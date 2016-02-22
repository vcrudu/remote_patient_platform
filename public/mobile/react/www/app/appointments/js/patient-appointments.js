/**
 * Created by Victor on 2/22/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var AppointmentsCalendar = React.createClass({
        displayName: "AppointmentsCalendar",

        componentDidMount: function () {
            $(this.refs.appointmentsCalendar).fullCalendar();
        },
        render: function () {
            return React.createElement("div", { ref: "appointmentsCalendar" });
        }
    });

    ReactDOM.render(React.createElement(AppointmentsCalendar, null), document.getElementById("patient-appointments"));
})();