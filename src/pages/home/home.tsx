import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Input,
  Icon,
  ScrollView,
  EventProps,
  Image,
  Editor
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import Style from "./home.module.scss";
import articleApi from "../../services/api/articleApi";

const Home: React.FC = () => {
  // 当前分类
  const [key, setKey] = useState<number>(0);

  // 分类LIst
  const [categoryList, setCategoryList] = useState<API.CategoryType[]>([]);

  // 文章LIst
  const [articleList, setArticleList] = useState<API.ArticleType[]>([]);

  // 当前页码
  const [page, setPage] = useState<number>(1);

  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    getArticleList();
  }, [key]);

  // 获取分类List
  const getCategoryList = async () => {
    const res = (await articleApi.reqArticleCtaegory()) as API.ResultType & {
      categoryList: API.CategoryType[];
    };
    console.log(res);
    if (res && res.code === 0) {
      setCategoryList(res.categoryList);
    }
  };

  // 获取文章
  const getArticleList = async () => {
    console.log(key);

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
      setArticleList(res.page.list);
    }
  };

  // 切换分类
  const handleChangeCategory: EventProps["onClick"] = e => {
    console.log(e);
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
      {/* 搜索栏 */}
      <View className={Style.serach}>
        <View className={Style.imput} onClick={() => to("/pages/search/search")}>
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
      {/* 资讯 */}
      {articleList.length > 0 ? (
        <ScrollView
          className={Style.articleScroll}
          scrollY
          scrollWithAnimation
          enableFlex
        >
          {articleList.map(item => {
            return (
              <View
                key={item.articleId}
                onClick={e =>
                  to("/pages/articleDetail/articleDetail?articleId=" + e.currentTarget.id)
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
