/**
 * Created by Victor on 3/18/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var PatientDetails = React.createClass({
        displayName: "PatientDetails",

        getInitialState: function () {
            return {
                appointmentTime: "",
                name: "",
                onlineStatus: ""
            };
        },
        componentDidMount: function () {
            var appointmentTime = Bridge.Redirect.getQueryStringParam()["appointmentTime"];
            var name = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["name"]);
            var onlineStatus = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["onlineStatus"]);
            this.setState({
                appointmentTime: appointmentTime,
                name: name,
                onlineStatus: onlineStatus
            });

            $(document).ready(function () {
                $('#patient-details-collapse').on('show.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').addClass('active');
                }).on('hide.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').removeClass('active');
                });
            });
        },
        formatDate: function (dateString) {
            var date = moment(dateString);
            return date.calendar();
        },
        render: function () {
            var onlineStatus = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["onlineStatus"]);
            var appointmentTime = Bridge.Redirect.getQueryStringParam()["appointmentTime"];
            var name = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["name"]);

            return React.createElement(
                "div",
                { className: "panel panel-default" },
                React.createElement(
                    "div",
                    { className: "panel-heading" },
                    React.createElement(
                        "h3",
                        { className: "panel-title" },
                        this.state.name ? this.state.name : name
                    ),
                    React.createElement(
                        "p",
                        null,
                        "Appointment Time: ",
                        React.createElement(
                            "strong",
                            null,
                            this.state.appointmentTime ? this.formatDate(this.state.appointmentTime) : appointmentTime
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "panel-image hide-panel-body" },
                    React.createElement("img", { src: "images/user.png", className: "img-responsive" })
                ),
                React.createElement("div", { className: this.state.onlineStatus ? this.state.onlineStatus == "offline" ? "statusBorder offline" : "statusBorder online" : "statusBorder " + onlineStatus }),
                React.createElement(
                    "div",
                    { className: "panel-footer text-center" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-12 col-sm-12 col-md-12 col-lg-12" },
                            React.createElement("img", { className: "img-responsive center-block call", src: "images/call-icon.png", width: "100" })
                        )
                    )
                )
            );
        }
    });

    var VitalSingChart = React.createClass({
        displayName: "VitalSingChart",

        propTypes: {
            aspectWidth: React.PropTypes.number.isRequired,
            aspectHeight: React.PropTypes.number.isRequired,
            mobileThreshold: React.PropTypes.number.isRequired
        },
        getDefaultProps: function () {
            return {
                aspectWidth: 16,
                aspectHeight: 9,
                mobileThreshold: 500,
                ticks: 10,
                mobileTicks: 5,
                type: undefined,
                minValue: 0,
                yDelta: 0,
                label: "",
                unit: ""
            };
        },
        getInitialState: function () {
            return {
                xAxis: undefined,
                x: undefined,
                x2: undefined,
                zoom: undefined,
                focus: undefined,
                brush: undefined,
                area: undefined,
                svg: undefined
            };
        },
        fillLines: function (g, data, x, y, numticks, width) {
            g.selectAll("line").remove();

            g.selectAll("line").data(data).enter().append("line").attr("class", "circles-line").attr("x1", function (d) {
                return x(d.dateTime);
            }).attr("y1", function (d) {
                return y(d.line.y1);
            }).attr("x2", function (d) {
                return x(d.dateTime);
            }).attr("y2", function (d) {
                return y(d.line.y2);
            });

            var yAxisGrid = d3.svg.axis().scale(y).orient("right").ticks(numticks).tickSize(width, 0).tickFormat("");

            g.append("g").classed('y', true).classed('grid', true).call(yAxisGrid);
        },
        fillCircles: function (g, tip, data, x, y) {
            g.selectAll('circle').remove();
            g.selectAll("circle").data(data).enter().append("circle").attr("cx", function (d) {
                return x(d.dateTime);
            }).attr("cy", function (d) {
                return y(d.value);
            }).attr("r", 7).attr("class", 'circle').attr("data-legend", function (d) {
                return d.label;
            }).style("fill", function (d) {
                return d.color;
            }).on("click", function (d) {
                tip.show(d);d3.select(this).style("stroke", "black").style("fill", d.color).style("stroke-width", 2);
            }).on("mouseout", function (d) {
                tip.hide(d);d3.select(this).style("stroke", "black").style("fill", d.color).style("stroke-width", 0);
            });
        },
        removeDuplicate: function (arrayOfStrings) {
            var uniqueArray = _.uniq(arrayOfStrings, function (item) {
                return moment(item).format("YYYY-MM-DD");
            });
            if (uniqueArray && uniqueArray.length > 0) {
                var itemFirst = uniqueArray[0];
                var itemLast = uniqueArray[uniqueArray.length - 1];

                var uniqueArrayOfDates = [];

                for (var i = 0; i < uniqueArray.length; i++) {

                    uniqueArrayOfDates.push(moment(new Date(uniqueArray[i])).startOf('day')._d);

                    if (i == uniqueArray.length - 1) {
                        var date = moment(new Date(uniqueArray[i])).startOf('day').add(24, "hours");
                        uniqueArrayOfDates.push(date._d);
                    }
                }
                return uniqueArrayOfDates;
            }

            return [];
        },
        drawGraphic: function (props) {
            var component = this;
            var chartRef = $(this.refs.graphic);
            var chartContextRef = $(this.refs.graphicContext);
            var graphicWrapper = $(this.refs.graphicWrapper);

            if (!props.dataSource || !props.dataSource.values || props.dataSource.values.length == 0) {
                graphicWrapper.hide();
                return;
            } else {
                graphicWrapper.show();
            }

            var margin = { top: 10, right: 15, bottom: 25, left: 35 };
            var width = chartRef.width() - margin.left - margin.right;
            var height = Math.ceil(width * props.aspectHeight / props.aspectWidth) - margin.top - margin.bottom;
            var height2 = Math.ceil(width * 2 / props.aspectWidth) - margin.top - margin.bottom;

            var num_ticks = props.ticks;

            if (chartRef.width() < props.mobileThreshold) {
                num_ticks = props.mobileTicks;

                height2 = Math.ceil(width * 3 / props.aspectWidth) - margin.top - margin.bottom;
            }

            // clear out existing graphics
            chartRef.empty();
            chartContextRef.empty();

            var data = [];
            var dataXTickValues = [];
            if (props.type != "bloodPressure") {
                var tempArray1 = [];
                for (var i = 0; i < props.dataSource.values.length; i++) {
                    tempArray1.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value,
                        color: "blue",
                        label: props.dataSource.label
                    });
                    dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
                }
            } else {
                var tempArray = [];
                for (var i = 0; i < props.dataSource.values.length; i++) {
                    tempArray.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value.systolic,
                        line: {
                            y1: props.dataSource.values[i].value.systolic,
                            y2: props.dataSource.values[i].value.diastolic
                        },
                        color: "blue",
                        label: props.dataSource.label
                    });

                    tempArray.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value.diastolic,
                        line: {
                            y1: props.dataSource.values[i].value.systolic,
                            y2: props.dataSource.values[i].value.diastolic
                        },
                        color: "red",
                        label: props.dataSource.label
                    });

                    dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
                }
                data = tempArray;
            }

            var uniqueArray = this.removeDuplicate(dataXTickValues);

            var x = d3.time.scale().range([10, width - 10]),
                x2 = d3.time.scale().range([10, width - 10]),
                y = d3.scale.linear().range([height, 0]),
                y2 = d3.scale.linear().range([height2, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function (d, i) {
                if (i == 0 || i == uniqueArray.length - 1) {
                    return "";
                }

                if (width <= props.mobileThreshold) {
                    var fmt = d3.time.format('%d');
                    return '\u2019' + fmt(d);
                } else {
                    var fmt = d3.time.format('%b-%d');
                    return fmt(d);
                }
            }),
                xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(function (d, i) {
                if (i == 0 || i == uniqueArray.length - 1) {
                    return "";
                }

                if (width <= props.mobileThreshold) {
                    var fmt = d3.time.format('%d');
                    return '\u2019' + fmt(d);
                } else {
                    var fmt = d3.time.format('%b-%d');
                    return fmt(d);
                }
            });

            var yAxis = d3.svg.axis().scale(y).orient("left").ticks(num_ticks);

            var line = d3.svg.line().interpolate("monotone").x(function (d) {
                return x(d.dateTime);
            }).y(function (d) {
                return y(d.value);
            });

            var area = d3.svg.area().interpolate("monotone").x(function (d) {
                return x(d.dateTime);
            }).y0(height).y1(function (d) {
                return y(d.value);
            });

            var area2 = d3.svg.area().interpolate("monotone").x(function (d) {
                return x2(d.dateTime);
            }).y0(height2).y1(function (d) {
                return y2(d.value);
            });

            var svg = d3.select(chartRef[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

            svg.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

            var focus = svg.append("g").attr("class", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var svg1 = d3.select(chartContextRef[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height2 + margin.top + margin.bottom);

            var context = svg1.append("g").attr("class", "context").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function (d) {
                return d.value + " " + props.unit + " on " + moment(d.dateTime).format("MM/DD hh:mm");
            });

            svg.call(tip);

            var brush = d3.svg.brush().x(x2).on("brush", function () {
                tip.hide();
                x.domain(brush.empty() ? x2.domain() : brush.extent());
                focus.select(".area").attr("d", area);
                focus.select(".line").attr("d", line);

                if (props.type == "bloodPressure") {
                    component.fillLines(focus, data, x, y, num_ticks, width);
                }

                component.fillCircles(focus, tip, data, x, y);

                focus.select(".x.axis").call(xAxis);

                // Reset zoom scale', s domain
                zoom.x(x);
            });

            var zoom = d3.behavior.zoom().on("zoom", function () {
                focus.select(".area").attr("d", area);
                focus.select(".line").attr("d", line);

                focus.selectAll('circle').attr('cx', function (d) {
                    return x(d.dateTime);
                }).attr('cy', function (d) {
                    return y(d.value);
                });

                focus.select(".line").attr("d", line);

                focus.select(".x.grid").call(xAxis);

                // Force changing brush range
                brush.extent(x.domain());

                svg.select(".brush").call(brush);
            });

            //x.domain(d3.extent(data, function(d) { return d.dateTime; }));

            x.domain([d3.min(uniqueArray, function (d) {
                return d;
            }), d3.max(uniqueArray, function (d) {
                return d;
            })]);

            y.domain([props.minValue, d3.max(data, function (d) {
                var n = d.value;
                return Math.ceil(n) + props.yDelta;
            })]);

            x2.domain(x.domain());
            y2.domain(y.domain());

            zoom.x(x);

            if (props.type != "bloodPressure") {
                var yAxisGrid = d3.svg.axis().scale(y).orient("right").ticks(num_ticks).tickSize(width, 0).tickFormat("");

                focus.append("g").classed('y', true).classed('grid', true).call(yAxisGrid);

                focus.append("path").datum(data).attr("class", "area").attr("d", area);

                focus.append("path").datum(data).attr("class", "line").attr("width", width).attr("d", line);
            }

            if (props.type == "bloodPressure") {
                component.fillLines(focus, data, x, y, num_ticks, width);
            }

            component.fillCircles(focus, tip, data, x, y);

            focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

            focus.append("g").attr("class", "y axis").call(yAxis);

            if (props.type != "bloodPressure") {
                context.append("path").datum(data).attr("class", "area").attr("d", area2);
            } else {
                context.selectAll('circle').data(data).enter().append("circle").attr("cx", function (d) {
                    return x2(d.dateTime);
                }).attr("cy", function (d) {
                    return y2(d.value);
                }).attr("r", 3).style("stroke", function (d) {
                    return d.color;
                }).style("fill", "none").style("stroke-width", 2);
            }
            context.append("g").attr("class", "x axis").attr("transform", "translate(0," + height2 + ")").call(xAxis2);

            context.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -6).attr("height", height2 + 7);

            /*var rect = focus.append("svg:rect")
             .attr("class", "pane")
             .attr("width", width)
             .attr("height", height)
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .call(zoom);*/
        },
        componentDidMount: function () {
            var component = this;
            component.drawGraphic(component.props);

            $(window).resize(function () {
                component.drawGraphic(component.props);
            });
        },
        componentDidUpdate: function (prevProps, prevState) {
            var component = this;
            component.drawGraphic(component.props);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "graphicWrapper", ref: "graphicWrapper" },
                React.createElement(
                    "h1",
                    null,
                    this.props.label
                ),
                React.createElement("div", { className: "graphic", id: "graphic", ref: "graphic" }),
                React.createElement("div", { className: "graphic", id: "graphicContext", ref: "graphicContext" })
            );
        }
    });

    var PatientVitalSingsPage = React.createClass({
        displayName: "PatientVitalSingsPage",

        getInitialState: function () {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                temperatureVitalSignsDef: emptyVitalSigns.temperatureVitalSignsDef,
                bloodPressureDef: emptyVitalSigns.temperatureVitalSignsDef,
                bloodOxygenDef: emptyVitalSigns.bloodOxygenDef,
                heartRateDef: emptyVitalSigns.heartRateDef,
                weightDef: emptyVitalSigns.weightDef,
                user: undefined
            };
        },
        componentDidMount: function () {
            var component = this;
            if (Modernizr.svg) {
                // if svg is supported, draw dynamic chart
                var userId = Bridge.Redirect.getQueryStringParam()["userId"];
                var vitalSigns = Bridge.Provider.getPatientVitalSigns(userId, function (result) {
                    if (result.success) {
                        var newDataSource = VitalSignsFactory.createVitalSings(result.data);
                        component.setState({
                            temperatureVitalSignsDef: newDataSource.temperatureVitalSignsDef,
                            bloodPressureDef: newDataSource.bloodPressureDef,
                            bloodOxygenDef: newDataSource.bloodOxygenDef,
                            heartRateDef: newDataSource.heartRateDef,
                            weightDef: newDataSource.weightDef
                        });
                        Bridge.Provider.getPatientDetails(userId, function (result) {
                            component.setState({
                                user: result.data
                            });
                        });
                    }
                });
            }
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(PatientDetails, { user: this.state.user }),
                React.createElement(
                    "div",
                    { className: "card" },
                    React.createElement(
                        "ul",
                        { className: "nav nav-tabs", role: "tablist" },
                        React.createElement(
                            "li",
                            { role: "presentation", className: "active" },
                            React.createElement(
                                "a",
                                { href: "#vital-signs", "aria-controls": "vital-signs", role: "tab", "data-toggle": "tab" },
                                React.createElement("img", { src: "images/icon-reports.png", width: "50" })
                            )
                        ),
                        React.createElement(
                            "li",
                            { role: "presentation" },
                            React.createElement(
                                "a",
                                { href: "#user-details", "aria-controls": "vital-signs", role: "tab", "data-toggle": "tab" },
                                React.createElement("img", { src: "images/icon-person.png", width: "50" })
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "tab-content" },
                        React.createElement(
                            "div",
                            { role: "tabpanel", className: "tab-pane active", id: "vital-signs" },
                            React.createElement(VitalSingChart, { dataSource: this.state.bloodPressureDef,
                                aspectWidth: 16,
                                aspectHeight: 9,
                                ticks: 10,
                                mobileThreshold: 500,
                                mobileTicks: 5,
                                type: this.state.bloodPressureDef.measurementType,
                                minValue: this.state.bloodPressureDef.minValue,
                                yDelta: 50,
                                label: this.state.bloodPressureDef.label,
                                unit: this.state.bloodPressureDef.unit }),
                            React.createElement(VitalSingChart, { dataSource: this.state.temperatureVitalSignsDef,
                                aspectWidth: 16,
                                aspectHeight: 9,
                                ticks: 10,
                                mobileThreshold: 500,
                                mobileTicks: 5,
                                type: this.state.temperatureVitalSignsDef.measurementType,
                                minValue: this.state.temperatureVitalSignsDef.minValue,
                                yDelta: 1,
                                label: this.state.temperatureVitalSignsDef.label,
                                unit: this.state.temperatureVitalSignsDef.unit }),
                            React.createElement(VitalSingChart, { dataSource: this.state.bloodOxygenDef,
                                aspectWidth: 16,
                                aspectHeight: 9,
                                ticks: 10,
                                mobileThreshold: 500,
                                mobileTicks: 5,
                                type: this.state.bloodOxygenDef.measurementType,
                                minValue: this.state.bloodOxygenDef.minValue,
                                yDelta: 5,
                                label: this.state.bloodOxygenDef.label,
                                unit: this.state.bloodOxygenDef.unit }),
                            React.createElement(VitalSingChart, { dataSource: this.state.heartRateDef,
                                aspectWidth: 16,
                                aspectHeight: 9,
                                ticks: 10,
                                mobileThreshold: 500,
                                mobileTicks: 5,
                                type: this.state.heartRateDef.measurementType,
                                minValue: this.state.heartRateDef.minValue,
                                yDelta: 5,
                                label: this.state.heartRateDef.label,
                                unit: this.state.heartRateDef.unit }),
                            React.createElement(VitalSingChart, { dataSource: this.state.weightDef,
                                aspectWidth: 16,
                                aspectHeight: 9,
                                ticks: 10,
                                mobileThreshold: 500,
                                mobileTicks: 5,
                                type: this.state.weightDef.measurementType,
                                minValue: this.state.weightDef.minValue,
                                yDelta: 0,
                                label: this.state.weightDef.label,
                                unit: this.state.weightDef.unit })
                        ),
                        React.createElement(
                            "div",
                            { role: "tabpanel", className: "tab-pane", id: "user-details" },
                            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientVitalSingsPage, null), document.getElementById("provider-vital-sings-container"));
})();