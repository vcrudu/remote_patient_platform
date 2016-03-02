/**
 * Created by Victor on 3/2/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var Device = React.createClass({
        handleDeviceItemClick: function(e) {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();

            var paths = window.location.pathname.split("/");
            var pathToRedirect = "";
            if (paths.length > 0) {
                for (var i=0;i<paths.length -1; i++) {
                    if (paths[i] != "") {
                        pathToRedirect += "/" + paths[i];
                    }
                }
            }

            pathToRedirect += "/" + this.props.model + ".html";
            Bridge.Redirect.redirectTo(pathToRedirect);
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
        getInitialState: function(){
            return {
                devices: []
            }
        },
        componentDidMount: function() {
            var availableDevices = [];
            var component = this;
            Bridge.getPatientDevices(function (devicesResult) {
                if (!devicesResult.success) return;
                component.setState({devices: devicesResult.data })
            });
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
            var devices = this.state.devices;
            return <div ref="addDeviceOverlay" className="addDeviceOverlay" onClick={this.hideAddDeviceOverlay}>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="list-group">
                                {devices.map(function(device) {
                                    return <Device key={device.model} imageUrl={device.imagesUrls[0]} model={device.model} description={device.description}/>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    });

    var MyDevices = React.createClass({
        handleAddDevice: function(){
            this.refs["addDeviceOverlay"].showAddDeviceOverlay();
        },
        render: function() {
            return <div className="container">
                <div className="row fill">
                    <AddDeviceOverlay ref="addDeviceOverlay"/>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <a href="javascript:void(0);" className="btn btn-default btn-lg btn-block btn-raised" onClick={this.handleAddDevice}>+<div className="ripple-container"></div></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<MyDevices/>, document.getElementById("my-devices"));
})();