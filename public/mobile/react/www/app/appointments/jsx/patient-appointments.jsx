/**
 * Created by Victor on 2/22/2016.
 */

(function() {
    "use strict";

    $.material.init();

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
            }).mobiscroll("setDate", new Date(), true);
        },
        render: function() {
            return <div>
                <input id="changeDayPicker" ref="changeDayPicker" className="hide"/>
                <button id="show" ref="show" onClick={this.handleShow} className="btn btn-raised btn-info">Change Day</button>
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
            if (slotDateTime <= now.getTime()) {//de prisos
                appointmentModalDiv.modal('hide');
                return;
            }
            else
            {
                console.log(reasonText.val());
                Bridge.patientBookAnAppointment({
                    cancel:false,
                    slotDateTime: slotId,
                    appointmentReason: reasonText.val()
                }, function(result) {
                    var event = Bridge.CalendarFactory.getEventById(slotId, appointmentsCalendarDiv.fullCalendar("clientEvents"));
                    if (event) {
                        appointmentsCalendarDiv.fullCalendar("updateEvent", Bridge.CalendarFactory.getBookedEvent(event, result.data));
                    }

                    appointmentModalDiv.modal('hide');
                    return;
                })
            }
        },
        onDateChanged: function(valueText, inst) {
            var date = moment(valueText);
            $(this.refs.appointmentsCalendar).fullCalendar("gotoDate", date);
        },
        componentDidMount: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentModal = $(this.refs.appointmentModal).modal('hide');
            var reasonText = $(this.refs.reasonText);
            var component = this;

            var currentDate = new Date();
            $(this.refs.appointmentsCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '00:15:00',
                allDaySlot: false,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: {days: 1},
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
                    if (calEvent.slot.countOfProviders == 0/* && calEvent.status !== "appointment"*/) {
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
                       // console.log(slotsResult);
                       Bridge.getPatientAppointment(function(appointmentsResult) {
                            if (!appointmentsResult.success) return;
                          // console.log(appointmentsResult);
                            for (var i = 0; i < slotsResult.data.length; i++) {
                                if (slotsResult.data[i].slotDateTime >= start.valueOf() && slotsResult.data[i].slotDateTime < end.valueOf()) {
                                    console.log(slotsResult.data[i]);
                                    var event = Bridge.CalendarFactory.getEvent(slotsResult.data[i], appointmentsResult.data);

                                    events.push(event);
                                }
                            }
                           console.log(events);
                            callback(events);
                        })
                    });

                    component.refs["dateSelector"].setDate(start._d);
                },
                eventAfterAllRender: function (view) {
                },
                resources: [
                    {id: 'a', title: 'Health care providers'}
                ]
            });
        },
        render: function() {
            return <div>
                <div ref="appointmentsCalendar"></div>
                <div ref="appointmentModal" id="appointmentModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Book appointment</h4>
                            </div>
                            <div className="modal-body">
                                <div className="form-group is-empty">
                                    <label htmlFor="reasonText" className="control-label">Reason</label>
                                    <textarea className="form-control" rows="3" id="reasonText" ref="reasonText"></textarea>
                                    <input type="hidden" id="slotId"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleBookAppointment}>Submit<div className="ripple-container"></div></button>
                            </div>
                        </div>
                    </div>
                </div>
                <DateSelector ref="dateSelector" onSelectDateCallback={this.onDateChanged}/>
            </div>
        }
    });

    ReactDOM.render(<AppointmentsCalendar/>, document.getElementById("patient-appointments"));
})();