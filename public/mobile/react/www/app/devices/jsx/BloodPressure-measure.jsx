/**
 * Created by Victor on 3/8/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var BLOOD_PRESSURE_MEASURE = React.createClass({
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
                <div className="row">
                    <div className="col-xs-6">
                        { this.state.value ? "Systolic: " +  this.state.value.systolic : null }
                    </div>
                    <div className="col-xs-6">
                        { this.state.value ? "Diastolic: " +  this.state.value.diastolic : null }
                    </div>
                </div>
                <div className="row buttonsContainer">
                    <div className="col-xs-12">
                        { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default" value="Confirm" onClick={this.handleNext}></input> : null }
                        { this.state.tryAgainButtonVisibility ? <input type="button" className="btn btn-default" value="Try Again" onClick={this.handleTryAgain}></input> : null }
                        { this.state.cancelButtonVisibility ? <input type="button" className="btn btn-default" value="Cancel" onClick={this.handleCancel}></input> : null }
                        { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default" value="Done" onClick={this.handleDone}></input> : null }
                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<BLOOD_PRESSURE_MEASURE carouselWizard="#measure-wizard" deviceModelType="BloodPressure"/>, document.getElementById("blood-pressure-measure"));
})();