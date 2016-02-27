/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        componentDidMount: function() {
            return <p>Hello</p>
        },
        render: function() {
            return <div>Provider Availability test</div>
        }
    });

    ReactDOM.render(<ProviderAvailabilityCalendar/>, document.getElementById("provider-availability"));
})();