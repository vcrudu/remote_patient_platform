/**
 * Created by Victor on 4/27/2016.
 */
(function() {
    "use strict";

    var UserGeneralInfo = React.createClass({
        getInitialState: function() {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                user: undefined
            }
        },
        componentDidMount: function() {
            var userId = Bridge.Redirect.getQueryStringParam()["userId"];
            var component = this;

            Bridge.Provider.getPatientDetails(userId, function(result) {
                component.setState({
                    user: result.data
                });
            });
        },
        render: function() {
            return <div className="demo-list-action mdl-list">
                <div className="mdl-list__item mdl-list__item--two-line">
                    <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">call</i>
                        <span>{this.state.user ? this.state.user.mobile : ""}</span>
                        <span className="mdl-list__item-sub-title">mobile</span>
                    </span>
                </div>
                <div className="divider"></div>
                <div className="clear"></div>
                <div className="mdl-list__item mdl-list__item--two-line">
                    <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">place</i>
                        <span>
                            {this.state.user ? this.state.user.address.addressLine1 : ""}
                            {this.state.user ? ", " + this.state.user.address.town : ""}
                            {this.state.user ? ", " + this.state.user.address.county : ""}
                            {this.state.user ? ", " + this.state.user.address.country : ""}
                            {this.state.user ? ", " + this.state.user.address.postCode : ""}
                        </span>
                    </span>
                </div>
                <div className="divider"></div>
                <div className="clear"></div>
                <div className="mdl-list__item mdl-list__item--two-line">
                    <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">message</i>
                        <span>{this.state.user ? this.state.user.email : ""}</span>
                        <span className="mdl-list__item-sub-title">email</span>
                    </span>
                </div>
                <div className="divider"></div>
                <div className="clear"></div>
                <div className="mdl-list__item mdl-list__item--two-line">
                    <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">group</i>
                        <span>{this.state.user ? this.state.user.sex : ""}</span>
                        <span className="mdl-list__item-sub-title">sex</span>
                    </span>
                </div>
                <div className="divider"></div>
                <div className="clear"></div>
                <div className="mdl-list__item mdl-list__item--two-line">
                    <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">assignment</i>
                        <span>{this.state.user ? this.state.user.nhsNumber : ""}</span>
                        <span className="mdl-list__item-sub-title">nhs number</span>
                    </span>
                </div>
                <div className="divider"></div>
                <div className="clear"></div>
            </div>
        }
    });

    var ProviderPatientProfileDetails = React.createClass({
        getInitialState: function() {
            return {
                appointmentTime: "",
                name: "",
                onlineStatus: ""
            }
        },
        socketCallback: function(message) {
            var event = message.data.event;
            var userId = message.data.user;

            if (event == "onlineStatus") {
                this.setState({onlineStatus: message.data.status});
            }
        },
        componentDidMount: function() {
            var appointmentTime = Bridge.Redirect.getQueryStringParam()["appointmentTime"];
            var name = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["name"]);
            var onlineStatus = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["onlineStatus"]);
            this.setState({
                appointmentTime: appointmentTime,
                name: name,
                onlineStatus: onlineStatus
            });

            $(document).ready(function() {
                $('#patient-details-collapse')
                    .on('show.bs.collapse', function(a) {
                        $(a.target).prev('.panel-heading').addClass('active');
                    })
                    .on('hide.bs.collapse', function(a) {
                        $(a.target).prev('.panel-heading').removeClass('active');
                    });
            });

            Bridge.Provider.socketCallBack = this.socketCallback;
        },
        formatDate: function(dateString) {
            var date = moment(dateString);
            return date.calendar();
        },
        handleCallClick: function() {
            var patientId = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["userId"]);
            var onlineStatus = this.state.onlineStatus; //decodeURIComponent(Bridge.Redirect.getQueryStringParam()["onlineStatus"]);
            if (this.props.onCall) {
                if (onlineStatus == "offline") {
                    return;
                }
                Bridge.Provider.callPatient(patientId, this.state.name, function(callResult) {});
            }
        },
        render: function() {
            return <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="primary-bg profile-image-container">
                        <img src="images/user.png" width="120" height="120" className="img-responsive center-block profile-user-photo"/>
                        <div className="userName"><h4>{this.state.name ? this.state.name : name}</h4></div>
                    </div>
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                        <a href="#user-info" className="mdl-layout__tab is-active">User Info</a>
                        <a href="#vital-signs" className="mdl-layout__tab">Vital Signs</a>
                    </div>
                    <div className="call-fab-container">
                        <button className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onclick="">
                            <i className="material-icons">call</i>
                        </button>
                    </div>
                </header>
                <main className="mdl-layout__content">
                    <section className="mdl-layout__tab-panel is-active" id="user-info">
                        <div className="page-content">
                            <UserGeneralInfo />
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="vital-signs">
                        <div className="page-content">

                        </div>
                    </section>
                </main>
            </div>
        }
    });

    ReactDOM.render(<ProviderPatientProfileDetails />, document.getElementById("provider-profile-details-container"));
})();