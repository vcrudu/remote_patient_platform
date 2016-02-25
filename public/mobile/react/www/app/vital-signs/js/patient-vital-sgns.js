/**
 * Created by Victor on 2/25/2016.
 */
(function () {
    "use strict";

    $.material.init();

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
                mobileThreshold: 500
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
        brushed: function () {
            if (this.state.xAxis && this.state.x && this.state.x2 && this.state.zoom && this.state.focus && this.state.brush && this.state.area) {

                this.state.x.domain(this.state.brush.empty() ? this.state.x2.domain() : this.state.brush.extent());
                this.state.focus.select(".area").attr("d", this.state.area);
                this.state.focus.select(".x.axis").call(this.state.xAxis);
                // Reset zoom scale's domain
                this.state.zoom.x(this.state.x);
            }
        },
        draw: function () {
            if (this.state.xAxis && this.state.x && this.state.zoom && this.state.focus && this.state.brush && this.state.area) {

                this.state.focus.select(".area").attr("d", this.state.area);
                this.state.focus.select(".x.axis").call(this.state.xAxis);
                // Force changing brush range
                this.state.brush.extent(this.state.x.domain());
                this.state.svg.select(".brush").call(this.state.brush);
            }
        },
        type: function (d) {
            d.date = d3.time.format('%Y-%m').parse(d.date);
            d.price = +d.price;
            return d;
        },
        drawGraphic: function (props) {
            var chartRef = $(this.refs.graphic);
            var chartContextRef = $(this.refs.graphicContext);

            var margin = { top: 10, right: 15, bottom: 25, left: 35 };
            var width = chartRef.width() - margin.left - margin.right;
            var height = Math.ceil(width * props.aspectHeight / props.aspectWidth) - margin.top - margin.bottom;
            var height2 = Math.ceil(width * 2 / props.aspectWidth) - margin.top - margin.bottom;

            var num_ticks = 13;

            if (chartRef.width() < props.mobileThreshold) {
                num_ticks = 5;
            }

            // clear out existing graphics
            chartRef.empty();
            chartContextRef.empty();

            var parseDate = d3.time.format("%Y-%m").parse;

            var x = d3.time.scale().range([0, width]),
                x2 = d3.time.scale().range([0, width]),
                y = d3.scale.linear().range([height, 0]),
                y2 = d3.scale.linear().range([height2, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function (d, i) {
                if (width <= props.mobileThreshold) {
                    var fmt = d3.time.format('%y');
                    return '\u2019' + fmt(d);
                } else {
                    var fmt = d3.time.format('%Y');
                    return fmt(d);
                }
            }),
                xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(function (d, i) {
                if (width <= props.mobileThreshold) {
                    var fmt = d3.time.format('%y');
                    return '\u2019' + fmt(d);
                } else {
                    var fmt = d3.time.format('%Y');
                    return fmt(d);
                }
            });
            var yAxis = d3.svg.axis().scale(y).orient("left").ticks(num_ticks);;

            var brush = d3.svg.brush().x(x2).on("brush", this.brushed);

            var area = d3.svg.area().interpolate("monotone").x(function (d) {
                return x(d.date);
            }).y0(height).y1(function (d) {
                return y(d.price);
            });

            var area2 = d3.svg.area().interpolate("monotone").x(function (d) {
                return x2(d.date);
            }).y0(height2).y1(function (d) {
                return y2(d.price);
            });

            var svg = d3.select(chartRef[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

            svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

            var focus = svg.append("g").attr("class", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var svg1 = d3.select(chartContextRef[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

            var context = svg1.append("g").attr("class", "context").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var zoom = d3.behavior.zoom().on("zoom", this.draw);

            var rect = svg.append("svg:rect").attr("class", "pane").attr("width", width).attr("height", height).attr("transform", "translate(" + margin.left + "," + margin.top + ")").call(zoom);

            var state = this;
            d3.csv(props.dataUrl, this.type, function (error, data) {
                x.domain(d3.extent(data.map(function (d) {
                    return d.date;
                })));
                y.domain([0, d3.max(data.map(function (d) {
                    var n = d.price;
                    return Math.ceil(n);
                }))]);
                x2.domain(x.domain());
                y2.domain(y.domain());

                // Set up zoom behavior
                zoom.x(x);

                focus.append("path").datum(data).attr("class", "area").attr("d", area);

                focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

                focus.append("g").attr("class", "y axis").call(yAxis);

                context.append("path").datum(data).attr("class", "area").attr("d", area2);

                context.append("g").attr("class", "x axis").attr("transform", "translate(0," + height2 + ")").call(xAxis2);

                context.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -6).attr("height", height2 + 7);

                state.setState({ x: x, x2: x2 });
            });

            this.setState({ xAxis: xAxis, brush: brush, zoom: zoom, focus: focus, area: area, svg: svg });
        },
        componentDidMount: function () {
            var component = this;

            if (Modernizr.svg) {
                // if svg is supported, draw dynamic chart
                component.drawGraphic(component.props);

                $(window).resize(function () {
                    component.drawGraphic(component.props);
                });
            }
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "graphicWrapper" },
                React.createElement("div", { className: "graphic", id: "graphic", ref: "graphic" }),
                React.createElement("div", { className: "graphic", id: "graphicContext", ref: "graphicContext" })
            );
        }
    });

    var PatientVitalSingsPage = React.createClass({
        displayName: "PatientVitalSingsPage",

        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(VitalSingChart, { dataUrl: "data/data.csv", aspectWidth: 16, aspectHeight: 9, mobileThreshold: 500 })
            );
        }
    });

    ReactDOM.render(React.createElement(PatientVitalSingsPage, null), document.getElementById("patient-vital-sings-container"));
})();