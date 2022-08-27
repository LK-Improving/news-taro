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
