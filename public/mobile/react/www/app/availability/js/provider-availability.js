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
                "Hello"
            );
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                "Provider Availability test"
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderAvailabilityCalendar, null), document.getElementById("provider-availability"));
})();