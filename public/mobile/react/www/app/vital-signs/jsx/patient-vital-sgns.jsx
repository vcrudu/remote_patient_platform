/**
 * Created by Victor on 2/25/2016.
 */
(function() {
    "use strict";

    $.material.init();

    var VitalSingChart = React.createClass({
        propTypes: {
            aspectWidth: React.PropTypes.number.isRequired,
            aspectHeight: React.PropTypes.number.isRequired,
            mobileThreshold: React.PropTypes.number.isRequired
        },
        getDefaultProps: function() {
            return {
                aspectWidth: 16,
                aspectHeight: 9,
                mobileThreshold: 500,
                ticks: 10,
                mobileTicks: 5
            };
        },
        getInitialState: function() {
            return {
                xAxis: undefined,
                x: undefined,
                x2: undefined,
                zoom: undefined,
                focus: undefined,
                brush: undefined,
                area: undefined,
                svg: undefined,
            }
        },
        drawGraphic: function(props)
        {
            var chartRef = $(this.refs.graphic);
            var chartContextRef = $(this.refs.graphicContext);
            var graphicWrapper = $(this.refs.graphicWrapper);

            if (!props.dataSource || !props.dataSource.values || props.dataSource.values.length == 0) {
                graphicWrapper.hide();
                return;
            }
            else {
                graphicWrapper.show();
            }

            var margin = { top: 10, right: 15, bottom: 25, left: 35 };
            var width = chartRef.width() - margin.left - margin.right;
            var height = Math.ceil((width * props.aspectHeight) / props.aspectWidth) - margin.top - margin.bottom;
            var height2 = Math.ceil((width * 2) / props.aspectWidth) - margin.top - margin.bottom;

            var num_ticks = props.ticks;

            if (chartRef.width() < props.mobileThreshold) {
                num_ticks = props.mobileTicks;
            }

            // clear out existing graphics
            chartRef.empty();
            chartContextRef.empty();

            var x = d3.time.scale().range([0, width]),
                x2 = d3.time.scale().range([0, width]),
                y = d3.scale.linear().range([height, 0]),
                y2 = d3.scale.linear().range([height2, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function(d,i) {
                    if (width <= props.mobileThreshold) {
                        var fmt = d3.time.format('%d');
                        return '\u2019' + fmt(d);
                    } else {
                        var fmt = d3.time.format('%b-%d');
                        return fmt(d);
                    }
                }),
                xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(function(d,i) {
                    if (width <= props.mobileThreshold) {
                        var fmt = d3.time.format('%d');
                        return '\u2019' + fmt(d);
                    } else {
                        var fmt = d3.time.format('%b-%d');
                        return fmt(d);
                    }
                });
            var yAxis = d3.svg.axis().scale(y).orient("left").ticks(num_ticks);

            var line = d3.svg.line()
                .interpolate("monotone")
                .x(function(d) { return x(d.dateTime); })
                .y(function(d) { return y(d.value); });

            var area = d3.svg.area()
                .interpolate("monotone")
                .x(function(d) { return x(d.dateTime); })
                .y0(height)
                .y1(function(d) { return y(d.value); });

            var area2 = d3.svg.area()
                .interpolate("monotone")
                .x(function(d) { return x2(d.dateTime); })
                .y0(height2)
                .y1(function(d) { return y2(d.value); });

            var svg = d3.select(chartRef[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var focus1 = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var focus2 = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var svg1 = d3.select(chartContextRef[0]).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var context = svg1.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var brush = d3.svg.brush()
                .x(x2)
                .on("brush", function() {
                    x.domain(brush.empty() ? x2.domain() : brush.extent());
                    focus.select(".area").attr("d", area);
                    focus1.select(".line").attr("d", line);
                    focus2.selectAll('circle')
                        .attr('cx', function(d) { return x(d.dateTime); })
                        .attr('cy', function(d) { return y(d.value); })
                        .attr('class', 'circle');
                    focus.select(".x.axis").call(xAxis);

                    // Reset zoom scale's domain
                    zoom.x(x);
                });

            var zoom = d3.behavior.zoom().on("zoom", function() {
                focus.select(".area").attr("d", area);
                focus1.select(".line").attr("d", line);
                focus2.selectAll('circle')
                    .attr('cx', function(d) { return x(d.dateTime); })
                    .attr('cy', function(d) { return y(d.value); })
                    .attr('class', 'circle');
                focus.select(".x.axis").call(xAxis);

                // Force changing brush range
                brush.extent(x.domain());
                svg.select(".brush").call(brush);
            });

            var rect = svg.append("svg:rect")
                .attr("class", "pane")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom);

            var data = props.dataSource.values.map(function(d) {
                return {
                    dateTime: moment(d.time),
                    value: d.value
                };

            });

            x.domain(d3.extent(data, function(d) { return d.dateTime; }));
            y.domain(
                [34,
                    d3.max(data, function(d) {
                            var n = d.value;
                            return Math.ceil(n);
                        }
                    )]);

            x2.domain(x.domain());
            y2.domain(y.domain());

            zoom.x(x);

            focus.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area);

            focus1.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("width", width)
                .attr("d", line);

            focus2.selectAll('circle').data(data).enter().append('circle')
                .attr('cx', function(d) { return x(d.dateTime); })
                .attr('cy', function(d) { return y(d.value); })
                .attr('r', 5)
                .attr('class', 'circle');

            focus.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            context.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("d", area2);

            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "x brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", -6)
                .attr("height", height2 + 7);
        },
        componentDidMount: function() {
            var component = this;
            component.drawGraphic(component.props);

            $(window).resize(function() {
                component.drawGraphic(component.props);
            });

        },
        componentDidUpdate: function(prevProps, prevState){
            var component = this;
            component.drawGraphic(component.props);
        },
        render: function() {
            return <div className="graphicWrapper" ref="graphicWrapper">
                <div className="graphic" id="graphic" ref="graphic"></div>
                <div className="graphic" id="graphicContext" ref="graphicContext"></div>
            </div>
        }
    });

    var PatientVitalSingsPage = React.createClass({
        getInitialState: function() {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                temperatureVitalSignsDef: emptyVitalSigns.temperatureVitalSignsDef
            }
        },
        componentDidMount: function() {
            var component = this;
            if (Modernizr.svg) { // if svg is supported, draw dynamic chart

                var vitalSigns = Bridge.getPatientVitalSigns(function(result) {
                    if (result.success) {
                        var newDataSource = VitalSignsFactory.createVitalSings(result.data);
                        component.setState({temperatureVitalSignsDef: newDataSource.temperatureVitalSignsDef});
                    }
                });
            }
        },
        render: function() {
            return <div>
                <VitalSingChart dataSource={this.state.temperatureVitalSignsDef}
                                dataUrl="data/data.csv"
                                aspectWidth={16}
                                aspectHeight={9}
                                ticks={10}
                                mobileThreshold={500}
                                mobileTicks={5} />
            </div>
        }
    });

    ReactDOM.render(<PatientVitalSingsPage />, document.getElementById("patient-vital-sings-container"));
})();