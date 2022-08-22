import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  Text,
  Input,
  Block,
  EventProps,
  InputProps,
  Image
} from "@tarojs/components";

import Style from "./search.module.scss";

import { debounce } from "../../utils/index";

interface HotType {
  id: string;
  iconUrl: string;
  searchWord: string;
}

interface SearchType {
  id: string;
  keyWord: string;
}
// 防抖函数使用
let isSend = null

const Search: React.FC = () => {
  // 表单项内容
  const [searchContent, setSearchContent] = useState<string>("");

  //历史搜索记录
  const [historyList, setHistoryList] = useState<string[]>(["普京", "唐山"]);

  //匹配到的数据
  const [searchList, setSearchList] = useState<SearchType[]>([]);

  // 热搜榜
  const [hotList, setHotList] = useState<HotType[]>([]);

  // 删除搜索历史
  const handleDelete: EventProps["onClick"] = () => {
    console.log("handleDelete");
  };

  // 清空搜索框
  const handleClear: EventProps["onClick"] = () => {
    setSearchContent("");
  };


  // 用户输入
  const handleInputChange:InputProps['onInput'] = e => {
    // console.log(e);

    setSearchContent(e.detail.value)
    // 防抖
    if (isSend!==null) {
      clearTimeout(isSend)
    }
    isSend = setTimeout(() => {
      // 关键词搜索
      console.log(e);
    }, 500) as any;
  };

  // 关键词搜索
  const searchByKeyword: EventProps["onClick"] = e => {
    console.log(
      "searchByKeyword",
      e.currentTarget.dataset.keyword || searchContent
    );

    // setSearchContent(e)
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
        <Button className={Style.searchBtn} onClick={searchByKeyword}>
          搜索
        </Button>
      </View>

      {!!searchList.length ? (
        <Block>
          {/* 搜索内容展示 */}
          <View className={Style.showSearchContent}>
            <View className={Style.searchContent}>
              搜索内容：{searchContent}
            </View>
            <View className={Style.searchList}>
              {searchList.map((item, index) => {
                return (
                  <View key={index} className={Style.searchItem}>
                    <Text className="iconfont icon-sousuo"></Text>
                    <Text
                      onClick={searchByKeyword}
                      className={Style.content}
                      data-keyword={item.keyWord}
                    >
                      {item.keyWord}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Block>
      ) : (
        <Block>
          {/* 历史搜索记录 */}
          {!!historyList.length ? (
            <View className={Style.history}>
              <View>历史</View>
              {historyList.map((item, index) => {
                return (
                  <View
                    key={index}
                    className={Style.historyItem}
                    id={item}
                    data-keyword={item}
                    onClick={searchByKeyword}
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
                  <View className={Style.hotItem} key={index}>
                    <Text className={Style.order}>{index + 1}</Text>
                    <Text
                      id={item.searchWord}
                      data-keyword={item.searchWord}
                      onClick={searchByKeyword}
                    >
                      {item.searchWord}
                    </Text>
                    {item.iconUrl ? (
                      <Image
                        className={Style.iconImg}
                        src={item.iconUrl}
                      ></Image>
                    ) : null}
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
