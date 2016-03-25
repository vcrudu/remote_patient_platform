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
            Bridge.Redirect.redirectTo("../vital-signs/provider-vital-signs.html?userId=" + this.props.model.patientId
                + "&appointmentTime=" + this.props.model.slotDateTimeString
                + "&name=" + this.props.model.name
                + "&onlineStatus=" + this.props.model.onlineStatus);
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
            return <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.model? this.props.model.name : ""}</h3>
                        <p>Appointment Time: <strong>{this.formatDate(this.props.model.slotDateTimeString)}</strong></p>
                    </div>
                    <div className="panel-image hide-panel-body">
                        <img src="images/user.png" className="img-responsive"/>
                    </div>
                    <div className={this.state.onlineStatus == "offline" ? "statusBorder offline" : "statusBorder online"}></div>
                    <div className="panel-footer text-center">
                        <div className="row">
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img className="img-responsive pull-right" src="images/call-icon.png" width="100" onClick={this.handleCallClick}/></div>
                            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6"><img className="img-responsive pull-left" src="images/dashboard-icon.png" width="100" onClick={this.handleClickDashboard}/></div>
                        </div>
                    </div>
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
            var provider = this.refs[userId];

            if (event == "onlineStatus") {
                if (provider) {
                    provider.changeOnlineStatus(message.data.status);
                }
            }
        },
        componentDidMount: function() {
            var component = this;
            Bridge.Provider.socketCallBack = this.socketCallback;
            Bridge.Provider.getAppointments(function(apiResult) {
                if (apiResult.success && apiResult.data && apiResult.data.length > 0) {
                    component.setState({
                        appointments:apiResult.data
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
                        return <ProviderAppointment ref={appointment.patientId} key={appointment.patientId} model={appointment} onCall={component.handleCall}/>;
                    })
                }
            </div>
        }
    });

    ReactDOM.render(<ProviderAppointments />, document.getElementById("provider-appointments"));
})();