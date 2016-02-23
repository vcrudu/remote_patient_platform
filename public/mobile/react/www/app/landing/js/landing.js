/**
 * Created by Victor on 2/23/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var LandingPage = React.createClass({
        displayName: "LandingPage",

        handleSignUpClick: function (e) {
            Bridge.Redirect.redirectToPatientSignUp();
        },
        handleRegisterClick: function (e) {},
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement("input", { type: "button", className: "btn btn-raised btn-primary", value: "Sign Up", onClick: this.handleSignUpClick }),
                React.createElement("input", { type: "button", className: "btn btn-raised btn-info", value: "Register", onClick: this.handleRegisterClick })
            );
        }
    });

    ReactDOM.render(React.createElement(LandingPage, null), document.getElementById("landing"));
})();