/**
 * Created by Victor on 3/8/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var M110_Measure = React.createClass({
        displayName: "M110_Measure",

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

            Bridge.DeviceReceiver.confirmMeasure(component.state.value, component.props.deviceModel, function (result) {
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
                { className: "row buttonsContainer" },
                React.createElement("div", { className: "col-xs-8" }),
                React.createElement(
                    "div",
                    { className: "col-xs-4" },
                    this.state.nextButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Confirm", onClick: this.handleNext }) : null,
                    this.state.doneButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Done", onClick: this.handleDone }) : null
                )
            );
        }
    });

    ReactDOM.render(React.createElement(M110_Measure, { carouselWizard: "#measure-wizard", deviceModel: "UA-767PBT-Ci", deviceModelType: "BloodPressure" }), document.getElementById("ua-767pbt-ci-measure"));
})();