/**
 * Created by Victor on 3/17/2016.
 */

Bridge.Provider = {
    getAppointments: function(callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getAppointments"};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "appointments";
            getFakeWhoProvider(function (data) {
                var req = {
                    url: apiUrl + '?token=' + data.token,
                    type: 'GET',
                    crossDomain: true
                };

                $.ajax(req).done(function(response) {
                    if (response.success) {
                        Bridge.resultCallback({success:true, data: response.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success:false, data: undefined, error: "error"});
                    }
                }).fail(function() {
                    Bridge.resultCallback({success:false, data: undefined, error: "error"});
                });
            });
        }
    },
    getPatientVitalSigns: function(userId, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getPatientVitalSigns", data: {userId: userId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "events";
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token + '&userName=' + userId,
                    type: "GET",
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                }).done(function (result) {
                    if (result.success) {
                        Bridge.resultCallback({success: true, data: result.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success: false, data: undefined, error: "error"});
                    }
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    },
    getPatientDetails: function(userId, callBack) {
        Bridge.resultCallback = callBack;

        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.getPatientDetails", data: {userId: userId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
            var apiUrl = Bridge.serverApiUrl + "patients/" + userId;
            getFakeWhoProvider(function (data) {
                $.ajax({
                    url: apiUrl + '?token=' + data.token,
                    type: "GET",
                    crossDomain: true,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                }).done(function (data) {
                    if (data.success) {
                        Bridge.resultCallback({success: true, data: data.result, error: undefined});
                    }
                    else {
                        Bridge.resultCallback({success: false, data: undefined, error: "error"});
                    }
                }).fail(function () {
                    Bridge.resultCallback({success: false, data: undefined, error: "error"});
                });
            });
        }
    },
    callPatient: function(patientId, callBack) {
        Bridge.resultCallback = callBack;
        if ((/android/gi).test(navigator.userAgent)) {
            var message = {method:"Bridge.Provider.callPatient", data: {userId: patientId}};
            prompt("bridge_key", JSON.stringify(message));
        } else {
        }
    },
    socketCallBack: function(socketMessage){
        if(Bridge.Provider.socketCallback){
            if(socketMessage){
                Bridge.Provider.socketCallback(socketMessage);
                return;
            }
        }
    }
}