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
import Style from "./register.module.scss";
import Taro from "@tarojs/taro";
import lockImg from "../../assets/images/login/lock.svg";
import weixinImg from "../../assets/images/login/weixin.svg";

interface FormType {
  phone: string;
  code: string;
}

// 登录页面
const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormType>({
    phone: "",
    code: ""
  });

  const disabled = formData.phone === "" || formData.code === "";

  useEffect(() => {
    // 获取用户openid，用于获取手机号（老板接口）
    // Taro.login({
    //   success: res => {
    //     console.log(res);
    //     let appId = "wx00fa32a7c2c1a3e7";
    //     let appSecret = "71f3927330a809fde2be894f0af6ed6a";
    //     let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${res.code}&grant_type=authorization_code`;
    //     Taro.request({
    //       method: "GET",
    //       url,
    //       success: res2 => {
    //         console.log(res2);
    //       }
    //     });
    //   }
    // });
  });
  // 提交表单
  const handleSubmit: FormProps["onSubmit"] = e => {
    const { phone, code } = e.detail.value as FormType;
    if (phone === "") {
      return Taro.showToast({
        title: "请输入手机号码!",
        icon: "error"
      });
    } else if (code === "") {
      return Taro.showToast({
        title: "请输入验证码!",
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

  // 跳转至登录页面
  const toLogin = () => {
    Taro.redirectTo({
      url: "/pages/login/login"
    });
  };

  return (
    <View className={Style.loginContainer}>
      {/* 登陆表单 */}
      <Form onSubmit={handleSubmit} className={Style.loginForm}>
        <View className={Style.formItem}>
          <Label for="phone">手机号：</Label>
          <Input
            name="phone"
            placeholder="请输入手机号码"
            type="number"
            value={formData.phone}
            onInput={e => setFormData({ ...formData, phone: e.detail.value })}
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.phone === "" ? "none" : "" }}
            onClick={() => setFormData({...formData,phone: ''})}
          ></Text>
          <Text className={Style.handleText}>获取验证码</Text>
        </View>
        <View className={Style.formItem}>
          <Label for="code">验证码：</Label>
          <Input
            name="code"
            placeholder="请输入验证码"
            type="number"
            value={formData.code}
            onInput={e => setFormData({ ...formData, code: e.detail.value })}
          ></Input>
          <Text
            className={"iconfont icon-clear1 " + Style.clearIconfont}
            style={{ display: formData.code === "" ? "none" : "" }}
            onClick={() => setFormData({...formData,code: ''})}
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
