declare namespace API {
  // 请求返回
  interface ResultType {
    code: number;
    msg: string;
  }
  // 会员
  interface MemberYype {
    accessToken: string;
    birth: string;
    city: string;
    createTime: string;
    expiresIn: string;
    gender: string;
    memberId: number;
    mobile: string;
    nickname: string;
    password: string;
    portrait: string;
    remark: string;
    sign: string;
    status: number;
    username: string;
  }
  // 文章分类
  interface CategoryType {
    categoryId: number;
    categoryName: string;
  }
  // 文章图片
  interface CoverType {
    articleId: number;
    defaultImg: number;
    id: number;
    imgName: string;
    imgSort: number;
    imgUrl: string;
  }
  // 文章
  interface ArticleType {
    articleId: number;
    authorId: number;
    catName: string;
    content: string;
    coverList: CoverType[];
    createTime: string;
    isAudit: number;
    member: Partial<MemberYype>;
    publishTime: string;
    readCount: number;
    tag: string[] | null;
    title: string;
    userId: number;
  }
  interface PageType {
    currPage: number;
    list: any[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
}
