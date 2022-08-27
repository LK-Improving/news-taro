import { post } from "../utils/request";


export default{
    // 密码登录
    reqLoginByPassword:(data:any) =>  post('/member/login/password',data),

    // 手机号登录/注册
    reqLoginByMobile:(data:any) =>  post('/member/login/mobile',data)
}