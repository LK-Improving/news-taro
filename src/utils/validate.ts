/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s: string) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    s
  );
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s: string) {
  return /^1[0-9]{10}$/.test(s);
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone(s: string) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s);
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL(s: string) {
  return /^http[s]?:\/\/.*/.test(s);
}
