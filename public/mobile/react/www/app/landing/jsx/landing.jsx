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
        handleRegisterClick: function(e){

        },
        render: function() {
            return <div>
                <input type="button" className="btn btn-raised btn-primary" value="Sign Up" onClick={this.handleSignUpClick}></input>
                <input type="button" className="btn btn-raised btn-info" value="Register" onClick={this.handleRegisterClick}></input>
            </div>
        }
    });

    ReactDOM.render(<LandingPage/>, document.getElementById("landing"));
})();