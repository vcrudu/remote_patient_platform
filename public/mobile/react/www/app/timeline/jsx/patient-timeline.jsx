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
                <CardText>
                    <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                        {this.props.title}
                    </div>
                    <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                        {this.props.summary}
                    </div>
                    <div ref="cardMessage" className="notification-message">
                        {this.props.message}
                    </div>
                </CardText>
                <CardMenu>
                    <IconButton name="more_vert" id={"card-menu-lower-right-" + this.props.cardId}/>
                    <Menu target={"card-menu-lower-right-" + this.props.cardId} align="right">
                        <MenuItem onClick={this.handleView}>View</MenuItem>
                        <MenuItem>Delete</MenuItem>
                    </Menu>
                </CardMenu>
            </Card>
        }
    });

    var AlarmCard = React.createClass({
        componentDidUpdate: function() {
        },
        componentDidMount: function() {
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <Card className="message-card-wide">
                <CardText>
                    <div className={this.props.isNew ? "notification-title unread" : "notification-title read"}>
                        {this.props.title}
                    </div>
                    <div ref="cardSummary" className={this.props.isNew ? "notification-summary unread" : "notification-summary read"}>
                        {this.props.summary}
                    </div>
                    <div ref="cardMessage" className="notification-message">
                        {this.props.message}
                    </div>
                </CardText>
                <CardMenu>
                    <IconButton name="more_vert" id={"card-menu-lower-right-" + this.props.cardId}/>
                    <Menu target={"card-menu-lower-right-" + this.props.cardId} align="right">
                        <MenuItem onClick={this.handleView}>View</MenuItem>
                        <MenuItem>Delete</MenuItem>
                    </Menu>
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
        componentDidMount: function() {
            var component = this;
            Bridge.Timeline.getNotifications(function(result) {
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

                    for(var i = 0; i< allCards.length; i++) {
                        cardDateTime = allCards[i].dateTime;
                        momentDateTimeString = moment(cardDateTime).format("YYYYMMDD");

                        if (momentDateTimeString == dateCard.dateString) {
                            groupedAllCards.push(allCards[i]);
                        }
                        else {
                            dateCard = {
                                id: cardDateTime,
                                title: component.formatCardDate(cardDateTime),
                                dateString: momentDateTimeString,
                                category: "date",
                            };

                            groupedAllCards.push(dateCard);
                            groupedAllCards.push(allCards[i]);
                        }
                    }
                }

                var infoCards = _.filter(allCards, function(card){
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

                    for(var i = 0; i< infoCards.length; i++) {
                        infoCardDateTime = infoCards[i].dateTime;
                        momentInfoDateTimeString = moment(infoCardDateTime).format("YYYYMMDD");

                        if (momentInfoDateTimeString == infoDateCard.dateString) {
                            groupedInfoCards.push(infoCards[i]);
                        }
                        else {
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

                var alarmCards = _.filter(allCards, function(card){
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

                    for(var i = 0; i< alarmCards.length; i++) {
                        alarmCardDateTime = alarmCards[i].dateTime;
                        momentAlarmDateTimeString = moment(alarmCardDateTime).format("YYYYMMDD");

                        if (momentAlarmDateTimeString == alarmDateCard.dateString) {
                            groupedAlarmCards.push(alarmCards[i]);
                        }
                        else {
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

                component.setState({cards: groupedAllCards, allCards: groupedAllCards, infoCards: groupedInfoCards, alarmCards: groupedAlarmCards});

                $(".mdl-progress").css('visibility', 'hidden');
            });
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
                                                return <InfoCard key={card.dateTime + "_all"} serverId={card.dateTime} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read}/>
                                            case "alarm":
                                                return <AlarmCard key={card.dateTime + "_all"} serverId={card.dateTime} title={card.title} message={card.content} summary={card.summary} cardId={card.dateTime + "_all"} isNew={!card.read}/>
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
