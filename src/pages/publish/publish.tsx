import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Editor,
  Text,
  Textarea,
  Block,
  Image,
  Button,
  EventProps,
  Input,
  InputProps
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { observer } from "mobx-react-lite";
import Style from "./publish.module.scss";
import articleApi from "../../services/api/articleApi";
import ArticleCard from "../../components/articleCard";
import useStore from "../../store";
import uploadApi from "../../services/api/uploadApi";

interface CtxType {
  clear: Function;
  getContent: Function;
  imgList: string[];
  insertAudio: Function;
  insertHtml: Function;
  insertImg: Function;
  insertLink: Function;
  insertTable: Function;
  insertText: Function;
  insertVideo: Function;
  plugins: Function;
  redo: Function;
  undo: Function;
  getSrc: Function;
  getRect: Function;
  callback: {
    resolve: any;
    reject: any;
  };
}

interface RectType {
  bottom: number;
  dataset: object;
  height: number;
  id: string;
  left: number;
  right: number;
  top: number;
  width: number;
}

interface UploadType {
  url: string; // 文件路径
  hash: string; // 用于删除图片
}

interface FormType {
  title: string;
  content: string;
  category: number[];
  coverList: Partial<API.CoverType>[];
  userID?: string;
}

const Publish: React.FC = () => {
  // 是否可编辑
  const [editable, setEditable] = useState<boolean>(false);

  // 分类LIst
  const [categoryList, setCategoryList] = useState<API.CategoryType[]>([]);

  const [formData, setFormData] = useState<FormType>({
    title: "",
    content: "",
    category: [],
    coverList: []
  });

  const [uploadList, setUploadList] = useState<UploadType[]>([]);

  const [modal, setModal] = useState<Partial<API.ModalType> | null>(null);

  // 获取页面实例
  const { page } = getCurrentInstance();

  const [ctx, setCtx] = useState<CtxType>();

  page?.selectComponent!("#article");

  const { MemberStore } = useStore();

  useEffect(() => {
    if (!MemberStore.memberInfo.memberId) {
      Taro.showToast({
        title: "您还未登录！",
        icon: "error",
        success: () => {
          Taro.navigateTo({
            url: "pages/pages/register"
          });
        }
      });
    }
    initEditor();
    getCategoryList();
  }, []);

  // 初始化编辑器
  const initEditor = () => {
    let article = page?.selectComponent!("#article") as CtxType;
    /**
     * @description 设置获取链接的方法
     * @param {String} type 链接的类型（img/video/audio/link）
     * @param {String} value 修改链接时，这里会传入旧值
     * @returns {Promise} 返回线上地址（2.2.0 版本起设置了 domain 属性时，可以缺省主域名）
     *   type 为 audio/video 时，可以返回一个源地址数组
     *   2.1.3 版本起 type 为 audio 时，可以返回一个 object，包含 src、name、author、poster 等字段
     *   2.2.0 版本起 type 为 img 时，可以返回一个源地址数组，表示插入多张图片（修改链接时仅限一张）
     */
    article.getSrc = (type, value) => {
      return new Promise((resolve, reject) => {
        console.log(type, value);

        if (type === "img" || type === "video") {
          // 显示操作菜单
          Taro.showActionSheet({
            itemList: ["本地选取", "远程链接"],
            success: res => {
              if (res.tapIndex == 0) {
                // 本地选取
                if (type === "img") {
                  Taro.chooseImage({
                    count: value === undefined ? 9 : 1, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
                    success: res2 => {
                      if (res2.tempFilePaths.length == 1 && Taro.editImage) {
                        // 单张图片时进行编辑
                        Taro.editImage({
                          src: res2.tempFilePaths[0],
                          complete: res3 => {
                            Taro.showLoading({
                              title: "上传中"
                            });
                            upload(res3.tempFilePath!, type).then(res4 => {
                              Taro.hideLoading();
                              resolve(res4);
                            });
                          }
                        });
                      } else {
                        // 否则批量上传
                        Taro.showLoading({
                          title: "上传中"
                        });
                        (async () => {
                          const arr: string[] = [];
                          for (let item of res2.tempFilePaths) {
                            // 依次上传
                            const src: string = await upload(item, type);
                            arr.push(src);
                          }
                          return arr;
                        })().then(res3 => {
                          Taro.hideLoading();
                          resolve(res3);
                        });
                      }
                    },
                    fail: reject
                  });
                } else {
                  Taro.chooseVideo({
                    success: res2 => {
                      Taro.showLoading({
                        title: "上传中"
                      });
                      upload(res2.tempFilePath, type).then(res3 => {
                        Taro.hideLoading();
                        resolve(res3);
                      });
                    },
                    fail: reject
                  });
                }
              } else {
                // 远程链接
                article.callback = {
                  resolve,
                  reject
                };
                setModal({
                  title: (type === "img" ? "图片" : "视频") + "链接",
                  value
                });
              }
            }
          });
        } else {
          article.callback = {
            resolve,
            reject
          };
          let title;
          if (type === "audio") {
            title = "音频链接";
          } else if (type === "link") {
            title = "链接地址";
          }

          setModal({
            title,
            value
          });
        }
      });
    };
    setCtx(article);
  };

  // 上传图片方法
  function upload(src, type) {
    return new Promise<string>(async (resolve, reject) => {
      console.log("上传", type === "img" ? "图片" : "视频", "：", src);
      // 实际使用时，上传到服务器
      const res2 = await uploadApi.upload(src);
      console.log(res2);
      if (res2.data) {
        setUploadList(
          uploadList.concat({
            url: res2.data.url,
            hash: res2.data.hash
          })
        );
        resolve(res2.data.url);
      } else if (res2.code === "image_repeated") {
        Taro.hideLoading();
        Taro.showToast({
          icon: "error",
          title: "该图片已被上传过！"
        });
      }
    });
  }

  // 删除图片方法
  async function remove(src) {
    console.log("删除图片：", src);
    const hash = uploadList.find(item => item.url === src.detail.src)?.hash;
    // 实际使用时，删除线上资源
    if (hash) {
      const res = await uploadApi.remove(hash);
      if (res) {
        setUploadList(uploadList.filter(item => item.hash !== hash));
        setFormData({
          ...formData,
          coverList: formData.coverList.filter(item => item.imgName !== hash)
        });
      }
    }
  }

  // 处理模态框
  const modalInput: InputProps["onInput"] = e => {
    setModal({ ...modal, value: e.detail.value });
  };

  const modalConfirm = () => {
    ctx?.callback.resolve(modal!.value || "");
    setModal(null);
  };

  const modalCancel = () => {
    ctx?.callback.reject();
    setModal(null);
  };

  // 调用编辑器接口
  const edit = e => {
    ctx![e]();
  };

  // 清空编辑器内容
  const clear = () => {
    Taro.showModal({
      title: "确认",
      content: "确定清空内容吗？",
      success: res => {
        if (res.confirm) ctx!.clear!();
      }
    });
  };

  // 保存编辑器内容
  const save = () => {
    if (ctx?.getContent() !== "<p></p>") {
      // 避免无法获取到正在编辑的文本内容
      setTimeout(() => {
        Taro.showModal({
          title: "复制至剪贴板并保存?",
          content: ctx!.getContent!(),
          confirmText: "完成",
          success: res => {
            if (res.confirm) {
              // 实际使用时，这里需要上传到服务器
              // 复制到剪贴板
              Taro.setClipboardData({
                data: ctx?.getContent()
              });
              // 结束编辑
              setFormData({ ...formData, content: ctx?.getContent() });
              setEditable(false);
            }
          }
        });
      }, 50);
    } else {
      Taro.showToast({
        title: "请先输入正文!",
        icon: "error"
      });
    }
  };

  // 获取分类
  const getCategoryList = async () => {
    const res = (await articleApi.reqArticleCtaegory()) as API.ResultType & {
      categoryList: API.CategoryType[];
    };
    if (res && res.code === 0) {
      setCategoryList(res.categoryList);
    }
  };

  // 发布/草稿
  const handlePublishOrDraft: EventProps["onClick"] = async e => {
    const { title, content, category, coverList } = formData;
    if (title === "") {
      return Taro.showToast({
        title: "请输入文章标题！",
        icon: "error"
      });
    }
    if (content === "") {
      return Taro.showToast({
        title: "请输入文章内容！",
        icon: "error"
      });
    }
    if (category.length < 1 && e.currentTarget.id === "0") {
      return Taro.showToast({
        title: "请选择文章分类！",
        icon: "error"
      });
    }
    if (!MemberStore.memberInfo.memberId) {
      return Taro.showToast({
        title: "您还未登录！",
        icon: "error",
        success: () => {
          Taro.navigateTo({
            url: "pages/pages/register"
          });
        }
      });
    }

    const params = {
      title,
      content,
      authorId: MemberStore.memberInfo.memberId,
      isAduit: e.currentTarget.id,
      categoryList: category.map(item => ({
        catId: item
      })),
      coverList
    };
    console.log(params);
    const res = await articleApi.reqSaveArticle(params);
    if (res && res.code === 0) {
      console.log(res);
      Taro.navigateBack();
    }
  };

  // 删除封面
  const handleRemove: EventProps["onClick"] = e => {
    console.log(e.currentTarget.dataset.url);
    Taro.showModal({
      title: "提示!",
      content: "您确定要删除该封面吗？",
      success(result) {
        if (result.confirm) {
          remove({detail:{src:e.currentTarget.dataset.url}});
        }
      }
    });
  };

  // 上传封面
  const handleUpload: EventProps["onClick"] = e => {
    Taro.chooseMedia({
      count: 3,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      camera: "back",
      success: async res => {
        console.log(res.tempFiles.length - formData.coverList.length);

        if (res.tempFiles.length + formData.coverList.length > 3) {
          return Taro.showToast({
            title: "最多只可上传三张封面！",
            icon: "error"
          });
        }
        Taro.showLoading({
          title: "上传中"
        });
        console.log(res.tempFiles);
        if (res.tempFiles) {
          for(let item of res.tempFiles){
            const res2 = await uploadApi.upload(item.tempFilePath);
            if (res2 && res2.data) {
              setUploadList(
                uploadList.concat({
                  url: res2.data.url,
                  hash: res2.data.hash
                })
              );
              setFormData({
                ...formData,
                coverList: formData.coverList.concat({
                  imgUrl: res2.data.url,
                  imgName: res2.data.hash
                })
              });
              console.log(123);
              
            } else if (res2.code === "image_repeated") {
              Taro.showToast({
                icon: "error",
                title: "该图片已被上传过！"
              });
            }
          }
        }
        Taro.hideLoading();
      }
    });
  };
  return (
    <View
      className={Style.publishContainer}
      onClick={e => {
        // console.log("container", e);
        // ctx 为编辑器实例
        ctx!.getRect!()
          .then((rect: RectType) => {
            // console.log(rect); // boundingClientRect 信息
            // 判断是否点击了富文本框
            if (
              e.detail.x > rect.left &&
              e.detail.x < rect.right &&
              e.detail.y > rect.top &&
              e.detail.y < rect.bottom
            ) {
              if (!editable) {
                setEditable(true);
              }
            } else {
              if (editable) {
                setEditable(false);
                if (ctx?.getContent() !== "<p></p>") {
                  setFormData({ ...formData, content: ctx?.getContent() });
                }
              }
            }
          })
          .catch(err => {
            console.log("获取失败", err);
          });
      }}
    >
      {/* 标题 */}
      <View className={Style.Block}>
        <Textarea
          placeholder="标题(建议30字以内)"
          maxlength={40}
          style={{ minHeight: "150rpx" }}
          autoHeight
          onInput={e => {
            setFormData({
              ...formData,
              title: e.detail.value
            });
          }}
        ></Textarea>
        <Text></Text>
      </View>
      {/* 工具栏 */}
      <View
        className={Style.editorToolbox}
        style={editable ? "" : "display:none"}
      >
        <Text
          className={"iconfont icon-undo " + Style.toolIconfont}
          onClick={() => edit("undo")}
        />
        <Text
          className={"iconfont icon-redo " + Style.toolIconfont}
          onClick={() => edit("redo")}
        />
        <Text
          className={"iconfont icon-img " + Style.toolIconfont}
          onClick={() => edit("insertImg")}
        />
        <Text
          className={"iconfont icon-video " + Style.toolIconfont}
          onClick={() => edit("insertVideo")}
        />
        <Text
          className={"iconfont icon-link " + Style.toolIconfont}
          onClick={() => edit("insertLink")}
        />
        <Text
          className={"iconfont icon-text " + Style.toolIconfont}
          onClick={() => edit("insertText")}
        />
        <Text
          className={"iconfont icon-clear " + Style.toolIconfont}
          onClick={clear}
        />
        <Text
          className={"iconfont icon-save " + Style.toolIconfont}
          onClick={save}
        />
      </View>
      {/* 内容富文本框编辑器 */}
      <View className={Style.Block}>
        <mpWeixin
          id="article"
          containerStyle="padding:0px;"
          content={formData.content}
          placeholder="请输入正文"
          emoji
          domain="https://smms.app/api/v2/upload?inajax=1"
          editable
          onRemove={remove}
        />
      </View>
      {modal && (
        <Block>
          <View className={Style.mask} />
          <View className={Style.modal}>
            <View className={Style.modalTitle}>{modal.title}</View>
            <Input
              className={Style.modalInput}
              value={modal.value}
              maxlength={-1}
              auto-focus
              onInput={modalInput}
            />
            <View className={Style.modalFoot}>
              <View className={Style.modalButton} onClick={modalCancel}>
                取消
              </View>
              <View
                className={Style.modalButton}
                style={{
                  color: "#576b95",
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

      {/* 分类 */}
      <View className={Style.Block}>
        <View>请选择分类</View>
        <View className={Style.categoryGroup}>
          {categoryList.map(item => {
            return (
              <View
                className={
                  formData.category.indexOf(item.catId) !== -1
                    ? Style.radio + " " + Style.active
                    : Style.radio
                }
                key={item.catId}
                onClick={() => {
                  formData.category.indexOf(item.catId) !== -1
                    ? setFormData({
                        ...formData,
                        category: formData.category.filter(
                          categoryId => item.catId !== categoryId
                        )
                      })
                    : setFormData({
                        ...formData,
                        category: formData.category.concat(item.catId)
                      });
                }}
              >
                {item.catName}
              </View>
            );
          })}
        </View>
      </View>
      {/* 封面 */}
      <View className={Style.Block}>
        <View>封面</View>
        <View className={Style.coverList}>
          {formData.coverList?.map((item, index) => {
            return (
              <Image key={index} className={Style.cover} src={item.imgUrl!}>
                <Text
                  className={"iconfont icon-clear " + Style.delBtn}
                  data-url={item.imgUrl}
                  onClick={handleRemove}
                ></Text>
              </Image>
            );
          })}
          <View className={Style.cover} onClick={handleUpload}>
            <Text>+</Text>
          </View>
        </View>
      </View>
      {/* 预览 */}
      <View className={Style.Block}>
        <View>预览</View>
        <ArticleCard
          article={{
            title: formData.title,
            coverList: formData.coverList as API.CoverType[],
            member: MemberStore.memberInfo,
            readCount: 0,
            likeCount: 0,
            collectionCount: 0,
            commentCount: 0
          }}
        />
      </View>
      {/* 操作按钮 */}
      <View className={Style.Block}>
        <View className={Style.buttonGroup}>
          <Button
            className={Style.publishBtn}
            id="0"
            onClick={handlePublishOrDraft}
          >
            发布
          </Button>
          <Button
            className={Style.draftBtn}
            id="3"
            onClick={handlePublishOrDraft}
          >
            存草稿
          </Button>
        </View>
      </View>
    </View>
  );
};

export default observer(Publish);
