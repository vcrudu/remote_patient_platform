/**
 * Created by Victor on 3/8/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var BLOOD_OXYGEN_MEASURE = React.createClass({
        displayName: "BLOOD_OXYGEN_MEASURE",

        getInitialState: function () {
            return {
                nextButtonVisibility: false,
                tryAgainButtonVisibility: false,
                cancelButtonVisibility: false,
                doneButtonVisibility: false,
                value: undefined
            };
        },
        componentDidMount: function () {
            var component = this;
            Bridge.DeviceReceiver.takeMeasure(component.props.deviceModelType, component.props.deviceModel, function (result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "measure-received":
                            component.setState({
                                nextButtonVisibility: true,
                                tryAgainButtonVisibility: false,
                                cancelButtonVisibility: false,
                                value: result.data.value
                            });
                            break;
                        case "measure-timeout":
                            component.setState({
                                nextButtonVisibility: false,
                                tryAgainButtonVisibility: true,
                                cancelButtonVisibility: true
                            });
                    }
                }
            });
        },
        handleTryAgain: function () {
            this.setState(this.getInitialState());
            this.componentDidMount();
        },
        handleCancel: function () {
            Bridge.Redirect.redirectTo("patient-my-devices.html");
        },
        handleNext: function () {
            var component = this;

            $(this.props.carouselWizard).carousel("next");
            component.setState({
                nextButtonVisibility: false,
                tryAgainButtonVisibility: false,
                cancelButtonVisibility: false
            });

            Bridge.DeviceReceiver.confirmMeasure(component.state.value, component.props.deviceModelType, function (result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "measure-confirmed":
                            component.setState({
                                doneButtonVisibility: true
                            });
                            break;
                    }
                }
            });
        },
        handleDone: function () {
            Bridge.Redirect.redirectTo("patient-my-devices.html");
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        this.state.value ? "SPO2: " + this.state.value.spo2 : null
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        this.state.value ? "Pulse: " + this.state.value.pr : null
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row buttonsContainer" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        this.state.nextButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Confirm", onClick: this.handleNext }) : null,
                        this.state.tryAgainButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Try Again", onClick: this.handleTryAgain }) : null,
                        this.state.cancelButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Cancel", onClick: this.handleCancel }) : null,
                        this.state.doneButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Done", onClick: this.handleDone }) : null
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(BLOOD_OXYGEN_MEASURE, { carouselWizard: "#measure-wizard", deviceModelType: "BloodOxygen" }), document.getElementById("blood-oxygen-measure"));
})();