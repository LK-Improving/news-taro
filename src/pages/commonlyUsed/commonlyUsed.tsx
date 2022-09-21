import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Input,
  ScrollView,
  EventProps,
  Image,
  ScrollViewProps,
  Block
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Style from "./commonlyUsed.module.scss";
import ArticleCard from "../../components/articleCard";
import useStore from "../../store";
import memberApi from "../../services/api/memberApi";

interface NavType {
  title: string;
  value: string;
}

// 节流
let isThrottle = false;

// 常用list
const NavList: NavType[] = [
  {
    title: "点赞",
    value: "Like"
  },
  {
    title: "收藏",
    value: "Collection"
  },
  {
    title: "评论",
    value: "Comment"
  },
  {
    title: "历史",
    value: "History"
  }
];

const CommonlyUsed: React.FC = () => {
  // 当前分类
  const [key, setKey] = useState<number>(0);

  // 文章LIst
  const [articleList, setArticleList] = useState<API.ArticleType[]>([]);

  // 评论LIst
  const [commentList, setCommentList] = useState<
    (API.commentType & { article: API.ArticleType })[]
  >([]);

  // 获取页面实例
  const instance = getCurrentInstance();

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  const {
    MemberStore: { memberInfo }
  } = useStore();

  const param = instance.router?.params!;

  // 初始化
  useEffect(() => {
    if (param.key) {
      setKey(parseInt(param.key));
    }
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
  const isComment = NavList[key].value === "Comment";
  // 设置文章
  const set = async () => {
    if (isComment) {
      let res = await getCommentList();
      setCommentList(res.list);
      setTotalPage(res.totalPage);
    } else {
      let res = await getArticleList();
      setArticleList(res.list);
      setTotalPage(res.totalPage);
    }
  };

  // 合并文章
  const push = async () => {
    if (isComment) {
      let res = await getCommentList();
      setCommentList(commentList.concat(res.list));
      setTotalPage(res.totalPage);
    } else {
      let res = await getArticleList();
      setArticleList(articleList.concat(res.list));
      setTotalPage(res.totalPage);
    }
    isThrottle = false;
  };

  // 获取文章&评论
  const getCommentList = async (): Promise<API.PageType & {
    list: API.commentType & { article: API.ArticleType }[];
  }> => {
    const params = {
      page,
      limit: 10,
      memberId: memberInfo.memberId || null
    };

    const res = (await memberApi[`req${NavList[key].value}Article`](
      params
    )) as API.ResultType & {
      page: API.PageType & {
        list: API.commentType & { article: API.ArticleType }[];
      };
    };
    if (res && res.code === 0) {
      return Promise.resolve(res.page);
    }
    return Promise.reject(res.msg);
  };

  // 获取文章
  const getArticleList = async (): Promise<API.PageType & {
    list: API.ArticleType[];
  }> => {
    const params = {
      page,
      limit: 10,
      memberId: memberInfo.memberId || null
    };

    const res = (await memberApi[`req${NavList[key].value}Article`](
      params
    )) as API.ResultType & {
      page: API.PageType & { list: API.ArticleType[] };
    };
    if (res && res.code === 0) {
      return Promise.resolve(res.page);
    }
    return Promise.reject(res.msg);
  };

  // 切换导航
  const handleChangeKey: EventProps["onClick"] = e => {
    console.log(e);
    setKey(e.currentTarget.dataset.key);
  };

  // 滚动至底部添加下一页文章
  const handleScrollToLower: ScrollViewProps["onScrollToLower"] = () => {
    let currentPAge = page;
    if (currentPAge === totalPage) {
      return;
    }
    if (!isThrottle) {
      isThrottle = true;
      setTimeout(() => {
        setPage(currentPAge + 1);
      }, 1500);
    }
  };

  // 删除评论
  const handeleDelComment: EventProps["onClick"] = e => {
    const id = e.currentTarget.id;
    Taro.showModal({
      title: "提示",
      content: "确定要删除该条评论吗！",
      success: async res2 => {
        if (res2.confirm) {
          const res = await memberApi.reqDelComment([id]);
          if (res && res.code === 0) {
            // 过滤评论
            setCommentList(commentList.filter(item => item.commentId != id));
          }
        }
      }
    });
  };

  // 跳转页面
  const to = (url: string) => {
    Taro.navigateTo({
      url: url
    });
  };
  return (
    <View className={Style.homeContainer}>
      {/* 导航条 */}
      <ScrollView
        className={Style.navScroll}
        scrollX
        scrollWithAnimation
        enableFlex
        scrollIntoView={key+''}
      >
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
      </ScrollView>
      {/* 文章 */}
      {isComment ? (
        commentList.length > 0 ? (
          <ScrollView
            className={Style.articleScroll}
            scrollY
            scrollWithAnimation
            enableFlex
            enable-passive
            enable-back-to-top
            onScrollToLower={handleScrollToLower}
          >
            {commentList.map(item => {
              return (
                <View
                  key={item.commentId}
                  className={Style.commentCard}
                  onClick={() =>
                    to(
                      "/pages/articleDetail/articleDetail?articleId=" +
                        item.article
                    )
                  }
                >
                  {/* 头部 */}
                  <View className={Style.header}>
                    <Image
                      className={Style.portrait}
                      src={
                        memberInfo.portrait
                          ? memberInfo.portrait
                          : "/assets/images/tabBar/个人-selected.png"
                      }
                    />
                    <View>
                      <View className={Style.nickNmae}>
                        {memberInfo.nickname}
                      </View>

                      <View className={Style.publishTime}>
                        {item.createTime}
                      </View>
                    </View>
                    <View
                      className={Style.right}
                      onClick={handeleDelComment}
                      id={item.commentId}
                    >
                      <Text>删除</Text>
                    </View>
                  </View>
                  {/* 内容 */}
                  <View className={Style.body}>
                    <Text className={Style.title}>{item.content}</Text>
                  </View>
                  <ArticleCard
                    article={item.article}
                    // to={to}
                    style={{ backgroundColor: "#f2eeee", padding: "20rpx" }}
                  />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View>您还没有评论过哦，快去发个友善的评论吧！</View>
        )
      ) : articleList.length > 0 ? (
        <ScrollView
          className={Style.articleScroll}
          scrollY
          scrollWithAnimation
          enableFlex
          enable-passive
          enable-back-to-top
          onScrollToLower={handleScrollToLower}
        >
          {articleList.map(item => {
            return <ArticleCard key={item.articleId} article={item} to={to} />;
          })}
        </ScrollView>
      ) : (
        <View>这里什么都没有哦</View>
      )}
    </View>
  );
};

export default CommonlyUsed;
