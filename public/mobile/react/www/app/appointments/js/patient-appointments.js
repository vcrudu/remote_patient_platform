/**
 * Created by Victor on 2/22/2016.
 */

(function () {
    "use strict";

    var DateSelector = React.createClass({
        displayName: "DateSelector",

        setDate: function (date) {
            var changeDayPicker = $(this.refs.changeDayPicker);
            changeDayPicker.mobiscroll("setVal", date);
            changeDayPicker.mobiscroll("setDate", date, true);
        },
        handleShow: function () {
            var changeDayPicker = $(this.refs.changeDayPicker);
            changeDayPicker.mobiscroll('show');
            return false;
        },
        componentDidMount: function () {
            var changeDayPicker = $(this.refs.changeDayPicker);
            var component = this;

            changeDayPicker.mobiscroll().calendar({
                theme: "material",
                display: "bottom",
                dateFormat: "yyyy-mm-dd",
                minDate: new Date(),
                onSelect: function (valueText, inst) {
                    component.props.onSelectDateCallback(valueText, inst);
                }
            }).mobiscroll("setDate", new Date(), true);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "show-appointments-mobiscroll-wrapper" },
                React.createElement("input", { id: "changeDayPicker", ref: "changeDayPicker", className: "hide" }),
                React.createElement(
                    "button",
                    { id: "show", ref: "show", onClick: this.handleShow, className: "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored show-appointments-mobiscroll" },
                    React.createElement(
                        "i",
                        { className: "material-icons" },
                        "event available"
                    )
                )
            );
        }
    });

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
                //de prisos
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
        onDateChanged: function (valueText, inst) {
            var date = moment(valueText);
            $(this.refs.appointmentsCalendar).fullCalendar("gotoDate", date);
        },
        isToday: function (td) {
            var d = new Date();
            return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
        },
        componentDidMount: function () {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentModal = $(this.refs.appointmentModal).modal('hide');
            var reasonText = $(this.refs.reasonText);
            var component = this;

            $(component.refs.appointmentsCalendar).on("swipeleft", function (event) {
                $(component.refs.appointmentsCalendar).fullCalendar("next");
            });

            $(component.refs.appointmentsCalendar).on("swiperight", function (event) {
                var defDate = $(component.refs.appointmentsCalendar).fullCalendar("getDate")._d;
                if (component.isToday(defDate)) {
                    return;
                }
                $(component.refs.appointmentsCalendar).fullCalendar("prev");
            });

            var currentDate = new Date();
            $(this.refs.appointmentsCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '00:15:00',
                allDaySlot: false,
                header: false,
                height: $(window).height() - 3,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: { days: 1 },
                        slotDuration: '00:15',
                        slotLabelInterval: '00:15',
                        columnFormat: 'dddd MM / DD'
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

                    component.refs["dateSelector"].setDate(start._d);
                },
                eventAfterAllRender: function (view) {}
            });
        },
        render: function () {
            return React.createElement(
                "div",
                { ref: "appointmentsCalendarWrapper" },
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
                ),
                React.createElement(DateSelector, { ref: "dateSelector", onSelectDateCallback: this.onDateChanged })
            );
        }
    });

    ReactDOM.render(React.createElement(AppointmentsCalendar, null), document.getElementById("patient-appointments"));
})();