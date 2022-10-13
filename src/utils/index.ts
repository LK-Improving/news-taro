import Taro from "@tarojs/taro";

// 函数防抖
export const debounce = (
  fn: Function,
  delay: number
) => {
  let t = null;
  return () => {
    if (t !== null) {
      console.log("clear");

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

// 是否登录
export function isAuth() {
  if (!!!Taro.getStorageSync("memberInfo")) {
    Taro.showToast({
      title: "您还未登录,请登录后使用",
      icon: "error"
    });
  }
  return !!Taro.getStorageSync("memberInfo");
}
