/**
 * Created by Victor on 4/29/2016.
 */

(function() {
    "use strict";

    var NoNetworkConnection = React.createClass({
        handleExitClick: function() {
            Bridge.Redirect.exitFromApplication();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();

            var button = this.refs.btnExitFromApplication;
            button.addEventListener('click', this.handleExitClick);
        },
        render: function() {
            var component = this;
            return <main className="mdl-layout__content">
                <div className="page-content">
                    <div className="mdl-card mdl-shadow--2dp">
                        <div className="mdl-card__title">
                            <h2 className="mdl-card__title-text">No Internet Connection</h2>
                        </div>
                        <div className="mdl-card__supporting-text">
                            Sorry, no Internet connectivity detected. Please reconnect.
                        </div>
                        <div className="buttons-container-right">
                            <button onClick={this.handleExitClick} ref="btnExitFromApplication" className="mdl-button mdl-js-button mdl-button--accent exit-from-application-button">
                                EXIT FROM APPLICATION
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        }
    });

    ReactDOM.render(<NoNetworkConnection />, document.getElementById("no-internet-connection"));
})();
