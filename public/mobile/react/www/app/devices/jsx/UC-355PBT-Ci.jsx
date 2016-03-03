/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var UC_355PBT_CI = React.createClass({
        getInitialState: function() {
            return {
                nextButtonVisibility: false,
                doneButtonVisibility: false
            }
        },
        componentDidMount: function() {
            var component = this;
            Bridge.DeviceInstaller.connectThermometerDevice(function(result) {
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

            Bridge.DeviceInstaller.pairDevice(component.props.deviceModel, function(result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "paired":
                            component.setState({
                                doneButtonVisibility: true
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
                    return device.model === component.props.deviceModel;
                });

                if (devices && devices.length > 0) {
                    var device = devices[0];
                    if (device) {
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
                <div className="col-xs-8">
                </div>
                <div className="col-xs-4">
                    { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Next" onClick={this.handleNext}></input> : null }
                    { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Done" onClick={this.handleDone}></input> : null }
                </div>
            </div>
        }
    });

    ReactDOM.render(<UC_355PBT_CI carouselWizard="#wizard" deviceModel="UC-355PBT-Ci"/>, document.getElementById("uc-355pbt-ci"));
})();