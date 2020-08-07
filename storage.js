/*
* @Author: Ez Lou
* @Email:  ezlou@bitasset.com
* @Date:   2020-08-07 17:10:01
*/
const Storage = {
  isSupport:null,
  // 兼容性检查
  checkSupport(){
    const key = '__test_key__' 
    const value = '__test_value__'
    let flag = false
    try{
      localStorage.setItem(key, value)
      if(localStorage.getItem(key) === value){
        flag = true
      }
      localStorage.removeItem(key)
      return flag
    }catch(e){
      if(e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED'){
        console.warn('localStorage 存储已达上限')
      }else{
        console.warn('当前浏览器不支持 localStorage')
      }
      return flag
    }
  },

  ready(){
    if(this.isSupport === null){
      this.isSupport = this.checkSupport()
    }
    if(this.isSupport){
      return Promise.resolve()
    }
    return Promise.reject()
  },

  checkKey(key){
    if(typeof key !== 'string'){
      console.warn(`${key} used as a key, but it is not a string`)
      key = String(key)
    }
    return key
  },

  serialize(value, callback){
    try{
      const valueString = JSON.stringify(value)
      callback(null, valueString)
    }catch(e){
      callback(e)
    }
  },

  setItem(key, value, name = ''){
    key = name ? name + '/' + this.checkKey(key) : this.checkKey(key)
    return this.ready().then(() => {
      if(value === undefined){
        value = null
      }
      this.serialize(value, (error, valueString) => {
        if(error){
          return Promise.reject(error)
        }
        try{
          localStorage.setItem(key, valueString)
          return Promise.resolve()
        }catch(e){
          return Promise.reject(e)
        }
      })
    })
  },
  
  // 获取某个key对应的value
  getItem(key){
    return localStorage.getItem(key)
  },
  
  // 删除特定的key/value
  removeItem(key){
    localStorage.removeItem(key)
  },
  
  // 清除全部
  clear(){
    localStorage.clear()
  },
  
  // 清除指定命名空间下的键值对
  clearNamespace(keyPrefix){
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
    if(key.indexOf(keyPrefix) === 0){
      localStorage.removeItem(key)
    }
    })
  }
}