/**
 * Created by Victor on 3/8/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var intObj = {
        template: 2,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var BLOOD_PRESSURE_PROGRESS = React.createClass({
        componentDidMount: function() {
            indeterminateProgress.start();
        },
        render: function() {
            return <div className="progress-bar-indeterminate"></div>
        }
    });

    var BLOOD_PRESSURE_MEASURE = React.createClass({
        getInitialState: function() {
            return {
                nextButtonVisibility: false,
                tryAgainButtonVisibility: false,
                cancelButtonVisibility: false,
                doneButtonVisibility: false,
                value: undefined
            }
        },
        componentDidMount: function() {
            var component = this;
            Bridge.DeviceReceiver.takeMeasure(component.props.deviceModelType, component.props.deviceModel, function(result) {
                if (result.success) {
                    switch (result.data.status) {
                        case "measure-received":
                            indeterminateProgress.end();
                            component.setState({
                                nextButtonVisibility: true,
                                tryAgainButtonVisibility: false,
                                cancelButtonVisibility: false,
                                value: result.data.value
                            });
                            $(component.props.carouselWizard).carousel("next");
                            break;
                        case "measure-timeout":
                            component.handleTryAgain();
                            break;
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
            return <div>
                <div className="buttons-group">
                    <div className="row has-separator buttons-container">
                        <div className="col-xs-4 data-cell-footer">
                            <h4 className="primary-text vertical-center">{ this.state.value ? "Systolic: " +  this.state.value.systolic : null }</h4>

                        </div>
                        <div className="col-xs-4 data-cell-footer">
                            <h4 className="primary-text vertical-center">{ this.state.value ? "Diastolic: " +  this.state.value.diastolic : null }</h4>
                        </div>
                        <div className="col-xs-4 data-cell-footer">
                            { this.state.cancelButtonVisibility ? <input type="button" className="btn btn-default btn-accent btn-footer pull-right" value="Cancel" onClick={this.handleCancel}></input> : null }
                            { this.state.nextButtonVisibility ? <input type="button" className="btn btn-default btn-accent btn-footer pull-right" value="Confirm" onClick={this.handleNext}></input> : null }
                            { this.state.tryAgainButtonVisibility ? <input type="button" className="btn btn-default btn-accent btn-footer pull-right" value="Try Again" onClick={this.handleTryAgain}></input> : null }
                            { this.state.doneButtonVisibility ? <input type="button" className="btn btn-default btn-accent btn-footer pull-right" value="Done" onClick={this.handleDone}></input> : null }
                        </div>
                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<BLOOD_PRESSURE_MEASURE carouselWizard="#measure-wizard" deviceModelType="BloodPressure-New"/>, document.getElementById("blood-pressure-measure"));
    ReactDOM.render(<BLOOD_PRESSURE_PROGRESS />, document.getElementById("blood-pressure-measure-progress"));
})();