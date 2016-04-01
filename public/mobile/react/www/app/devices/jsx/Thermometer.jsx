/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var THERMOMETER = React.createClass({
        getInitialState: function() {
            return {
                nextButtonVisibility: false,
                doneButtonVisibility: false,
                deviceAddress: undefined
            }
        },
        componentDidMount: function() {
            var component = this;
            Bridge.DeviceInstaller.connectDevice(component.props.deviceModelType, function(result) {
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
        handleNext: function() {
            var component = this;

            $(this.props.carouselWizard).carousel("next");
            component.setState({
                nextButtonVisibility: false
            });

            Bridge.DeviceInstaller.pairDevice(component.props.deviceModelType, function(result) {
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
        handleDone: function() {
            var availableDevices = [];
            var component = this;
            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) return;

                var devices = _.filter(devicesResult.data,function(device) {
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
        render: function() {
            return <div className="row has-separator buttons-container">
                <div className="col-xs-6">
                </div>
                <div className="col-xs-6">
                    { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Next" onClick={this.handleNext}></input> : null }
                    { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Done" onClick={this.handleDone}></input> : null }
                </div>
            </div>
        }
    });

    ReactDOM.render(<THERMOMETER carouselWizard="#wizard" deviceModelType="Temperature"/>, document.getElementById("thermometer"));
})();