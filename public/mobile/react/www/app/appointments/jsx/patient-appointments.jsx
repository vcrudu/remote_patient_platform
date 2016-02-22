/**
 * Created by Victor on 2/22/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var AppointmentsCalendar = React.createClass({
        componentDidMount: function() {
            $(this.refs.appointmentsCalendar).fullCalendar();
        },
        render: function() {
            return <div ref="appointmentsCalendar"></div>
        }
    });

    ReactDOM.render(<AppointmentsCalendar/>, document.getElementById("patient-appointments"));
})();