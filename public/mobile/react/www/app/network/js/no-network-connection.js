/**
 * Created by Victor on 4/29/2016.
 */

(function () {
    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var Card = ReactMDL.Card;
    var CardTitle = ReactMDL.CardTitle;
    var CardText = ReactMDL.CardText;
    var CardMenu = ReactMDL.CardMenu;
    var CardActions = ReactMDL.CardActions;
    var Button = ReactMDL.Button;

    var NoNetworkConnection = React.createClass({
        displayName: "NoNetworkConnection",

        handleExitClick: function () {
            Bridge.Redirect.exitFromApplication();
        },
        render: function () {
            var component = this;
            return React.createElement(
                Layout,
                null,
                React.createElement(
                    Content,
                    null,
                    React.createElement(
                        "div",
                        { className: "page-content-wrapper" },
                        React.createElement(
                            Card,
                            { className: "message-card-wide" },
                            React.createElement(
                                CardTitle,
                                null,
                                React.createElement(
                                    "h6",
                                    { className: "mdl-card__title-text" },
                                    "No Internet Connection"
                                )
                            ),
                            React.createElement(
                                CardText,
                                null,
                                "Sorry, no Internet connectivity detected. Please reconnect."
                            ),
                            React.createElement(
                                CardMenu,
                                null,
                                React.createElement(
                                    CardActions,
                                    null,
                                    React.createElement(
                                        Button,
                                        { onClick: this.handleExitClick, className: "mdl-button--accent exit-from-application-button", colored: true },
                                        "EXIT FROM APPLICATION"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(NoNetworkConnection, null), document.getElementById("no-internet-connection"));
})();