// 函数防抖
export const debounce = (fn: Function, delay: number,preFn:Function|undefined =undefined) => {
  let t = null;
  if (preFn) {
    preFn()
  }
  return () => {
    if (t !== null) {
        console.log('clear');
        
      clearTimeout(t);
    }
    t = setTimeout(() => {
      fn();
    }, delay) as any;
  };
};

// 函数节流
export const throllte = (fn: Function, delay: number) => {
  let flag = true;
  return () => {
    if (flag) {
      setTimeout(() => {
        fn();
        flag = true;
      }, delay);
    }
    flag = false;
  };
};
