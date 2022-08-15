import React, { useEffect, useRef, useState } from 'react'
import { View, Editor, Text, Textarea } from '@tarojs/components'
import content2 from './content'
import Style from './publish.module.scss'
import { ComponentInstance, getCurrentInstance } from '@tarojs/taro'
import Taro from '@tarojs/taro'

interface CtxType {
  clear?: Function
  getContent?: Function
  imgList?: string[]
  insertAudio?: Function
  insertHtml?: Function
  insertImg?: Function
  insertLink?: Function
  insertTable?: Function
  insertText?: Function
  insertVideo?: Function
  plugins?: Function
  redo?: Function
  undo?: Function
  getSrc?: Function
}

// 上传图片方法
function upload(src, type) {
  return new Promise((resolve, reject) => {
    console.log('上传', type === 'img' ? '图片' : '视频', '：', src)
    resolve(src)
    /*
    // 实际使用时，上传到服务器
    Taro.uploadFile({
      url: 'xxx', // 接口地址
      filePath: src,
      name: 'xxx',
      success(res) {
        resolve(res.data.path) // 返回线上地址
      },
      fail: reject
    })
    */
  })
}
// 删除图片方法
function remove(src) {
  console.log('删除图片：', src)
  // 实际使用时，删除线上资源
}

const Publish: React.FC = () => {
  const [content, setContent] = useState<string>(content2)
  const [editable, setEditable] = useState<boolean>(true)
  const [modal, setModal] = useState<any>()
  // 获取页面实例
  const { page } = getCurrentInstance()
  const [ctx, setCtx] = useState<CtxType>()
  page?.selectComponent!('#article')
  const handleInput = (e) => {
    console.log(e);
    console.log(ctx);

  }
  useEffect(() => {
    let article = page?.selectComponent!('#article') as CtxTyp
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

        if (type === 'img' || type === 'video') {
          // 显示操作菜单
          Taro.showActionSheet({
            itemList: ['本地选取', '远程链接'],
            success: res => {
              if (res.tapIndex == 0) {
                // 本地选取
                if (type === 'img') {
                  Taro.chooseImage({
                    count: value === undefined ? 9 : 1, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
                    success: res => {
                      if (res.tempFilePaths.length == 1 && Taro.editImage) {
                        // 单张图片时进行编辑
                        Taro.editImage({
                          src: res.tempFilePaths[0],
                          complete: res2 => {
                            Taro.showLoading({
                              title: '上传中'
                            })
                            upload(res2.tempFilePath || res.tempFilePaths[0], type).then(res => {
                              Taro.hideLoading()
                              resolve(res)
                            })
                          }
                        })
                      } else {
                        // 否则批量上传
                        Taro.showLoading({
                          title: '上传中'
                        });
                        (async () => {
                          const arr = []
                          for (let item of res.tempFilePaths) {
                            // 依次上传
                            const src = await upload(item, type)
                            arr.push(src)
                          }
                          return arr
                        })().then(res => {
                          Taro.hideLoading()
                          resolve(res)
                        })
                      }
                    },
                    fail: reject
                  })
                } else {
                  Taro.chooseVideo({
                    success: res => {
                      Taro.showLoading({
                        title: '上传中'
                      })
                      upload(res.tempFilePath, type).then(res => {
                        Taro.hideLoading()
                        resolve(res)
                      })
                    },
                    fail: reject
                  })
                }
              } else {
                // 远程链接
                // callback = {
                //   resolve,
                //   reject
                // }
                setModal({
                  title: (type === 'img' ? '图片' : '视频') + '链接',
                  value
                })
              }
            }
          })
        } else {
          // this.callback = {
          //   resolve,
          //   reject
          // }
          let title
          if (type === 'audio') {
            title = '音频链接'
          } else if (type === 'link') {
            title = '链接地址'
          }
          setModal({
            title,
            value
          })
        }
      })
    }
    setCtx(article)
  }, [])
  // 调用编辑器接口
  const edit = (e) => {

    ctx![e]()
  }
  // 清空编辑器内容
  const clear = () => {
    Taro.showModal({
      title: '确认',
      content: '确定清空内容吗？',
      success: res => {
        if (res.confirm)
          ctx!.clear!()
      }
    })
  }
  // 保存编辑器内容
  const save = () => {
    // 避免无法获取到正在编辑的文本内容
    setTimeout(() => {
      setContent(ctx!.getContent!())
      Taro.showModal({
        title: '保存',
        content: ctx!.getContent!(),
        confirmText: '完成',
        success: res => {
          if (res.confirm) {
            // 实际使用时，这里需要上传到服务器
            // 复制到剪贴板
            Taro.setClipboardData({
              data: content,
            })
            // 结束编辑
            setEditable(false)
          }
        }
      })
    }, 50)
  }

  return (
    <View>
      <Textarea placeholder='标题(建议30字以内)' maxlength={40} onInput={handleInput}></Textarea>
      {/* bindremove='remove' */}
      <View className={Style.editorToolbox}>
        <Text className={'iconfont icon-undo ' + Style.toolIconfont} onClick={() => edit('undo')} />
        <Text className={'iconfont icon-redo ' + Style.toolIconfont} onClick={() => edit('redo')} />
        <Text className={'iconfont icon-img ' + Style.toolIconfont} onClick={() => edit('insertImg')} />
        <Text className={'iconfont icon-video ' + Style.toolIconfont} onClick={() => edit('insertVideo')} />
        <Text className={'iconfont icon-link ' + Style.toolIconfont} onClick={() => edit('insertLink')} />
        <Text className={'iconfont icon-text ' + Style.toolIconfont} onClick={() => edit('insertText')} />
        <Text className={'iconfont icon-clear ' + Style.toolIconfont} onClick={clear} />
        <Text className={'iconfont icon-save ' + Style.toolIconfont} onClick={save} />
      </View>
      <mp-weixin id='article' container-style='padding:20px' content={content} domain='https://mp-html.oss-cn-hangzhou.aliyuncs.com' editable={editable} />
    </View>
  )
}

export default Publish

