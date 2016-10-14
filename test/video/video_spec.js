/**
 * Created by Victor on 22/08/2015.
 */

var videoService = require('../../services/videoService');
var should = require('should');

describe.skip('Video',function(){

    describe('Manage users',function(){

        it("Create user", function(done){
            videoService.createVideoUser('vcrudu@hotmail.com','John','Smith',function(err, result) {
                var data = result;
                done();
            });
        });

        it("get user", function(done){
            videoService.getUser('test@test.com',function(err, result) {
                var data = result;
                done();
            });
        });

        it("create meeting", function(done){
            videoService.createVideoMeeting('test@test.com',function(err, result) {
                var data = result;
                done();
            });
        });

    });
});