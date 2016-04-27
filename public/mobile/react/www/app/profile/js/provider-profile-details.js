/**
 * Created by Victor on 4/27/2016.
 */
(function () {
    "use strict";

    var UserGeneralInfo = React.createClass({
        displayName: "UserGeneralInfo",

        getInitialState: function () {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                user: undefined
            };
        },
        componentDidMount: function () {
            var userId = Bridge.Redirect.getQueryStringParam()["userId"];
            var component = this;

            Bridge.Provider.getPatientDetails(userId, function (result) {
                component.setState({
                    user: result.data
                });
            });
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "demo-list-action mdl-list" },
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "call"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.mobile : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "mobile"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "place"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.address.addressLine1 : "",
                            this.state.user ? ", " + this.state.user.address.town : "",
                            this.state.user ? ", " + this.state.user.address.county : "",
                            this.state.user ? ", " + this.state.user.address.country : "",
                            this.state.user ? ", " + this.state.user.address.postCode : ""
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "message"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.email : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "email"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "group"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.sex : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "sex"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "assignment"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.nhsNumber : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "nhs number"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" })
            );
        }
    });

    var ProviderPatientProfileDetails = React.createClass({
        displayName: "ProviderPatientProfileDetails",

        getInitialState: function () {
            return {
                appointmentTime: "",
                name: "",
                onlineStatus: ""
            };
        },
        socketCallback: function (message) {
            var event = message.data.event;
            var userId = message.data.user;

            if (event == "onlineStatus") {
                this.setState({ onlineStatus: message.data.status });
            }
        },
        componentDidMount: function () {
            var appointmentTime = Bridge.Redirect.getQueryStringParam()["appointmentTime"];
            var name = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["name"]);
            var onlineStatus = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["onlineStatus"]);
            this.setState({
                appointmentTime: appointmentTime,
                name: name,
                onlineStatus: onlineStatus
            });

            $(document).ready(function () {
                $('#patient-details-collapse').on('show.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').addClass('active');
                }).on('hide.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').removeClass('active');
                });
            });

            Bridge.Provider.socketCallBack = this.socketCallback;
        },
        formatDate: function (dateString) {
            var date = moment(dateString);
            return date.calendar();
        },
        handleCallClick: function () {
            var patientId = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["userId"]);
            var onlineStatus = this.state.onlineStatus; //decodeURIComponent(Bridge.Redirect.getQueryStringParam()["onlineStatus"]);
            if (this.props.onCall) {
                if (onlineStatus == "offline") {
                    return;
                }
                Bridge.Provider.callPatient(patientId, this.state.name, function (callResult) {});
            }
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "mdl-layout mdl-js-layout mdl-layout--fixed-header" },
                React.createElement(
                    "header",
                    { className: "mdl-layout__header" },
                    React.createElement(
                        "div",
                        { className: "primary-bg profile-image-container" },
                        React.createElement("img", { src: "images/user.png", width: "120", height: "120", className: "img-responsive center-block profile-user-photo" }),
                        React.createElement(
                            "div",
                            { className: "userName" },
                            React.createElement(
                                "h4",
                                null,
                                this.state.name ? this.state.name : name
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mdl-layout__tab-bar mdl-js-ripple-effect" },
                        React.createElement(
                            "a",
                            { href: "#user-info", className: "mdl-layout__tab is-active" },
                            "User Info"
                        ),
                        React.createElement(
                            "a",
                            { href: "#vital-signs", className: "mdl-layout__tab" },
                            "Vital Signs"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "call-fab-container" },
                        React.createElement(
                            "button",
                            { className: "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored", onclick: "" },
                            React.createElement(
                                "i",
                                { className: "material-icons" },
                                "call"
                            )
                        )
                    )
                ),
                React.createElement(
                    "main",
                    { className: "mdl-layout__content" },
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "user-info" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(UserGeneralInfo, null)
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "vital-signs" },
                        React.createElement("div", { className: "page-content" })
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderPatientProfileDetails, null), document.getElementById("provider-profile-details-container"));
})();