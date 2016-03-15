/**
 * Created by Victor on 3/8/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var BLOOD_PRESSURE_MEASURE = React.createClass({
        displayName: "BLOOD_PRESSURE_MEASURE",

        getInitialState: function () {
            return {
                nextButtonVisibility: false,
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
                            debugger;
                            component.setState({
                                nextButtonVisibility: true,
                                value: result.data.value
                            });
                            break;
                    }
                }
            });
        },
        handleNext: function () {
            var component = this;

            $(this.props.carouselWizard).carousel("next");
            component.setState({
                nextButtonVisibility: false
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
                        this.state.value ? "Systolic: " + this.state.value.value.systolic : null
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        this.state.value ? "Diastolic: " + this.state.value.value.diastolic : null
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row buttonsContainer" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        this.state.nextButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Confirm", onClick: this.handleNext }) : null,
                        this.state.doneButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Done", onClick: this.handleDone }) : null
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(BLOOD_PRESSURE_MEASURE, { carouselWizard: "#measure-wizard", deviceModelType: "BloodPressure" }), document.getElementById("blood-pressure-measure"));
})();