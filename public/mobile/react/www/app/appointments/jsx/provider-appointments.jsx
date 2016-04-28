/**
 * Created by Victor on 3/17/2016.
 */

(function() {
    "use strict";

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
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
            var listItem = this.refs.listItem;
            listItem.addEventListener('click', this.handleClickDashboard);
        },
        render: function() {
            return <li className="mdl-list__item mdl-list__item--two-line" onClick={this.handleClickDashboard} ref="listItem">
                <span className="mdl-list__item-primary-content">
                  <i className="material-icons mdl-list__item-avatar">person</i>
                  <span>{this.props.model? this.props.model.name : ""}</span>
                  <span className="mdl-list__item-sub-title">Appointment Time: <strong>{this.formatDate(this.props.model.slotDateTimeString)}</strong></span>
                </span>
                <span className="mdl-list__item-secondary-content">
                  <a className={this.state.onlineStatus == "offline" ? "mdl-list__item-secondary-action offline" : "mdl-list__item-secondary-action"} href="#"><i className="material-icons">lens</i></a>
                </span>
            </li>
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
            return <ul className="mdl-list">
                {
                    component.state.appointments.map(function (appointment) {
                        return <ProviderAppointment
                                    ref={appointment.patientId + "_" + appointment.slotDateTime}
                                    key={appointment.patientId + "_" + appointment.slotDateTime}
                                    model={appointment}
                                    onCall={component.handleCall}/>
                    })
                }
            </ul>
        }
    });

    ReactDOM.render(<ProviderAppointments />, document.getElementById("provider-appointments"));
})();