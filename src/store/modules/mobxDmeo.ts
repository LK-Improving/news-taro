import { makeAutoObservable } from "mobx";

class useMobxStore{
  // 定义一个初始数据
  count = 0;

  // 定义一个原始数组，用于测试computed计算属性
  list = [1, 2, 3, 4, 5, 6];

  constructor() {
    // 对初始化数据进行响应式处理
    makeAutoObservable(this);
  }

  // 定义一个计算属性
  get filterList() {
    return this.list.filter(item => item > 4);
  }

  //增加list数据内容
  addList = () => {
    this.list.push(7);
  };

  // 设置改变初始化数据方法
  addCount = () => {
    this.count++;
    console.log(this.count);
  };
}

export default useMobxStore
