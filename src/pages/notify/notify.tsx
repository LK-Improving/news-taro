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
  const [notifyList, setnotifyList] = useState<API.ArticleType[]>([]);

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  const { MemberStore } = useStore();

  // 初始化
  useEffect(() => {
    
  }, []);
  // 监听页码
  useEffect(() => {
    if (page === 1) {
      set()
    } else{
      push();
    }
  }, [page]);

  // 设置文章
  const set = async () => {
    const res = await getNotiftList();
    // setArticleList(res.list);
    console.log(res);
    
    // setTotalPage(res.totalPage);
  };

  // 合并文章
  const push = async () => {
    let res = await getNotiftList();
    // setArticleList(articleList.concat(res.list));
    isThrottle = false;
    Taro.hideLoading();
  };

  // 获取通知
  const getNotiftList = async (): Promise<API.PageType & {
    list: API.ArticleType;
  }> => {
    const params = {
      page,
      limit: 10,
      memberId: MemberStore.memberInfo.memberId || null
    };
    const res = (await memberApi.reqNotifyListByMemberId(
      params
    )) as API.ResultType & {
      page: API.PageType & { list: API.ArticleType };
    };
    console.log(res);
    if (res && res.code === 0) {
      return Promise.resolve(res.page);
    }
    return Promise.reject(res.msg);
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
      {/* 搜索栏 */}
      <View className={Style.serach}>
        <View
          className={Style.imput}
          onClick={() => to("/pages/search/search")}
        >
          <Text
            className="iconfont icon-sousuo"
            style={{ fontSize: "40rpx" }}
          ></Text>
          <Input
            placeholder="搜索喜欢的新闻吧！"
            placeholderStyle="font-size:32rpx"
          />
        </View>
        <Text
          className={"iconfont icon-plus " + Style.iconfont}
          onClick={() => to("/pages/publish/publish")}
        >
          发布
        </Text>
      </View>

      {/* 文章 */}
      {notifyList.length > 0 ? (
        <ScrollView
          className={Style.articleScroll}
          scrollY
          scrollWithAnimation
          enableFlex
          enable-passive
          enable-back-to-top
          refresher-enabled
          onScrollToLower={handleScrollToLower}

        >
          {notifyList.map(item => {
            return 123;
          })}
        </ScrollView>
      ) : (
        <View>这里什么都没有哦</View>
      )}
    </View>
  );
};

export default observer(Notify);
