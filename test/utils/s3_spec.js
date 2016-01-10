/**
 * Created by Victor on 10/01/2016.
 */

(function() {


    var utils = require('../../utils').dateTimeUtils;
    var should = require('should');
    var _ = require('underscore');
    var availabilityService = require('../../services/availabilityService');
    var AWS             = require('aws-sdk');
    var s3Client       = new AWS.S3({apiVersion: '2006-03-01',
        endpoint:"s3-eu-west-1.amazonaws.com",
        accessKeyId:"AKIAJHYGK2RWWUKI5UTA",
        secretAccessKey:"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",
        sslEnabled:true
    });


    describe('s3', function () {
        it('get s3 object', function (done) {

            var params = {
                Bucket: 'trichrome', /* required */
                Key: 'private/email/templates/confirmSubscription.html'
            };

            s3Client.getObject(params, function(err, data) {
                should(err).be.null;
                should(data).be.ok;
                var s3Content = data.Body.toString();
                should(s3Content).be.ok;
                done();
            });

        });

    });
})();