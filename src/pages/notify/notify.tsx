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
import Style from "./notify.module.scss";
import useStore from "../../store";
import memberApi from "../../services/api/memberApi";

// 节流
let isThrottle = false;

const Notify: React.FC = () => {
  // 通知LIst
  const [notifyList, setnotifyList] = useState<API.NotifyType[]>([]);

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  const { MemberStore } = useStore();

  // 初始化
  useEffect(() => {}, []);
  // 监听页码
  useEffect(() => {
    if (page === 1) {
      set();
    } else {
      push();
    }
  }, [page]);

  // 设置文章
  const set = async () => {
    const res = await getNotiftList();
    setnotifyList(res.list);
    console.log(res);

    setTotalPage(res.totalPage);
  };

  // 合并文章
  const push = async () => {
    let res = await getNotiftList();
    setnotifyList(notifyList.concat(res.list));
    isThrottle = false;
    Taro.hideLoading();
  };

  // 获取通知
  const getNotiftList = async (): Promise<API.PageType & {
    list: API.NotifyType[];
  }> => {
    const params = {
      page,
      limit: 10,
      memberId: MemberStore.memberInfo.memberId || null
    };
    const res = (await memberApi.reqNotifyListByMemberId(
      params
    )) as API.ResultType & {
      page: API.PageType & { list: API.NotifyType[] };
    };
    if (res && res.code === 0) {
      return Promise.resolve(res.page);
    }
    return Promise.reject(res.msg);
  };

  // 已读消息
  const readNotify: Function = async (id: string) => {
    const params = {
      id,
      status: 1
    };
    const res = await memberApi.reqUpdateNotify(params);
    if (res && res.code === 0) {
      console.log("已读");
      setnotifyList(
        notifyList.map(item => {
          if (item.id === id) {
            item.status = 1;
          }
          return item;
        })
      );
    }
  };

  // 删除通知
  const handleDelNotify: EventProps["onClick"] = e => {
    e.stopPropagation()
    Taro.showModal({
      title: "提示",
      content: "真的要删除该条通知吗！",
      success: async res => {
        if (res.confirm) {
          const resp = await memberApi.reqDelNotify([e.currentTarget.id]);
          if (resp && resp.code === 0) {
            setnotifyList(
              notifyList.filter(item => item.id !== e.currentTarget.id)
            );
            Taro.showToast({
              title: "删除成功！"
            });
          }
        }
      }
    });
  };

  // 滚动至底部添加下一页文章
  const handleScrollToLower: ScrollViewProps["onScrollToLower"] = () => {
    let currentPAge = page;
    if (currentPAge === totalPage) {
      return;
    }
    if (!isThrottle) {
      Taro.showLoading({
        title: "正在加载数据!",
        mask: true
      });
      isThrottle = true;
      setTimeout(() => {
        setPage(currentPAge + 1);
      }, 1500);
    }
  };

  // 跳转页面
  const to = (url: string) => {
    Taro.navigateTo({
      url: url
    });
  };

  return (
    <View className={Style.homeContainer}>
      {/* 通知 */}
      {notifyList.length > 0 ? (
        <ScrollView
          className={Style.notifyScroll}
          scrollY
          scrollWithAnimation
          enableFlex
          enable-passive
          enable-back-to-top
          refresher-enabled
          onScrollToLower={handleScrollToLower}
        >
          {notifyList.map(item => {
            return (
              <View
                className={Style.notifyItem}
                key={item.id}
                onClick={() => {
                  if (!item.status) {
                    readNotify(item.id);
                  }
                  to(
                    "/pages/articleDetail/articleDetail?articleId=" +
                      item.articleId
                  );
                }}
              >
                <View className={Style.detail}>
                  <Image src={item.subscribeInfo.portrait}></Image>
                  {!item.status && <View className={Style.tag}></View>}
                  <View className={Style.infoSection}>
                    <View className={Style.author}>
                      {item.subscribeInfo.nickname}
                    </View>
                    <View className={Style.info}>
                      <Text style={{ marginRight: 20 }}>{item.createTime}</Text>
                      {/* {'来自' + articleDetail.city} */}
                    </View>
                  </View>
                  <View onClick={handleDelNotify} id={item.id} className={Style.del}>
                    删除
                  </View>
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
