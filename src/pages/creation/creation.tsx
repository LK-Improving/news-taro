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
  Block,
  Textarea
} from "@tarojs/components";
import Taro, { getCurrentInstance, useDidShow, useLoad } from "@tarojs/taro";
import Style from "./creation.module.scss";
import ArticleCard from "../../components/articleCard";
import useStore from "../../store";
import memberApi from "../../services/api/memberApi";
import articleApi from "../../services/api/articleApi";
import { throllte } from "../../utils";

interface NavType {
  title: string;
  value: string;
}

// 节流
let isThrottle = false;

// 常用list
const NavList: NavType[] = [
  {
    title: "审核中",
    value: "0"
  },
  {
    title: "已发布",
    value: "1"
  },
  {
    title: "未通过",
    value: "2"
  },
  {
    title: "草稿箱",
    value: "3"
  }
];

const CommonlyUsed: React.FC = () => {
  // 当前分类
  const [key, setKey] = useState<number | null>(null);

  // 会员信息
  const [memberInfo, setMemberInfo] = useState<Partial<API.MemberYype>>({});

  // 文章LIst
  const [creationList, setCreationList] = useState<API.ArticleType[]>([]);

  // 获取页面实例
  const instance = getCurrentInstance();

  // 当前页码
  const [page, setPage] = useState<number>(1);

  // 总页数
  const [totalPage, setTotalPage] = useState<number>(1);

  // 是否展开
  const [isSpread, setIsSpread] = useState<boolean>(false);

  // 是否关注
  const [isSubsecibe, setISubsecibe] = useState<boolean>(false);

  // 变换
  const [coverTransform, setCoverTransForm] = useState<string>("");

  // 变换配置
  const [coverTransition, setCoverTransiton] = useState<string>("");

  const [statistics, setStatistics] = useState<Partial<API.StatisticsType>>({});

  const { MemberStore } = useStore();

  let startY = 0; // 手指起始的坐标
  let moveY = 0; // 手指移动的坐标
  let moveDistance = 0; // 手指移动的距离

  const param = instance.router?.params!;

  

  // 监听onShow
  useDidShow(() => {
    new Promise(async resolve => {
      const member = await getMemberInfo();
      resolve(member);
    }).then(res => {
      if (res) {
        selectSubscribe(res);
        getStatistics(res);
        if (param.key) {
          setKey(parseInt(param.key));
        } else {
          setKey(1);
        }
      }
    });
  });

  // 监听分类
  useEffect(() => {
    if (memberInfo.memberId) {
      set();
      setPage(1);
    }
  }, [key]);

  // 监听页码
  useEffect(() => {
    if (memberInfo.memberId) {
      if (page > 1) {
        push();
      }
    }
  }, [page]);

  // 设置文章
  const set = async () => {
    let res = await getCreationList();
    setCreationList(res.list);
    setTotalPage(res.totalPage);
  };

  // 合并文章
  const push = async () => {
    let res = await getCreationList();
    setCreationList(creationList.concat(res.list));
    setTotalPage(res.totalPage);
    isThrottle = false;
  };

  // 获取会员信息
  const getMemberInfo: Function = async () => {
    if (param.memberId) {
      const res = (await memberApi.reqMemberInfo(
        param.memberId
      )) as API.ResultType & {
        member: API.MemberYype;
      };

      if (res && res.code === 0) {
        setMemberInfo(res.member);
        return res.member;
      }
      return null;
    }
  };

  // 获取用户统计数
  const getStatistics: Function = async (member: typeof memberInfo) => {
    const res = (await memberApi.reqStatistics(
      member.memberId!
    )) as API.ResultType & {
      statistics: API.StatisticsType;
    };
    if (res && res.code === 0) {
      setStatistics(res.statistics);
    }
  };
  // 获取个人创作
  const getCreationList = async (): Promise<API.PageType & {
    list: API.ArticleType[];
  }> => {
    const params = {
      page,
      limit: 10,
      memberId: memberInfo.memberId,
      isAudit: NavList[key!].value
    };

    const res = (await articleApi.reqCreationList(params)) as API.ResultType & {
      page: API.PageType & { list: API.ArticleType[] };
    };
    if (res && res.code === 0) {
      return Promise.resolve(res.page);
    }
    return Promise.reject(res.msg);
  };

  const handeleDel: EventProps["onClick"] = e => {
    e.stopPropagation();
    Taro.showModal({
      title: "提示",
      content: "确定哟删除吗！",
      success: async res2 => {
        if (res2.confirm) {
          const res = await articleApi.reqDelCreation([e.currentTarget.id]);
          if (res && res.code === 0) {
            setCreationList(
              creationList.filter(item => item.articleId !== e.currentTarget.id)
            );
          }
        }
      }
    });
  };

  // 切换导航
  const handleChangeKey: EventProps["onClick"] = e => {
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

  // 查询当前用户是否订阅
  const selectSubscribe: Function = async (member: typeof memberInfo) => {
    const params = {
      subscribeId: param.memberId,
      memberId: member.memberId
    };
    const res = (await memberApi.reqSelectSubscribe(
      params
    )) as API.ResultType & {
      isSubscribe: boolean;
    };
    if (res && res.code === 0) {
      setISubsecibe(res.isSubscribe);
    }
  };

  // 订阅
  const handleSubscribe: EventProps["onClick"] = async () => {
    const params = {
      subscribeId: param.memberId,
      memberId: memberInfo.memberId
    };
    const res = await memberApi.reqSaveSubscribe(params);
    if (res && res.code === 0) {
      setISubsecibe(true);
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
            subscribe_id: param.memberId,
            member_id: memberInfo.memberId
          };
          const res = await memberApi.reqCanelSubscribe(params);
          if (res && res.code === 0) {
            setISubsecibe(false);
          }
        }
      }
    });
  };

  // 手指触摸开始操作
  const handleTouchStart: EventProps["onTouchStart"] = e => {
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

  // 跳转页面
  const to = (url: string) => {
    Taro.navigateTo({
      url: url
    });
  };
  return (
    <View className={Style.homeContainer}>
      {/* 头图 */}
      <View className={Style.banner}></View>
      {/* 空间详情 */}
      <View
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={Style.spaceInfo}
        style={{ transform: coverTransform, transition: coverTransition }}
      >
        {/* part1 */}
        <View className={Style.part1}>
          {/* 头像 */}
          <View className={Style.face}>
            <Image src={memberInfo.portrait!} className={Style.portrait} />
          </View>
          {/* 统计数 */}
          <View className={Style.statistical}>
            {/* 数量 */}
            <View className={Style.count}>
              <View className={Style.fans}>
                <View className={Style.num}>{statistics.fans || statistics.fans === 0 ? statistics.fans : "-"}</View>
                <View className={Style.type}>粉丝</View>
              </View>
              <View className={Style.fans}>
                <View className={Style.num}>{statistics.subscribeCount || statistics.subscribeCount === 0 ? statistics.subscribeCount : "-"}</View>
                <View className={Style.type}>关注</View>
              </View>
              <View className={Style.fans}>
                <View className={Style.num}>{statistics.likeCount || statistics.likeCount === 0 ? statistics.likeCount : "-"}</View>
                <View className={Style.type}>获赞</View>
              </View>
            </View>
            {/* 按钮 */}
            <View>
              {memberInfo.memberId === MemberStore.memberInfo.memberId ? (
                <Button
                  className={Style.defaultBtn}
                  onClick={() => to("/pages/personalSetting/personalSetting")}
                >
                  编辑资料
                </Button>
              ) : isSubsecibe ? (
                <Button
                  className={Style.defaultBtn}
                  onClick={handlCanelSubscribe}
                >
                  已关注
                </Button>
              ) : (
                <Button
                  className={Style.subscribeBtn}
                  onClick={handleSubscribe}
                >
                  关注
                </Button>
              )}
            </View>
          </View>
        </View>
        {/* part2 */}
        <View className={Style.part2}>
          {/* 基础base */}
          <View className={Style.base}>
            <Text className={Style.name}>{memberInfo.nickname}</Text>
            {memberInfo.gender &&
              memberInfo.gender !== 2 &&
              (memberInfo.gender === 0 ? (
                <Text
                  className={"iconfont icon-nan " + Style.gender}
                  style={{ color: "skyblue" }}
                ></Text>
              ) : (
                <Text
                  className={"iconfont icon-nv " + Style.gender}
                  style={{ color: "pink" }}
                ></Text>
              ))}
          </View>
          {/* 描述desc */}
          <View className={Style.desc}>
            {/* 签名 */}
            <View className={Style.sign}>
              {isSpread ? (
                <Textarea
                  style={{ width: "80Vmin" }}
                  autoHeight
                  value={memberInfo.sign!}
                ></Textarea>
              ) : (
                <Text>{memberInfo.sign || "这个人很懒什么都没有留下"}</Text>
              )}
            </View>
            {/* 展开 */}
            <View
              className={Style.spreadBtn}
              onClick={throllte(() => setIsSpread(!isSpread), 50)}
            >
              {isSpread ? "收起" : "展开"}
            </View>
          </View>
          {isSpread && (
            // 标签
            <View className={Style.tags}>
              <Text>{"UID:" + memberInfo.memberId}</Text>
              {memberInfo.city && (
                <Text>{"来自:" + memberInfo.city.substring(0, 2)}</Text>
              )}
            </View>
          )}
        </View>
      </View>
      {/* 导航条 */}
      <ScrollView
        className={Style.navScroll}
        scrollX
        scrollWithAnimation
        enableFlex
        scrollIntoView={"nav-" + key}
        style={{ transform: coverTransform, transition: coverTransition }}
      >
        {memberInfo.memberId &&
          NavList.map((item, index) => {
            return (
              (memberInfo.memberId === MemberStore.memberInfo.memberId ||
                index === 1) && (
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
              )
            );
          })}
      </ScrollView>
      {/* 文章 */}
      {creationList.length > 0 ? (
        key === 2 ? (
          <ScrollView
            className={Style.articleScroll}
            scrollY
            scrollWithAnimation
            enableFlex
            enable-passive
            enable-back-to-top
            style={{ transform: coverTransform, transition: coverTransition }}
            onScrollToLower={handleScrollToLower}
          >
            {creationList.map(item => {
              return (
                <View
                  key={item.articleId}
                  className={Style.commentCard}
                  // onClick={() =>
                  //   to(
                  //     "/pages/articleDetail/articleDetail?articleId=" +
                  //       item.articleId
                  //   )
                  // }
                >
                  {/* 头部 */}
                  <View className={Style.header}>
                    <Text className={Style.remark}>
                      {"备注：" + item.remark}
                    </Text>
                    <View
                      className={Style.right}
                      onClick={handeleDel}
                      id={item.articleId}
                    >
                      <Text>删除</Text>
                    </View>
                  </View>
                  <ArticleCard
                    article={item}
                    style={{ backgroundColor: "#f2eeee", padding: "20rpx" }}
                    option={{ footer: false }}
                  />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <ScrollView
            className={Style.articleScroll}
            scrollY
            scrollWithAnimation
            enableFlex
            enable-passive
            enable-back-to-top
            style={{ transform: coverTransform, transition: coverTransition }}
            onScrollToLower={handleScrollToLower}
          >
            {creationList.map(item => {
              return (
                <ArticleCard
                  key={item.articleId}
                  article={item}
                  to={to}
                  option={{
                    footer: key === 1,
                    headerRight:
                      memberInfo.memberId === MemberStore.memberInfo.memberId
                  }}
                  handeleDel={handeleDel}
                />
              );
            })}
          </ScrollView>
        )
      ) : (
        <View>这里什么都没有哦</View>
      )}
    </View>
  );
};

export default CommonlyUsed;
