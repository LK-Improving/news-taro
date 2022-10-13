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
import VirtualList from "@tarojs/components/virtual-list";
import Style from "./home.module.scss";
import articleApi from "../../services/api/articleApi";
import ArticleCard from "../../components/articleCard";
import useStore from "../../store";

// 节流
let isThrottle = false;

// 虚拟列表
// const virList = () => (
//   <VirtualList
//     height={380} /* 列表的高度 */
//     width="100%" /* 列表的宽度 */
//     itemData={articleList} /* 渲染列表的数据 */
//     itemCount={articleList.length} /*  渲染列表的长度 */
//     itemSize={220} /* 列表单项的高度  */
//     onScroll={({ scrollDirection, scrollOffset }) => {
//       console.log(scrollOffset);

//       if (
//         // 避免重复加载数据
//         !isThrottle &&
//         // 只有往前滚动我们才触发
//         scrollDirection === "forward" &&
//         // 5 = (列表高度 / 单项列表高度)
//         // 100 = 滚动提前加载量，可根据样式情况调整
//         scrollOffset > (articleList.length - 360 / 220) * 220
//       ) {
//         handleScrollToLower();
//         console.log(articleList);
//       }
//     }}
//   >
//     {Row}
//   </VirtualList>
// );

// const Row = React.memo(
//   ({
//     id,
//     index,
//     style,
//     data
//   }: {
//     id: string;
//     index: number;
//     style: React.CSSProperties;
//     data: API.ArticleType[];
//   }) => {
//     return (
//       <View id={id} style={style}>
//         <ArticleCard article={data[index]} />
//       </View>
//     );
//   }
// );

const Home: React.FC = () => {
  // 当前分类
  const [key, setKey] = useState<number>(0);

  // 下拉刷新
  const [isRefreesh, setIsRefreesh] = useState<boolean>(false);

  // 分类LIst
  const [categoryList, setCategoryList] = useState<API.CategoryType[]>([]);

  // 文章LIst
  const [articleList, setArticleList] = useState<API.ArticleType[]>([]);

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  const { MemberStore } = useStore();

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
      catId: key,
      memberId: MemberStore.memberInfo.memberId || null
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
  const handleScrollToLower = () => {
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

  const onReachBottom = e => {
    console.log(e);
  };

  // 跳转页面
  const to = (url: string) => {
    Taro.navigateTo({
      url: url
    });
    // 更新阅读量
    if (url.substring(0, 20) === "/pages/articleDetail") {
      setArticleList(
        articleList.map(item => {
          if (item.articleId === url.substring(45)) {
            console.log(typeof item.readCount);

            item.readCount = (parseInt(item.readCount) + 1).toString();
          }
          return item;
        })
      );
    }
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
              key={item.catId}
              onClick={handleChangeCategory}
              data-key={item.catId}
              className={
                key === item.catId
                  ? Style.navItem + " " + Style.active
                  : Style.navItem
              }
            >
              {item.catName}
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
              <ArticleCard
                headerTo={to}
                key={item.articleId}
                article={item}
                to={to}
              />
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
