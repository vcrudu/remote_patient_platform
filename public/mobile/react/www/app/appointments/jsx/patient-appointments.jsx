/**
 * Created by Victor on 2/22/2016.
 */

(function() {
    "use strict";

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var APPOINTMENTS_PROGRESS = React.createClass({
        componentDidMount: function() {
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div className="progress-bar-indeterminate"></div>
        }
    });

    var DateSelector = React.createClass({
        setDate: function(date) {
            var changeDayPicker = $(this.refs.changeDayPicker);
            changeDayPicker.mobiscroll("setVal", date);
            changeDayPicker.mobiscroll("setDate", date, true)
        },
        handleShow: function() {
            var changeDayPicker = $(this.refs.changeDayPicker);
            changeDayPicker.mobiscroll('show');
            return false;
        },
        componentDidMount: function() {
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
            });

            changeDayPicker.mobiscroll("setDate", new Date(), true);
        },
        render: function() {
            return <div className="show-appointments-mobiscroll-wrapper">
                <input id="changeDayPicker" ref="changeDayPicker" className="hide"/>
                <button id="show" ref="show" onClick={this.handleShow} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored show-appointments-mobiscroll"><i className="material-icons">event available</i></button>
            </div>
        }
    });

    var AppointmentsCalendar = React.createClass({
        handleBookAppointment: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentsCalendarDiv = $(this.refs.appointmentsCalendar);
            var slotId = parseInt(appointmentModalDiv.attr("data-slot-id"));
            var reasonText = $(this.refs.reasonText);

            var slotDateTime = moment(slotId);
            var now = new Date();
            if (slotDateTime <= now.getTime()) {
                document.querySelector("#" + appointmentModalDiv.attr("id")).close();
                return;
            }
            else
            {
                Bridge.patientBookAnAppointment({
                    cancel:false,
                    slotDateTime: slotId,
                    appointmentReason: reasonText.val()
                }, function(result) {
                    var event = Bridge.CalendarFactory.getEventById(slotId, appointmentsCalendarDiv.fullCalendar("clientEvents"));
                    if (event) {
                        appointmentsCalendarDiv.fullCalendar("updateEvent", Bridge.CalendarFactory.getBookedEvent(event, result.data));
                    }

                    document.querySelector("#" + appointmentModalDiv.attr("id")).close();
                    return;
                })
            }
        },
        handleCancelAppointmentModal: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            document.querySelector("#" + appointmentModalDiv.attr("id")).close();

            var actualHeight = $(".fc-scroller").height();
            $(".fc-scroller").height(actualHeight + 1);
            $(".fc-scroller").height(actualHeight - 1);

            componentHandler.upgradeDom();
            return;
        },
        onDateChanged: function(valueText, inst) {
            var date = moment(valueText);
            $(this.refs.appointmentsCalendar).fullCalendar("gotoDate", date);
        },
        isToday: function (td){
            var d = new Date();
            return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        componentDidMount: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var reasonText = $(this.refs.reasonText);
            var component = this;

            $(component.refs.appointmentsCalendar).on("swipeleft" , function(event) {
                $(component.refs.appointmentsCalendar).fullCalendar("next");
            });

            $(component.refs.appointmentsCalendar).on("swiperight", function(event) {
                var defDate = $(component.refs.appointmentsCalendar).fullCalendar("getDate")._d;
                if (component.isToday(defDate)) {return;}
                $(component.refs.appointmentsCalendar).fullCalendar("prev");
            });

            var currentDate = new Date();
            $(this.refs.appointmentsCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '00:15:00',
                allDaySlot: false,
                header:false,
                height: $(window).height() - 3,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: {days: 1},
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
                    if (calEvent.slot.countOfProviders == 0/* && calEvent.status !== "appointment"*/) {
                        return;

                    }

                    $("#" + appointmentModalDiv.attr("id")).attr("data-slot-id", calEvent.id);
                    reasonText.val("");
                    document.querySelector("#" + appointmentModalDiv.attr("id")).showModal();
                },
                events: function (start, end, timezone, callback) {
                    indeterminateProgress.start();
                    var events = [];
                    Bridge.getSlots(start.format("MM/DD"), function (slotsResult) {
                        if (!slotsResult.success) return;
                       Bridge.getPatientAppointment(function(appointmentsResult) {
                            if (!appointmentsResult.success) return;
                            for (var i = 0; i < slotsResult.data.length; i++) {
                                if (slotsResult.data[i].slotDateTime >= start.valueOf() && slotsResult.data[i].slotDateTime < end.valueOf()) {
                                    var event = Bridge.CalendarFactory.getEvent(slotsResult.data[i], appointmentsResult.data);

                                    events.push(event);
                                }
                            }
                            callback(events);

                           indeterminateProgress.end();
                        })
                    });

                    component.refs["dateSelector"].setDate(start._d);
                },
                eventAfterAllRender: function (view) {
                },
                loading: function(isLoading, view ) {
                }
            });
        },
        render: function() {
            return <div ref="appointmentsCalendarWrapper">
                <div ref="appointmentsCalendar"></div>
                <dialog className="mdl-dialog" ref="appointmentModal" id="appointmentModal">
                    <h4>Book an appointment</h4>
                    <div className="mdl-dialog__content book-appointment-content">
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <textarea className="mdl-textfield__input" type="text" rows= "3" id="reasonText" name="reasonText" ref="reasonText"></textarea>
                            <label className="mdl-textfield__label mdl-textfield__label--accent" htmlFor="reasonText">Reason</label>
                        </div>
                    </div>
                    <div className="mdl-dialog__actions">
                        <button type="button" className="mdl-button mdl-button--accent" onClick={this.handleBookAppointment}>Submit</button>
                        <button type="button" className="mdl-button mdl-button--accent" onClick={this.handleCancelAppointmentModal}>Close</button>
                    </div>
                </dialog>
                <DateSelector ref="dateSelector" onSelectDateCallback={this.onDateChanged}/>
            </div>
        }
    });

    ReactDOM.render(<APPOINTMENTS_PROGRESS/>, document.getElementById("patient-appointments-progress"));
    ReactDOM.render(<AppointmentsCalendar/>, document.getElementById("patient-appointments"));
})();