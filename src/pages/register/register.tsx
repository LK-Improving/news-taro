import React, { useEffect, useState } from "react";
import {
  View,
  EventProps,
  Form,
  Label, 
  Input,
  Button,
  FormProps,
  Text,
  Image,
  CommonEventFunction
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import Style from "./register.module.scss";
import lockImg from "../../assets/images/login/lock.svg";
import weixinImg from "../../assets/images/login/weixin.svg";
import { isMobile } from "../..//utils/validate";
import memberApi from "../../services/api/memberApi";
import useStore from "../../store";

interface FormType {
  mobile: string;
  smsCode: string;
}

const randomCode = Math.floor(Math.random() * 10000).toString();

// 登录页面
const Register: React.FC = () => {
  const [smsCodeTitle, setsmsCodeTitle] = useState<string>("获取验证码");

  const [formData, setFormData] = useState<FormType>({
    mobile: "",
    smsCode: ""
  });

  const disabled = formData.mobile === "" || formData.smsCode === "";

  const { MemberStore } = useStore();

  useEffect(() => {
    // 获取用户openid，用于获取手机号（老板接口）
    // Taro.login({
    //   success: res => {
    //     console.log(res);
    //     let appId = 'wx00fa32a7c2c1a3e7';
    //     let appSecret = '71f3927330a809fde2be894f0af6ed6a';
    //     let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${res.code}&grant_type=authorization_code`;
    //     Taro.request({
    //       method: 'GET',
    //       url,
    //       success: res2 => {
    //         console.log(res2);
    //       }
    //     });
    //   }
    // });
  });
  // 提交表单
  const handleSubmit: FormProps["onSubmit"] = async e => {
    const { mobile, smsCode } = e.detail.value as FormType;
    if (!isMobile(mobile)) {
      return Taro.showToast({
        title: "手机号格式不正确!",
        icon: "error"
      });
    } else if (smsCode !== randomCode) {
      return Taro.showToast({
        title: "验证码不正确!",
        icon: "error"
      });
    }
    const res = (await memberApi.reqLoginByMobile({
      mobile,
      smsCode
    })) as API.ResultType & { member: API.MemberYype };
    if (res.code === 0) {
      // 存储会员信息
      Taro.setStorageSync("memberInfo", res.member);
      MemberStore.setMmberInfo(res.member);
      // 跳转至之前的页面
      const pages = Taro.getCurrentPages();
      if (pages.length >= 2) {
        if (pages[pages.length - 2].route === "pages/register/register") {
          return Taro.navigateBack({ delta: 2 });
        }
      }
      return Taro.navigateBack();
    } else {
      return Taro.showToast({
        title: res.msg,
        icon: "error"
      });
    }
  };

  // 获取验证码
  const handelSendCode: EventProps["onClick"] = () => {
    if (!formData.mobile) {
      return;
    }
    if (!isMobile(formData.mobile)) {
      return Taro.showToast({
        title: "您的手机号格式不正确！",
        icon: "error"
      });
    }
    console.log(isMobile(formData.mobile));
    return Taro.showToast({
      title: "您的验证码为" + randomCode,
      icon: "none"
    });
  };

  // 获取手机号//微信登录
  const getPhoneNumber: CommonEventFunction = e => {
    console.log(e);
    if (!e.detail.code) {
      // 该功能需要企业账号或微信认证（300认证费）
      Taro.showToast({
        title: "该功能暂未开放",
        icon: "error"
      });
    }
    // Taro.getUserProfile({
    //   desc:'展示用户信息',
    //   success: res => {
    //     console.log(res);

    //   },
    //   fail: err => {
    //     console.log(err);

    //   }
    // })
  };

  // 跳转至密码登录页面
  const toLogin = () => {
    const pages = Taro.getCurrentPages();
    console.log(pages);
    if (pages.length >= 2) {
      if (pages[pages.length - 2].route === "pages/login/login") {
        return Taro.navigateBack();
      }
    }
    return Taro.navigateTo({
      url: "/pages/login/login"
    });
  };

  return (
    <View className={Style.loginContainer}>
      {/* 登陆表单 */}
      <Form onSubmit={handleSubmit} className={Style.loginForm}>
        <View className={Style.formItem}>
          <Label for="mobile">手机号：</Label>
          <Input
            name="mobile"
            placeholder="请输入手机号码"
            type="number"
            value={formData.mobile}
            onInput={e => setFormData({ ...formData, mobile: e.detail.value })}
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.mobile === "" ? "none" : "" }}
            onClick={() => setFormData({ ...formData, mobile: "" })}
          ></Text>
          <Text
            className={Style.handleText}
            style={{
              color: !formData.mobile ? "lightgray" : ""
            }}
            onClick={handelSendCode}
          >
            {smsCodeTitle}
          </Text>
        </View>
        <View className={Style.formItem}>
          <Label for="smsCode">验证码：</Label>
          <Input
            name="smsCode"
            placeholder="请输入验证码"
            type="number"
            value={formData.smsCode}
            onInput={e => setFormData({ ...formData, smsCode: e.detail.value })}
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.smsCode === "" ? "none" : "" }}
            onClick={() => setFormData({ ...formData, smsCode: "" })}
          ></Text>
        </View>
        <View className={Style.formItem}>
          <Text>其他登陆方式：</Text>
          <Button className={Style.optionBtn} onClick={toLogin}>
            <Image src={lockImg} />
          </Button>
          <Button
            className={Style.optionBtn}
            open-type="getPhoneNumber"
            onGetPhoneNumber={getPhoneNumber}
          >
            <Image src={weixinImg} />
          </Button>
        </View>
        <View className={Style.formItem}>
          <View className={Style.buttonGroup}>
            <Button
              className={Style.registerBtn}
              disabled={disabled}
              formType="submit"
              style={{
                flex: 1,
                backgroundColor: disabled ? "#eaaab0" : "",
                color: disabled ? "#f6dfe1" : ""
              }}
            >
              验证登录
            </Button>
          </View>
        </View>
      </Form>
    </View>
  );
};

export default Register;
