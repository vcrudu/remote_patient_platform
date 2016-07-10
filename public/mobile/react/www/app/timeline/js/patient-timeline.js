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
        componentDidMount: function () {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
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
        componentDidMount: function () {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function () {
            return React.createElement(
                Card,
                { className: "message-card-wide mdl-shadow--2dp" },
                React.createElement(
                    CardText,
                    { onClick: this.handleView },
                    React.createElement(
                        "div",
                        { className: "notification-title-wrapper" },
                        React.createElement(
                            "div",
                            { className: "notification-icon" },
                            React.createElement(
                                "i",
                                { className: "material-icons mdl-list__item-avatar" },
                                "info_outline"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "notification-title-summary" },
                            React.createElement(
                                "div",
                                { className: this.props.isNew ? "notification-title unread" : "notification-title read" },
                                this.props.title
                            ),
                            React.createElement(
                                "div",
                                { ref: "cardSummary", className: this.props.isNew ? "notification-summary unread" : "notification-summary read" },
                                this.props.summary
                            )
                        )
                    ),
                    React.createElement("div", { className: "clear" }),
                    React.createElement(
                        "div",
                        { ref: "cardMessage", className: "notification-message" },
                        this.props.message
                    )
                ),
                React.createElement(
                    CardMenu,
                    null,
                    React.createElement(
                        "div",
                        { className: this.props.isNew ? "notification-title unread" : "notification-title read" },
                        this.props.time
                    )
                )
            );
        }
    });

    var AlarmCard = React.createClass({
        displayName: "AlarmCard",

        componentDidUpdate: function () {},
        componentDidMount: function () {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function () {
            return React.createElement(
                Card,
                { className: "message-card-wide mdl-shadow--2dp" },
                React.createElement(
                    CardText,
                    { onClick: this.handleView },
                    React.createElement(
                        "div",
                        { className: "notification-title-wrapper" },
                        React.createElement(
                            "div",
                            { className: "notification-icon" },
                            React.createElement(
                                "i",
                                { className: "material-icons mdl-list__item-avatar" },
                                "alarm"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "notification-title-summary" },
                            React.createElement(
                                "div",
                                { className: this.props.isNew ? "notification-title unread" : "notification-title read" },
                                this.props.title
                            ),
                            React.createElement(
                                "div",
                                { ref: "cardSummary", className: this.props.isNew ? "notification-summary unread" : "notification-summary read" },
                                this.props.summary
                            )
                        )
                    ),
                    React.createElement("div", { className: "clear" }),
                    React.createElement(
                        "div",
                        { ref: "cardMessage", className: "notification-message" },
                        this.props.message
                    )
                ),
                React.createElement(
                    CardMenu,
                    null,
                    React.createElement(
                        "div",
                        { className: this.props.isNew ? "notification-title unread" : "notification-title read" },
                        this.props.time
                    )
                )
            );
        }
    });

    var ReadingCard = React.createClass({
        displayName: "ReadingCard",

        componentDidUpdate: function () {},
        componentDidMount: function () {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        handleView: function () {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function () {
            return React.createElement(
                Card,
                { className: "message-card-wide mdl-shadow--2dp" },
                React.createElement(
                    CardText,
                    { onClick: this.handleView },
                    React.createElement(
                        "div",
                        { className: "notification-title-wrapper" },
                        React.createElement(
                            "div",
                            { className: "notification-icon" },
                            React.createElement(
                                "i",
                                { className: "material-icons mdl-list__item-avatar" },
                                "timeline"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "notification-title-summary" },
                            React.createElement(
                                "div",
                                { className: this.props.isNew ? "notification-title unread" : "notification-title read" },
                                this.props.title
                            ),
                            React.createElement(
                                "div",
                                { ref: "cardSummary", className: this.props.isNew ? "notification-summary unread" : "notification-summary read" },
                                this.props.summary
                            )
                        )
                    ),
                    React.createElement("div", { className: "clear" }),
                    React.createElement(
                        "div",
                        { ref: "cardMessage", className: "notification-message" },
                        this.props.message
                    )
                ),
                React.createElement(
                    CardMenu,
                    null,
                    React.createElement(
                        "div",
                        { className: this.props.isNew ? "notification-title unread" : "notification-title read" },
                        this.props.time
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
        groupCards: function (cards, filteredCards) {
            if (filteredCards && filteredCards.length > 0) {
                var cardDateTime = filteredCards[0].dateTime;
                var momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                var dateCard = {
                    id: cardDateTime,
                    title: this.formatCardDate(cardDateTime),
                    dateString: momentDateTimeString,
                    category: "date"
                };

                cards.push(dateCard);

                for (var i = 0; i < filteredCards.length; i++) {
                    cardDateTime = filteredCards[i].dateTime;
                    momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                    filteredCards[i].timeString = moment(filteredCards[i].dateTime).format("HH:mm");

                    if (momentDateTimeString == dateCard.dateString) {
                        cards.push(filteredCards[i]);
                    } else {
                        dateCard = {
                            id: cardDateTime,
                            title: this.formatCardDate(cardDateTime),
                            dateString: momentDateTimeString,
                            category: "date"
                        };

                        cards.push(dateCard);
                        cards.push(filteredCards[i]);
                    }
                }
            }
        },
        insertCard: function (cardCollection, notification) {
            if (cardCollection.length === 0) {
                cardCollection.push(notification);
            } else {
                var firstCard = cardCollection[0];
                if (firstCard.dateString && moment(firstCard.dateString) < moment(notification.dateTime)) {
                    cardCollection.splice(0, 0, notification);
                } else {
                    cardCollection.splice(1, 0, notification);
                }
            }
        },
        notificationCallback: function (data) {
            var component = this;
            var notification = data.notification;
            component.setState(function (previousState) {
                notification.timeString = moment(notification.dateTime).format("HH:mm");
                this.insertCard(previousState.cards, notification);
                this.insertCard(previousState.allCards, notification);
                switch (notification.category) {
                    case "info":
                        this.insertCard(previousState.infoCards, notification);
                        break;
                    case "alarm":
                        this.insertCard(previousState.alarmCards, notification);
                        break;
                    case "reading":
                        this.insertCard(previousState.readingsCards, notification);
                        break;
                }

                return previousState;
            });
        },
        componentDidMount: function () {
            var component = this;
            Bridge.notificationCallback = this.notificationCallback;

            Bridge.Timeline.getNotifications(function (result) {
                var allCards = _.sortBy(result.data, "dateTime").reverse();
                var groupedAllCards = [];
                component.groupCards(groupedAllCards, allCards);

                var infoCards = _.filter(allCards, function (card) {
                    return card.category == "info";
                });
                var groupedInfoCards = [];
                component.groupCards(groupedInfoCards, infoCards);

                var alarmCards = _.filter(allCards, function (card) {
                    return card.category == "alarm";
                });
                var groupedAlarmCards = [];
                component.groupCards(groupedAlarmCards, alarmCards);

                var readingsCards = _.filter(allCards, function (card) {
                    return card.category == "reading";
                });
                var groupedReadingsCards = [];
                component.groupCards(groupedReadingsCards, readingsCards);

                component.setState({
                    cards: groupedAllCards,
                    allCards: groupedAllCards,
                    infoCards: groupedInfoCards,
                    alarmCards: groupedAlarmCards,
                    readingsCards: groupedReadingsCards
                });

                $(".mdl-progress").css('visibility', 'hidden');
            });
        },
        componentWillUnmount: function () {
            Bridge.notificationCallback = undefined;
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
                                            return React.createElement(InfoCard, { key: card.dateTime + "_all", serverId: card.dateTime, time: card.timeString, title: card.title, message: card.content, summary: card.summary, cardId: card.dateTime + "_all", isNew: !card.read });
                                        case "alarm":
                                            return React.createElement(AlarmCard, { key: card.dateTime + "_all", serverId: card.dateTime, time: card.timeString, title: card.title, message: card.content, summary: card.summary, cardId: card.dateTime + "_all", isNew: !card.read });
                                        case "reading":
                                            return React.createElement(ReadingCard, { key: card.dateTime + "_all", serverId: card.dateTime, time: card.timeString, title: card.title, message: card.content, summary: card.summary, cardId: card.dateTime + "_all", isNew: !card.read });
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