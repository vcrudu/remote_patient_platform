/**
 * Created by Victor on 4/8/2016.
 */
(function () {
    "use strict";

    $.material.init();

    var ProviderLandingPage = React.createClass({
        displayName: "ProviderLandingPage",

        handleSignUpClick: function (e) {
            Bridge.Redirect.redirectToProviderSignUp();
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

    ReactDOM.render(React.createElement(ProviderLandingPage, null), document.getElementById("provider-landing"));
})();