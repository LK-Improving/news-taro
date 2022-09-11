import { get, post } from "../../utils/request";

const prefix = "/member";

export default {
  // 密码登录
  reqLoginByPassword: (params: object) => post(prefix + "/login/password", params),

  // 手机号登录/注册
  reqLoginByMobile: (params: object) => post(prefix + "/login/mobile", params),

  // 修改用户信息
  reqUpdateMember: (params: object) => post(prefix + "/update", params),

  // 发表评论
  reqSaveComment: (params: object) => post(prefix + "/comment/save", params),

  // 点赞文章
  reqSaveLike: (params: object) => post(prefix + "/like/save", params),

  // 取消点赞文章
  reqDelLike: (params: object) => post(prefix + "/like/delete", params),

  // 查询当前用户是否点赞该文章
  reqisLike: (params: object) => get(prefix + "/like/islike", params),

  // 收藏文章
  reqSaveCollection: (params: object) => post(prefix + "/collection/save", params),

  // 取消文章
  reqDelCollection: (params: object) => post(prefix + "/collection/delete", params),

  // 查询当前用户是否收藏该文章
  reqIsCollection: (params: object) => get(prefix + "/collection/iscollection", params),

  // 根据文章ID获取评论
  reqCommentListByArticleId: (params:object) => get(prefix + "/comment/list",params),

};
