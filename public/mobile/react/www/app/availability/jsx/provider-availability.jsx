/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        render: function() {
            return <div>Provider Availability</div>
        }
    });

    ReactDOM.render(<ProviderAvailabilityCalendar/>, document.getElementById("provider-availability"));
})();