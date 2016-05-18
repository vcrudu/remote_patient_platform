/**
 * Created by Victor on 5/16/2016.
 */

(function () {

    "use strict";

    var Layout = ReactMDL.Layout;
    var Header = ReactMDL.Header;
    var HeaderRow = ReactMDL.HeaderRow;
    var HeaderTabs = ReactMDL.HeaderTabs;
    var Tab = ReactMDL.Tab;
    var Content = ReactMDL.Content;
    var Card = ReactMDL.Card;
    var CardTitle = ReactMDL.CardTitle;
    var CardText = ReactMDL.CardText;
    var CardMenu = ReactMDL.CardMenu;
    var IconButton = ReactMDL.IconButton;
    var Menu = ReactMDL.Menu;
    var MenuItem = ReactMDL.MenuItem;
    var ProgressBar = ReactMDL.ProgressBar;

    var DateCard = React.createClass({
        displayName: "DateCard",

        componentDidUpdate: function () {},
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

        componentDidUpdate: function () {},
        componentDidMount: function () {},
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function () {
            return React.createElement(
                Card,
                { className: "message-card-wide" },
                React.createElement(
                    CardTitle,
                    null,
                    React.createElement(
                        "h6",
                        { className: "mdl-card__title-text" },
                        this.props.title
                    )
                ),
                React.createElement(
                    CardText,
                    null,
                    this.props.message
                ),
                React.createElement(
                    CardMenu,
                    null,
                    React.createElement(IconButton, { name: "more_vert", id: "card-menu-lower-right-" + this.props.cardId }),
                    React.createElement(
                        Menu,
                        { target: "card-menu-lower-right-" + this.props.cardId, align: "right" },
                        React.createElement(
                            MenuItem,
                            { onClick: this.handleView },
                            "View"
                        ),
                        React.createElement(
                            MenuItem,
                            null,
                            "Delete"
                        )
                    )
                )
            );
        }
    });

    var AlarmCard = React.createClass({
        displayName: "AlarmCard",

        componentDidUpdate: function () {},
        componentDidMount: function () {},
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function () {
            return React.createElement(
                Card,
                { className: "message-card-wide" },
                React.createElement(
                    CardTitle,
                    null,
                    React.createElement(
                        "h6",
                        { className: "mdl-card__title-text" },
                        this.props.title
                    )
                ),
                React.createElement(
                    CardText,
                    null,
                    this.props.message
                ),
                React.createElement(
                    CardMenu,
                    null,
                    React.createElement(IconButton, { name: "more_vert", id: "card-menu-lower-right-" + this.props.cardId }),
                    React.createElement(
                        Menu,
                        { target: "card-menu-lower-right-" + this.props.cardId, align: "right" },
                        React.createElement(
                            MenuItem,
                            { onClick: this.handleView },
                            "View"
                        ),
                        React.createElement(
                            MenuItem,
                            null,
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
                activeTab: 0,
                cards: [],
                allCards: [],
                alarmCards: [],
                infoCards: [],
                readingsCards: []
            };
        },
        componentDidUpdate: function () {},
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

                component.setState({ cards: groupedAllCards, allCards: groupedAllCards, infoCards: groupedInfoCards, alarmCards: groupedAlarmCards });

                $(".mdl-progress").css('visibility', 'hidden');
            });
        },
        onChange: function (tabId) {
            if (tabId == 0) {
                this.setState({ activeTab: tabId, cards: this.state.allCards });
            } else if (tabId == 1) {
                this.setState({ activeTab: tabId, cards: this.state.infoCards });
            } else if (tabId == 2) {
                this.setState({ activeTab: tabId, cards: this.state.alarmCards });
            } else if (tabId == 3) {
                this.setState({ activeTab: tabId, cards: this.state.readingsCards });
            }
        },
        render: function () {
            var component = this;
            return React.createElement(
                Layout,
                { fixedHeader: true, fixedTabs: true },
                React.createElement(
                    Header,
                    null,
                    React.createElement(ProgressBar, { indeterminate: true, ref: "progressBar", id: "progressBar" }),
                    React.createElement(
                        HeaderTabs,
                        { activeTab: this.state.activeTab, onChange: this.onChange, ripple: true },
                        React.createElement(
                            Tab,
                            { href: "#tab1" },
                            "All"
                        ),
                        React.createElement(
                            Tab,
                            { href: "#tab2" },
                            "Info"
                        ),
                        React.createElement(
                            Tab,
                            { href: "#tab3" },
                            "Alarms"
                        ),
                        React.createElement(
                            Tab,
                            { href: "#tab4" },
                            "Readings"
                        )
                    )
                ),
                React.createElement(
                    Content,
                    null,
                    React.createElement(
                        "section",
                        { id: "tab1" },
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
                    React.createElement("section", { id: "tab2", className: "hide" }),
                    React.createElement("section", { id: "tab3", className: "hide" }),
                    React.createElement("section", { id: "tab4", className: "hide" })
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientTimeline, null), document.getElementById("patient-timeline-2"));
})();