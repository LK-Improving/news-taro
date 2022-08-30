import { get } from "../../utils/request";

const prefix = "/article";

export default {
  // 获取所有分类
  reqArticleCtaegory: () => get(prefix + "/category/all"),
  // 根据分类获取所有文章
  reqArticleListByCatId: (params: object) => get(prefix + "/list", params),
  // 文章详情
  reqArticleInfo: (value: string) => get(prefix + "/info/" + value)
};
