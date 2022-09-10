import { get, post } from "../../utils/request";

const prefix = "/article";

export default {
  // 获取所有分类
  reqArticleCtaegory: () => get(prefix + "/category/all"),
  // 根据分类获取所有文章
  reqArticleListByCatId: (params: object) => get(prefix + "/list", params),
  // 文章详情
  reqArticleInfo: (value: string) => get(prefix + "/info/" + value),

  // 关键字搜索
  reqSearchArticle: (params: object) => get(prefix + "/search", params),

  // 热搜榜
  reqHotArticle: (params: object) => get(prefix + "/hot", params),

  // 发布文章
  reqSaveArticle: (params: object) => post(prefix + "/save", params)
};
