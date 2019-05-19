/**
 * powered by 波比小金刚 at 2018-05-23 10:33:06 
 * last modified by 波比小金刚 at 2018-05-23 10:33:06 
 * @Description: mock数据文件
*/
let Mock;

//! 只在开发环境中使用，避免拦截正常的请求
if(process.env.NODE_ENV === 'development'){
  Mock = require('mockjs');

  // const getSuccessResponse = data => ({
  //   success: true,
  //   status: 200,
  //   msg: '请求成功',
  //   result: data
  // })
  //
  // const getFailedResponse = () => ({
  //   success: false,
  //   status: 400,
  //   msg: '测试一下接口报错的情况',
  //   result: null
  // })

    // Mock.mock(/http:\/\/www\.mock\.js\/fs\/base\/data\/item\/getItems+/, 'get', options => {
    //     if(options){
    //         const res = {
    //             topTitles:[{},{}]
    //         }
    //         return getSuccessResponse(res);
    //     }else{
    //         return getFailedResponse();
    //     }
    // });
    //
    // Mock.mock(/http:\/\/www\.mock\.js\/fs\/base\/data\/item\/getTopTitle+/, 'get', options => {
    //     if(options){
    //         const res = [{value:123,label:"123"},{value:153,label:"153"},{value:423,label:"423"}]
    //         return getSuccessResponse(res);
    //     }else{
    //         return getFailedResponse();
    //     }
    // });

  //* 获取搜索框的列表数据
  // Mock.mock(/http:\/\/www\.mock\.js\/items\?key=[\s\S]+/, 'get', options => {
  //   if((options.url.split('key=')[1]).length){
  //     let res = Mock.mock({'result': [
  //       {
  //         label: '内容',
  //         'data|1-5': [
  //           {
  //             name: '南站',
  //             id: Random.id(),
  //             image: Random.image('40x40', '#4A7BF7', '南站'),
  //             description: '火车南站，一个神奇的地方，老杜的故乡'
  //           }
  //         ]
  //       },
  //       {
  //         label: '频道',
  //         'data|1-5': [
  //           {
  //             name: '南站',
  //             id: Random.id(),
  //             image: Random.image('40x40', '#4A7BF7', '南站'),
  //             description: '火车南站，一个神奇的地方，老杜的故乡'
  //           }
  //         ]
  //       }
  //     ]});
  //     return getSuccessResponse(res);
  //   }else{
  //     return getFailedResponse();
  //   }
  // });
}

export default Mock;