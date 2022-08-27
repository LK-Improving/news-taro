declare namespace API {
  interface ResultType {
    code: number,
    msg: string
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
}
