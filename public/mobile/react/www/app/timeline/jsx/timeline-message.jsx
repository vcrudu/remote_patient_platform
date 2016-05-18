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
            var component = this;
            Bridge.Timeline.getById(messageId, function(result) {
                component.setState({message: result.data});

                indeterminateProgress.end();
            });
        },
        render: function() {
            var component = this;
            return <main className="mdl-layout__content">
                <TIMELINE_MESSAGE_PROGRESS />
                <div className="page-content">
                    <div className="page-content-wrapper">
                        <div className="mdl-card mdl-shadow--2dp">
                            <div className="mdl-card__title">
                                <h2 className="mdl-card__title-text">{this.state.message.title}</h2>
                            </div>
                            <div className="mdl-card__supporting-text">
                                {this.state.message.message}
                            </div>
                            <div className="buttons-container-right">
                                <button className="mdl-button mdl-js-button mdl-button--accent exit-from-application-button">
                                    sample action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        }
    });

    ReactDOM.render(<TimelineMessage />, document.getElementById("timeline-message"));
})();
