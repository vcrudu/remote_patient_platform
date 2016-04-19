/**
 * Created by Victor on 3/8/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var BLOOD_PRESSURE_PROGRESS = React.createClass({
        displayName: "BLOOD_PRESSURE_PROGRESS",

        componentDidMount: function () {
            indeterminateProgress.start();
        },
        render: function () {
            return React.createElement("div", { className: "progress-bar-indeterminate" });
        }
    });

    var BLOOD_PRESSURE_MEASURE = React.createClass({
        displayName: "BLOOD_PRESSURE_MEASURE",

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
                            indeterminateProgress.end();
                            component.setState({
                                nextButtonVisibility: true,
                                tryAgainButtonVisibility: false,
                                cancelButtonVisibility: false,
                                value: result.data.value
                            });
                            $(component.props.carouselWizard).carousel("next");
                            break;
                        case "measure-timeout":
                            component.handleTryAgain();
                            break;
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
                    { className: "row row-data-cells" },
                    React.createElement(
                        "div",
                        { className: "col-xs-6 data-cell" },
                        this.state.value ? "Systolic: " + this.state.value.systolic : null
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-6 data-cell" },
                        this.state.value ? "Diastolic: " + this.state.value.diastolic : null
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row has-separator buttons-container" },
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        this.state.cancelButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default pull-left", value: "Cancel", onClick: this.handleCancel }) : null
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        this.state.nextButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default pull-right", value: "Confirm", onClick: this.handleNext }) : null,
                        this.state.tryAgainButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default pull-right", value: "Try Again", onClick: this.handleTryAgain }) : null,
                        this.state.doneButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default pull-right", value: "Done", onClick: this.handleDone }) : null
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(BLOOD_PRESSURE_MEASURE, { carouselWizard: "#measure-wizard", deviceModelType: "BloodPressure" }), document.getElementById("blood-pressure-measure"));
    ReactDOM.render(React.createElement(BLOOD_PRESSURE_PROGRESS, null), document.getElementById("blood-pressure-measure-progress"));
})();