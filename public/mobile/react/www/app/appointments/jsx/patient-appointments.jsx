/**
 * Created by Victor on 2/22/2016.
 */

(function() {
    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var FABButton = ReactMDL.FABButton;
    var Icon = ReactMDL.Icon;
    var Button = ReactMDL.Button;
    var Dialog = ReactMDL.Dialog;
    var DialogTitle = ReactMDL.DialogTitle;
    var DialogContent = ReactMDL.DialogContent;
    var DialogActions = ReactMDL.DialogActions;
    var Textfield = ReactMDL.Textfield;
    var ProgressBar  = ReactMDL.ProgressBar;

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
                <FABButton colored ripple className="show-appointments-mobiscroll" onClick={this.handleShow}>
                    <Icon name="event available" />
                </FABButton>
            </div>
        }
    });

    var AppointmentsCalendar = React.createClass({
        handleBookAppointment: function() {
            var appointmentsCalendarDiv = $(this.refs.appointmentsCalendar);
            var slotId = this.state.slotId;
            var reasonText = $("#reasonText").val();

            var slotDateTime = moment(slotId);
            var now = new Date();
            var component = this;
            if (slotDateTime <= now.getTime()) {
                $("#reasonText").val("");
                component.setState({openDialog: false, slotId: undefined});
                return;
            }
            else
            {
                Bridge.patientBookAnAppointment({
                    cancel:false,
                    slotDateTime: slotId,
                    appointmentReason: reasonText
                }, function(result) {
                    var event = Bridge.CalendarFactory.getEventById(slotId, appointmentsCalendarDiv.fullCalendar("clientEvents"));
                    if (event) {
                        appointmentsCalendarDiv.fullCalendar("updateEvent", Bridge.CalendarFactory.getBookedEvent(event, result.data));
                    }

                    $("#reasonText").val("");
                    component.setState({openDialog: false, slotId: undefined});
                    return;
                })
            }
        },
        handleCancelAppointmentModal: function() {
            this.setState({openDialog: false, slotId: undefined, slotReason: ""});

            var actualHeight = $(".fc-scroller").height();
            $(".fc-scroller").height(actualHeight + 1);
            $(".fc-scroller").height(actualHeight - 1);

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
        },
        componentDidMount: function() {
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
                height: $(window).height() - 4,
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
                    if (calEvent.slot.countOfProviders == 0) {
                        return;
                    }

                    component.setState({openDialog: true, slotId: calEvent.id, slotReason: ""});
                },
                events: function (start, end, timezone, callback) {
                    $(".mdl-progress").css('visibility', 'visible');
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

                           $(".mdl-progress").css('visibility', 'hidden');
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
        getInitialState: function() {
            return {
                openDialog: false,
                slotId: undefined,
            }
        },
        onReasonChange: function() {
        },
        render: function() {
            return <Layout>
                    <Content>
                        <ProgressBar indeterminate ref="progressBar" id="progressBar"/>
                        <div ref="appointmentsCalendarWrapper">
                            <div ref="appointmentsCalendar"></div>
                            <Dialog className="mdl-dialog" ref="appointmentModal" id="appointmentModal" open={this.state.openDialog}>
                                <DialogTitle>Book an appointment</DialogTitle>
                                <DialogContent className="book-appointment-content">
                                    <Textfield id="reasonText" name="reasonText" ref="reasonText" label="Reason" rows={3} onChange={this.onReasonChange} />
                                </DialogContent>
                                <DialogActions>
                                    <Button type="button" className="mdl-button mdl-button--accent" onClick={this.handleBookAppointment}>Submit</Button >
                                    <Button type="button" className="mdl-button mdl-button--accent" onClick={this.handleCancelAppointmentModal}>Close</Button>
                                </DialogActions>
                            </Dialog>
                            <DateSelector ref="dateSelector" onSelectDateCallback={this.onDateChanged}/>
                        </div>
                    </Content>
                </Layout>
        }
    });

    ReactDOM.render(<AppointmentsCalendar/>, document.getElementById("patient-appointments"));
})();