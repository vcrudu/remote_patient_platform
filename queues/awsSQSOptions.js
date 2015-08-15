/**
 * Created by Victor on 01/07/2015.
 */
var commonConfig = require('../config/awsConfig');

(function(){
    module.exports = {
        endpoint:'https://sqs.eu-west-1.amazonaws.com/160466482332/vitalsigns',
        accessKeyId: commonConfig.accessKeyId,
        secretAccessKey:commonConfig.secretAccessKey,
        region:commonConfig.region,
        sslEnabled:commonConfig.sslEnabled,
        apiVersion: '2012-11-05'
    };
})();