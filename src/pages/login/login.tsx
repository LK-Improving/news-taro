import React, { useEffect, useState } from "react";
import {
  View,
  EventProps,
  Form,
  Label,
  Input,
  Button,
  FormProps,
  Image,
  Text,
  CommonEventFunction
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import Style from "./login.module.scss";
import phoneImg from "../../assets/images/login//phone.svg";
import weixinImg from "../../assets/images/login/weixin.svg";
import memberApi from "../../services/api/memberApi";
import { isMobile } from "../../utils/validate";
import useStore from "../../store";

interface FormType {
  mobile: string;
  password: string;
}

// 登录页面
const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormType>({
    mobile: "",
    password: ""
  });
  const disabled = formData.mobile === "" || formData.password === "";

  const { MemberStore } = useStore();
  const handleSubmit: FormProps["onSubmit"] = async e => {
    const { mobile, password } = e.detail.value as FormType;
    if (!isMobile(mobile)) {
      return Taro.showToast({
        title: "手机号格式不正确!",
        icon: "error"
      });
    }
    const res = (await memberApi.reqLoginByPassword({
      mobile,
      password
    })) as API.ResultType & { member: API.MemberYype };
    console.log(res);
    if (res.code === 0) {
      // 存储会员信息
      Taro.setStorageSync("memberInfo", res.member);
      MemberStore.serMmberInfo(res.member)
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

  // 获取手机号
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

  // 跳转至手机号登录注册页面
  const toRegister = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length >= 2) {
      if (pages[pages.length - 2].route === "pages/register/register") {
        return Taro.navigateBack();
      }
    }
    return Taro.navigateTo({
      url: "/pages/register/register"
    });
  };

  return (
    <View className={Style.loginContainer}>
      {/* 登陆表单 */}
      <Form onSubmit={handleSubmit} className={Style.loginForm}>
        <View className={Style.formItem}>
          <Label for="mobile">用户名：</Label>
          <Input
            name="mobile"
            placeholder="请输入用户名"
            value={formData.mobile}
            onInput={e => setFormData({ ...formData, mobile: e.detail.value })}
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.mobile === "" ? "none" : "" }}
            onClick={() => setFormData({ ...formData, mobile: "" })}
          ></Text>
        </View>
        <View className={Style.formItem}>
          <Label for="password">密码：</Label>
          <Input
            name="password"
            placeholder="请输入密码"
            value={formData.password}
            onInput={e =>
              setFormData({ ...formData, password: e.detail.value })
            }
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.password === "" ? "none" : "" }}
            onClick={() => setFormData({ ...formData, password: "" })}
          ></Text>
          <Text className={Style.handleText}>忘记密码</Text>
        </View>
        <View className={Style.formItem}>
          <Text>其他登陆方式：</Text>
          <Button className={Style.optionBtn} onClick={toRegister}>
            <Image src={phoneImg} />
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
            <Button className={Style.registerBtn} onClick={toRegister}>
              注册
            </Button>
            <Button
              className={Style.LoginBtn}
              disabled={disabled}
              formType="submit"
              style={{
                backgroundColor: disabled ? "#eaaab0" : "",
                color: disabled ? "#f6dfe1" : ""
              }}
            >
              登录
            </Button>
          </View>
        </View>
      </Form>
    </View>
  );
};

export default Login;
