// import Qs from 'qs'
// 引入
import axios from "axios"
// 环境 
if (process.env.NODE_ENV == 'development') {
    // 开发环境
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
} else if (process.env.NODE_ENV == 'debug') {
    // 测试环境
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
} else if (process.env.NODE_ENV == 'production') {
    // 生产环境  
    axios.defaults.baseURL = 'http://blue-cat-blue.love/';
}
// 请求超时
axios.defaults.timeout = 30000;
//  post 请求头 
axios.defaults.headers.post['Content-Type'] = 'application/json';


/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err.data)
        })
    });
}


// class Request {
//     constructor() {
//         // 创建axios实例
//         this._axios = axios.create({
//             baseURL: address.baseURL,
//             timeout: 1000 * 5, // 请求超时时间
//             headers: {}
//         })
//         // 请求拦截
//         this._axios.interceptors.request.use(
//             config => {
//                 const requestHeader = {
//                     'X-Requested-With': 'XMLHttpRequest',
//                     'Content-Type': 'application/json; charset=UTF-8',
//                     'Access-Control-Allow-Origin': '*',
//                     // token: getToken() // 请求头统一添加token
//                 }
//                 config.headers = Object.assign(config.headers, requestHeader)
//                 return config
//             },
//             error => {
//                 Promise.reject(error)
//             }
//         )
//     }

//     // 根据请求方式，判断参数是放在query中还是body中。
//     // 最直观的区别，比如GET请求把参数包含在url中，而POST则通过request body把参数放置在body体中，所以在提交时的参数形式是有区别的
//     // 以下列了四种我一般常用请求方式的参数形式，大家可以自行调整
//     /**
//      * 发送get请求
//      * @param {String} url地址
//      * @param {Object} query 查询参数
//      * @return json数据
//      */
//     get(url, query = {}) {
//         return this._request('get')(url, {
//             ...query
//         })
//     }
//     /**
//      * 发送post请求
//      * @param {String} url地址
//      * @param {Object} body 查询参数
//      * @return json数据
//      */
//     post(url, body = {}, headers) {
//         let data
//         if (this.isFormData(body)) {
//             data = body
//         } else if (Array.isArray(body)) {
//             data = body
//         } else {
//             data = {
//                 ...body
//             }
//         }
//         return this._request('post')(url, headers)(url, data)
//     }
//     put(url, body = {}) {
//         return this._request('put')(url, {
//             ...body
//         })
//     }
//     delete(url, body = {}) {
//         return this._request('delete')(url, {
//             ...body
//         })
//     }

//     isFormData = v => {
//         return Object.prototype.toString.call(v) === '[object FormData]'
//     }


//     /**
//      * 设置请求头
//      * @param {Object} header 请求头
//      */
//     setHeaders(header) {
//         Object.keys(header).forEach(key => {
//             this._axios.defaults.headers[key] = header[key]
//         })
//     }

//     // 处理请求头 headers
//     handleHeaders() {
//         const headers = {}
//         headers['XMIME-TYPE'] = '3'
//         Headers['Content-Type'] = 'application/json; charset=UTF-8'
//         return headers
//     }

//     /**
//      * 发送请求
//      * @param {String} method 请求方法类型
//      * @param headers
//      * @returns {function(*=, *=):Promise<unknown>}
//      * @private
//      */
//     _request(method, headers) {
//         this.setHeaders(this.handleHeaders()) // 设置统一的请求头
//         if (headers) {
//             this.setHeaders(headers) // 自定义请求头
//         }

//         return (url, data, timeout) => {
//             const config = {
//                 url,
//                 method,
//                 timeout: timeout || this._axios.defaults.timeout
//             } // 构造请求 config

//             // 判断请求类型 get post
//             const paramType = ['get', 'delete'].indexOf(method) !== -1 ? 'params' : 'data'
//             config[paramType] = data
//             //参数序列化
//             config.paramsSerializer = params => {
//                 return Qs.stringify(params, {
//                     arrayFormat: 'repeat'
//                 })
//             }

//             return new Promise((resolve, reject) => {
//                 // 发送真正的请求，验证权限，检查404等status
//                 this._axios
//                     .request(config)
//                     .then(response => {
//                         if (this.handleSuccessStatus(response.data.code, response.data)) {
//                             if (response.headers['content-type'] !== 'text/plain; charset=urf-8') {
//                                 resolve(
//                                     // 对响应结果二次包装
//                                     Object.assign({
//                                             success: Number(response.data.code) === 200,
//                                             data: response.data.data,
//                                             msg: response.data.msg
//                                         },
//                                         response.data
//                                     )
//                                 ) // 处理返回结果
//                             } else {
//                                 resolve(response.data)
//                             }
//                         }
//                     }, response => {
//                         // 处理错误码
//                         if (response.response) {
//                             const statusCode = response.response.status
//                             this.handleErrorStatus(statusCode)
//                         } else {
//                             Vue.prototype.$message.error(response.message)
//                         }
//                         reject(response)
//                     })
//                     .catch(err => {
//                         reject(err)
//                     })
//             })
//         }
//     }


//     // 请求成功，返回错误码
//     // 具体状态码跟后台开发人员统一，然后根据状态码进行相应提示
//     // 下面是我在项目中的操作，大家可自行调整扩展
//     handleSuccessStatus(code) {
//         let result = ''
//         let flag = false
//         switch (code) {
//             case '20007':
//                 result = '未查找到二次认证密码！'
//                 flag = true
//                 break
//             case '20008':
//                 result = '您的二次认证密码还未修改，请先修改！'
//                 flag = true
//                 break
//             case '20009':
//                 result = '您还未开启二次认证，请联系管理员！'
//                 flag = true
//                 break
//             case '90001':
//                 result = '请输入二次认证密码！'
//                 flag = true
//                 break
//             case '90002':
//                 result = '无操作权限！'
//                 flag = true
//                 break
//             default:
//                 break
//         }

//         // 进行通知
//         // $message方法是我按需引入的element-ui中的提示组件，你可以替换成自己的提示组件
//         if (result) {
//             Vue.prototype.$message.error(result)
//         }
//         return flag
//     }
//     // 根据错误码获取错误提示
//     handleErrorStatus(statusCode) {
//         let errorMsg = ''
//         if (statusCode === 500) {
//             errorMsg = '数据请求失败，请联系管理员！'
//         } else if (statusCode === 404) {
//             errorMsg = '请求地址错误！'
//         } else if (statusCode === 402) {
//             errorMsg = '当前您没有权限操作该数据！'
//         } else {
//             errorMsg = '请求出错！'
//         }
//         // 进行通知
//         Vue.prototype.$message.error(errorMsg)
//     }
// }

// export default new Request()