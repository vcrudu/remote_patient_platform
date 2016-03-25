/**
 * Created by Victor on 2/23/2016.
 */
(function() {
    "use strict";

    $.material.init();

    var LandingPage = React.createClass({
        handleSignUpClick: function(e){
            Bridge.Redirect.redirectToPatientSignUp();
        },
        handleSignIn: function(e){
            Bridge.Redirect.redirectToSignIn("");
        },
        render: function() {
            return <div className="row-no-padding has-separator">
                <div className="col-xs-6">
                    <input type="button" className="btn btn-default btn-sign-up" value="Sign Up" onClick={this.handleSignUpClick}></input>
                </div>
                <div className="col-xs-6">
                    <input type="button" className="btn btn-default btn-login" value="Sign In" onClick={this.handleSignIn}></input>
                </div>
            </div>
        }
    });

    ReactDOM.render(<LandingPage/>, document.getElementById("landing"));
})();