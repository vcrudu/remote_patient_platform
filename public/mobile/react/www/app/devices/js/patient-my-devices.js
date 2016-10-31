/**
 * Created by Victor on 3/2/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var MY_DEVICES_PROGRESS = React.createClass({
        displayName: "MY_DEVICES_PROGRESS",

        componentDidMount: function () {
            indeterminateProgress.start();
        },
        componentDidUpdate: function () {
            //componentHandler.upgradeDom();
        },
        render: function () {
            return React.createElement("div", { className: "progress-bar-indeterminate" });
        }
    });

    var NoDevicesMessage = React.createClass({
        displayName: "NoDevicesMessage",

        componentDidMount: function () {
            $(this.refs.noDeviceMessage).hide();
            if (this.props.pairedDevices && this.props.pairedDevices.length > 0) {
                $(this.refs.noDeviceMessage).hide();
            } else {
                $(this.refs.noDeviceMessage).show();
            }
            $(this.refs.noDeviceMessage).removeClass("hide");
        },
        hideMessage: function () {
            $(this.refs.noDeviceMessage).addClass("hide");
        },
        handleAddDevice: function () {
            this.props.handleInstallDevice();
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "container hide", ref: "noDeviceMessage" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-sm-12" },
                        React.createElement(
                            "div",
                            { className: "bs-component" },
                            React.createElement(
                                "div",
                                { className: "jumbotron" },
                                React.createElement(
                                    "h2",
                                    { className: "primary-title primary-text" },
                                    "Welcome"
                                ),
                                React.createElement(
                                    "p",
                                    { className: "supporting-text" },
                                    "Add some devices to get started."
                                ),
                                React.createElement(
                                    "p",
                                    { className: "supporting-text pull-right" },
                                    React.createElement(
                                        "a",
                                        { href: "javascript:void(0);", className: "btn btn-primary btn-accent", onClick: this.handleAddDevice },
                                        "Install a new device"
                                    )
                                ),
                                React.createElement("div", { className: "clear" })
                            )
                        )
                    )
                )
            );
        }
    });

    var PairedDevice = React.createClass({
        displayName: "PairedDevice",

        getInitialState: function () {
            return {
                deviceIcon: ""
            };
        },
        componentDidMount: function () {
            switch (this.props.modelType) {
                case "Temperature":
                    this.setState({ deviceIcon: "images/thermometer-icon.png" });
                    break;
                case "BloodOxygen":
                    this.setState({ deviceIcon: "images/oximeter-JPD-500F-icon.png" });
                    break;
                case "BloodPressure":
                    if (this.props.model === "UA-767PBT-Ci") {
                        this.setState({ deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png" });
                    } else {
                        this.setState({ deviceIcon: "images/UA-651BLE-350x240.png" });
                    }
                    break;
                case "Weight":
                    this.setState({ deviceIcon: "images/UC-355PBT-Ci.png" });
                    break;
            }
        },
        handleDeviceItemClick: function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            switch (this.props.modelType) {
                case "Temperature":
                    Bridge.Redirect.redirectTo("Thermometer-measure.html");
                    break;
                case "BloodOxygen":
                    Bridge.Redirect.redirectTo("BloodOxygen-measure.html");
                    break;
                case "BloodPressure":
                    if (this.props.model === "UA-767PBT-Ci") {
                        Bridge.Redirect.redirectTo("UC-355PBT-Ci-measure.html");
                    } else {
                        Bridge.Redirect.redirectTo("BloodPressure-measure.html");
                    }
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "list-group-item", onClick: this.handleDeviceItemClick },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-7" },
                            React.createElement(
                                "h4",
                                { className: "primary-text" },
                                this.props.model
                            ),
                            React.createElement(
                                "p",
                                { className: "primary-text-secondary" },
                                this.props.description
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-5" },
                            React.createElement("img", { src: this.state.deviceIcon, className: "img-responsive device-image" })
                        )
                    )
                ),
                React.createElement("div", { className: "list-group-separator full-width" })
            );
        }
    });

    var Device = React.createClass({
        displayName: "Device",

        getInitialState: function () {
            return {
                deviceIcon: ""
            };
        },
        componentDidMount: function () {
            debugger;
            switch (this.props.modelType) {
                case "Temperature":
                    this.setState({ deviceIcon: "images/thermometer-icon.png" });
                    break;
                case "BloodOxygen":
                    this.setState({ deviceIcon: "images/oximeter-JPD-500F-icon.png" });
                    break;
                case "BloodPressure":
<<<<<<< HEAD
                    if (this.props.model === "UA-767PBT-Ci") {
                        this.setState({ deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png" });
                    } else {
                        this.setState({ deviceIcon: "images/UA-651BLE-350x240.png" });
                    }
=======
                    this.setState({ deviceIcon: "images/UA-651BLE-350x240.png" });
>>>>>>> origin/PatientsGroup
                    break;
                case "Weight":
                    this.setState({ deviceIcon: "images/blood-pressure-monitor-icon.png" });
                    break;
            }
        },
        handleDeviceItemClick: function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            switch (this.props.modelType) {
                case "Temperature":
                    Bridge.Redirect.redirectTo("Thermometer.html");
                    break;
                case "BloodOxygen":
                    Bridge.Redirect.redirectTo("BloodOxygen.html");
                    break;
                case "BloodPressure":
                    if (this.props.model === "UA-767PBT-Ci") {
                        Bridge.Redirect.redirectTo("UC-355PBT-Ci.html");
                    } else {
                        Bridge.Redirect.redirectTo("BloodPressure.html");
                    }
                    break;
            }
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "list-group-item", onClick: this.handleDeviceItemClick },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-7" },
                            React.createElement(
                                "h4",
                                { className: "primary-text" },
                                this.props.model
                            ),
                            React.createElement(
                                "p",
                                { className: "primary-text-secondary" },
                                this.props.description
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "col-xs-5" },
                            React.createElement("img", { src: this.state.deviceIcon, className: "img-responsive device-image" })
                        )
                    )
                ),
                React.createElement("div", { className: "list-group-separator full-width" })
            );
        }
    });

    var AddDeviceOverlay = React.createClass({
        displayName: "AddDeviceOverlay",

        /*getDefaultProps: function() {
            devices: []
        },*/
        showAddDeviceOverlay: function () {
            var addDeviceOverlayDiv = $(this.refs.addDeviceOverlay);

            addDeviceOverlayDiv.slideDown(250, "linear", function () {
                /*setTimeout(function() {*/
                Bridge.DeviceInstaller.showDevicePopup(function () {
                    addDeviceOverlayDiv.slideUp();
                });
                /*}, 200);*/
            });
        },
        hideAddDeviceOverlay: function () {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideUp(250, "linear", function () {
                /*setTimeout(function() {*/
                Bridge.DeviceInstaller.closeDevicePopup(function () {});
                /*}, 200);*/
            });
        },
        render: function () {
            var component = this;
            var devices = [];

            if (component.props.devices) {
                devices = component.props.devices;
            }
            return React.createElement(
                "div",
                { ref: "addDeviceOverlay", className: "addDeviceOverlay gray_200", onClick: this.hideAddDeviceOverlay },
                React.createElement("div", { className: "space_24" }),
                React.createElement(
                    "div",
                    { className: "list-group", ref: "addDeviceOverlayList" },
                    devices.map(function (device) {
                        return React.createElement(Device, { key: "available-" + device.model, imageUrl: device.imagesUrls[0], model: device.model, description: device.description, modelType: device.deviceModelType });
                    })
                )
            );
        }
    });

    var PairedDevices = React.createClass({
        displayName: "PairedDevices",

        getDefaultProps: function () {
            devices: [];
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement("div", { className: "space_24" }),
                React.createElement(
                    "div",
                    { className: "list-group" },
                    this.props.devices.map(function (device) {
                        return React.createElement(PairedDevice, { key: "paired-" + device.model, imageUrl: device.imagesUrls[0], model: device.model, description: device.description, modelType: device.deviceModelType });
                    })
                )
            );
        }
    });

    var MyDevices = React.createClass({
        displayName: "MyDevices",

        getInitialState: function () {
            return {
                pairedDevices: [],
                devices: []
            };
        },
        handleAddDevice: function () {
            this.refs["addDeviceOverlay"].showAddDeviceOverlay();
        },
        componentDidMount: function () {
            var component = this;

            component.refs.noDevices.hideMessage();

            $(".addDeviceOverlay").height($("body").height());

            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) {
                    return;
                } else {
                    Bridge.DeviceInstaller.getDevicesFromToLocalStorage(function (pairedResult) {
                        component.refs.noDevices.hideMessage();

                        if (!pairedResult.success) {
                            component.setState({ devices: devicesResult.data });
                            return;
                        }

                        component.setState({ pairedDevices: pairedResult.data, devices: devicesResult.data });
                        component.refs.noDevices.componentDidMount();
                    });
                }

                indeterminateProgress.end();
            });
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(NoDevicesMessage, { ref: "noDevices", pairedDevices: this.state.pairedDevices, handleInstallDevice: this.handleAddDevice }),
                React.createElement(AddDeviceOverlay, { ref: "addDeviceOverlay", devices: this.state.devices }),
                React.createElement(PairedDevices, { devices: this.state.pairedDevices }),
                React.createElement(
                    "div",
                    { className: "bottom-container" },
                    React.createElement(
                        "a",
                        { href: "javascript:void(0);", className: "pull-right btn btn-fab btn-accent", onClick: this.handleAddDevice },
                        React.createElement(
                            "i",
                            { className: "material-icons accent" },
                            "add"
                        ),
                        React.createElement("div", { className: "ripple-container" })
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(MY_DEVICES_PROGRESS, null), document.getElementById("my-devices-progress"));
    ReactDOM.render(React.createElement(MyDevices, null), document.getElementById("my-devices"));
})();