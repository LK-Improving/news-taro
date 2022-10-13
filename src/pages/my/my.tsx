import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Image,
  EventProps,
  Block,
  Input,
  InputProps
} from "@tarojs/components";
import Taro, { getCurrentInstance, useDidHide, useDidShow } from "@tarojs/taro";
import { observer } from "mobx-react-lite";
import Style from "./my.module.scss";
import useStore from "../../store";
import memberApi from "../../services/api/memberApi";
import { isAuth } from "../../utils";

const My: React.FC = () => {
  const [statistics, setStatistics] = useState<Partial<API.StatisticsType>>({});

  const [notifyCount, seNotifyCount] = useState<number>(0);

  const [modal, setModal] = useState<Partial<API.ModalType> | null>(null);

  const {
    MemberStore: { memberInfo, setMmberInfo }
  } = useStore();

  // 监听onShow
  useDidShow(() => {
    if (memberInfo.memberId) {
      getStatistics();
      getNotifyCount();
    }
  });

  useDidHide(()=>{
    modalHide()
  })

  // 获取用户统计数
  const getNotifyCount: Function = async () => {
    const res = (await memberApi.reqNotifyCount(
      memberInfo.memberId!
    )) as API.ResultType & {
      count: number;
    };
    if (res && res.code === 0) {
      seNotifyCount(res.count);
    }
  };

  // 获取用户统计数
  const getStatistics: Function = async () => {
    const res = (await memberApi.reqStatistics(
      memberInfo.memberId!
    )) as API.ResultType & {
      statistics: API.StatisticsType;
    };
    if (res && res.code === 0) {
      setStatistics(res.statistics);
    }
  };

  // 推出操作
  const handleExit: EventProps["onClick"] = () => {
    if (!memberInfo.password) {
      return setModal({
        title: "为便于下次登录，请设置登陆密码",
        value: ""
      });
    }
    modalCancel()
  };

  // 处理模态框
  const modalInput: InputProps["onInput"] = e => {
    setModal({ ...modal, value: e.detail.value, errMsg: "" });
  };

  // 提交密码
  const modalConfirm = async () => {
    if (modal?.value?.trim() === "") {
      return setModal({ ...modal, errMsg: "密码不能为空" });
    }
    const res = await memberApi.reqUpdateMember({
      memberId: memberInfo.memberId,
      password: modal?.value
    });
    if (res && res.code === 0) {
      Taro.removeStorageSync("memberInfo");
      setMmberInfo({});
    }
    modalHide();
  };

  // 直接退出
  const modalCancel = () => {
    Taro.removeStorageSync("memberInfo");
    setMmberInfo({});
    modalHide();
  };

  // 关闭模态框
  const modalHide = () => {
    setModal(null);
  };

  // 跳转页面
  const to = (url: string) => {
    Taro.navigateTo({
      url
    });
  };

  return (
    <View className={Style.myContainer}>
      {/* 用户部分 */}
      <View
        className={Style.userSection}
        onClick={() =>
          memberInfo.memberId
            ? to(
                "/pages/creation/creation?key=1&memberId=" + memberInfo.memberId
              )
            : to("/pages/register/register")
        }
      >
        <View className={Style.userInfo}>
          <Image
            className={Style.portrait}
            src={
              memberInfo && memberInfo.portrait
                ? memberInfo.portrait
                : "../../assets/images/tabBar/个人-selected.png"
            }
          />
          <View>
            <View>
              {memberInfo.nickname ? memberInfo.nickname : "点击登录"}
            </View>
            {memberInfo.memberId ? (
              <View className={Style.UID}>UID:{memberInfo.memberId}</View>
            ) : null}
          </View>
        </View>

        <View>
          {memberInfo.memberId && (
            <Text className={Style.personal}>个人主页</Text>
          )}
          <Text className={"iconfont icon-right " + Style.iconfont}></Text>
        </View>
      </View>
      {/* 用户信息2 */}
      <View className={Style.myWrapper}>
        <View
          className={Style.card}
          onClick={() =>
            isAuth() &&
            to("/pages/creation/creation?key=1&memberId=" + memberInfo.memberId)
          }
        >
          <View className={Style.num}>
            {statistics.publishCount || statistics.publishCount === 0
              ? statistics.publishCount
              : "-"}
          </View>
          <View>资讯</View>
        </View>
        <View className={Style.card}>
          <View className={Style.num}>
            {statistics.likeCount || statistics.likeCount === 0
              ? statistics.likeCount
              : "-"}
          </View>
          <View>获赞</View>
        </View>
        <View
          className={Style.card}
          onClick={() => isAuth() && to("/pages/subscribe/subscribe?key=1")}
        >
          <View className={Style.num}>
            {statistics.fans || statistics.fans === 0 ? statistics.fans : "-"}
          </View>
          <View>粉丝</View>
        </View>
        <View
          className={Style.card}
          onClick={() => isAuth() && to("/pages/subscribe/subscribe?key=0")}
        >
          <View className={Style.num}>
            {statistics.subscribeCount || statistics.subscribeCount === 0
              ? statistics.subscribeCount
              : "-"}
          </View>
          <View>关注</View>
        </View>
      </View>
      {/* 常用 */}
      <View>
        <View className={Style.title}>创作中心</View>
        <View className={Style.myWrapper}>
          <View
            className={Style.card}
            onClick={() => isAuth() && to("/pages/notify/notify")}
          >
            <View
              className={"iconfont icon-xiaoxitongzhi " + Style.navIconfont}
            ></View>
            <View>消息通知</View>
            {notifyCount > 0 && (
              <View className={Style.tag}>
                {notifyCount > 99 ? 99 : notifyCount}
              </View>
            )}
          </View>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() &&
              to(
                "/pages/creation/creation?key=0&memberId=" + memberInfo.memberId
              )
            }
          >
            <View
              className={"iconfont icon-shenhezhong " + Style.navIconfont}
            ></View>
            <View>审核中</View>
          </View>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() &&
              to(
                "/pages/creation/creation?key=1&memberId=" + memberInfo.memberId
              )
            }
          >
            <View
              className={"iconfont icon-yifabu " + Style.navIconfont}
            ></View>
            <View>已发布</View>
          </View>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() &&
              to(
                "/pages/creation/creation?key=3&memberId=" + memberInfo.memberId
              )
            }
          >
            <View
              className={"iconfont icon-caogaoxiang " + Style.navIconfont}
            ></View>
            <View>草稿箱</View>
          </View>
        </View>
      </View>
      {/* 常用 */}
      <View>
        <View className={Style.title}>常用</View>
        <View className={Style.myWrapper}>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() && to("/pages/commonlyUsed/commonlyUsed?key=0")
            }
          >
            <View
              className={"iconfont icon-dianzan " + Style.navIconfont}
            ></View>
            <View>点赞</View>
          </View>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() && to("/pages/commonlyUsed/commonlyUsed?key=1")
            }
          >
            <View
              className={"iconfont icon-shoucang " + Style.navIconfont}
            ></View>
            <View>收藏</View>
          </View>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() && to("/pages/commonlyUsed/commonlyUsed?key=2")
            }
          >
            <View
              className={"iconfont icon-pinglun " + Style.navIconfont}
            ></View>
            <View>评论</View>
          </View>
          <View
            className={Style.card}
            onClick={() =>
              isAuth() && to("/pages/commonlyUsed/commonlyUsed?key=3")
            }
          >
            <View className={"iconfont icon-lishi " + Style.navIconfont}></View>
            <View>浏览历史</View>
          </View>
        </View>
      </View>
      {/* 用户导航2 */}
      {memberInfo.memberId && (
        <View className={Style.handleList}>
          <View className={Style.title}>更多服务</View>
          <View
            className={Style.handleItem}
            onClick={() =>
              isAuth() && to("/pages/personalSetting/personalSetting")
            }
          >
            <View>
              <Text
                className={Style.listIconfont + " iconfont icon-setting"}
              ></Text>
              <Text>个人设置</Text>
            </View>
            <View>
              <Text className={"iconfont icon-right " + Style.iconfont}></Text>
            </View>
          </View>

          <View className={Style.handleItem} onClick={handleExit}>
            <View>
              <Text
                className={Style.listIconfont + " iconfont icon-exit"}
              ></Text>
              <Text>退出登录</Text>
            </View>
            <View>
              <Text className={"iconfont icon-right " + Style.iconfont}></Text>
            </View>
          </View>
        </View>
      )}
      {modal && (
        <Block>
          <View className={Style.mask} />
          <View className={Style.modal}>
            <View className={"iconfont icon-guanbi " + Style.modalHide} onClick={modalHide}>
              
            </View>
            <View className={Style.modalTitle}>{modal.title}</View>
            <Input
              className={Style.modalInput}
              value={modal.value}
              maxlength={-1}
              auto-focus
              onInput={modalInput}
            />
            <View className={Style.modalErrMsg}>
              <Text>{modal.errMsg}</Text>
            </View>
            <View className={Style.modalFoot}>
              <View className={Style.modalButton} style={{color:'#9d9d9d'}} onClick={modalCancel}>
                直接退出
              </View>
              <View
                className={Style.modalButton}
                style={{
                  color: "#e98e97",
                  borderLeft: "1px solid rgba(0,0,0,.1)"
                }}
                onClick={modalConfirm}
              >
                确定
              </View>
            </View>
          </View>
        </Block>
      )}
    </View>
  );
};

export default observer(My);
