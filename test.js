const QiniuManager = require('./src/utils/QiniuManager');
const path = require('path');

// 创建各种上传凭证之前，我们需要定义好其中鉴权对象mac
var accessKey = 'FwW7hmBAqRMdyaYwGCcJV5voR5ABpKrivmHj3qrL';
var secretKey = 'CILdhEXD89FqWVtTYKW5WNDlthLktVNi8Qw8P6H1';


// 文件上传
const localFile = "/Users/lzh/Desktop/R.md";
const key = 'R.md';
const downloadPath = path.join(__dirname, key);

const manager = new QiniuManager(accessKey, secretKey, '1111demo');

manager.downloadFile(key, downloadPath).then(() => {
    console.error('ok');
});
// manager.uploadFile(key, localFile).then((data) => {
//     console.log('上传成功:', data);
//     return manager.deleteFile(key);
// }).then((data) => {
//     console.log('删除成功:', data);
// }).catch((err) => {
//     console.error(err);
// });
// manager.getBucketDomain().then(data => {
//     console.log(data);
// })
// manager.deleteFile(key); 

// download
// var bucketManager = new qiniu.rs.BucketManager(mac, config);
// var publicBucketDomain = 'http://qyy0t5i2u.hd-bkt.clouddn.com';

// // 公开空间访问链接
// var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);


