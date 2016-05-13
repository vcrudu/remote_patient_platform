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

    var USER_TIMELINE_PROGRESS = React.createClass({
        displayName: "USER_TIMELINE_PROGRESS",

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

    var DateCard = React.createClass({
        displayName: "DateCard",

        render: function () {
            return React.createElement(
                "div",
                { className: "group-separator", cl: true },
                React.createElement(
                    "h2",
                    { className: "mdl-card__title-text" },
                    this.props.title
                )
            );
        }
    });

    var MessageCard = React.createClass({
        displayName: "MessageCard",

        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        componentDidMount: function () {
            componentHandler.upgradeDom();

            var viewButton = this.refs.viewButton;
            viewButton.addEventListener('click', this.handleView);
        },
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.cardId, 2);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "message-card-wide mdl-card mdl-shadow--2dp" },
                React.createElement(
                    "div",
                    { className: "mdl-card__title" },
                    React.createElement(
                        "h6",
                        { className: "mdl-card__title-text" },
                        this.props.title
                    )
                ),
                React.createElement(
                    "div",
                    { className: "mdl-card__supporting-text" },
                    this.props.message
                ),
                React.createElement(
                    "div",
                    { className: "mdl-card__menu" },
                    React.createElement(
                        "button",
                        { id: "card-menu-lower-right-" + this.props.cardId, className: "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" },
                        React.createElement(
                            "i",
                            { className: "material-icons" },
                            "more_vert"
                        )
                    ),
                    React.createElement(
                        "ul",
                        { className: "mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect", htmlFor: "card-menu-lower-right-" + this.props.cardId },
                        React.createElement(
                            "li",
                            { className: "mdl-menu__item", ref: "viewButton", onClick: this.handleView },
                            "View"
                        ),
                        React.createElement(
                            "li",
                            { className: "mdl-menu__item" },
                            "Delete"
                        )
                    )
                )
            );
        }
    });

    var PatientTimeline = React.createClass({
        displayName: "PatientTimeline",

        getInitialState: function () {
            return {
                cards: []
            };
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        formatCardDate: function (timeStamp) {
            return moment(timeStamp).format("dddd Do MMM");
        },
        componentDidMount: function () {
            var fakeCards = [{
                type: "Date",
                id: 1463130864000,
                title: this.formatCardDate(1463130864000),
                dateTime: 1463130864000
            }, {
                type: "Message",
                id: 2,
                title: "Card 1",
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...",
                dateTime: 1463130864000
            }, {
                type: "Message",
                id: 3,
                title: "Card 2",
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...",
                dateTime: 1463130864000
            },
            /* {
                 type: "Message",
                 id: 4,
                 title: "Card 3",
                 message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia..."
             },*/
            {
                type: "Date",
                id: 1463044464000,
                title: this.formatCardDate(1463044464000)
            }, {
                type: "Message",
                id: 6,
                title: "Card 4",
                message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...",
                dateTime: 1463044464000
            }];

            this.setState({ cards: fakeCards });

            indeterminateProgress.end();
        },
        render: function () {
            var component = this;
            return React.createElement(
                "div",
                { className: "mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs" },
                React.createElement(
                    "header",
                    { className: "mdl-layout__header" },
                    React.createElement(USER_TIMELINE_PROGRESS, null),
                    React.createElement(
                        "div",
                        { className: "mdl-layout__tab-bar mdl-js-ripple-effect" },
                        React.createElement(
                            "a",
                            { href: "#tab-all", className: "mdl-layout__tab is-active" },
                            "All"
                        ),
                        React.createElement(
                            "a",
                            { href: "#tab-info", className: "mdl-layout__tab" },
                            "Info"
                        ),
                        React.createElement(
                            "a",
                            { href: "#tab-alarms", className: "mdl-layout__tab" },
                            "Alarms"
                        ),
                        React.createElement(
                            "a",
                            { href: "#tab-readings", className: "mdl-layout__tab" },
                            "Readings"
                        )
                    )
                ),
                React.createElement(
                    "main",
                    { className: "mdl-layout__content" },
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "tab-all" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(
                                "div",
                                { className: "page-content-wrapper" },
                                component.state.cards.map(function (card) {
                                    switch (card.type) {
                                        case "Date":
                                            return React.createElement(DateCard, { key: card.id, title: card.title });
                                        case "Message":
                                            return React.createElement(MessageCard, { key: card.id, title: card.title, message: card.message, cardId: card.id });
                                    }
                                })
                            )
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "tab-info" },
                        React.createElement("div", { className: "page-content" })
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "tab-alarms" },
                        React.createElement("div", { className: "page-content" })
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "tab-readings" },
                        React.createElement("div", { className: "page-content" })
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientTimeline, null), document.getElementById("patient-timeline"));
})();