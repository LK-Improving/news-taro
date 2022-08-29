import { post } from "../../utils/request";

const prefix = "/member";

export default {
  // 密码登录
  reqLoginByPassword: (params: any) => post(prefix + "/login/password", params),

  // 手机号登录/注册
  reqLoginByMobile: (params: any) => post(prefix + "/login/mobile", params)
};
