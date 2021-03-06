/**
 * Created by Victor on 3/31/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var PatientSignUpButton = React.createClass({
        displayName: "PatientSignUpButton",

        handleBackButton: function () {
            Bridge.Redirect.redirectToWithLevelsUp("landing/landing.html", 2);
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "a",
                    { href: "javascript:void(0);", className: "btn-back", title: "Back", onClick: this.handleBackButton },
                    React.createElement(
                        "i",
                        { className: "material-icons md-48 md-inactive" },
                        "keyboard_backspace"
                    )
                ),
                React.createElement(
                    "h2",
                    { className: "page-title" },
                    "Sign Up"
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientSignUpButton, null), document.getElementById("back-button-container"));
})();