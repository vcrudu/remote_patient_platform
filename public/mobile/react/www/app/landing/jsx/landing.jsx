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
            Bridge.Redirect.redirectToSignIn();
        },
        render: function() {
            return <div className="buttonsContainer">
                <input type="button" className="btn btn-default red" value="Sign Up" onClick={this.handleSignUpClick}></input>
                <input type="button" className="btn btn-default green" value="Sign In" onClick={this.handleSignIn}></input>
            </div>
        }
    });

    ReactDOM.render(<LandingPage/>, document.getElementById("landing"));
})();