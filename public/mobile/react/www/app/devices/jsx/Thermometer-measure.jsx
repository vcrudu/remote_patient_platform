/**
 * Created by Victor on 3/14/2016.
 */


(function() {
    "use strict";

    $.material.init();

    var M110_Measure = React.createClass({
        getInitialState: function() {
            return {
                nextButtonVisibility: false,
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
                                value: result.data.value
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
                        { this.state.value ? "Temperature: " +  this.state.value : null }
                    </div>
                </div>
                <div className="row buttonsContainer">
                    <div className="col-xs-12">
                        { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default" value="Confirm" onClick={this.handleNext}></input> : null }
                        { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default" value="Done" onClick={this.handleDone}></input> : null }
                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<M110_Measure carouselWizard="#measure-wizard" deviceModelType="Temperature"/>, document.getElementById("thermometer-measure"));
})();