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
import Style from "./home.module.scss";
import articleApi from "../../services/api/articleApi";

// 节流
let isThrottle = false;

const Home: React.FC = () => {
  // 当前分类
  const [key, setKey] = useState<number>(0);
  // 当前分类
  const [isRefreesh, setIsRefreesh] = useState<boolean>(false);

  // 分类LIst
  const [categoryList, setCategoryList] = useState<API.CategoryType[]>([]);

  // 文章LIst
  const [articleList, setArticleList] = useState<API.ArticleType[]>([]);

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  // 初始化
  useEffect(() => {
    getCategoryList();
  }, []);

  // 监听分类
  useEffect(() => {
    set();
    setPage(1);
  }, [key]);
  // 监听页码
  useEffect(() => {
    if (page > 1) {
      push();
    }
  }, [page]);

  // 设置文章
  const set = async () => {
    const res = await getArticleList();
    setArticleList(res.list);
    setTotalPage(res.totalPage);
  };

  // 合并文章
  const push = async () => {
    let res = await getArticleList();
    setArticleList(articleList.concat(res.list));
    isThrottle = false;
    Taro.hideLoading();
  };

  // 获取分类
  const getCategoryList = async () => {
    const res = (await articleApi.reqArticleCtaegory()) as API.ResultType & {
      categoryList: API.CategoryType[];
    };
    console.log(res);
    if (res && res.code === 0) {
      setCategoryList(res.categoryList);
      isThrottle = false;
    }
  };

  // 获取文章
  const getArticleList = async (): Promise<API.PageType & {
    list: API.ArticleType;
  }> => {
    const params = {
      page,
      limit: 10,
      catId: key
    };
    const res = (await articleApi.reqArticleListByCatId(
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

  // 切换分类
  const handleChangeCategory: EventProps["onClick"] = e => {
    console.log(e);
    setKey(e.currentTarget.dataset.key);
  };

  // 滚动至底部添加下一页文章
  const handleScrollToLower: ScrollViewProps["onScrollToLower"] = () => {
    let currenPAge = page;
    if (currenPAge === totalPage) {
      return;
    }
    if (!isThrottle) {
      Taro.showLoading({
        title: "正在u加载数据!",
        mask: true
      });
      isThrottle = true;
      setTimeout(() => {
        setPage(currenPAge + 1);
      }, 1500);
    }
  };

  // 下拉刷新
  const handleRefresh: ScrollViewProps["onRefresherRefresh"] = e => {
    console.log(e);
    setIsRefreesh(true);
    setPage(1);
    set();

    setTimeout(() => {
      setIsRefreesh(false);
    }, 1500);
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
      {/* 导航条 */}
      <ScrollView
        className={Style.navScroll}
        scrollX
        scrollWithAnimation
        enableFlex
        scrollIntoView={"nav" + key}
      >
        <View
          onClick={handleChangeCategory}
          data-key={0}
          className={
            key === 0 ? Style.navItem + " " + Style.active : Style.navItem
          }
        >
          全部
        </View>
        {categoryList.map(item => {
          return (
            <View
              key={item.categoryId}
              onClick={handleChangeCategory}
              data-key={item.categoryId}
              className={
                key === item.categoryId
                  ? Style.navItem + " " + Style.active
                  : Style.navItem
              }
            >
              {item.categoryName}
            </View>
          );
        })}
      </ScrollView>
      {/* 文章 */}
      {articleList.length > 0 ? (
        <ScrollView
          className={Style.articleScroll}
          scrollY
          scrollWithAnimation
          enableFlex
          enable-passive
          enable-back-to-top
          refresher-enabled
          onScrollToLower={handleScrollToLower}
          onRefresherRefresh={handleRefresh}
          refresherTriggered={isRefreesh}
        >
          {articleList.map(item => {
            return (
              <View
                key={item.articleId}
                onClick={e =>
                  to(
                    "/pages/articleDetail/articleDetail?articleId=" +
                      e.currentTarget.id
                  )
                }
                id={item.articleId.toString()}
                className={Style.articleItem}
              >
                <View className={Style.item}>
                  <View className={Style.header}>
                    <Image
                      className={Style.portrait}
                      src="/assets/images/tabBar/个人-selected.png"
                    />
                    <View>
                      <View className={Style.nickNmae}>
                        {item.member.nickname}
                      </View>

                      <View className={Style.publishTime}>
                        {item.publishTime}
                      </View>
                    </View>
                    <View className={Style.right}>
                      <Button>关注</Button>
                    </View>
                  </View>
                </View>
                <View className={Style.item}>
                  <View className={Style.content}>
                    <Text className={Style.title}>{item.title}</Text>
                  </View>
                </View>
                <View className={Style.item}>
                  <View className={Style.cover}>
                    {item.coverList.length > 0 ? (
                      item.coverList.length > 1 ? (
                        item.coverList.map((icoverItem, index) => {
                          return index < 3 ? (
                            <Image
                              key={icoverItem.id}
                              className={Style.contentImage}
                              src={icoverItem.imgUrl}
                            />
                          ) : null;
                        })
                      ) : (
                        <Image
                          className={Style.contentImage}
                          src={item.coverList[0].imgUrl}
                        />
                      )
                    ) : null}
                  </View>
                </View>
                <View className={Style.item}>
                  <View className={Style.detail}>
                    <Text>{item.member.nickname}</Text>
                    <Text>
                      {item.readCount >= 10000
                        ? Math.round(item.readCount / 10000)
                        : item.readCount}
                      看过
                    </Text>
                  </View>
                </View>
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

export default Home;
