/**
 * Created by Victor on 5/31/2016.
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
    var List  = ReactMDL.List;
    var ListItem  = ReactMDL.ListItem;
    var ListItemContent  = ReactMDL.ListItemContent;

    var ProviderDetails = React.createClass({
        render: function() {
            return <List>
                <ListItem twoLine>
                    <ListItemContent avatar="person" subtitle="name">{this.props.model ? this.props.model.title + " " + this.props.model.name + " " + this.props.model.surname : ""}</ListItemContent>
                </ListItem>
                <div className="divider"></div>
                <div className="clear"></div>
                <ListItem twoLine>
                    <ListItemContent avatar="message" subtitle="email">{this.props.model ? this.props.model.email : ""}</ListItemContent>
                </ListItem>
                <div className="divider"></div>
                <div className="clear"></div>
                <ListItem twoLine>
                    <ListItemContent avatar="place">
                        {this.props.model && this.props.model.address.addressLine1 ? this.props.model.address.addressLine1 : ""}
                        {this.props.model && this.props.model.address.town ? ", " + this.props.model.address.town : ""}
                        {this.props.model && this.props.model.address.county ? ", " + this.props.model.address.county : ""}
                        {this.props.model && this.props.model.address.country ? ", " + this.props.model.address.country : ""}
                        {this.props.model && this.props.model.address.postCode ? ", " + this.props.model.address.postCode : ""}
                    </ListItemContent>
                </ListItem>
                <div className="divider"></div>
                <div className="clear"></div>
                {
                    this.props.model.contactDetails.map(function (contact) {
                        switch (contact.contactType) {
                            case "Phone":
                                return <div>
                                    <ListItem twoLine>
                                        <ListItemContent avatar="local_phone" subtitle="phone">{contact.contact}</ListItemContent>
                                    </ListItem>
                                    <div className="divider"></div>
                                    <div className="clear"></div>
                                </div>;
                            case "Mobile":
                                return <div>
                                    <ListItem twoLine>
                                        <ListItemContent avatar="stay_current_portrait" subtitle="mobile">{contact.contact}</ListItemContent>
                                    </ListItem>
                                    <div className="divider"></div>
                                    <div className="clear"></div>
                                </div>;
                        }
                    })
                }
            </List>;
        }
    });

    var AppointmentDetails = React.createClass({
        getInitialState: function() {
            return {
                activeTab: 0,
                providerInfo: undefined,
                appointmentInfo: undefined
            }
        },
        componentDidMount: function() {
            var component = this;

            var providerId = Bridge.Redirect.getQueryStringParam()["providerId"];
            var slotId = Bridge.Redirect.getQueryStringParam()["slotId"];

            Bridge.Provider.getProviderSlotById(slotId, function(slotResul) {
                if (result.success) {
                    Bridge.Provider.getProviderDetails(providerId, function(result) {
                        if (result.success) {
                            component.setState({
                                providerInfo: result.data
                            });
                        }

                        $(".mdl-progress").css('visibility', 'hidden');
                    });
                }
                else {
                    $(".mdl-progress").css('visibility', 'hidden');
                }
            });


        },
        onChange: function(tabId) {
            if (tabId == 0) {
                this.setState({ activeTab: tabId });
            }
            else if (tabId == 1) {
                this.setState({ activeTab: tabId });
            }
        },
        render : function() {
            var component = this;
            return  <Layout fixedHeader fixedTabs>
                <Header>
                    <ProgressBar indeterminate ref="progressBar" id="progressBar"/>
                    <HeaderTabs activeTab={this.state.activeTab} onChange={this.onChange} ripple>
                        <Tab href="#tab1">Appointment Info</Tab>
                        <Tab href="#tab2">Provider Info</Tab>
                    </HeaderTabs>
                </Header>
                <Content>
                    <section id="tab1">
                        <div className="page-content">
                            <div className="page-content-wrapper">
                                {(() => {
                                    switch (component.state.activeTab) {
                                        case 0: return "Content for Tab 1";
                                        case 1: return <ProviderDetails model={component.state.providerInfo}/>;
                                    }
                                })()}
                            </div>
                        </div>
                    </section>
                    <section id="tab2" className="hide"></section>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<AppointmentDetails />, document.getElementById("appointment-details"));
})();