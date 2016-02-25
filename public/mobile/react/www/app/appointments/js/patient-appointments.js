/**
 * Created by Victor on 2/22/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var AppointmentsCalendar = React.createClass({
        displayName: "AppointmentsCalendar",

        handleBookAppointment: function () {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentsCalendarDiv = $(this.refs.appointmentsCalendar);
            var slotId = parseInt(appointmentModalDiv.attr("data-slot-id"));
            var reasonText = $(this.refs.reasonText);

            var slotDateTime = moment(slotId);
            var now = new Date();
            if (slotDateTime <= now.getTime()) {
                appointmentModalDiv.modal('hide');
                return;
            } else {
                Bridge.patientBookAnAppointment({
                    cancel: false,
                    slotDateTime: slotId,
                    appointmentReason: reasonText.val()
                }, function (result) {
                    var event = Bridge.CalendarFactory.getEventById(slotId, appointmentsCalendarDiv.fullCalendar("clientEvents"));
                    if (event) {
                        appointmentsCalendarDiv.fullCalendar("updateEvent", Bridge.CalendarFactory.getBookedEvent(event, result.data));
                    }

                    appointmentModalDiv.modal('hide');
                    return;
                });
            }
        },
        componentDidMount: function () {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentModal = $(this.refs.appointmentModal).modal('hide');
            var reasonText = $(this.refs.reasonText);

            var currentDate = new Date();
            $(this.refs.appointmentsCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '00:15:00',
                allDaySlot: false,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: { days: 1 },
                        slotDuration: '00:15',
                        slotLabelInterval: '00:15'
                    }
                },
                scrollTime: currentDate.getHours() + ':' + currentDate.getMinutes() + ':00',
                eventClick: function (calEvent, jsEvent, view) {
                    var now = new Date();
                    if (calEvent.id < now.getTime()) {
                        return;
                    }
                    if (calEvent.slot.countOfProviders == 0 /* && calEvent.status !== "appointment"*/) {
                            return;
                        }

                    appointmentModalDiv.attr("data-slot-id", calEvent.id);
                    appointmentModal.modal('show');
                    reasonText.val("");
                },
                events: function (start, end, timezone, callback) {
                    var events = [];
                    Bridge.getSlots(function (slotsResult) {
                        if (!slotsResult.success) return;

                        Bridge.getPatientAppointment(function (appointmentsResult) {
                            if (!appointmentsResult.success) return;
                            for (var i = 0; i < slotsResult.data.length; i++) {
                                if (slotsResult.data[i].slotDateTime >= start.valueOf() && slotsResult.data[i].slotDateTime < end.valueOf()) {
                                    var event = Bridge.CalendarFactory.getEvent(slotsResult.data[i], appointmentsResult.data);
                                    events.push(event);
                                }
                            }
                            callback(events);
                        });
                    });
                },
                eventAfterAllRender: function (view) {},
                resources: [{ id: 'a', title: 'Health care providers' }]
            });
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement("div", { ref: "appointmentsCalendar" }),
                React.createElement(
                    "div",
                    { ref: "appointmentModal", id: "appointmentModal", className: "modal fade", role: "dialog" },
                    React.createElement(
                        "div",
                        { className: "modal-dialog" },
                        React.createElement(
                            "div",
                            { className: "modal-content" },
                            React.createElement(
                                "div",
                                { className: "modal-header" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "close", "data-dismiss": "modal" },
                                    "×"
                                ),
                                React.createElement(
                                    "h4",
                                    { className: "modal-title" },
                                    "Book appointment"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-body" },
                                React.createElement(
                                    "div",
                                    { className: "form-group is-empty" },
                                    React.createElement(
                                        "label",
                                        { htmlFor: "reasonText", className: "control-label" },
                                        "Reason"
                                    ),
                                    React.createElement("textarea", { className: "form-control", rows: "3", id: "reasonText", ref: "reasonText" }),
                                    React.createElement("input", { type: "hidden", id: "slotId" })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-default", "data-dismiss": "modal" },
                                    "Close"
                                ),
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-primary", onClick: this.handleBookAppointment },
                                    "Submit",
                                    React.createElement("div", { className: "ripple-container" })
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(AppointmentsCalendar, null), document.getElementById("patient-appointments"));
})();