/**
 * Created by Victor on 1/10/2016.
 */

var Bridge = {};

Bridge.getToken = function(callBack){
    Bridge.resultCallback = callBack;
    var message = {method:"getToken"};
    prompt("bridge_key", JSON.stringify(message));
}

Bridge.getUrl = function(callBack){
    Bridge.resultCallback = callBack;
    var message = {method:"getUrl"};
    prompt("bridge_key", JSON.stringify(message));
}

Bridge.callBack = function(result){
    if(Bridge.resultCallback){
        if(result.token && Bridge.resultCallback){
            Bridge.resultCallback(result.token);
            delete Bridge.resultCallback;
            return;
        }
        if(result.url && Bridge.resultCallback){
            Bridge.resultCallback(result.url);
            delete Bridge.resultCallback;
            return;
        }
    }
}

angular.module('mobileApp')
    .factory('commonService',['$localStorage','$location', function($localStorage, $location) {
        return {
            getToken: function (callback) {
                if ((/android/gi).test(navigator.userAgent)) {
                    Bridge.getToken(callback);
                } else {
                    setTimeout(function () {
                        callback($localStorage.user.token);
                    }, 0);
                }
            },
            getServerUrl: function (callback) {
                if ((/android/gi).test(navigator.userAgent)) {
                    Bridge.getUrl(callback);
                } else {
                    setTimeout(function () {
                        callback("http://localhost:8081/v1/api/");
                    }, 0);
                }
            }
        };
    }]);
