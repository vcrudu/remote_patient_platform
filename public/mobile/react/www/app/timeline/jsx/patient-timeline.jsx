/**
 * Created by Victor on 5/16/2016.
 */

(function() {

    "use strict";

    var Layout = ReactMDL.Layout;
    var Header = ReactMDL.Header;
    var HeaderRow = ReactMDL.HeaderRow;
    var HeaderTabs = ReactMDL.HeaderTabs;
    var Tab = ReactMDL.Tab;
    var Content = ReactMDL.Content;
    var Card = ReactMDL.Card;
    var CardTitle  = ReactMDL.CardTitle;
    var CardText  = ReactMDL.CardText;
    var CardMenu   = ReactMDL.CardMenu;
    var IconButton   = ReactMDL.IconButton;
    var Menu = ReactMDL.Menu;
    var MenuItem = ReactMDL.MenuItem;
    var ProgressBar  = ReactMDL.ProgressBar;

    var DateCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        render: function() {
            return <div className="group-separator" cl><h2 className="mdl-card__title-text">{this.props.title}</h2></div>;
        }
    });

    var InfoCard = React.createClass({
        componentDidUpdate: function() {

        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <Card className="message-card-wide mdl-shadow--2dp">
                <CardText onClick={this.handleView}>
                    <div className="notification-title-wrapper">
                        <div className="notification-icon">
                            <i className="material-icons mdl-list__item-avatar">info_outline</i>
                        </div>
                        <div className="notification-title-summary">
                            <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                                {this.props.title}
                            </div>
                            <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                                {this.props.summary}
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div ref="cardMessage" className="notification-message">
                        {this.props.message}
                    </div>
                </CardText>
                <CardMenu>
                    <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>{this.props.time}</div>
                </CardMenu>
            </Card>
        }
    });

    var AlarmCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <Card className="message-card-wide mdl-shadow--2dp">
                <CardText onClick={this.handleView}>
                    <div className="notification-title-wrapper">
                        <div className="notification-icon">
                            <i className="material-icons mdl-list__item-avatar">alarm</i>
                        </div>
                        <div className="notification-title-summary">
                            <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                                {this.props.title}
                            </div>
                            <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                                {this.props.summary}
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div ref="cardMessage" className="notification-message">
                        {this.props.message}
                    </div>
                </CardText>
                <CardMenu>
                    <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>{this.props.time}</div>
                </CardMenu>
            </Card>
        }
    });

    var ReadingCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
            var cardMessage = this.refs.cardMessage;
            $(cardMessage).dotdotdot({});

            var cardSummary = this.refs.cardSummary;
            $(cardSummary).dotdotdot({});
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <Card className="message-card-wide mdl-shadow--2dp">
                <CardText onClick={this.handleView}>
                    <div className="notification-title-wrapper">
                        <div className="notification-icon">
                            <i className="material-icons mdl-list__item-avatar">timeline</i>
                        </div>
                        <div className="notification-title-summary">
                            <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                                {this.props.title}
                            </div>
                            <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                                {this.props.summary}
                            </div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div ref="cardMessage" className="notification-message">
                        {this.props.message}
                    </div>
                </CardText>
                <CardMenu>
                    <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>{this.props.time}</div>
                </CardMenu>
            </Card>
        }
    });

    var PatientTimeline = React.createClass({
        getInitialState: function() {
            return {
                activeTab: 0,
                cards: [],
                allCards: [],
                alarmCards: [],
                infoCards: [],
                readingsCards: []
            }
        },
        componentDidUpdate: function() {
        },
        formatCardDate: function(timeStamp) {
            return moment(timeStamp).format("dddd Do MMM");
        },
        groupCards: function(cards, filteredCards) {
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

                for(var i = 0; i< filteredCards.length; i++) {
                    cardDateTime = filteredCards[i].dateTime;
                    momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                    filteredCards[i].timeString = moment(filteredCards[i].dateTime).format("HH:mm");

                    if (momentDateTimeString == dateCard.dateString) {
                        cards.push(filteredCards[i]);
                    }
                    else {
                        dateCard = {
                            id: cardDateTime,
                            title: this.formatCardDate(cardDateTime),
                            dateString: momentDateTimeString,
                            category: "date",
                        };

                        cards.push(dateCard);
                        cards.push(filteredCards[i]);
                    }
                }
            }
        },
        insertCard:function(cardCollection, notification) {
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
        notificationCallback:function(data) {
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
        componentDidMount: function() {
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
        onChange: function(tabId) {
            if (tabId == 0) {
                this.setState({ activeTab: tabId, cards: this.state.allCards });
            }
            else if (tabId == 1) {
                this.setState({ activeTab: tabId, cards: this.state.infoCards });
            }
            else if (tabId == 2) {
                this.setState({ activeTab: tabId, cards: this.state.alarmCards });
            }
            else if (tabId == 3) {
                this.setState({ activeTab: tabId, cards: this.state.readingsCards });
            }
        },
        render : function() {
            var component = this;
            return  <Layout fixedHeader fixedTabs>
                <Header>
                    <ProgressBar indeterminate ref="progressBar" id="progressBar"/>
                    <HeaderTabs activeTab={this.state.activeTab} onChange={this.onChange} ripple>
                        <Tab href="#tab1">All</Tab>
                        <Tab href="#tab2">Info</Tab>
                        <Tab href="#tab3">Alarms</Tab>
                        <Tab href="#tab4">Readings</Tab>
                    </HeaderTabs>
                </Header>
                <Content>
                    <section id="tab1">
                        <div className="page-content">
                            <div className="page-content-wrapper">
                                {
                                    component.state.cards.map(function (card) {
                                        switch (card.category) {
                                            case "date":
                                                return <DateCard key={card.id + "_date"} title={card.title} cardId={card.id + "_date"}/>
                                            case "info":
                                                return <InfoCard key={card.dateTime + "_all"} serverId={card.dateTime} time={card.timeString} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read}/>
                                            case "alarm":
                                                return <AlarmCard key={card.dateTime + "_all"} serverId={card.dateTime} time={card.timeString} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read}/>
                                            case "reading":
                                                return <ReadingCard key={card.dateTime + "_all"} serverId={card.dateTime} time={card.timeString} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read}/>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    <section id="tab2" className="hide"></section>
                    <section id="tab3" className="hide"></section>
                    <section id="tab4" className="hide"></section>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<PatientTimeline />, document.getElementById("patient-timeline-2"));
})();
