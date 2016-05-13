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
        render: function() {
            return <div className="group-separator" cl><h2 className="mdl-card__title-text">{this.props.title}</h2></div>;
        }
    });

    var MessageCard = React.createClass({
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        componentDidMount: function() {
            componentHandler.upgradeDom();

            var viewButton = this.refs.viewButton;
            viewButton.addEventListener('click', this.handleView);
        },
        handleView: function() {
            Bridge.Redirect.redirectToWithLevelsUp("timeline/timeline-message.html?messageId=" + this.props.cardId, 2);
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
            }
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        formatCardDate: function(timeStamp) {
            return moment(timeStamp).format("dddd Do MMM");
        },
        componentDidMount: function() {
            var fakeCards = [
                {
                    type: "Date",
                    id: 1463130864000,
                    title: this.formatCardDate(1463130864000),
                    dateTime: 1463130864000
                },
                {
                    type: "Message",
                    id: 2,
                    title: "Card 1",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...",
                    dateTime: 1463130864000
                },
                {
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
                    title: this.formatCardDate(1463044464000),
                },
                {
                    type: "Message",
                    id: 6,
                    title: "Card 4",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...",
                    dateTime: 1463044464000
                },
            ];

            this.setState({cards: fakeCards});

            indeterminateProgress.end();
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
                                        switch (card.type) {
                                            case "Date":
                                                return <DateCard key={card.id} title={card.title} />
                                            case "Message":
                                                return <MessageCard key={card.id} title={card.title} message={card.message} cardId={card.id}/>
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel is-active" id="tab-info">
                        <div className="page-content">
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel is-active" id="tab-alarms">
                        <div className="page-content">
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel is-active" id="tab-readings">
                        <div className="page-content">
                        </div>
                    </section>
                </main>
            </div>;
        }
    });

    ReactDOM.render(<PatientTimeline />, document.getElementById("patient-timeline"));
})();