/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var PairedDevice = React.createClass({
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
            return <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                <div className="row">
                    <div className="col-xs-8">
                        <h3>{this.props.model}</h3>
                        <p>{this.props.description}</p>
                    </div>
                    <div className="col-xs-4">
                        <img src={"images/" + this.props.model + ".png"} className="img-responsive device-image"/>
                    </div>
                </div>
            </div>
        }
    });

    var Device = React.createClass({
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
            return <div className="list-group-item" onClick={this.handleDeviceItemClick}>
                <div className="row">
                    <div className="col-xs-8">
                        <h3>{this.props.model}</h3>
                        <p>{this.props.description}</p>
                    </div>
                    <div className="col-xs-4">
                        <img src={"images/" + this.props.model + ".png"} className="img-responsive device-image"/>
                    </div>
                </div>
            </div>
        }
    });

    var AddDeviceOverlay = React.createClass({
        getDefaultProps: function() {
            devices: []
        },
        showAddDeviceOverlay: function() {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideDown();
        },
        hideAddDeviceOverlay: function() {
            var appointmentModalDiv = $(this.refs.addDeviceOverlay);
            appointmentModalDiv.slideUp();
        },
        render: function() {
            return <div ref="addDeviceOverlay" className="addDeviceOverlay" onClick={this.hideAddDeviceOverlay}>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="list-group">
                                {this.props.devices.map(function(device) {
                                    return <Device key={"available-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType}/>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    });

    var PairedDevices = React.createClass({
        getDefaultProps: function() {
            devices: []
        },
        render: function() {
            return  <div className="list-group">
                {
                    this.props.devices.map(function(device) {
                        return <PairedDevice key={"paired-" + device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description} modelType={device.deviceModelType}/>;
                    })
                }
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
            return <div className="container">
                <div className="row fill">
                    <AddDeviceOverlay ref="addDeviceOverlay" devices={this.state.devices}/>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <a href="javascript:void(0);" className="btn btn-default btn-lg btn-block btn-raised" onClick={this.handleAddDevice}>+<div className="ripple-container"></div></a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <PairedDevices devices={this.state.pairedDevices}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<MyDevices/>, document.getElementById("my-devices"));
})();


