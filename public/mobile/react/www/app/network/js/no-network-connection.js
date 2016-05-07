/**
 * Created by Victor on 4/29/2016.
 */

(function () {
    "use strict";

    var NoNetworkConnection = React.createClass({
        displayName: "NoNetworkConnection",

        handleExitClick: function () {
            Bridge.Redirect.exitFromApplication();
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();

            var button = this.refs.btnExitFromApplication;
            button.addEventListener('click', this.handleExitClick);
        },
        render: function () {
            var component = this;
            return React.createElement(
                "main",
                { className: "mdl-layout__content" },
                React.createElement(
                    "div",
                    { className: "page-content" },
                    React.createElement(
                        "div",
                        { className: "mdl-card mdl-shadow--2dp" },
                        React.createElement(
                            "div",
                            { className: "mdl-card__title" },
                            React.createElement(
                                "h2",
                                { className: "mdl-card__title-text" },
                                "No Internet Connection"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "mdl-card__supporting-text" },
                            "Sorry, no Internet connectivity detected. Please reconnect."
                        ),
                        React.createElement(
                            "div",
                            { className: "buttons-container-right" },
                            React.createElement(
                                "button",
                                { onClick: this.handleExitClick, ref: "btnExitFromApplication", className: "mdl-button mdl-js-button mdl-button--accent exit-from-application-button" },
                                "EXIT FROM APPLICATION"
                            )
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(NoNetworkConnection, null), document.getElementById("no-internet-connection"));
})();