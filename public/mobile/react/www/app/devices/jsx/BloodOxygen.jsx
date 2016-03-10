/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var BLOOD_OXYGEN = React.createClass({
        getInitialState: function() {
            return {
                nextButtonVisibility: false,
                doneButtonVisibility: false,
                cancelButtonVisibility: false,
                retryButtonVisibility: false,
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
        handleRetry: function() {
            var component = this;

            component.setState({
                nextButtonVisibility: false,
                cancelButtonVisibility: false,
                retryButtonVisibility: false,
            });

            Bridge.DeviceInstaller.pairDevice(component.props.deviceModelType, function(result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "paired":
                            component.setState({
                                doneButtonVisibility: true,
                                cancelButtonVisibility: false,
                                retryButtonVisibility: false,
                                deviceAddress: result.data.address
                            });
                            break;
                    }
                }
                else {
                    component.setState({
                        doneButtonVisibility: false,
                        cancelButtonVisibility: true,
                        retryButtonVisibility: true,
                    });
                }
            });
        },
        handleNext: function() {
            var component = this;

            $(this.props.carouselWizard).carousel("next");
            component.setState({
                nextButtonVisibility: false,
                cancelButtonVisibility: false,
                retryButtonVisibility: false,
            });

            Bridge.DeviceInstaller.pairDevice(component.props.deviceModelType, function(result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "paired":
                            component.setState({
                                doneButtonVisibility: true,
                                cancelButtonVisibility: false,
                                retryButtonVisibility: false,
                                deviceAddress: result.data.address
                            });
                            break;
                    }
                }
                else {
                    component.setState({
                        doneButtonVisibility: false,
                        cancelButtonVisibility: true,
                        retryButtonVisibility: true,
                    });
                }
            });
        },
        handleCancel: function() {
            Bridge.Redirect.redirectTo("patient-my-devices.html");
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
            return <div className="row buttonsContainer">
                <div className="col-xs-12">
                    { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default" value="Next" onClick={this.handleNext}></input> : null }
                    { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default" value="Done" onClick={this.handleDone}></input> : null }
                    { this.state.cancelButtonVisibility ? <input type="button" className="btn btn-default" value="Cancel" onClick={this.handleCancel}></input> : null }
                    { this.state.retryButtonVisibility ? <input type="button" className="btn btn-default" value="Retry" onClick={this.handleRetry}></input> : null }
                </div>
            </div>
        }
    });

    ReactDOM.render(<BLOOD_OXYGEN carouselWizard="#wizard" deviceModelType="BloodOxygen"/>, document.getElementById("blood-oxygen"));
})();