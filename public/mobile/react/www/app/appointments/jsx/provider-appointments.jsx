/**
 * Created by Victor on 3/17/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderAppointment = React.createClass({
        getInitialState: function(){
            return {
                onlineStatus: this.props.model.onlineStatus,
            }
        },
        handleClickDashboard: function(){
            Bridge.Redirect.redirectTo("../profile/provider-profile-details.html?userId=" + this.props.model.patientId
                + "&appointmentTime=" + this.props.model.slotDateTimeString
                + "&name=" + this.props.model.name
                + "&onlineStatus=" + this.state.onlineStatus);
        },
        changeOnlineStatus: function(status) {
            this.setState({
                onlineStatus: status
            });
        },
        formatDate: function(dateString) {
            var date = moment(dateString);
            return date.calendar();
        },
        handleCallClick: function() {
            var patientId = this.props.model.patientId;
            if (this.props.onCall) {
                if (this.state.onlineStatus == "offline") {
                    return;
                }
                this.props.onCall(patientId);
            }
        },
        render: function() {
            return <div className="list-group-item" onClick={this.handleClickDashboard}>
                <div className="row-action-primary bottom">
                    <img src="images/user.png" className={this.state.onlineStatus == "offline" ? "img-responsive img-circle img-border-offline" : "img-responsive img-circle img-border-online"}/>
                </div>
                <div className="row-content">
                    <h4 className="list-group-item-heading">{this.props.model? this.props.model.name : ""}</h4>
                    <p className="list-group-item-text">Appointment Time: <strong>{this.formatDate(this.props.model.slotDateTimeString)}</strong></p>
                </div>
            </div>
        }
    });

    var ProviderAppointments = React.createClass({
        getInitialState: function(){
            return {
                appointments: [],
            }
        },
        socketCallback: function(message) {
            var event = message.data.event;
            var userId = message.data.user;
            var refs = this.refs;
            for (var name in refs){
                if (name.indexOf(userId) != -1) {
                    if (event == "onlineStatus") {
                        var provider = this.refs[name];
                        if (provider) {
                            provider.changeOnlineStatus(message.data.status);
                        }
                    }
                }
            }
        },
        componentDidMount: function() {
            var component = this;
            Bridge.Provider.socketCallBack = this.socketCallback;
            Bridge.Provider.getAppointments(function(apiResult) {
                var orderedResult = _.sortBy(apiResult.data, function(num){
                    return num.slotDateTime;
                });
                if (apiResult.success && apiResult.data && apiResult.data.length > 0) {
                    component.setState({
                        appointments:orderedResult
                    });
                }
            });
        },
        handleCall: function(patientId) {
            Bridge.Provider.callPatient(patientId, function(callResult) {});
        },
        render: function() {
            var component = this;
            return <div className="list-group">
                {
                    component.state.appointments.map(function (appointment) {
                        return <div key={appointment.patientId + "_" + appointment.slotDateTime + "_div"}>
                                <ProviderAppointment
                                    ref={appointment.patientId + "_" + appointment.slotDateTime}
                                    key={appointment.patientId + "_" + appointment.slotDateTime}
                                    model={appointment}
                                    onCall={component.handleCall}/>
                                <div className="list-group-separator" key={appointment.patientId + "_" + appointment.slotDateTime + "_separator"}></div>
                            </div>
                    })
                }
            </div>
        }
    });

    ReactDOM.render(<ProviderAppointments />, document.getElementById("provider-appointments"));
})();