import React, { FC, useEffect, useState } from "react";
import {
  View,
  Button,
  Image,
  FormProps,
  Picker,
  PickerDateProps,
  PickerRegionProps,
  PickerSelectorProps,
  Input,
  Textarea,
  EventProps
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { observer } from "mobx-react-lite";
import Style from "./personalSetting.module.scss";
import useStore from "../../store";
import memberApi from "../../services/api/memberApi";

const selector = ["男", "女", "保密"];

const PersonalSetting: React.FC = () => {
  const {
    MemberStore: { memberInfo, setMmberInfo }
  } = useStore();

  const [active, setActive] = useState<string>("");

  const [formData, setFormData] = useState<Partial<API.MemberYype>>({});

  useEffect(() => {
    // const member = Taro.getStorageSync('memberInfo')
    // if (member) {
    //   console.log(member);
    //   setMemberInfo(member)
    // }
    if (memberInfo) {
      setFormData(memberInfo);
    } else {
      Taro.navigateBack();
    }
  }, []);

  // 保存
  const handleSave: EventProps["onClick"] = async () => {
    console.log(formData);
    const res = await memberApi.reqUpdateMember(formData) as API.ResultType & {
      member:API.MemberYype
    }
    if (res && res.code === 0) {
      console.log(res);
      setMmberInfo(res.member)
      Taro.setStorageSync('memberInfo',res.member)
      Taro.showToast({
        title: '个人信息已保存',
        duration:5000,
        success:()=>{
          setTimeout(() => {
            Taro.navigateBack()
          }, 500);
        }
      })
    }
  };
  // 修改性别
  const handleChangeGender: PickerSelectorProps["onChange"] = e => {
    console.log(e);
    setFormData({ ...formData, gender: parseInt(e.detail.value.toString()) });
  };
  // 修改日期
  const handleChangeDate: PickerDateProps["onChange"] = e => {
    console.log(e);
    setFormData({ ...formData, birth: e.detail.value });
  };
  // 修改城市
  const handleChangeCity: PickerRegionProps["onChange"] = e => {
    console.log(e);
    setFormData({ ...formData, city: e.detail.value.toString() });
  };
  return (
    <View className={Style.container}>
      <View className={Style.myForm}>
        <View>
          <View className={Style.left}>头像</View>
          <View className={Style.right}>
            <Image src={formData.portrait!} className={Style.portrait}></Image>
          </View>
        </View>
        <View>
          <View className={Style.left}>昵称</View>
          <View
            className={Style.right}
            onClick={() =>
              active !== "nickname" ? setActive("nickname") : null
            }
          >
            <Input
              value={formData.nickname}
              placeholder="请输入昵称"
              maxlength={15}
              disabled={active !== "nickname"}
              onInput={e =>
                setFormData({ ...formData, nickname: e.detail.value })
              }
              onBlur={() => setActive("")}
            ></Input>
          </View>
        </View>
        <View>
          <View className={Style.left}>性别</View>
          <View className={Style.right}>
            <Picker
              mode="selector"
              range={selector}
              onChange={handleChangeGender}
            >
              <View>
                {formData.gender!==null ? selector[formData.gender!] : "保密"}
              </View>
            </Picker>
          </View>
        </View>
        <View>
          <View className={Style.left}>出生年月</View>
          <View className={Style.right}>
            <Picker
              mode="date"
              value={
                formData.birth ? formData.birth!.substring(0, 10) : "1980-01-01"
              }
              start="1900-01-01"
              end="2017-09-01"
              onChange={handleChangeDate}
            >
              <View>
                {formData.birth
                  ? formData.birth!.substring(0, 10)
                  : "1980-01-01"}
              </View>
            </Picker>
          </View>
        </View>
        <View>
          <View className={Style.left}>城市</View>
          <View className={Style.right}>
            <Picker
              mode="region"
              value={formData.city ? formData.city!.split(",") : []}
              onChange={handleChangeCity}
            >
              <View>
                {formData.city ? formData.city : "四海为家，人在漂泊"}
              </View>
            </Picker>
          </View>
        </View>
        <View>
          <View className={Style.left}>个性签名</View>
          <View
            className={Style.right}
            onClick={() => (active !== "sign" ? setActive("sign") : null)}
          >
            <Textarea
              value={formData.sign}
              placeholder="这个人很神秘，什么都没有写"
              autoHeight
              maxlength={70}
              fixed
              disabled={active !== "sign"}
              onInput={e => setFormData({ ...formData, sign: e.detail.value })}
              onBlur={() => setActive("")}
            ></Textarea>
          </View>
        </View>
      </View>
      <Button onClick={handleSave} className={Style.saveBtn}>保存</Button>
    </View>
  );
};

export default observer(PersonalSetting);
