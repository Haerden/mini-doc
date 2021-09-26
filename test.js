const qiniu = require('qiniu')

// 创建各种上传凭证之前，我们需要定义好其中鉴权对象mac
var accessKey = 'FwW7hmBAqRMdyaYwGCcJV5voR5ABpKrivmHj3qrL';
var secretKey = 'CILdhEXD89FqWVtTYKW5WNDlthLktVNi8Qw8P6H1';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
    scope: 'minidoc', // 空间的名称
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);


var config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;


// 文件上传
var localFile = "/Users/lzh/Desktop/READ.md";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key = 'READ.md';

// formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
//     respBody, respInfo) {
//     if (respErr) {
//         throw respErr;
//     }

//     if (respInfo.statusCode === 200) {
//         console.log(respBody);
//     } else {
//         console.log(respInfo.statusCode);
//         console.log(respBody);
//     }
// });

// download
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://qyy0t5i2u.hd-bkt.clouddn.com';

// 公开空间访问链接
var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(publicDownloadUrl);


