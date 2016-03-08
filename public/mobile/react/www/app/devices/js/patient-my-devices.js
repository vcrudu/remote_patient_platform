/**
 * Created by Victor on 3/2/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var PairedDevice = React.createClass({
        displayName: "PairedDevice",

        handleDeviceItemClick: function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            var redirectUrl = this.props.model + "-measure.html";
            Bridge.Redirect.redirectTo(redirectUrl);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "list-group-item", onClick: this.handleDeviceItemClick },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-8" },
                        React.createElement(
                            "h3",
                            null,
                            this.props.model
                        ),
                        React.createElement(
                            "p",
                            null,
                            this.props.description
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-4" },
                        React.createElement("img", { src: "images/" + this.props.model + ".png", className: "img-responsive device-image" })
                    )
                )
            );
        }
    });

    var Device = React.createClass({
        displayName: "Device",

        handleDeviceItemClick: function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            Bridge.Redirect.redirectTo(this.props.model + ".html");
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "list-group-item", onClick: this.handleDeviceItemClick },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-8" },
                        React.createElement(
                            "h3",
                            null,
                            this.props.model
                        ),
                        React.createElement(
                            "p",
                            null,
                            this.props.description
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-4" },
                        React.createElement("img", { src: "images/" + this.props.model + ".png", className: "img-responsive device-image" })
                    )
                )
            );
        }
    });

    var AddDeviceOverlay = React.createClass({
        displayName: "AddDeviceOverlay",

        getDefaultProps: function () {
            devices: [];
        },
        showAddDeviceOverlay: function () {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideDown();
        },
        hideAddDeviceOverlay: function () {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideUp();
        },
        render: function () {
            return React.createElement(
                "div",
                { ref: "addDeviceOverlay", className: "addDeviceOverlay", onClick: this.hideAddDeviceOverlay },
                React.createElement(
                    "div",
                    { className: "container" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-12" },
                            React.createElement(
                                "div",
                                { className: "list-group" },
                                this.props.devices.map(function (device) {
                                    return React.createElement(Device, { key: "available-" + device.model, imageUrl: device.imagesUrls[0], model: device.model, description: device.description });
                                })
                            )
                        )
                    )
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
                { className: "list-group" },
                this.props.devices.map(function (device) {
                    return React.createElement(PairedDevice, { key: "paired-" + device.model, imageUrl: device.imagesUrls[0], model: device.model, description: device.description });
                })
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

            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) {
                    return;
                } else {
                    Bridge.DeviceInstaller.getDevicesFromToLocalStorage(function (pairedResult) {
                        if (!pairedResult.success) {
                            component.setState({ devices: devicesResult.data });
                            return;
                        }
                        component.setState({ pairedDevices: pairedResult.data, devices: devicesResult.data });
                    });
                }
            });
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "row fill" },
                    React.createElement(AddDeviceOverlay, { ref: "addDeviceOverlay", devices: this.state.devices }),
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-12" },
                                React.createElement(
                                    "a",
                                    { href: "javascript:void(0);", className: "btn btn-default btn-lg btn-block btn-raised", onClick: this.handleAddDevice },
                                    "+",
                                    React.createElement("div", { className: "ripple-container" })
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "col-xs-12" },
                                React.createElement(PairedDevices, { devices: this.state.pairedDevices })
                            )
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(MyDevices, null), document.getElementById("my-devices"));
})();