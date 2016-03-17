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
    }
}