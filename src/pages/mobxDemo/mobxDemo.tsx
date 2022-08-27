import React, { useContext } from "react";
import { View, Text, Button } from "@tarojs/components";
import { observer } from "mobx-react-lite";
import Taro from "@tarojs/taro";
import useStore from "../../store";


function Index() {
  const { useMobxStore } = useStore()

  return (
    <View>
      <Text>
        {useMobxStore.count}
      </Text>
      <Button onClick={useMobxStore.addCount}>添加</Button>
      <Button onClick={e=>{Taro.navigateTo({url: '/pages/login/login'})}}>gohome</Button>
      {/* 计算属性 */}
      <View>{useMobxStore.filterList.join('~')}</View>
      <Button onClick={useMobxStore.addList}>点我数组添加内容</Button>

    </View>
  );
}

export default observer(Index);
