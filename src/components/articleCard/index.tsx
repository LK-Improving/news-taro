import { Button, EventProps, Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { createAtom } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import memberApi from "../../services/api/memberApi";
import useStore from "../../store";
import Style from "./index.module.scss";

interface OptionType {
  headerRight?: boolean;
  footer?: boolean;
}

interface IPropType {
  article: Partial<API.ArticleType> & { id?: string };
  handeleDel?: EventProps["onClick"];
  to?: Function;
  headerTo?: Function;
  option?: OptionType;
  style?: React.CSSProperties;
}

const ArticleCard: React.FC<IPropType> = ({
  article,
  to,
  headerTo,
  option = { footer: true, headerRight: false },
  handeleDel,
  style
}) => {
  const { MemberStore } = useStore();
  

  // 判断文章是否被删除
  return !(!article.articleId&&article.id) ? (
    <View
      onClick={e =>
        to
          ? to(
              "/pages/articleDetail/articleDetail?articleId=" +
                e.currentTarget.id
            )
          : null
      }
      id={article.articleId}
      className={Style.articleCard}
      style={style}
    >
      {/* 头部 */}
      <View
        className={Style.header}
        onClick={e => {
          e.stopPropagation();
          headerTo &&
            headerTo("/pages/creation/creation?memberId=" + article.authorId);
          
        }}
      >
        <Image
          className={Style.portrait}
          src={
            article.member?.portrait
              ? article.member.portrait
              : "/assets/images/tabBar/个人-selected.png"
          }
        />
        <View>
          <View className={Style.nickNmae}>{article.member!.nickname}</View>

          <View className={Style.publishTime}>{article.publishTime}</View>
        </View>
        {option && option.headerRight && (
          <View
            className={Style.right}
            onClick={handeleDel}
            id={article.articleId}
          >
            <Text>删除</Text>
          </View>
        )}
      </View>
      {/* 内容 */}
      <View className={Style.body}>
        <Text className={Style.title}>{article.title}</Text>
      </View>
      {/* 封面 */}
      <View className={Style.cover}>
        {article.coverList && article.coverList.length > 0 ? (
          article.coverList.length > 1 ? (
            article.coverList.map((icoverItem, index) => {
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
              src={article.coverList[0].imgUrl}
            />
          )
        ) : null}
      </View>
      {/* 底部栏 */}
      {option && option.footer == true && (
        <View className={Style.footer}>
          <Text className={"iconfont icon-liulan " + Style.browse}>
            &nbsp;
            {article.readCount && article.readCount >= 10000
              ? Math.round(article.readCount / 10000) + "w"
              : article.readCount}
            看过
          </Text>
          <View className={Style.info}>
            <Text className={"iconfont icon-dianzan " + Style.count}>
              &nbsp;
              {article.likeCount && article.likeCount >= 10000
                ? Math.round(article.likeCount / 10000) + "w"
                : article.likeCount}
            </Text>
            <Text className={"iconfont icon-shoucang " + Style.count}>
              &nbsp;
              {article.collectionCount && article.collectionCount >= 10000
                ? Math.round(article.collectionCount / 10000) + "w"
                : article.collectionCount}
            </Text>
            <Text className={"iconfont icon-pinglun " + Style.count}>
              &nbsp;
              {article.commentCount && article.commentCount >= 10000
                ? Math.round(article.commentCount / 10000) + "w"
                : article.commentCount}
            </Text>
          </View>
        </View>
      )}
    </View>
  ) : (
    // 文章被删除
    <View className={Style.articleCard} style={style}>
      {/* 头部 */}
      <View
        className={Style.header}
      >
        <Image
          className={Style.portrait}
          src={
            article.member?.portrait
              ? article.member.portrait
              : "/assets/images/tabBar/个人-selected.png"
          }
        />
        <View>
          <View className={Style.nickNmae}>未知</View>
        </View>
        <View className={Style.right} onClick={handeleDel} id={article.id}>
          <Text>删除</Text>
        </View>
      </View>
      {/* 内容 */}
      <View className={Style.body}>
        <Text className={Style.title}>该篇文章已被发布人删除！</Text>
      </View>
    </View>
  );
};

export default observer(ArticleCard);
