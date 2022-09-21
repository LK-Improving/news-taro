import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Input,
  ScrollView,
  EventProps,
  Image,
  ScrollViewProps
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { observer } from "mobx-react-lite";
import Style from "./subscribe.module.scss";
import useStore from "../../store";
import memberApi from "../../services/api/memberApi";
import { throllte } from "../../utils";

interface NavType {
  title: string;
  value: string;
}

// 节流
let isThrottle = false;

// 常用list
const NavList: NavType[] = [
  {
    title: "关注",
    value: "memberId"
  },
  {
    title: "粉丝",
    value: "subscribeId"
  }
];

const Notify: React.FC = () => {
  // 通知LIst
  const [subscribeList, setsubscribeList] = useState<API.NotifyType[]>([]);

  // 当前页码
  const [key, setKey] = useState<number>(0);

  const { MemberStore } = useStore();

  // 初始化
  useEffect(() => {
    getsubscribeList();
  }, [key]);

  // 获取订阅
  const getsubscribeList = async () => {
    const params = {
      [NavList[key].value]: MemberStore.memberInfo.memberId || null
    };
    const res = (await memberApi.reqSubscribeAll(params)) as API.ResultType & {
      list: API.NotifyType[];
    };
    if (res && res.code === 0) {
      setsubscribeList(
        res.list.map(item => {
          if (item.memberId === MemberStore.memberInfo.memberId) {
            item.status = 1;
          } else{
            item.status = 0;
          }
          return item;
        })
      );
    }
  };

  // 订阅
  const handleSubscribe: Function = async (subscribeId: string) => {
    const params = {
      subscribeId,
      memberId: MemberStore.memberInfo.memberId
    };
    const res = await memberApi.reqSaveSubscribe(params);
    if (res && res.code === 0) {
      setsubscribeList(
        subscribeList.map(item => {
          if (item.subscribeId === subscribeId) {
            item.status = 1;
          }
          return item;
        })
      );
    }
  };

  // 取消订阅
  const handlCanelSubscribe: Function = (subscribe_id: string) => {
    Taro.showModal({
      title: "提示",
      content: "你确定要取消关注吗？",
      success: async res2 => {
        if (res2.confirm) {
          const params = {
            subscribe_id,
            member_id: MemberStore.memberInfo.memberId
          };
          const res = await memberApi.reqCanelSubscribe(params);
          if (res && res.code === 0) {
            setsubscribeList(
              subscribeList.map(item => {
                if (item.subscribeId === subscribe_id) {
                  item.status = 0;
                }
                return item;
              })
            );
          }
        }
      }
    });
  };

  // 切换导航
  const handleChangeKey: EventProps["onClick"] = e => {
    setKey(e.currentTarget.dataset.key);
  };

  // 跳转页面
  const to = (url: string) => {
    Taro.navigateTo({
      url: url
    });
  };

  return (
    <View className={Style.homeContainer}>
      {/* 导航栏 */}
      <View className={Style.navBar}>
        {NavList.map((item, index) => {
          return (
            <View
              key={item.value}
              onClick={handleChangeKey}
              data-key={index}
              className={
                key === index
                  ? Style.navItem + " " + Style.active
                  : Style.navItem
              }
            >
              {item.title}
            </View>
          );
        })}
      </View>

      {/* 通知 */}
      {subscribeList.length > 0 ? (
        <ScrollView
          className={Style.notifyScroll}
          scrollY
          scrollWithAnimation
          enableFlex
          enable-passive
          enable-back-to-top
        >
          {subscribeList.map(item => {
            return (
              <View className={Style.notifyItem} key={item.id}>
                <View className={Style.detail}>
                  <Image src={item.subscribeInfo.portrait}></Image>
                  <View className={Style.infoSection}>
                    <View className={Style.author}>
                      {item.subscribeInfo.nickname}
                    </View>
                    <View className={Style.info}>
                      <View>
                        {"来自" + item.subscribeInfo.city.substring(0, 2)}
                      </View>
                      <View
                        style={{ marginRight: 20 }}
                        className={Style.overflow}
                      >
                        {item.subscribeInfo.sign}
                      </View>
                    </View>
                  </View>
                  {item.status == 0 ? (
                    <Button
                      onClick={throllte(
                        () => handleSubscribe(item.subscribeId),
                        500
                      )}
                    >
                      关注
                    </Button>
                  ) : (
                    <Button
                      onClick={throllte(
                        () => handlCanelSubscribe(item.subscribeId),
                        500
                      )}
                      className={Style.activeBtn}
                    >
                      已关注
                    </Button>
                  )}
                </View>
                <View>{item.content}</View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View>这里什么都没有哦</View>
      )}
    </View>
  );
};

export default observer(Notify);
