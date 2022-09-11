import Taro from "@tarojs/taro"
import { makeAutoObservable } from "mobx"

class MemberStore{

    // 会员信息
    memberInfo:Partial<API.MemberYype> = Taro.getStorageSync('memberInfo')?Taro.getStorageSync('memberInfo'):{}

    constructor(){
        // 自动观察
        makeAutoObservable(this)
    }

    setMmberInfo = (val:Partial<API.MemberYype>) => {
        this.memberInfo = val
    }
}

export default MemberStore