/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        validateTimeString: function() {
            var reasonText = $(this.refs.reasonText);
            var scheduleValue=reasonText.val();
            var re = /((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9]))/g;
            var match = re.exec(scheduleValue);
            if(match){
                $( "#modal-submit" ).prop( "disabled", false );
            } else {
                $( "#modal-submit" ).prop( "disabled", true );
            }

        },
        handleProviderAvailability: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentsCalendarDiv = $(this.refs.appointmentsCalendar);
            var reasonText = $(this.refs.reasonText);


            var modalTitle = $(".modal-title").html();
            var oldAvailability=$("span#currentSchedule").html();
            var availabilityString=reasonText.val();
            var dateString=moment(appointmentsCalendarDiv.fullCalendar('getDate')).format("DD[.]MM[.]YYYY");
            var submitMode=modalTitle.split(" ");
        if(submitMode[0]=="Set"){
           Bridge.providerSetAvailability({
               availabilityString: availabilityString,
               dateString: dateString
                }, function(result) {
                        console.log('ok s-a inscris');


                })
                }else {
            Bridge.providerUpdateAvailability({
                availabilityString: availabilityString,
                dateString: dateString,
                oldAvailabilityString: oldAvailability
            }, function(result) {
                console.log('update');


            })

        }

            appointmentModalDiv.modal('hide');


            appointmentsCalendarDiv.fullCalendar('refetchEvents' );



        },


        componentDidMount: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentModal = $(this.refs.appointmentModal).modal('hide');
            var reasonText = $(this.refs.reasonText);

            var currentDate = new Date();
            $(this.refs.appointmentsCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '00:15:00',
                allDaySlot: false,
                allDay:false,
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
                    console.log(calEvent);
                    reasonText.html(calEvent.title);
                    var dateTitle="Edit availability "+moment(calEvent._start._d).format("DD[/]MM[/]YYYY");
                    $(".modal-title").text(dateTitle);
                    $("span#currentSchedule").html(calEvent.title);
                    $("#modal-body-header").show();
                    appointmentModal.modal('show');
                },
                dayClick: function (calEvent, jsEvent, view) {

                    var now = new Date();
                    if (calEvent < now.getTime()) {
                        return;
                    }

                    var dateTitle="Set availability "+moment(calEvent._d).format("DD[/]MM[/]YYYY");//formattedDate(calEvent);


                    $(".modal-title").text(dateTitle);
                    $("#modal-body-header").hide();


                    function formattedDate(date) {//to-do de trecut functia in alt fisier
                        var d = new Date(date || Date.now()),
                            month = '' + (d.getMonth() + 1),
                            day = '' + d.getDate(),
                            year = d.getFullYear();

                        if (month.length < 2) month = '0' + month;
                        if (day.length < 2) day = '0' + day;

                        return [day,month,year].join('/');
                    }

                    var dateTitle=formattedDate(calEvent);

                    $("span#modal-title-data").text(dateTitle);

                   // appointmentModalDiv.attr("data-slot-id", calEvent.id);
                        appointmentModal.modal('show');


                    var insertedText='';
                    reasonText.html(insertedText);
                    $( "#modal-submit" ).prop( "disabled", true );

                },
                events: function (start, end, timezone, callback) {
                    var events = [];
                    Bridge.getProviderSlots(start,end,function (result) {
                        if (result.success) {

                            for (var i = 0; i < result.data.length; i++) {
                                var intervals = result.data[i].intervals.split("-");
                                events.push({
                                    availability: result.data[i],
                                    title: result.data[i].intervals,
                                    start: intervals[0]+':00',
                                    end: intervals[1]+':00',
                                    allDay:true,
                                    icon: 'fa fa-calendar',
                                    className: ["event", 'bg-color-' + 'greenLight'],
                                    backgroundColor:'green'
                                });
                            }
                            console.log(events);
                            callback(events);
                        }

                    })},
                eventRender: function(event, element) {
                    element.find('.fc-event-title').append("<br/>" + event.location);
                    element.find('.fc-time').hide();
                },
                eventAfterAllRender: function (view) {
                },
                resources: [
                    {id: 'a', title: 'Availability'}
                ]
            });
        },
        render: function() {
            return <div>
                <div ref="appointmentsCalendar" id="calendar"></div>
                <div ref="appointmentModal" id="appointmentModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title"></h4>
                            </div>
                            <div className="modal-body">

                                <div className="form-group is-empty">
                                    <header id="modal-body-header">Current schedule:
                                        <span id="currentSchedule"></span>
                                    </header>
                                    <label htmlFor="reasonText" className="control-label">Availability</label>
                                    <textarea className="form-control" rows="3" id="reasonText" ref="reasonText" onChange={this.validateTimeString}></textarea>
                                    <span className="note">Example: 08:00-12:00, 13:00-17:00 </span>
                                    <input type="hidden" id="slotId"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" id="modal-submit" onClick={this.handleProviderAvailability}>Submit<div className="ripple-container"></div></button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<ProviderAvailabilityCalendar />, document.getElementById("provider-availability"));
})();