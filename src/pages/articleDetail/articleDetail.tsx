import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Image,
  Swiper,
  SwiperItem,
  EventProps,
  Block,
  Textarea
} from "@tarojs/components";
import { getCurrentInstance, useShareAppMessage } from "@tarojs/taro";

import Style from "./articleDetail.module.scss";

import arcImag from "../../assets/images/arc.png";
import articleApi from "../../services/api/articleApi";

const ArticleDetail: React.FC = () => {
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
        imgUrl: "http://p3-sign.toutiaoimg.com/tos-cn-i-qvj2lq49k0/93557ac3c735433d965bb6ef25919442~tplv-tt-post:400:400.jpeg?from=post&x-expires=1668960000&x-signature=g5STBTwDRQVjSPs0cFm7p305%2F7c%3D"
      }
    ],
    createTime: "2022-08-22 10:56:20",
    isAudit: 1,
    member: {},
    publishTime: "2022-08-22 10:56:20",
    readCount: 12058406,
    tag: null,
    title: "",
    userId: 1
  });
  // 获取页面实例
  const instance = getCurrentInstance();
  // 评论
  const [common, setCommon] = useState<string>("");

  // 键盘高度
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  // 是否显示
  const [visible, setVisible] = useState<boolean>(false);

  // 是否点赞
  const [isLike, setIsLike] = useState<boolean>(false);

  // 是否收藏
  const [isCollection, setIsCollection] = useState<boolean>(false);

  const [coverTransform, setCoverTransForm] = useState<string>("");

  const [coverTransition, setCoverTransiton] = useState<string>("");

  let startY = 0; // 手指起始的坐标
  let moveY = 0; // 手指移动的坐标
  let moveDistance = 0; // 手指移动的距离

  const showConfirmBar = false;

  useEffect(() => {
    console.log(instance.router?.params.articleId);
    init();
  }, []);

  const init = async () => {
    const articleId = instance.router?.params.articleId as string;
    const res = (await articleApi.reqArticleInfo(
      articleId
    )) as API.ResultType & {
      article: API.ArticleType;
    };
    if (res && res.code === 0) {
      console.log(res);
      setArticleDetail(res.article);
    }
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
    setIsLike(!isLike);
  };

  // 收藏/取消收藏
  const handleCollection: EventProps["onClick"] = () => {
    setIsCollection(!isCollection);
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

  return (
    <View className={Style.articleDetailContainer}>
      {/* 封面 */}
      <Swiper className={Style.coverSwiper}>
        <SwiperItem>
          <Image src={articleDetail.coverList[0].imgUrl}></Image>
        </SwiperItem>
        <SwiperItem>
          <Image src={articleDetail.cover}></Image>
        </SwiperItem>
      </Swiper>
      {/* 文章详情 */}
      <View style={{ transform: coverTransform, transition: coverTransition }}>
        {/* 文章头部 */}
        <View
          className={Style.artcileHeader}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image className={Style.arc} src={arcImag}></Image>
          <View className={Style.title}>{articleDetail.title}</View>
          <View className={Style.detail}>
            <Image src={articleDetail.member.portrait} />
            <View className={Style.infoSection}>
              <View className={Style.author}>
                {articleDetail.member.nickname}
              </View>
              <View className={Style.info}>
                <Text style={{ marginRight: 20 }}>
                  {articleDetail.publishTime}
                </Text>
                {"来自" + articleDetail.city}
              </View>
            </View>
            <Button>关注</Button>
          </View>
        </View>
        {/* 文章内容 */}
        <View className={Style.Block}>
          <mpWeixin
            id="article"
            containerStyle="padding:0px;"
            content={articleDetail.content}
            placeholder="请输入正文"
            emoji
            domain="https://mp-html.oss-cn-hangzhou.aliyuncs.com"
          />
        </View>

        {/* 点赞，收藏，转发， */}
        <View className={Style.artcileFooter}>
          <View className={Style.footerLeft}>
            {/* 评论&nbsp;{articleDetail.commonList.length} */}
          </View>
          <View className={Style.FooterRight}>
            {/* <View>{articleDetail.like}&nbsp;赞</View> */}
            <View>&nbsp;|&nbsp;</View>
            {/* <View>{articleDetail.collectionNum}&nbsp;收藏</View> */}
          </View>
        </View>
      </View>

      {/* 操作栏 */}
      <View
        className={Style.handleBar}
        // style={{ bottom: keyboardHeight + "rpx" }}
      >
        {!visible ? (
          <Block>
            <View className={Style.white} onClick={() => setVisible(true)}>
              <Text
                className="iconfont icon-shuru"
                style={{ fontSize: "32rpx" }}
              ></Text>
              <Text>&nbsp;写评论···</Text>
            </View>
            <Button onClick={handleLike}>
              <Text
                className={
                  isLike
                    ? "iconfont icon-dianzan_kuai " + Style.handleOption
                    : "iconfont icon-dianzan " + Style.handleOption
                }
                style={{ color: isLike ? "#e98e97" : "" }}
                onClick={handleLike}
              ></Text>
            </Button>

            <Button onClick={handleCollection}>
              <Text
                className={
                  isCollection
                    ? "iconfont icon-shoucang_kuai " + Style.handleOption
                    : "iconfont icon-shoucang " + Style.handleOption
                }
                style={{ color: isCollection ? "#e98e97" : "" }}
                onClick={handleCollection}
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
              value={common}
              onInput={e => setCommon(e.detail.value)}
              autoFocus
              autoHeight
              showConfirmBar={showConfirmBar}
              adjustPosition={false}
              onFocus={e => {
                console.log(e);
                setKeyboardHeight(8);
              }}
              onBlur={e => {
                console.log(e);
                setKeyboardHeight(0);
                setVisible(false);
              }}
            ></Textarea>
            <Text
              className={Style.publish}
              style={{ color: common ? "#e98e97" : "#868080" }}
            >
              发布
            </Text>
          </Block>
        )}
      </View>
    </View>
  );
};

export default ArticleDetail;
