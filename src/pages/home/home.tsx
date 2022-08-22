import React, { useEffect, useState } from 'react'
import { View, Button, Text, Input, Icon, ScrollView, EventProps, Image, Editor } from '@tarojs/components'
import counter from '../../store/counter'
import Style from './home.module.scss'
import Taro from '@tarojs/taro'



const Home: React.FC = () => {

  const [key, setKey] = useState<string>('1')


  useEffect(() => {
    console.log(counter);

  }, [])

  const handleChangeType: EventProps['onClick'] = (e) => {
    console.log(e)
    setKey(e.currentTarget.id)
  }

  // 获取分类List
  const getCategoryList = () => {
    // Taro.request({
    //   url
    // })
  }

  // 前往搜索页面
  const toSearch = () => {
    Taro.navigateTo({
      url: 'pages/search/search'
    })
  }

  const toDetail = (id)=>{
    Taro.navigateTo({
      url: '/page/articleDetail/articleDetail?id=' + id
    })
  }
  return (
    <View className={Style.homeContainer}>
      {/* 搜索栏 */}
      <View className={Style.serach}>
        <View className={Style.imput} onClick={toSearch}>
          <Text className='iconfont icon-sousuo' style={{ fontSize: '40rpx' }}></Text>
          <Input placeholder='搜索喜欢的新闻吧！' placeholderStyle='font-size:32rpx' />
        </View>
        <Text className={'iconfont icon-plus ' + Style.iconfont} onClick={()=>to('pages/publish/publish')}>发布</Text>
      </View>
      {/* 导航条 */}
      <ScrollView
        className={Style.navScroll}
        scrollX
        scrollWithAnimation
        enableFlex
        scrollIntoView={'nav' + key}
      >
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
            return (
              <View key={item} onClick={handleChangeType} id={item.toString()} className={key === item.toString() ? Style.navItem + ' ' + Style.active : Style.navItem}>科技</View>
            )
          })
        }

      </ScrollView>
      {/* 资讯 */}
      <ScrollView
        className={Style.contentScroll}
        scrollY
        scrollWithAnimation
        enableFlex
      >
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
            return (
              <View key={item} onClick={e=>toDetail(e.currentTarget.id)} id={item.toString()} className={Style.contentItem}>
                <View className={Style.content}>
                  <Text className={Style.title}>51545</Text>
                  <View className={Style.detail}>
                    <text>lk</text>
                    <text>11122评论</text>
                    <text>6天前</text>
                    <text>X</text>
                  </View>
                  </View>
                <Image className={Style.contentImage} src='/assets/images/tabBar/个人-selected.png' />
              </View>
            )
          })
        }

      </ScrollView>
    </View>
  )
}

export default Home

