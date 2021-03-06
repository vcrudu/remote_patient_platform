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
        handleSignIn: function (e) {
            Bridge.Redirect.redirectToSignIn("");
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "row-no-padding has-separator" },
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    React.createElement("input", { type: "button", className: "btn btn-default btn-sign-up", value: "Sign Up", onClick: this.handleSignUpClick })
                ),
                React.createElement(
                    "div",
                    { className: "col-xs-6" },
                    React.createElement("input", { type: "button", className: "btn btn-default btn-login", value: "Sign In", onClick: this.handleSignIn })
                )
            );
        }
    });

    ReactDOM.render(React.createElement(LandingPage, null), document.getElementById("landing"));
})();