/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var PairedDevice = React.createClass({
        getInitialState: function() {
            return {
                deviceIcon: "",
            }
        },
        componentDidMount: function() {
            switch (this.props.modelType)
            {
                case "Temperature":
                    this.setState({deviceIcon: "images/thermometer-icon.png"})
                    break;
                case "BloodOxygen":
                    this.setState({deviceIcon: "images/oximeter-JPD-500F-icon.png"})
                    break;
                case "BloodPressure":
                    this.setState({deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png"})
                    break;
                case "Weight":
                    this.setState({deviceIcon: "images/UC-355PBT-Ci.png"})
                    break;
            }
        },
        handleDeviceItemClick: function(e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            switch (this.props.modelType)
            {
                case "Temperature":
                    Bridge.Redirect.redirectTo("Thermometer-measure.html");
                    break;
                case "BloodOxygen":
                    Bridge.Redirect.redirectTo("BloodOxygen-measure.html");
                    break;
                case "BloodPressure":
                    Bridge.Redirect.redirectTo("BloodPressure-measure.html");
                    break;
            }
        },
        render: function() {
            return <div>
                    <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                        <div className="row">
                            <div className="col-xs-7">
                                <h4 className="primary-text">{this.props.model}</h4>
                                <p className="primary-text-secondary">{this.props.description}</p>
                            </div>
                            <div className="col-xs-5">
                                <img src={this.state.deviceIcon} className="img-responsive device-image"/>
                            </div>
                        </div>
                    </div>
                    <div className="list-group-separator full-width"></div>
                </div>
        }
    });

    var Device = React.createClass({
        getInitialState: function() {
            return {
                deviceIcon: "",
            }
        },
        componentDidMount: function() {
            switch (this.props.modelType)
            {
                case "Temperature":
                    this.setState({deviceIcon: "images/thermometer-icon.png"})
                    break;
                case "BloodOxygen":
                    this.setState({deviceIcon: "images/oximeter-JPD-500F-icon.png"})
                    break;
                case "BloodPressure":
                    this.setState({deviceIcon: "images/blood-pressure-UA-767BT-Ci-monitor-icon.png"})
                    break;
                case "Weight":
                    this.setState({deviceIcon: "images/blood-pressure-monitor-icon.png"})
                    break;
            }
        },
        handleDeviceItemClick: function(e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            switch (this.props.modelType)
            {
                case "Temperature":
                    Bridge.Redirect.redirectTo("Thermometer.html");
                    break;
                case "BloodOxygen":
                    Bridge.Redirect.redirectTo("BloodOxygen.html");
                    break;
                case "BloodPressure":
                    Bridge.Redirect.redirectTo("BloodPressure.html");
                    break;
            }
        },
        render: function() {
            return <div>
                <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                    <div className="row">
                        <div className="col-xs-7">
                            <h4 className="primary-text">{this.props.model}</h4>
                            <p className="primary-text-secondary">{this.props.description}</p>
                        </div>
                        <div className="col-xs-5">
                            <img src={this.state.deviceIcon} className="img-responsive device-image"/>
                        </div>
                    </div>
                </div>
                <div className="list-group-separator full-width"></div>
            </div>
        }
    });

    var AddDeviceOverlay = React.createClass({
        getDefaultProps: function() {
            devices: []
        },
        showAddDeviceOverlay: function() {
            var addDeviceOverlayDiv = $(this.refs.addDeviceOverlay);
            addDeviceOverlayDiv.slideDown();
            Bridge.DeviceInstaller.showDevicePopup(function() {
                addDeviceOverlayDiv.slideUp();
            });
        },
        hideAddDeviceOverlay: function() {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideUp();
            Bridge.DeviceInstaller.closeDevicePopup(function() {

            });
        },
        render: function() {
            return <div ref="addDeviceOverlay" className="addDeviceOverlay gray_200" onClick={this.hideAddDeviceOverlay}>
                <div className="space_24"></div>
                <div className="list-group" ref="addDeviceOverlayList">
                    {this.props.devices.map(function(device) {
                        return <Device key={"available-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType}/>;
                    })}
                </div>
            </div>
        }
    });

    var PairedDevices = React.createClass({
        getDefaultProps: function() {
            devices: []
        },
        render: function() {
            return <div>
                <div className="space_24"></div>
                <div className="list-group">
                    {
                        this.props.devices.map(function(device) {
                            return <PairedDevice key={"paired-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType}/>;
                        })
                    }
                </div>
            </div>
        }
    });

    var MyDevices = React.createClass({
        getInitialState: function(){
            return {
                pairedDevices: [],
                devices: []
            }
        },
        handleAddDevice: function(){
            this.refs["addDeviceOverlay"].showAddDeviceOverlay();
        },
        componentDidMount: function() {
            var component = this;

            $(".addDeviceOverlay").height($("body").height());

            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) {
                    return;
                }
                else {
                    Bridge.DeviceInstaller.getDevicesFromToLocalStorage(function (pairedResult) {
                        if (!pairedResult.success)
                        {
                            component.setState({devices: devicesResult.data })
                            return;
                        }
                        component.setState({pairedDevices: pairedResult.data, devices: devicesResult.data })
                    });
                }
            });
        },
        render: function() {
            return <div>
                <AddDeviceOverlay ref="addDeviceOverlay" devices={this.state.devices}/>
                <PairedDevices devices={this.state.pairedDevices}/>

                <div className="bottom-container">
                    <a href="javascript:void(0);" className="pull-right btn btn-fab btn-accent" onClick={this.handleAddDevice}><i className="material-icons accent">add</i><div className="ripple-container"></div></a>
                </div>
            </div>
        }
    });

    ReactDOM.render(<MyDevices/>, document.getElementById("my-devices"));
})();


