import { removeFile, uploadFile } from "../../utils/request";

export default{
    // 上传
    upload: (path:string) => uploadFile('https://smms.app/api/v2/upload?inajax=1',path),

    // 删除
    remove: (hash:string) => removeFile('https://smms.app/delete/' + hash)
}