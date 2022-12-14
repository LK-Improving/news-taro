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
    gender: number;
    memberId: string;
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
    catId: number;
    catName: string;
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
    articleId: string;
    authorId: string;
    catName: string;
    content: string;
    coverList: CoverType[];
    createTime: string;
    isAudit: number;
    member: Partial<MemberYype>;
    publishTime: string;
    readCount: string;
    remark: string | null;
    title: string;
    userId: number;
    likeCount: number;
    collectionCount: number;
    commentCount: number;
    isLike: number;
    isCollection: number;
    isSubscribe: number;
  }
  // 分页
  interface PageType {
    currPage: number;
    list: any[];
    pageSize: number;
    totalCount: number;
    totalPage: number;
  }
  // 评论
  interface commentType {
    articleId: string;
    commentId: string;
    content: string;
    createTime: string;
    member: MemberYype;
    memberId: string;
  }
  // 通知
  interface NotifyType {
    articleId: string;
    createTime: string;
    content: string;
    id: string;
    memberId: string;
    status: number;
    subscribeId: string;
    subscribeInfo: MemberYype;
  }
  // 统计数
  interface StatisticsType {
    fans: number;
    likeCount: number;
    publishCount: number;
    subscribeCount: number;
  }

  //模态框
  interface ModalType {
    title: string;
    value: string;
    errMsg: string;
  }
}
