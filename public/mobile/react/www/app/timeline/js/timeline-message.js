/**
 * Created by Victor on 5/13/2016.
 */

(function () {
    "use strict";

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var TIMELINE_MESSAGE_PROGRESS = React.createClass({
        displayName: "TIMELINE_MESSAGE_PROGRESS",

        componentDidMount: function () {
            indeterminateProgress.start();
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        render: function () {
            return React.createElement("div", { className: "progress-bar-indeterminate" });
        }
    });

    var TimelineMessage = React.createClass({
        displayName: "TimelineMessage",

        getInitialState: function () {
            return {
                message: {}
            };
        },
        handleExitClick: function () {
            Bridge.Redirect.exitFromApplication();
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        componentDidMount: function () {
            var messageId = Bridge.Redirect.getQueryStringParam()["messageId"];
            var component = this;
            Bridge.Timeline.getById(messageId, function (result) {
                component.setState({ message: result.data });

                Bridge.Timeline.read(messageId, true, function (readResult) {
                    debugger;
                    indeterminateProgress.end();
                });
            });
        },
        render: function () {
            var component = this;
            return React.createElement(
                "main",
                { className: "mdl-layout__content" },
                React.createElement(TIMELINE_MESSAGE_PROGRESS, null),
                React.createElement(
                    "div",
                    { className: "page-content" },
                    React.createElement(
                        "div",
                        { className: "page-content-wrapper" },
                        React.createElement(
                            "div",
                            { className: "mdl-card mdl-shadow--2dp" },
                            React.createElement(
                                "div",
                                { className: "mdl-card__title" },
                                React.createElement(
                                    "h2",
                                    { className: "mdl-card__title-text" },
                                    this.state.message.title
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "mdl-card__supporting-text" },
                                this.state.message.content
                            ),
                            React.createElement(
                                "div",
                                { className: "buttons-container-right" },
                                React.createElement(
                                    "button",
                                    { className: "mdl-button mdl-js-button mdl-button--accent exit-from-application-button" },
                                    "sample action"
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(TimelineMessage, null), document.getElementById("timeline-message"));
})();