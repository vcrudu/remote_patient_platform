/**
 * Created by Victor on 01/07/2015.
 */

var commonConfig = require('../config/awsConfig');

module.exports = {
    endpoint:'https://dynamodb.eu-west-1.amazonaws.com',
    accessKeyId: commonConfig.accessKeyId,
    secretAccessKey:commonConfig.secretAccessKey,
    region:commonConfig.region,
    sslEnabled:commonConfig.sslEnabled,
    apiVersion: '2012-08-10',
    tablesSuffix:''
};
