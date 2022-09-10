import Taro from "@tarojs/taro";

const baseUrl = "http://localhost:88/api";

// Post请求
export const post = (url: string, data?: any) => {
  return new Promise<API.ResultType>((resolve, reject) => {
    Taro.request({
      url: baseUrl + url,
      method: "POST",
      data,
      success: (res) => {
        if (res && res.data) {
          resolve(res.data);
        }
      },
      fail:(err)=>{
        Taro.showToast({
            title: '请求失败了，请稍后重试。',
            icon: 'error'
        })
        reject(err.errMsg)
      }
    });
  });
};

// Get请求
export const get = (url: string, data?: any) => {
    return new Promise<API.ResultType>((resolve, reject) => {
        Taro.request({
          url: baseUrl + url,
          method: "GET",
          data,
          success: (res) => {
            if (res && res.data) {
              resolve(res.data);
            }
          },
          fail:(err)=>{
            Taro.showToast({
                title: '请求失败了，请稍后重试。',
                icon: 'error'
            })
            reject(err.errMsg)
          }
        });
      });
};

// 上传文件
export const uploadFile = ( filePath: any) => {
  return new Promise<any>((resolve, reject) => {
    Taro.uploadFile({
      url: 'https://smms.app/api/v2/upload?inajax=1',
      header: {
        'content-type': 'application/x-www-form-urlencoded', //修改为formdata数据格式
        'Authorization': 'pLzY2TAkDzLHYqcs4TjcQDXkobmWA6ZE'
      },
      filePath,
      name: 'smfile',
      formData:{
        'file_id':'0'
      },
      success: (res) => {
        if (res && res.data) {
          resolve(res);
        }
      },
      fail:(err)=>{
        Taro.showToast({
            title: '请求失败了，请稍后重试。',
            icon: 'error'
        })
        reject(err.errMsg)
      }
    });
  });
};