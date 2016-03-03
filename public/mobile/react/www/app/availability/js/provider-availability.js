/**
 * Created by Victor on 2/25/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        displayName: "ProviderAvailabilityCalendar",

        componentDidMount: function () {

            return React.createElement(
                "p",
                null,
                "Hello1"
            );
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "comment" },
                React.createElement(
                    "h2",
                    { className: "commentAuthor" },
                    this.props.author
                ),
                this.props.children
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderAvailabilityCalendar, { author: "vasea", children: "its okey" }), document.getElementById("provider-availability"));
})();