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
                { className: "col-xs-6 col-sm-6 col-md-6 col-lg-6" },
                React.createElement(
                    "div",
                    { className: "panel panel-default" },
                    React.createElement(
                        "div",
                        { className: "panel-heading" },
                        React.createElement(
                            "h3",
                            { className: "panel-title" },
                            this.props.model ? this.props.model.name : ""
                        ),
                        React.createElement(
                            "p",
                            null,
                            "Appointment Time: ",
                            React.createElement(
                                "strong",
                                null,
                                this.formatDate(this.props.model.slotDateTimeString)
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "panel-image hide-panel-body" },
                        React.createElement("img", { src: "images/user.png", className: "img-responsive" })
                    ),
                    React.createElement("div", { className: this.state.onlineStatus == "offline" ? "statusBorder offline" : "statusBorder online" }),
                    React.createElement(
                        "div",
                        { className: "panel-footer text-center" },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-6 col-sm-6 col-md-6 col-lg-6" },
                                React.createElement("img", { className: "img-responsive pull-right", src: "images/call-icon.png", width: "100", onClick: this.handleCallClick })
                            ),
                            React.createElement(
                                "div",
                                { className: "col-xs-6 col-sm-6 col-md-6 col-lg-6" },
                                React.createElement("img", { className: "img-responsive pull-left", src: "images/dashboard-icon.png", width: "100", onClick: this.handleClickDashboard })
                            )
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
                if (apiResult.success && apiResult.data && apiResult.data.length > 0) {
                    component.setState({
                        appointments: apiResult.data
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
                    return React.createElement(ProviderAppointment, { ref: appointment.patientId, key: appointment.patientId, model: appointment, onCall: component.handleCall });
                })
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderAppointments, null), document.getElementById("provider-appointments"));
})();