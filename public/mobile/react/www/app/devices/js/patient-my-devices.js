/**
 * Created by Victor on 3/2/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var Device = React.createClass({
        displayName: "Device",

        handleDeviceItemClick: function (e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            var paths = window.location.pathname.split("/");
            var pathToRedirect = "";
            if (paths.length > 0) {
                for (var i = 0; i < paths.length - 1; i++) {
                    if (paths[i] != "") {
                        pathToRedirect += "/" + paths[i];
                    }
                }
            }

            pathToRedirect += "/" + this.props.model + ".html";
            Bridge.Redirect.redirectTo(pathToRedirect);
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

        getInitialState: function () {
            return {
                devices: []
            };
        },
        componentDidMount: function () {
            var availableDevices = [];
            var component = this;
            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) return;
                component.setState({ devices: devicesResult.data });
            });
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
            var devices = this.state.devices;
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
                                devices.map(function (device) {
                                    return React.createElement(Device, { key: device.model, imageUrl: device.imagesUrls[0], model: device.model, description: device.description });
                                })
                            )
                        )
                    )
                )
            );
        }
    });

    var MyDevices = React.createClass({
        displayName: "MyDevices",

        handleAddDevice: function () {
            this.refs["addDeviceOverlay"].showAddDeviceOverlay();
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "row fill" },
                    React.createElement(AddDeviceOverlay, { ref: "addDeviceOverlay" }),
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
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(MyDevices, null), document.getElementById("my-devices"));
})();