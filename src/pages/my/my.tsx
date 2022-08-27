import React, { useEffect, useState } from 'react'
import { View, Button, Text, Image, EventProps } from '@tarojs/components'

import Style from './my.module.scss'
import Taro from '@tarojs/taro'

const My: React.FC = () => {
  const [memberInfo, setMemberInfo] = useState<API.MemberYype>(Taro.getStorageSync('memberInfo'))

  useEffect(()=>{
    // const member = Taro.getStorageSync('memberInfo')
    // if (member) {
    //   console.log(member);
    //   setMemberInfo(member)
    // }
  },[])

  const toLogin:EventProps['onClick'] = () => {
    Taro.navigateTo({
      url: "/pages/register/register"
    })
  }

  return (
    <View className={Style.myContainer}>
      {/* 用户部分 */}
      <View className={Style.userSection} onClick={toLogin}>
        <View className={Style.userInfo}>
          <Image className={Style.portrait} src={memberInfo?memberInfo.portrait?memberInfo.portrait:'../../assets/images/tabBar/个人-selected.png':'/assets/images/tabBar/个人-selected.png'} />
          <View>
            <View>{memberInfo?memberInfo.nickname:'点击登录'}</View>
            {memberInfo?<View className={Style.UID}>UID:{memberInfo?.memberId}</View>:null}
          </View>
        </View>
        <View>
          <Text className={Style.personal}>
            个人主页
          </Text>
          <Text className={'iconfont icon-right ' + Style.iconfont}></Text>
        </View>
      </View>
      {/* 用户Cards */}
      <View className={Style.userCards}>
        <View className={Style.card}>
          <View className={Style.num}>0</View>
          <View>资讯</View>
        </View>
        <View className={Style.card}>
          <View className={Style.num}>0</View>
          <View>获赞</View>
        </View>
        <View className={Style.card}>
          <View className={Style.num}>0</View>
          <View>粉丝</View>
        </View>
        <View className={Style.card}>
          <View className={Style.num}>0</View>
          <View>关注</View>
        </View>
      </View>
      {/* 用户导航 */}
      <View className={Style.userCards}>
        <View className={Style.card}>
          <View className={'iconfont icon-dianzan ' + Style.navIconfont}></View>
          <View>点赞</View>
        </View>
        <View className={Style.card}>
          <View className={'iconfont icon-shoucang ' + Style.navIconfont}></View>
          <View>收藏</View>
        </View>
        <View className={Style.card}>
          <View className={'iconfont icon-pinglun ' + Style.navIconfont}></View>
          <View>评论</View>
        </View>
        <View className={Style.card}>
          <View className={'iconfont icon-lishi ' + Style.navIconfont}></View>
          <View>浏览历史</View>
        </View>
      </View>
      {/* 用户导航2 */}
      <View className={Style.handleList}>
        <View className={Style.handleItem}>
          <View>
            <Text className={Style.listIconfont + ' iconfont icon-dianzan'}></Text>
            <Text >点赞</Text>
          </View>
          <View>
            <Text className={'iconfont icon-right ' + Style.iconfont}></Text>
          </View>
        </View>
        <View className={Style.handleItem}>
          <View>
            <Text className={Style.listIconfont + ' iconfont icon-shoucang'}></Text>
            <Text >收藏</Text>
          </View>
          <View>
            <Text className={'iconfont icon-right ' + Style.iconfont}></Text>
          </View>
        </View>
        <View className={Style.handleItem}>
          <View>
            <Text className={Style.listIconfont + ' iconfont icon-pinglun'}></Text>
            <Text >评论</Text>
          </View>
          <View>
            <Text className={'iconfont icon-right ' + Style.iconfont}></Text>
          </View>
        </View>
        <View className={Style.handleItem}>
          <View>
            <Text className={Style.listIconfont + ' iconfont icon-lishi'}></Text>
            <Text >历史</Text>
          </View>
          <View>
            <Text className={'iconfont icon-right ' + Style.iconfont}></Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default My

