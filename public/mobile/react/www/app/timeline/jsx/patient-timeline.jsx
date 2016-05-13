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

    var USER_TIMELINE_PROGRESS = React.createClass({
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

    var DateCard = React.createClass({
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        componentDidMount: function() {
        },
        render: function() {
            return <div className="group-separator" cl><h2 className="mdl-card__title-text">{this.props.title}</h2></div>;
        }
    });

    var InfoCard = React.createClass({
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
            var viewButton = this.refs.viewButton;
            viewButton.addEventListener('click', this.handleView);
        },
        componentDidMount: function() {

        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <div className="message-card-wide mdl-card mdl-shadow--2dp">
                <div className="mdl-card__title">
                    <h6 className="mdl-card__title-text">{this.props.title}</h6>
                </div>
                <div className="mdl-card__supporting-text">
                    {this.props.message}
                </div>
                <div className="mdl-card__menu">
                    <button id={"card-menu-lower-right-" + this.props.cardId} className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                        <i className="material-icons">more_vert</i>
                    </button>
                    <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor={"card-menu-lower-right-" + this.props.cardId}>
                        <li className="mdl-menu__item" ref="viewButton" onClick={this.handleView}>View</li>
                        <li className="mdl-menu__item">Delete</li>
                    </ul>
                </div>
            </div>
        }
    });

    var AlarmCard = React.createClass({
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
            var viewButton = this.refs.viewButton;
            viewButton.addEventListener('click', this.handleView);
        },
        componentDidMount: function() {
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.serverId, 2);
        },
        render: function() {
            return <div className="message-card-wide mdl-card mdl-shadow--2dp">
                <div className="mdl-card__title">
                    <h6 className="mdl-card__title-text">{this.props.title}</h6>
                </div>
                <div className="mdl-card__supporting-text">
                    {this.props.message}
                </div>
                <div className="mdl-card__menu">
                    <button id={"card-menu-lower-right-" + this.props.cardId} className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                        <i className="material-icons">more_vert</i>
                    </button>
                    <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor={"card-menu-lower-right-" + this.props.cardId}>
                        <li className="mdl-menu__item" ref="viewButton" onClick={this.handleView}>View</li>
                        <li className="mdl-menu__item">Delete</li>
                    </ul>
                </div>
            </div>
        }
    });

    var PatientTimeline = React.createClass({
        getInitialState: function(){
            return {
                cards: [],
                alarmCards: [],
                infoCards: []
            }
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
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
                indeterminateProgress.end();

                component.setState({cards: groupedAllCards, infoCards: groupedInfoCards, alarmCards: groupedAlarmCards});
            });
        },
        render : function() {
            var component = this;
            return <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">
                <header className="mdl-layout__header">
                    <USER_TIMELINE_PROGRESS />
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                        <a href="#tab-all" className="mdl-layout__tab is-active">All</a>
                        <a href="#tab-info" className="mdl-layout__tab">Info</a>
                        <a href="#tab-alarms" className="mdl-layout__tab">Alarms</a>
                        <a href="#tab-readings" className="mdl-layout__tab">Readings</a>
                    </div>
                </header>
                <main className="mdl-layout__content">
                    <section className="mdl-layout__tab-panel is-active" id="tab-all">
                        <div className="page-content">
                            <div className="page-content-wrapper">
                                {
                                    component.state.cards.map(function (card) {
                                        switch (card.category) {
                                            case "date":
                                                return <DateCard key={card.id + "_date"} title={card.title} cardId={card.id + "_date"}/>
                                            case "info":
                                                return <InfoCard key={card.dateTime + "_all"} serverId={card.dateTime} title={card.title} message={card.summary} cardId={card.dateTime + "_all"}/>
                                            case "alarm":
                                                return <AlarmCard key={card.dateTime + "_all"} serverId={card.dateTime} title={card.title} message={card.summary} cardId={card.dateTime + "_all"}/>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="tab-info">
                        <div className="page-content">
                            <div className="page-content-wrapper">
                                {
                                    component.state.infoCards.map(function (card) {
                                        switch (card.category) {
                                            case "date":
                                                return <DateCard key={card.id + "_date_info"} title={card.title} cardId={card.id + "_date_info"}/>
                                            case "info":
                                                return <InfoCard key={card.dateTime + "_info"} serverId={card.dateTime} title={card.title} message={card.summary} cardId={card.dateTime + "_info"}/>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="tab-alarms">
                        <div className="page-content">
                            <div className="page-content-wrapper">
                                {
                                    component.state.alarmCards.map(function (card) {
                                        switch (card.category) {
                                            case "date":
                                                return <DateCard key={card.id + "_date_alarm"} title={card.title} cardId={card.id + "_date_alarm"}/>
                                            case "alarm":
                                                return <AlarmCard key={card.dateTime + "_alarm"} serverId={card.dateTime} title={card.title} message={card.summary} cardId={card.dateTime + "_alarm"}/>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="tab-readings">
                        <div className="page-content">
                        </div>
                    </section>
                </main>
            </div>;
        }
    });

    ReactDOM.render(<PatientTimeline />, document.getElementById("patient-timeline"));
})();