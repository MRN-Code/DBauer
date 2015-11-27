'use strict';

var aws = require('aws-sdk');
var zlib = require('zlib');
var fs = require('fs');
var config = require('config');
aws.config.loadFromPath('/coins/config/dbauer-aws-credentials.json');

function upload() {
    var localPath = config.get('destPath');
    var key = config.get('s3Key');
    var s3Params = { Bucket: config.get('s3BucketName'), Key: key };
    var s3Object = new aws.S3({params: s3Params});
    var stream = fs.createReadStream(localPath).pipe(zlib.createGzip());
    var s3Upload = s3Object.upload({Body: stream})
        .on('httpUploadProgress', function(evt) { console.log(evt); });

    return new Promise(function startUpload(res, rej) {
        console.log('Starting upload to AWS S3:', key);
        return s3Upload.start(function handleUploadComplete(err, data) {
            if (err) {
                console.log('Encountered error during upload');
                rej(err);
                return;
            }

            console.log('Successfully uploaded', localPath);
            res(data);
        });
    });
}

module.exports.upload = upload;
