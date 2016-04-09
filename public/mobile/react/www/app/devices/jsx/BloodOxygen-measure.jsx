/**
 * Created by Victor on 3/8/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var BLOOD_OXYGEN_MEASURE = React.createClass({
        getInitialState: function() {
            return {
                nextButtonVisibility: false,
                tryAgainButtonVisibility: false,
                cancelButtonVisibility: false,
                doneButtonVisibility: false,
                value: undefined,
            }
        },
        componentDidMount: function() {
            var component = this;
            Bridge.DeviceReceiver.takeMeasure(component.props.deviceModelType, component.props.deviceModel, function(result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "measure-received":
                            component.setState({
                                nextButtonVisibility: true,
                                tryAgainButtonVisibility: false,
                                cancelButtonVisibility: false,
                                value: result.data.value
                            });
                            break;
                        case "measure-timeout":
                            component.setState({
                                nextButtonVisibility: false,
                                tryAgainButtonVisibility: true,
                                cancelButtonVisibility: true,
                            });
                    }
                }
            });
        },
        handleTryAgain: function() {
            this.setState(this.getInitialState());
            this.componentDidMount();
        },
        handleCancel: function() {
            Bridge.Redirect.redirectTo("patient-my-devices.html");
        },
        handleNext: function() {
            var component = this;

            $(this.props.carouselWizard).carousel("next");
            component.setState({
                nextButtonVisibility: false,
                tryAgainButtonVisibility: false,
                cancelButtonVisibility: false,
            });

            Bridge.DeviceReceiver.confirmMeasure(component.state.value, component.props.deviceModelType, function(result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "measure-confirmed":
                            component.setState({
                                doneButtonVisibility: true
                            });
                            break;
                    }
                }
            });
        },
        handleDone: function() {
            Bridge.Redirect.redirectTo("patient-my-devices.html");
        },
        render: function() {
            return <div className="container">
                <div className="row has-separator buttons-container">
                    <div className="col-xs-6 text-center">
                        { this.state.value ? "SPO2: " +  this.state.value.spo2 : null }
                    </div>
                    <div className="col-xs-6 text-center">
                        { this.state.value ? "Pulse: " +  this.state.value.pr : null }
                    </div>
                </div>
                <div className="row has-separator buttons-container">
                    <div className="col-xs-12">
                        { this.state.tryAgainButtonVisibility ? <input type="button" className="btn btn-default pull-left" value="Try Again" onClick={this.handleTryAgain}></input> : null }
                        { this.state.cancelButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Cancel" onClick={this.handleCancel}></input> : null }
                        { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Confirm" onClick={this.handleNext}></input> : null }
                        { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default pull-right" value="Done" onClick={this.handleDone}></input> : null }
                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<BLOOD_OXYGEN_MEASURE carouselWizard="#measure-wizard" deviceModelType="BloodOxygen"/>, document.getElementById("blood-oxygen-measure"));
})();