import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Image,
  Swiper,
  SwiperItem,
  EventProps
} from "@tarojs/components";

import Style from "./articleDetail.module.scss";

import arcImag from "../../assets/images/arc.png";

interface UserType {
  nickName: string;
  portrait: string;
};

type ArticleType = {
  userInfo: UserType
  readCount: Number;
  title: string;
  content: string;
  city: string;
  like: number;
  collectionNum: number;
  cover: string;
  publishTime: string;
  commonList: Array< UserType& {common:string}>
};

const My: React.FC = () => {
  const [articleDetail, setArticleDetail] = useState<ArticleType>({
    userInfo: {
      nickName: "admin",
      portrait: "/assets/images/tabBar/个人-selected.png"
    },
    readCount: 145154,
    title: "text",
    content: require("../publish/content"),
    city: "湖南",
    like: 515452,
    collectionNum: 151545,
    cover: require("../../assets/images/bgImg.jpg"),
    publishTime: "六天前",
    commonList: []
  });

  const [coverTransform, setCoverTransForm] = useState<string>("");
  const [coverTransition, setCoverTransiton] = useState<string>("");

  let startY = 0; // 手指起始的坐标
  let moveY = 0; // 手指移动的坐标
  let moveDistance = 0; // 手指移动的距离

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

  return (
    <View className={Style.articleDetailContainer}>
      {/* 封面 */}
      <Swiper className={Style.coverSwiper}>
        <SwiperItem>
          <Image src={articleDetail.cover}></Image>
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
            <Image src={articleDetail.userInfo.portrait} />
            <View className={Style.infoSection}>
              <View className={Style.author}>
                {articleDetail.userInfo.nickName}
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
          <View className={Style.footerLeft}>评论&nbsp;{articleDetail.commonList.length}</View>
          <View className={Style.FooterRight}>
            <View>{articleDetail.like}&nbsp;赞</View>
            <View>&nbsp;|&nbsp;</View>
            <View>{articleDetail.collectionNum}&nbsp;收藏</View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default My;
