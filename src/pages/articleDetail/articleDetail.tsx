import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  Image,
  Swiper,
  SwiperItem,
  EventProps,
  Block,
  Textarea,
  ScrollView,
  ScrollViewProps
} from "@tarojs/components";
import Taro, { getCurrentInstance, useShareAppMessage } from "@tarojs/taro";
import { observer } from "mobx-react-lite";
import Style from "./articleDetail.module.scss";

import arcImag from "../../assets/images/arc.png";
import articleApi from "../../services/api/articleApi";
import memberApi from "../../services/api/memberApi";
import useStore from "../../store";
import { debounce, throllte } from "../../utils";

const ArticleDetail: React.FC = () => {
  // 文章详情
  const [articleDetail, setArticleDetail] = useState<Partial<API.ArticleType>>({
    articleId: 1741828224670735,
    authorId: 1563343744953057300,
    catName: "财经",
    content: "",
    coverList: [
      {
        articleId: 1741828224670735,
        defaultImg: 0,
        id: 461,
        imgName: "tos-cn-i-qvj2lq49k0/93557ac3c735433d965bb6ef25919442",
        imgSort: 0,
        imgUrl:
          "http://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/93557ac3c735433d965bb6ef25919442~tplv-tt-post:400:400.jpeg?from=post&x-expires=1668960000&x-signature=g5STBTwDRQVjSPs0cFm7p305%2F7c%3D"
      }
    ],
    createTime: "2022-08-22 10:56:20",
    isAudit: 1,
    member: {},
    publishTime: "2022-08-22 10:56:20",
    readCount: 12058406,
    tag: null,
    title: "",
    userId: 1,
    likeCount: 0,
    collectionCount: 0,
    commentCount: 0
  });
  // 获取页面实例
  const instance = getCurrentInstance();
  // 评论
  const [comment, setComment] = useState<string>("");

  // 评论列表
  const [commenList, setCommentList] = useState<API.commentType[]>([]);

  // 键盘高度
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  // 是否显示
  const [visible, setVisible] = useState<boolean>(false);

  // 是否点赞
  const [isLike, setIsLike] = useState<boolean>(false);

  // 是否收藏
  const [isCollection, setIsCollection] = useState<boolean>(false);

  // 变换
  const [coverTransform, setCoverTransForm] = useState<string>("");

  // 变换配置
  const [coverTransition, setCoverTransiton] = useState<string>("");

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 节流
  const [isThrottle, setIsThrottle] = useState<boolean>(false);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  // 状态Ref(解决卸载组件时状态不是最新的)
  const stateRef = useRef({
    likeState: false,
    collectionState: false,
    firstLikeState: false,
    firstCollectionState: false
  });

  const { MemberStore } = useStore();

  let startY = 0; // 手指起始的坐标
  let moveY = 0; // 手指移动的坐标
  let moveDistance = 0; // 手指移动的距离

  const showConfirmBar = false;

  const articleId = instance.router?.params.articleId!;

  // 初始化
  useEffect(() => {
    init();
    // 即将卸载
    return () => {
      console.log("即将卸载");
      const {
        likeState,
        collectionState,
        firstLikeState,
        firstCollectionState
      } = stateRef!.current;
      // console.log(likeState, firstLikeState);
      // console.log(collectionState, firstCollectionState);
      if (likeState !== firstLikeState) {
        isLikeArticle();
      }
      if (collectionState !== firstCollectionState) {
        isCollectionArticle();
      }
    };
  }, []);

  // 监听页码
  useEffect(() => {
    if (page > 1) {
      push();
      setIsThrottle(false);
    }
  }, [page]);

  // 监听是否点赞
  useEffect(() => {
    stateRef.current.likeState = isLike;
  }, [isLike]);

  // 监听受否收藏
  useEffect(() => {
    stateRef.current.collectionState = isCollection;
  }, [isCollection]);

  // 查询当前用户是否点赞该文章
  const queryIsLike = async (params: object) => {
    const res = (await memberApi.reqisLike(params)) as API.ResultType & {
      isLike: boolean;
    };
    if (res && res.code === 0) {
      console.log(res);
      setIsLike(res.isLike);
      stateRef.current.firstLikeState = res.isLike;
    }
  };

  // 查询当前用户是否收藏该文章
  const queryIsCollection = async (params: object) => {
    const res = (await memberApi.reqIsCollection(params)) as API.ResultType & {
      isCollection: boolean;
    };
    if (res && res.code === 0) {
      console.log(res);
      setIsCollection(res.isCollection);
      stateRef.current.firstCollectionState = res.isCollection;
    }
  };

  // 初始化
  const init = async () => {
    getArticleDetail();
    const res = await getCommentList();
    setCommentList(res.list);
    setTotalPage(res.totalPage);
    if (MemberStore.memberInfo.memberId) {
      const params = {
        articleId,
        memberId: MemberStore.memberInfo.memberId
      };
      queryIsLike(params);
      queryIsCollection(params);
    }
  };

  // 合并评论
  const push = async () => {
    const res = await getCommentList();
    setCommentList(commenList.concat(res.list));
  };

  //获取文章详情
  const getArticleDetail = async () => {
    const params = {
      articleId,
      memberId: MemberStore.memberInfo.memberId || null
    };
    const res = (await articleApi.reqArticleInfo(params)) as API.ResultType & {
      article: API.ArticleType;
    };
    if (res && res.code === 0) {
      setArticleDetail(res.article);
    }
  };

  // 获取评论
  const getCommentList = async (): Promise<API.PageType & {
    list: API.commentType[];
  }> => {
    const params = {
      page,
      limit: 10,
      articleId
    };
    const res = (await memberApi.reqCommentListByArticleId(
      params
    )) as API.ResultType & {
      page: API.PageType & { list: API.commentType[] };
    };
    if (res && res.code === 0) {
      return Promise.resolve(res.page);
    }
    return Promise.reject(res.msg);
  };

  // 手指触摸开始操作
  const handleTouchStart: EventProps["onTouchStart"] = e => {
    // console.log('start',e);
    startY = e.touches[0].clientY;
    setCoverTransiton("transform .3s linear");
  };

  // 手指触摸移动操作
  const handleTouchMove: EventProps["onTouchMove"] = e => {
    // console.log('move',e);
    moveY = e.touches[0].clientY;
    moveDistance = moveY - startY;
    if (moveDistance <= 0) {
      return;
    }
    if (moveDistance >= 100) {
      moveDistance = 100;
    }
    setCoverTransForm(`translateY(${moveDistance}rpx)`);
  };

  // 手指触摸结束操作
  const handleTouchEnd: EventProps["onTouchEnd"] = e => {
    // console.log('end',e);
    setCoverTransForm(`translateY(0)`);
    setCoverTransiton("transform .5s linear");
  };

  // 点赞/取消点赞
  const handleLike: EventProps["onClick"] = () => {
    if (!MemberStore.memberInfo.memberId) {
      return Taro.showToast({
        title: "请登陆后再操作！",
        icon: "error"
      });
    }
    setIsLike(!isLike);
  };

  // 收藏/取消收藏
  const handleCollection: EventProps["onClick"] = () => {
    if (!MemberStore.memberInfo.memberId) {
      return Taro.showToast({
        title: "请登陆后再操作！",
        icon: "error"
      });
    }
    setIsCollection(!isCollection);
    if (!isCollection) {
      Taro.showToast({
        title: "收藏成功！"
      });
    }
  };

  // 分享
  const handleShare = useShareAppMessage(res => {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: articleDetail.title,
      path: "/page/user?id=123"
    };
  });

  // 是否点赞
  const isLikeArticle = () => {
    const params = {
      articleId,
      memberId: MemberStore.memberInfo.memberId
    };
    if (stateRef.current.likeState) {
      memberApi.reqSaveLike(params);
    } else {
      memberApi.reqDelLike(params);
    }
  };

  // 是否收藏
  const isCollectionArticle = () => {
    const params = {
      articleId,
      memberId: MemberStore.memberInfo.memberId
    };
    if (stateRef.current.collectionState) {
      memberApi.reqSaveCollection(params);
    } else {
      memberApi.reqDelCollection(params);
    }
  };
  // 评论
  const handleComment: EventProps["onClick"] = async () => {
    console.log(comment);
    const params = {
      articleId,
      memberId: MemberStore.memberInfo.memberId,
      content: comment
    };
    const res = await memberApi.reqSaveComment(params);
    if (res && res.code === 0) {
      Taro.showToast({
        icon: "success",
        title: "评论成功",
        success: getCommentList
      });
    }
  };
  // 滚动至评论底部添加下一页评论
  const handleScrollToLower: ScrollViewProps["onScrollToLower"] = () => {
    let currentPAge = page;
    if (currentPAge === totalPage || isThrottle) {
      return;
    }
    setIsThrottle(true);
    setTimeout(() => {
      setPage(currentPAge + 1);
    }, 1500);
  };

  // 订阅
  const handleSubscribe: EventProps["onClick"] = async () => {
    const params = {
      subscribeId: articleDetail.member?.memberId,
      memberId: MemberStore.memberInfo.memberId
    };
    const res = await memberApi.reqSaveSubscribe(params);
    if (res && res.code === 0) {
      setArticleDetail({ ...articleDetail, isSubscribe: 1 });
    }
  };

  // 取消订阅
  const handlCanelSubscribe: EventProps["onClick"] = () => {
    Taro.showModal({
      title: "提示",
      content: "你确定要取消关注吗？",
      success: async res2 => {
        if (res2.confirm) {
          const params = {
            subscribe_id: articleDetail.member?.memberId,
            member_id: MemberStore.memberInfo.memberId
          };
          const res = await memberApi.reqCanelSubscribe(params);
          if (res && res.code === 0) {
            setArticleDetail({ ...articleDetail, isSubscribe: 0 });
          }
        }
      }
    });
  };

  return (
    <View className={Style.articleDetailContainer}>
      {/* 封面 */}
      <Swiper className={Style.coverSwiper}>
        {articleDetail.coverList!.length > 0
          ? articleDetail.coverList!.map((item, index) => {
              return (
                <SwiperItem key={item.id}>
                  <Image src={articleDetail.coverList![index].imgUrl}></Image>
                </SwiperItem>
              );
            })
          : null}
      </Swiper>

      {/* 文章详情 */}
      <View style={{ transform: coverTransform, transition: coverTransition }}>
        {/* 头部 */}
        <View
          className={Style.artcileHeader}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image className={Style.arc} src={arcImag}></Image>
          <View className={Style.title}>{articleDetail.title}</View>
          <View className={Style.detail}>
            <Image src={articleDetail.member!.portrait!} />
            <View className={Style.infoSection}>
              <View className={Style.author}>
                {articleDetail.member!.nickname}
              </View>
              <View className={Style.info}>
                <Text style={{ marginRight: 20 }}>
                  {articleDetail.publishTime}
                </Text>
                {/* {'来自' + articleDetail.city} */}
              </View>
            </View>
            {MemberStore.memberInfo.memberId &&
            articleDetail.authorId !== MemberStore.memberInfo.memberId &&
            articleDetail.isSubscribe === 0 ? (
              <Button onClick={throllte(handleSubscribe, 500)}>关注</Button>
            ) : (
              <Button
                onClick={throllte(handlCanelSubscribe, 500)}
                className={Style.activeBtn}
              >
                已关注
              </Button>
            )}
          </View>
        </View>
        {/* 文章内容 */}
        <View className={Style.Block}>
          <mpWeixin
            id="article"
            containerStyle="padding:0px;"
            content={articleDetail.content}
            emoji
            domain="https://mp-html.oss-cn-hangzhou.aliyuncs.com"
          />
        </View>

        {/* 点赞，收藏，转发， */}
        <View className={Style.artcileFooter}>
          <View className={Style.footerLeft}>
            评论&nbsp;{articleDetail.commentCount}
          </View>
          <View className={Style.footerRight}>
            <View>{articleDetail.likeCount}&nbsp;赞</View>
            <View>&nbsp;|&nbsp;</View>
            <View>{articleDetail.collectionCount}&nbsp;收藏</View>
          </View>
        </View>
      </View>

      {/* 评论 */}
      {commenList.length > 0 ? (
        <ScrollView
          className={Style.commentScroll}
          scrollY
          scrollWithAnimation
          enableFlex
          enable-passive
          lower-threshold={150}
          onScrollToLower={handleScrollToLower}
        >
          {commenList.map(item => {
            return (
              <View className={Style.commentItem} key={item.commentId}>
                {/* 评论头部 */}
                <View className={Style.commentHeader}>
                  {/* 头像 */}
                  <Image src={item.member.portrait} />
                  <View className={Style.commentInfo}>
                    <View className={Style.nickName}>
                      {item.member.nickname}
                    </View>
                    <View className={Style.commentTime}>{item.createTime}</View>
                    <View className={Style.commenContent}>{item.content}</View>
                  </View>
                </View>
              </View>
            );
          })}
          <View>{isThrottle ? "正在加载中！" : null}</View>
          <View>{page === totalPage ? "没有更多啦！" : null}</View>
        </ScrollView>
      ) : (
        <View>暂无评论</View>
      )}
      {/* 操作栏 */}
      <View
        className={Style.handleBar}
        // style={{ bottom: keyboardHeight + 'rpx' }}
      >
        {!visible ? (
          <Block>
            <View
              className={Style.white}
              onClick={() => (MemberStore.memberInfo ? setVisible(true) : null)}
            >
              <Text
                className="iconfont icon-shuru"
                style={{ fontSize: "32rpx" }}
              ></Text>
              {MemberStore.memberInfo ? (
                <Text>&nbsp;写评论···</Text>
              ) : (
                <Text>&nbsp;登陆后才能评论</Text>
              )}
            </View>
            <Button onClick={debounce(handleLike, 500)}>
              <Text
                className={
                  isLike
                    ? "iconfont icon-dianzan_kuai " + Style.handleOption
                    : "iconfont icon-dianzan " + Style.handleOption
                }
                style={{ color: isLike ? "#e98e97" : "" }}
              ></Text>
            </Button>

            <Button onClick={debounce(handleCollection, 500)}>
              <Text
                className={
                  isCollection
                    ? "iconfont icon-shoucang_kuai " + Style.handleOption
                    : "iconfont icon-shoucang " + Style.handleOption
                }
                style={{ color: isCollection ? "#e98e97" : "" }}
              ></Text>
            </Button>

            <Button openType="share" onClick={() => handleShare}>
              <Text
                className={"iconfont icon-zhuanfa " + Style.handleOption}
                style={{ color: "#e98e97" }}
              ></Text>
            </Button>
          </Block>
        ) : (
          <Block>
            <Textarea
              className={Style.textarea}
              placeholder="发个友善的评论吧！"
              placeholderStyle="color: #868080;"
              fixed
              value={comment}
              onInput={e => setComment(e.detail.value)}
              autoFocus
              autoHeight
              showConfirmBar={showConfirmBar}
              adjustPosition={false}
              maxlength={120}
              onFocus={e => {
                setKeyboardHeight(8);
              }}
              onBlur={e => {
                setKeyboardHeight(0);
                setVisible(false);
              }}
            ></Textarea>
            <Text
              className={Style.publish}
              style={{ color: comment ? "#e98e97" : "#868080" }}
              onClick={handleComment}
            >
              发布
            </Text>
          </Block>
        )}
      </View>
    </View>
  );
};

export default observer(ArticleDetail);
