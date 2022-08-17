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
  Text
} from "@tarojs/components";
import Style from "./login.module.scss";
import Taro from "@tarojs/taro";
import phoneImg from "../../assets/images/login//phone.svg";
import weixinImg from "../../assets/images/login/weixin.svg";

interface FormType {
  account: string;
  password: string;
}

// 登录页面
const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormType>({
    account: "",
    password: ""
  });
  const disabled = formData.account === "" || formData.password === "";

  const handleSubmit: FormProps["onSubmit"] = e => {
    const { account, password } = e.detail.value as FormType;
    if (account === "") {
      return Taro.showToast({
        title: "请输入用户名!",
        icon: "error"
      });
    } else if (password === "") {
      return Taro.showToast({
        title: "请输入密码!",
        icon: "error"
      });
    }
    console.log(e);
  };

  const handleClick: EventProps["onClick"] = e => {
    console.log(e);
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
    Taro.redirectTo({
      url: "/pages/register/register"
    });
  };

  return (
    <View className={Style.loginContainer}>
      {/* 登陆表单 */}
      <Form onSubmit={handleSubmit} className={Style.loginForm}>
        <View className={Style.formItem}>
          <Label for="account">用户名：</Label>
          <Input
            name="account"
            placeholder="请输入用户名"
            value={formData.account}
            onInput={e => setFormData({ ...formData, account: e.detail.value })}
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.account === "" ? "none" : "" }}
            onClick={() => setFormData({ ...formData, account: "" })}
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
            <Button className={Style.LoginBtn} formType="reset">
              重置
            </Button>
            <Button
              className={Style.registerBtn}
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
