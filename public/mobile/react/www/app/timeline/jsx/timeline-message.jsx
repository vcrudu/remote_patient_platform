/**
 * Created by Victor on 5/13/2016.
 */

(function() {
    "use strict";

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var TIMELINE_MESSAGE_PROGRESS = React.createClass({
        componentDidMount: function() {
            indeterminateProgress.start();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div className="progress-bar-indeterminate"></div>
        }
    });

    var TimelineMessage = React.createClass({
        getInitialState: function(){
            return {
                message: {},
                isVisible: false,
                actionButtons: []
            }
        },
        handleExitClick: function() {
            Bridge.Redirect.exitFromApplication();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        componentDidMount: function() {
            var messageId = Bridge.Redirect.getQueryStringParam()["messageId"];
            var action = Bridge.Redirect.getQueryStringParam()["action"];
            var component = this;
            Bridge.Timeline.getById(messageId, function(result) {
                component.setState({message: result.data});

                if (!action) {
                    action = result.data.responseAction;
                }

                var message = result.data;
                Bridge.Timeline.read(messageId, message.read, action, function(readResult) {

                    switch (message.type) {
                        case "canMakeAppointment":
                            component.setState({
                                actionButtons: ["goToAppointments"]
                            });
                            break;
                        case "devicesAvailable":
                            component.setState({
                                actionButtons: ["devicesAvailable"]
                            });
                            break;
                        default:
                            component.setState({
                                actionButtons: ["goToTimeline"]
                            });
                            break;
                    }

                    indeterminateProgress.end();

                    component.setState({
                        isVisible: true
                    });
                });
            });
        },
        handleActionClick: function(event) {
            var action = $(event.currentTarget).attr("data-action-name");
            switch (action) {
                case "goToAppointments":
                    Bridge.Redirect.redirectToWithLevelsUp("appointments/patient-appointments.html", 2);
                    break;
                case "goToDevices":
                    Bridge.Redirect.openUrl("/#/patient/patient.devices/patient.devices.buy");
                    break;
                case "goToTimeline":
                    history.go(-1);
                    break;
            }
        },
        render: function() {
            var component = this;
            return <main className={this.state.isVisible ? "mdl-layout__content visible" : "mdl-layout__content hidden"} ref="messageCard">
                <TIMELINE_MESSAGE_PROGRESS />
                <div className="page-content">
                    <div className="page-content-wrapper">
                        <div className="mdl-card mdl-shadow--2dp">
                            <div className="mdl-card__title">
                                <h2 className="mdl-card__title-text">{this.state.message.title}</h2>
                            </div>
                            <div className="mdl-card__supporting-text">
                                {this.state.message.content}
                            </div>
                            <div className="mdl-card__actions">
                                {
                                    component.state.actionButtons.map(function (button) {
                                        switch (button) {
                                            case "goToAppointments":
                                                return <button data-action-name="goToAppointments" className="mdl-button mdl-js-button mdl-button--accent push-right" onClick={component.handleActionClick}>
                                                    GO TO APPOINTMENTS
                                                </button>
                                            case "goToTimeline":
                                                return <button data-action-name="goToTimeline" className="mdl-button mdl-js-button mdl-button--accent push-right" onClick={component.handleActionClick}>
                                                    OK
                                                </button>
                                            case "devicesAvailable":
                                                return <button data-action-name="goToDevices" className="mdl-button mdl-js-button mdl-button--accent push-right" onClick={component.handleActionClick}>
                                                    BUY A DEVICE
                                                </button>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        }
    });

    ReactDOM.render(<TimelineMessage />, document.getElementById("timeline-message"));
})();
