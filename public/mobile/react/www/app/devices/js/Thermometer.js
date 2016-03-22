/**
 * Created by Victor on 3/2/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var THERMOMETER = React.createClass({
        displayName: "THERMOMETER",

        getInitialState: function () {
            return {
                nextButtonVisibility: false,
                doneButtonVisibility: false,
                deviceAddress: undefined
            };
        },
        componentDidMount: function () {
            var component = this;
            Bridge.DeviceInstaller.connectDevice(component.props.deviceModelType, function (result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "connected":
                            component.setState({
                                nextButtonVisibility: true
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

            Bridge.DeviceInstaller.pairDevice(component.props.deviceModelType, function (result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "paired":
                            component.setState({
                                doneButtonVisibility: true,
                                deviceAddress: result.data.address
                            });
                            break;
                    }
                }
            });
        },
        handleDone: function () {
            var availableDevices = [];
            var component = this;
            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) return;

                var devices = _.filter(devicesResult.data, function (device) {
                    return device.deviceModelType === component.props.deviceModelType;
                });

                if (devices && devices.length > 0) {
                    var device = devices[0];
                    if (device) {
                        device.address = component.state.deviceAddress;
                        Bridge.DeviceInstaller.addDeviceToLocalStorage(device, function (result) {
                            if (result.success) {
                                switch (result.data.status) {
                                    case "deviceAdded":
                                        Bridge.Redirect.redirectTo("patient-my-devices.html");
                                        break;
                                }
                            }
                        });
                    }
                }
            });
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "row buttonsContainer" },
                React.createElement("div", { className: "col-xs-8" }),
                React.createElement(
                    "div",
                    { className: "col-xs-4" },
                    this.state.nextButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Next", onClick: this.handleNext }) : null,
                    this.state.doneButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default", value: "Done", onClick: this.handleDone }) : null
                )
            );
        }
    });

    ReactDOM.render(React.createElement(THERMOMETER, { carouselWizard: "#wizard", deviceModelType: "Temperature" }), document.getElementById("thermometer"));
})();