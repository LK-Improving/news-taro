import { get, post } from "../../utils/request";

const prefix = "/member";

export default {
  // 密码登录
  reqLoginByPassword: (params: any) => post(prefix + "/login/password", params),

  // 手机号登录/注册
  reqLoginByMobile: (params: any) => post(prefix + "/login/mobile", params),

  // 发表评论
  reqSaveComment: (params: object) => post(prefix + "/comment/save", params),

  // 根据文章ID获取评论
  reqCommentListByArticleId: (value:number) => get(prefix + "/comment/list/" + value)
};
