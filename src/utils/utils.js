/**
 * powered by 波比小金刚 at 2018-05-07 17:40:28
 * last modified by 波比小金刚 at 2018-05-07 17:40:28
 * @Description: 工具方法集
 */

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g

export function isUrl(path) {
  return reg.test(path)
}

//* 获取当前的时间戳
const now = () => {
  return Date.now() || new Date().getTime();
}

/**
 * *节流函数
 * @param {*} func 目标函数 
 * @param {*} wait 执行时间间隔
 * @param {*} options 配置, leading: false 表示不会立即触发函数， trailing: false 最后一次回调不会被触发，二者不能并存
 */
export const throttleForkedFromUnderScore = (func, wait, options) => {
  let context, args, result;

  // setTimeout 的 handler
  let timeout = null;
 
  // 标记时间戳
  let previous = 0;

  if(!options) options = {};
  
  let later = () => {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if(!timeout) context = args = null;
  }

  return function(){
    var _now = now();
    // 设置{ leading: false }之后，第一次不执行 因为 previous = _now
    if(!previous && options.leading === false) previous = _now;
    
    // 距离下一次触发需要的时间间隔
    let remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    
    // 时间到了 || 系统时间被调整过的情况
    if(remaining <=0 || remaining > wait){
      if(timeout){
        clearTimeout(timeout);
        timeout = null;
      }

      // 重置时间标记
      previous = _now;

      // 触发函数
      result = func.apply(context, args);

      // 避免内存泄漏
      if(!timeout) context = args = null;

    // 最后一次需要触发的情况
    }else if(!timeout && options.trailing !== false){
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
}

/**
 * *利用生成器实现迭代器和map
 * @param {obj} obj 
 */
export function* entries(obj){
  for(let key of Object.keys(obj)){
    yield [key, obj[key]]
  }
}

// ! 判断是否是生产环境
export const isDev = () => {
  return process.env.NODE_ENV === 'development';
}

// ! 日志记录 | 异常处理
export const logger = remark => {
  return function(target, name, descriptor){
    let method = descriptor.value;
    descriptor.value = (...args) => {
      //console.info(`小金刚告诉你, 备注: ${remark}, 方法${name}执行之前，检查到此时参数是：`, args);
      let ret;
      try {
        ret = method.apply(target, args);
        //console.info(`小金刚告诉你, 方法${name}执行成功!`);
      } catch (error) {
        //console.error(`小金刚告诉你, ${name} 执行失败了!`);
        //console.dir(error);
      } finally {
        //console.info(`小金刚告诉你, ${name} 执行完毕!`);
      }
      return ret;
    }
  }
}

// ! 千分位
export const toThousands = num=>(num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');

/**
 * 防抖
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 表示是否需要立即执行
 */
export const debounce = (func, wait, immediate) => {
  let timer, result, args, timestamp, context;
  // 延迟执行函数
  let later = () => {
    let last = now() - timestamp;
    if(last < wait && last >= 0 ){
      timer = setTimeout(later, wait-last);
    }else{
      timer = null;
      if(!immediate){
        result = func.apply(context, args);
        if(timer) args = context = null;
      }
    }
  }

  return function(){
    context = this;
    args = arguments;
    timestamp = now();
    let callNow = immediate && !timer;
    if(!timer) timer = setTimeout(later, wait);
    if(callNow){
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  }
}

export const deepCompare = (o1, o2) => {
    //标识是否相似
    var flag = true;

    var traverse = function(o1,o2){
        //如果至少有一个不是对象
        if(!(o1 instanceof Object) || !(o2 instanceof Object)){
            if(o1 !== o2){
                flag = false;
            }
            return;
        }
        //如果两个对象的属性数量不一致
        //比如：
        //a:{name:"Jack",age:22}
        //b:{name:"Jack"}
        if(Object.keys(o1).length !== Object.keys(o2).length){
            flag = false;
        }
        //若有不同之处，尽早结束递归
        if(flag){
            //深度遍历对象
            for(var i in o1){
                //若都是对象，继续递归
                if(typeof o1[i] === "object" && typeof o2[i] === "object"){
                    traverse(o1[i],o2[i]);
                }//若都不是对象，则比较值
                else if(typeof o1[i] !== "object" && typeof o2[i] !== "object"){
                    if(o1[i] !== o2[i]){
                        flag = false;;
                    }
                }//一个是对象，一个不是对象，肯定不相似
                else{
                    flag = false;
                }
            }
        }
    };

    traverse(o1,o2);

    return flag;
};

export const colorLabelMap = {
    "内容":"#a8d66d",
    "频道":"#49dbff",
}

export const type = 'product' //环境
const isTest = type === 'test'
//testapi
export const loginUrl = isTest ? '//restapi-test1.fishsaying.com/' : '//restapi.fishsaying.com/'
export const jumpUrl = isTest ? '//test1-login-v2.fishsaying.com/login/bdp' : '//login.yushuoyun.com/login/bdp'
