/**
 * Created by Victor on 3/2/2016.
 */

(function () {
    "use strict";

    $.material.init();

    $.material.init();

    var intObj = {
        template: 2,
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

    var BLOOD_PRESSURE = React.createClass({
        displayName: "BLOOD_PRESSURE",

        getInitialState: function () {
            return {
                nextButtonVisibility: false,
                doneButtonVisibility: false,
                cancelButtonVisibility: false,
                retryButtonVisibility: false,
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
        handleRetry: function () {
            var component = this;

            component.setState({
                nextButtonVisibility: false,
                cancelButtonVisibility: false,
                retryButtonVisibility: false
            });

            $(component.props.carouselWizard).carousel("prev");
            this.componentDidMount();
        },
        handleNext: function () {
            var component = this;

            $(this.props.carouselWizard).carousel("next");
            component.setState({
                nextButtonVisibility: false,
                cancelButtonVisibility: false,
                retryButtonVisibility: false
            });

            Bridge.DeviceInstaller.pairDevice(component.props.deviceModelType, function (result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "paired":
                            indeterminateProgress.end();
                            component.setState({
                                doneButtonVisibility: true,
                                cancelButtonVisibility: false,
                                retryButtonVisibility: false,
                                deviceAddress: result.data.address
                            });
                            $(component.props.carouselWizard).carousel("next");
                            break;
                    }
                } else {
                    $(component.props.carouselWizard).carousel("prev");
                    component.componentDidMount();
                    /*component.setState({
                        doneButtonVisibility: false,
                        cancelButtonVisibility: true,
                        retryButtonVisibility: true,
                    });*/
                }
            });
        },
        handleCancel: function () {
            Bridge.Redirect.redirectTo("patient-my-devices.html");
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
                { className: "row has-separator buttons-container" },
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    this.state.cancelButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default btn-accent btn-footer pull-left", value: "Cancel", onClick: this.handleCancel }) : null
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    this.state.nextButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default btn-accent btn-footer pull-right", value: "Next", onClick: this.handleNext }) : null,
                    this.state.doneButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default btn-accent btn-footer pull-right", value: "Done", onClick: this.handleDone }) : null,
                    this.state.retryButtonVisibility ? React.createElement("input", { type: "button", className: "btn btn-default btn-accent btn-footer pull-right", value: "Retry", onClick: this.handleRetry }) : null
                )
            );
        }
    });

    ReactDOM.render(React.createElement(BLOOD_PRESSURE, { carouselWizard: "#wizard", deviceModelType: "BloodPressure-New" }), document.getElementById("blood-pressure"));
    ReactDOM.render(React.createElement(BLOOD_PRESSURE_PROGRESS, null), document.getElementById("blood-pressure-pair-progress"));
})();