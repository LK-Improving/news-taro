import React, { useEffect, useState } from 'react'
import { View, Button, Text, Input, Icon } from '@tarojs/components'
import counter from '../../store/counter'
import Style from './home.module.scss'
import Taro from '@tarojs/taro'



const Home: React.FC = () => {

  const [key, setKey] = useState<string>('')

  useEffect(() => {
    console.log(counter);

  }, [])

  const handleInput = (e) => {
    console.log(e);
    setKey(e.detail.value)
  }

  const toSearch = () => {
    // Taro.navigateTo({
    //   url: ''
    // })
  }

  return (
    <View className={Style.homeContailer}>
      {/* 搜索栏 */}
      <View className={Style.serach}>
        <View className={Style.imput} onClick={toSearch}>
          <text className='iconfont icon-sousuo' style={{fontSize: '40rpx'}}></text>
          <Input placeholder='搜索喜欢的新闻吧！' onInput={handleInput} />
        </View>
        <text className={'iconfont icon-plus ' + Style.iconfont} >发布</text>
      </View>
    </View>
  )
}

export default Home

