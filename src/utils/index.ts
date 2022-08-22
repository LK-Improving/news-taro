// 函数防抖
export const debounce = (t:any,fn: Function, delay: number) => {
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
