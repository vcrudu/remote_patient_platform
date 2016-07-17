/**
 * Created by Victor on 5/31/2016.
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
    var List = ReactMDL.List;
    var ListItem = ReactMDL.ListItem;
    var ListItemContent = ReactMDL.ListItemContent;

    var AppointmentInfo = React.createClass({
        displayName: "AppointmentInfo",

        getInitialState: function () {
            return {
                appointmentTime: this.props.model ? this.props.model.slotDateTime : "",
                reasonText: this.props.model ? this.props.model.appointmentReason : ""
            };
        },
        render: function () {
            return React.createElement(
                List,
                null,
                React.createElement(
                    ListItem,
                    { twoLine: true },
                    React.createElement(
                        ListItemContent,
                        { avatar: "alarm", subtitle: "time" },
                        this.state.appointmentTime
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    ListItem,
                    { twoLine: true },
                    React.createElement(
                        ListItemContent,
                        { avatar: "message", subtitle: "reason" },
                        this.state.reasonText
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" })
            );
        }
    });

    var ProviderInfo = React.createClass({
        displayName: "ProviderInfo",

        render: function () {
            return React.createElement(
                List,
                null,
                React.createElement(
                    ListItem,
                    { twoLine: true },
                    React.createElement(
                        ListItemContent,
                        { avatar: "person", subtitle: "name" },
                        this.props.model ? this.props.model.title + " " + this.props.model.name + " " + this.props.model.surname : ""
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    ListItem,
                    { twoLine: true },
                    React.createElement(
                        ListItemContent,
                        { avatar: "message", subtitle: "email" },
                        this.props.model ? this.props.model.email : ""
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    ListItem,
                    { twoLine: true },
                    React.createElement(
                        ListItemContent,
                        { avatar: "place" },
                        this.props.model && this.props.model.address.addressLine1 ? this.props.model.address.addressLine1 : "",
                        this.props.model && this.props.model.address.town ? ", " + this.props.model.address.town : "",
                        this.props.model && this.props.model.address.county ? ", " + this.props.model.address.county : "",
                        this.props.model && this.props.model.address.country ? ", " + this.props.model.address.country : "",
                        this.props.model && this.props.model.address.postCode ? ", " + this.props.model.address.postCode : ""
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                this.props.model.contactDetails.map(function (contact) {
                    switch (contact.contactType) {
                        case "Phone":
                            return React.createElement(
                                "div",
                                { key: "Phone" },
                                React.createElement(
                                    ListItem,
                                    { twoLine: true },
                                    React.createElement(
                                        ListItemContent,
                                        { avatar: "local_phone", subtitle: "phone" },
                                        contact.contact
                                    )
                                ),
                                React.createElement("div", { className: "divider" }),
                                React.createElement("div", { className: "clear" })
                            );
                        case "Mobile":
                            return React.createElement(
                                "div",
                                { key: "Mobile" },
                                React.createElement(
                                    ListItem,
                                    { twoLine: true },
                                    React.createElement(
                                        ListItemContent,
                                        { avatar: "stay_current_portrait", subtitle: "mobile" },
                                        contact.contact
                                    )
                                ),
                                React.createElement("div", { className: "divider" }),
                                React.createElement("div", { className: "clear" })
                            );
                    }
                })
            );
        }
    });

    var AppointmentDetails = React.createClass({
        displayName: "AppointmentDetails",

        getInitialState: function () {
            return {
                activeTab: undefined,
                providerInfo: undefined,
                appointmentInfo: undefined
            };
        },
        componentDidMount: function () {
            var component = this;

            var slotId = Bridge.Redirect.getQueryStringParam()["slotId"];

            Bridge.Provider.getProviderSlotById(slotId, function (slotResult) {
                if (slotResult.success) {

                    var slotDate = moment(slotResult.data.slotDateTime).format("YYYY-MM-DD hh:mm");

                    slotResult.data.slotDateTime = slotDate;

                    component.setState({
                        appointmentInfo: slotResult.data
                    });

                    Bridge.Provider.getProviderDetails(slotResult.data.providerId, function (result) {
                        if (result.success) {
                            component.setState({
                                providerInfo: result.data
                            });

                            component.setState({ activeTab: 0 });
                        }

                        $(".mdl-progress").css('visibility', 'hidden');
                    });
                } else {
                    $(".mdl-progress").css('visibility', 'hidden');
                }
            });
        },
        onChange: function (tabId) {
            if (tabId == 0) {
                this.setState({ activeTab: tabId });
            } else if (tabId == 1) {
                this.setState({ activeTab: tabId });
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
                        "div",
                        { className: "primary-bg profile-image-container" },
                        React.createElement("img", { src: "images/user.png", width: "120", height: "120", className: "img-responsive center-block profile-user-photo" }),
                        React.createElement(
                            "div",
                            { className: "userName" },
                            React.createElement(
                                "h4",
                                null,
                                component.state.providerInfo ? component.state.providerInfo.title + " " + component.state.providerInfo.name + " " + component.state.providerInfo.surname : ""
                            )
                        )
                    ),
                    React.createElement(
                        HeaderTabs,
                        { activeTab: this.state.activeTab, onChange: this.onChange, ripple: true },
                        React.createElement(
                            Tab,
                            { href: "#tab1" },
                            "Appointment Info"
                        ),
                        React.createElement(
                            Tab,
                            { href: "#tab2" },
                            "Provider Info"
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
                                function () {
                                    switch (component.state.activeTab) {
                                        case 0:
                                            return React.createElement(AppointmentInfo, { model: component.state.appointmentInfo });
                                        case 1:
                                            return React.createElement(ProviderInfo, { model: component.state.providerInfo });
                                    }
                                }()
                            )
                        )
                    ),
                    React.createElement("section", { id: "tab2", className: "hide" })
                )
            );
        }
    });

    ReactDOM.render(React.createElement(AppointmentDetails, null), document.getElementById("appointment-details"));
})();