'use strict';

var aws = require('aws-sdk');
var fs = require('fs');
var config = require('config');
aws.config.loadFromPath('/coins/config/dbauer-aws-credentials.json');

function makeObjectPublic() {
    var bucket = config.get('s3BucketName');
    var key = config.get('s3Key');
    var params = {
        Bucket: bucket,
        Key: key,
        ACL: 'public-read'
    };
    var s3 = new aws.S3();
    return new Promise(function setObjectACL(res, rej) {
        console.log('Making ' + key + 'publicly readable');
        s3.putObjectAcl(params, function(err, data) {
            if (err) {
                console.log('Enountered error during permissions change');
                rej(err);
                return;
            }

            console.log('Successfully changed permissions');
            console.log('URL: https://' + bucket + '.s3.amazonaws.com/' + key);
            res(data);
        });
    });
}

function upload() {
    var localPath = config.get('destPath');
    var key = config.get('s3Key');
    var s3Params = { Bucket: config.get('s3BucketName'), Key: key };
    var s3Object = new aws.S3({params: s3Params});
    var stream = fs.createReadStream(localPath);
    var s3Upload = s3Object.upload({Body: stream})
        .on('httpUploadProgress', function(evt) { console.log(evt); });

    return new Promise(function startUpload(res, rej) {
        console.log('Starting upload to AWS S3:', key);
        return s3Upload.send(function handleUploadComplete(err, data) {
            if (err) {
                console.log('Encountered error during upload');
                rej(err);
                return;
            }

            console.log('Successfully uploaded', localPath);
            res(data);
        });
    }).then(makeObjectPublic);
}

module.exports.upload = upload;
