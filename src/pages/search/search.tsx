import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Input,
  Block,
  EventProps,
  InputProps
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import Style from "./search.module.scss";

import articleApi from "../../services/api/articleApi";

interface SearchType {
  articleId: string;
  title: string;
}
// 防抖函数使用
let isSend = null;

const Search: React.FC = () => {
  // 表单项内容
  const [searchContent, setSearchContent] = useState<string>("");

  //历史搜索记录
  const [historyList, setHistoryList] = useState<string[]>([]);

  //匹配到的数据
  const [searchList, setSearchList] = useState<SearchType[]>([]);

  // 热搜榜
  const [hotList, setHotList] = useState<API.ArticleType[]>([]);

  useEffect(() => {
    getSearchHistory();
    getHotList();
  }, []);

  // 监听用户输入
  useEffect(() => {
    // 防抖
    if (isSend !== null) {
      clearTimeout(isSend);
    }
    isSend = setTimeout(() => {
      if (searchContent !== "") {
        // 关键词搜索
        search(searchContent);
      } else {
        setSearchList([]);
      }
    }, 500) as any;
  }, [searchContent]);

  // 获取热搜榜
  const getHotList = async () => {
    const res = (await articleApi.reqHotArticle({})) as API.ResultType & {
      page: API.PageType & { list: API.ArticleType[] };
    };
    if (res && res.code === 0) {
      console.log(res);
      setHotList(res.page.list);
    }
  };

  // 获取搜索历史
  const getSearchHistory = () => {
    const history = Taro.getStorageSync("searchHistory");
    if (history) {
      setHistoryList(history);
    }
  };

  // 删除搜索历史
  const handleDelete: EventProps["onClick"] = () => {
    //是否确认清空
    Taro.showModal({
      content: "确认清空记录吗?",
      success: res => {
        if (res.confirm) {
          setHistoryList([]);
          Taro.removeStorageSync("searchHistory");
        }
      }
    });
  };

  // 关键字搜索
  const search = async (key: string) => {
    const res = (await articleApi.reqSearchArticle({
      key
    })) as API.ResultType & { searchList: SearchType[] };
    if (res && res.code === 0) {
      console.log(res);
      setSearchList(res.searchList);
      if (res.searchList.length > 0) {
        //将搜索关键字添加到历史记录
        if (historyList.indexOf(searchContent) !== -1) {
          historyList.splice(historyList.indexOf(searchContent), 1);
        }
        historyList.unshift(searchContent);

        setHistoryList(historyList);

        //存储到本地
        Taro.setStorageSync("searchHistory", historyList);
      }
    }
  };

  // 清空搜索框
  const handleClear: EventProps["onClick"] = () => {
    setSearchContent("");
  };

  // 用户输入
  const handleInputChange: InputProps["onInput"] = e => {
    // console.log(e);
    setSearchContent(e.detail.value.trim());
  };

  // 跳转至详情页
  const toDetail: EventProps["onClick"] = e => {
    if (e.currentTarget.dataset.articleId) {
      handleClear(e)
      Taro.navigateTo({
        url:
          "/pages/articleDetail/articleDetail?articleId=" +
          e.currentTarget.dataset.articleId
      });
    }
  };

  return (
    <View className={Style.searchContainer}>
      {/* 头部 */}
      <View className={Style.header}>
        <View className={Style.searchInput}>
          <Text className={"iconfont icon-sousuo " + Style.searchIcon}></Text>
          <Input
            type="text"
            value={searchContent}
            placeholder="搜索喜欢的文章"
            autoFocus
            onInput={handleInputChange}
          />
          <Text
            className={"iconfont icon-clear1 " + Style.clear}
            hidden={!searchContent}
            onClick={handleClear}
            style={{ display: searchContent ? "inline" : "none" }}
          ></Text>
        </View>
        <Button
          className={Style.searchBtn}
          onClick={() => search(searchContent)}
        >
          搜索
        </Button>
      </View>

      {!!searchList.length ? (
        <Block>
          {/* 搜索内容展示 */}
            <View className={Style.searchContent}>
              搜索内容：{searchContent}
            </View>
            <View className={Style.searchList}>
              {searchList.map(item => {
                return (
                  <View
                    key={item.articleId}
                    className={Style.searchItem}
                    data-articleId={item.articleId}
                    onClick={toDetail}
                  >
                    <Text className={"iconfont icon-sousuo " + Style.content}>{item.title}</Text>
                  </View>
                );
              })}
            </View>
        </Block>
      ) : (
        <Block>
          {/* 历史搜索记录 */}
          {!!historyList.length ? (
            <View className={Style.history}>
              <View className={Style.title}>历史</View>
              {historyList.map((item, index) => {
                return (
                  <View
                    key={index}
                    className={Style.historyItem}
                    id={item}
                    data-keyword={item}
                    onClick={() => setSearchContent(item)}
                  >
                    {item}
                  </View>
                );
              })}
              {/* 删除 */}
              <View
                className={"iconfont icon-clear " + Style.delete}
                onClick={handleDelete}
              ></View>
            </View>
          ) : null}
          {/* 热搜榜 */}
          <View className={Style.hotContainer}>
            <View className={Style.title}>热搜榜</View>
            {/* 列表 */}
            <View className={Style.hotList}>
              {hotList.map((item, index) => {
                return (
                  <View
                    className={Style.hotItem}
                    key={item.articleId}
                    data-articleId={item.articleId}
                    onClick={toDetail}
                  >
                    <Text className={Style.order}>{index + 1}</Text>
                    <Text data-keyword={item.articleId}>{item.title}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Block>
      )}
    </View>
  );
};

export default Search;
