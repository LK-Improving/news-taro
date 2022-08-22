import { Component } from 'react'
// import { Provider } from 'mobx-react'
import { View } from '@tarojs/components'
// import counterStore from './store/counter'
import './app.scss'

// const store = {
//   counterStore
// }

class App extends Component {
  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  // this.props.children 就是要渲染的页面
  render() {
    return (
      // 类式组件
      // <Provider store={store}>
      <View>
        {this.props.children}
      </View>
      // </Provider>
    )
  }
}

export default App
