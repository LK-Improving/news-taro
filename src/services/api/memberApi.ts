import { get, post } from "../../utils/request";

const prefix = "/member";

export default {
  // 密码登录
  reqLoginByPassword: (params: object) =>
    post(prefix + "/login/password", params),

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
  reqSaveCollection: (params: object) =>
    post(prefix + "/collection/save", params),

  // 取消收藏
  reqDelCollection: (params: object) =>
    post(prefix + "/collection/delete", params),

  // 查询当前用户是否收藏该文章
  reqIsCollection: (params: object) =>
    get(prefix + "/collection/iscollection", params),

  // 根据文章ID获取评论
  reqCommentListByArticleId: (params: object) =>
    get(prefix + "/comment/list", params),

  // 获取订阅/粉丝
  reqSubscribeAll: (params: object) => get(prefix + "/subscribe/all", params),

  // 关注
  reqSaveSubscribe: (params: object) =>
    post(prefix + "/subscribe/save", params),

  // 取消关注
  reqCanelSubscribe: (params: object) =>
    post(prefix + "/subscribe/delete", params),

  // 用户点赞
  reqLikeArticle: (params: object) => get(prefix + "/like/article", params),

  // 用户收藏
  reqCollectionArticle: (params: object) =>
    get(prefix + "/collection/article", params),

  // 用户评论
  reqCommentArticle: (params: object) =>
    get(prefix + "/comment/article", params),

  // 用户历史
  reqHistoryArticle: (params: object) =>
    get(prefix + "/history/article", params),

  // 删除评论
  reqDelComment: (params: object) => post(prefix + "/comment/delete", params),

  // 获取通知
  reqNotifyListByMemberId: (params: object) =>
    get(prefix + "/notify/list", params),

  // 修改通知
  reqUpdateNotify: (params: object) => post(prefix + "/notify/update", params),

  // 删除通知
  reqDelNotify: (params: object) => post(prefix + "/notify/delete", params),

  // 查询是否关注
  reqSelectSubscribe: (params: object) =>
    get(prefix + "/subscribe/select", params),

  // 新增历史记录
  reqSaveHistory: (params: object) => post(prefix + "/history/save", params),

  // 删除历史记录
  reqDelHistoryByid: (params: object) =>
    post(prefix + "/history/delete", params),

  // 删除点赞
  reqDelLikeById: (params: object) => post(prefix + "/like/deletebyid", params),

  // 删除收藏
  reqDelCollectionById: (params: object) =>
    post(prefix + "/collection/deletebyid", params),

  // 用户统计数
  reqStatistics: (value: string) => get(prefix + "/statistics/" + value),

  // 查询用户信息
  reqMemberInfo: (value: string) => get(prefix + "/info/" + value),

  // 获取用户未读通知数量
  reqNotifyCount: (value: string) => get(prefix + "/notify/count/" + value)
};
