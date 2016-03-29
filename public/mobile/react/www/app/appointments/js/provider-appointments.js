/**
 * Created by Victor on 3/17/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var ProviderAppointment = React.createClass({
        displayName: "ProviderAppointment",

        getInitialState: function () {
            return {
                onlineStatus: this.props.model.onlineStatus
            };
        },
        handleClickDashboard: function () {
            Bridge.Redirect.redirectTo("../vital-signs/provider-vital-signs.html?userId=" + this.props.model.patientId + "&appointmentTime=" + this.props.model.slotDateTimeString + "&name=" + this.props.model.name + "&onlineStatus=" + this.props.model.onlineStatus);
        },
        changeOnlineStatus: function (status) {
            this.setState({
                onlineStatus: status
            });
        },
        formatDate: function (dateString) {
            var date = moment(dateString);
            return date.calendar();
        },
        handleCallClick: function () {
            var patientId = this.props.model.patientId;
            if (this.props.onCall) {
                if (this.state.onlineStatus == "offline") {
                    return;
                }
                this.props.onCall(patientId);
            }
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "list-group-item", onClick: this.handleClickDashboard },
                React.createElement(
                    "div",
                    { className: "row-action-primary bottom" },
                    React.createElement("img", { src: "images/user.png", className: this.state.onlineStatus == "offline" ? "img-responsive img-circle img-border-offline" : "img-responsive img-circle img-border-online" })
                ),
                React.createElement(
                    "div",
                    { className: "row-content" },
                    React.createElement(
                        "h4",
                        { className: "list-group-item-heading" },
                        this.props.model ? this.props.model.name : ""
                    ),
                    React.createElement(
                        "p",
                        { className: "list-group-item-text" },
                        "Appointment Time: ",
                        React.createElement(
                            "strong",
                            null,
                            this.formatDate(this.props.model.slotDateTimeString)
                        )
                    )
                )
            );
        }
    });

    var ProviderAppointments = React.createClass({
        displayName: "ProviderAppointments",

        getInitialState: function () {
            return {
                appointments: []
            };
        },
        socketCallback: function (message) {
            var event = message.data.event;
            var userId = message.data.user;
            debugger;
            var refs = this.refs;
            var provider = this.refs[userId];

            if (event == "onlineStatus") {
                if (provider) {
                    provider.changeOnlineStatus(message.data.status);
                }
            }
        },
        componentDidMount: function () {
            var component = this;
            Bridge.Provider.socketCallBack = this.socketCallback;
            Bridge.Provider.getAppointments(function (apiResult) {
                var orderedResult = _.sortBy(apiResult.data, function (num) {
                    return num.slotDateTime;
                });
                if (apiResult.success && apiResult.data && apiResult.data.length > 0) {
                    component.setState({
                        appointments: orderedResult
                    });
                }
            });
        },
        handleCall: function (patientId) {
            Bridge.Provider.callPatient(patientId, function (callResult) {});
        },
        render: function () {
            var component = this;
            return React.createElement(
                "div",
                { className: "list-group" },
                component.state.appointments.map(function (appointment) {
                    return React.createElement(
                        "div",
                        { key: appointment.patientId + "_" + appointment.slotDateTime + "_div" },
                        React.createElement(ProviderAppointment, {
                            ref: appointment.patientId + "_" + appointment.slotDateTime,
                            key: appointment.patientId + "_" + appointment.slotDateTime,
                            model: appointment,
                            onCall: component.handleCall }),
                        React.createElement("div", { className: "list-group-separator", key: appointment.patientId + "_" + appointment.slotDateTime + "_separator" })
                    );
                })
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderAppointments, null), document.getElementById("provider-appointments"));
})();