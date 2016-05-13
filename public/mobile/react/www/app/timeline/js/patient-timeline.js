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

        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        componentDidMount: function () {},
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

    var InfoCard = React.createClass({
        displayName: "InfoCard",

        componentDidUpdate: function () {
            componentHandler.upgradeDom();
            var viewButton = this.refs.viewButton;
            viewButton.addEventListener('click', this.handleView);
        },
        componentDidMount: function () {},
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
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

    var AlarmCard = React.createClass({
        displayName: "AlarmCard",

        componentDidUpdate: function () {
            componentHandler.upgradeDom();
            var viewButton = this.refs.viewButton;
            viewButton.addEventListener('click', this.handleView);
        },
        componentDidMount: function () {},
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
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
                cards: [],
                alarmCards: [],
                infoCards: []
            };
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        formatCardDate: function (timeStamp) {
            return moment(timeStamp).format("dddd Do MMM");
        },
        componentDidMount: function () {
            var component = this;
            Bridge.Timeline.getNotifications(function (result) {
                var allCards = _.sortBy(result.data, "dateTime").reverse();

                var groupedAllCards = [];
                if (allCards && allCards.length > 0) {
                    var cardDateTime = allCards[0].dateTime;
                    var momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                    var dateCard = {
                        id: cardDateTime,
                        title: component.formatCardDate(cardDateTime),
                        dateString: momentDateTimeString,
                        category: "date"
                    };

                    groupedAllCards.push(dateCard);

                    for (var i = 0; i < allCards.length; i++) {
                        cardDateTime = allCards[i].dateTime;
                        momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                        if (momentDateTimeString == dateCard.dateString) {
                            groupedAllCards.push(allCards[i]);
                        } else {
                            dateCard = {
                                id: cardDateTime,
                                title: component.formatCardDate(cardDateTime),
                                dateString: momentDateTimeString,
                                category: "date"
                            };

                            groupedAllCards.push(dateCard);
                            groupedAllCards.push(allCards[i]);
                        }
                    }
                }

                var infoCards = _.filter(allCards, function (card) {
                    return card.category == "info";
                });

                var groupedInfoCards = [];
                if (infoCards && infoCards.length > 0) {
                    var infoCardDateTime = infoCards[0].dateTime;
                    var momentInfoDateTimeString = moment(infoCardDateTime).format("YYYYMMDD");

                    var infoDateCard = {
                        id: infoCardDateTime,
                        title: component.formatCardDate(infoCardDateTime),
                        dateString: momentInfoDateTimeString,
                        category: "date"
                    };

                    groupedInfoCards.push(infoDateCard);

                    for (var i = 0; i < infoCards.length; i++) {
                        infoCardDateTime = infoCards[i].dateTime;
                        momentInfoDateTimeString = moment(infoCardDateTime).format("YYYYMMDD");

                        if (momentInfoDateTimeString == infoDateCard.dateString) {
                            groupedInfoCards.push(infoCards[i]);
                        } else {
                            infoDateCard = {
                                id: infoCardDateTime,
                                title: component.formatCardDate(infoCardDateTime),
                                dateString: momentInfoDateTimeString,
                                category: "date"
                            };

                            groupedInfoCards.push(infoDateCard);
                            groupedInfoCards.push(infoCards[i]);
                        }
                    }
                }

                var alarmCards = _.filter(allCards, function (card) {
                    return card.category == "alarm";
                });

                var groupedAlarmCards = [];
                if (alarmCards && alarmCards.length > 0) {
                    var alarmCardDateTime = alarmCards[0].dateTime;
                    var momentAlarmDateTimeString = moment(alarmCardDateTime).format("YYYYMMDD");

                    var alarmDateCard = {
                        id: alarmCardDateTime,
                        title: component.formatCardDate(alarmCardDateTime),
                        dateString: momentAlarmDateTimeString,
                        category: "date"
                    };

                    groupedAlarmCards.push(alarmDateCard);

                    for (var i = 0; i < alarmCards.length; i++) {
                        alarmCardDateTime = alarmCards[i].dateTime;
                        momentAlarmDateTimeString = moment(alarmCardDateTime).format("YYYYMMDD");

                        if (momentAlarmDateTimeString == alarmDateCard.dateString) {
                            groupedAlarmCards.push(alarmCards[i]);
                        } else {
                            alarmDateCard = {
                                id: alarmCardDateTime,
                                title: component.formatCardDate(alarmCardDateTime),
                                dateString: momentAlarmDateTimeString,
                                category: "date"
                            };

                            groupedAlarmCards.push(alarmDateCard);
                            groupedAlarmCards.push(alarmCards[i]);
                        }
                    }
                }
                indeterminateProgress.end();

                component.setState({ cards: groupedAllCards, infoCards: groupedInfoCards, alarmCards: groupedAlarmCards });
            });
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
                                    switch (card.category) {
                                        case "date":
                                            return React.createElement(DateCard, { key: card.id + "_date", title: card.title, cardId: card.id + "_date" });
                                        case "info":
                                            return React.createElement(InfoCard, { key: card.dateTime + "_all", serverId: card.dateTime, title: card.title, message: card.summary, cardId: card.dateTime + "_all" });
                                        case "alarm":
                                            return React.createElement(AlarmCard, { key: card.dateTime + "_all", serverId: card.dateTime, title: card.title, message: card.summary, cardId: card.dateTime + "_all" });
                                    }
                                })
                            )
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "tab-info" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(
                                "div",
                                { className: "page-content-wrapper" },
                                component.state.infoCards.map(function (card) {
                                    switch (card.category) {
                                        case "date":
                                            return React.createElement(DateCard, { key: card.id + "_date_info", title: card.title, cardId: card.id + "_date_info" });
                                        case "info":
                                            return React.createElement(InfoCard, { key: card.dateTime + "_info", serverId: card.dateTime, title: card.title, message: card.summary, cardId: card.dateTime + "_info" });
                                    }
                                })
                            )
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "tab-alarms" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(
                                "div",
                                { className: "page-content-wrapper" },
                                component.state.alarmCards.map(function (card) {
                                    switch (card.category) {
                                        case "date":
                                            return React.createElement(DateCard, { key: card.id + "_date_alarm", title: card.title, cardId: card.id + "_date_alarm" });
                                        case "alarm":
                                            return React.createElement(AlarmCard, { key: card.dateTime + "_alarm", serverId: card.dateTime, title: card.title, message: card.summary, cardId: card.dateTime + "_alarm" });
                                    }
                                })
                            )
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "tab-readings" },
                        React.createElement("div", { className: "page-content" })
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientTimeline, null), document.getElementById("patient-timeline"));
})();