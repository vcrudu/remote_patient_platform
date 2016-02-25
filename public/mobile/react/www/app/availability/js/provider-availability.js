/**
 * Created by Victor on 2/25/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        displayName: "ProviderAvailabilityCalendar",

        render: function () {
            return React.createElement(
                "div",
                null,
                "Provider Availability"
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderAvailabilityCalendar, null), document.getElementById("provider-availability"));
})();