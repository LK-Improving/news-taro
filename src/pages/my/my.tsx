import React, { useEffect } from 'react'
import { View, Button, Text } from '@tarojs/components'
import counter from '../../store/counter'

import './my.scss'

type PageStateProps = {
  store: {
    counterStore: {
      counter: number,
      increment: Function,
      decrement: Function,
      incrementAsync: Function
    }
  }
}

const Home:React.FC<PageStateProps> = (props)=> {
  useEffect(()=>{
    console.log(counter);
    
  },[])
  const increment = () => {
    console.log(counter);
    
    counter.increment()
  }

  const decrement = () => {
    counter.decrement()
  }

  const incrementAsync = () => {
    counter.incrementAsync()
  }
  return(
    <View className='index'>
        <Button onClick={increment}>+</Button>
        <Button onClick={decrement}>-</Button>
        <Button onClick={incrementAsync}>Add Async</Button>
        <Text>{counter.counter}</Text>
      </View>
  )
}

export default Home

