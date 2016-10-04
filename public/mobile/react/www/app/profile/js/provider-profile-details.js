/**
 * Created by Victor on 4/27/2016.
 */
(function () {
    "use strict";

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var USER_PROFILE_PROGRESS = React.createClass({
        displayName: "USER_PROFILE_PROGRESS",

        componentDidMount: function () {
            indeterminateProgress.start();
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        render: function () {
            return React.createElement("div", { className: "progress-bar-indeterminate" });
        }
    });

    var Question = React.createClass({
        displayName: "Question",

        componentDidMount: function () {},
        render: function () {
            return React.createElement(
                "li",
                { className: "question-answer" },
                React.createElement(
                    "div",
                    { className: "question" },
                    this.props.question
                ),
                React.createElement(
                    "div",
                    { className: "answers" },
                    this.props.answers.map(function (answer) {
                        return React.createElement(
                            "div",
                            { key: answer.id, className: "answer" },
                            answer.name + " - " + answer.choice_id
                        );
                    })
                )
            );
        }
    });

    var ConditionResult = React.createClass({
        displayName: "ConditionResult",

        componentDidMount: function () {
            var probability = this.props.probability * 100;
            var conditionId = "#progressBar_" + this.props.conditionId.toString().replace(".", "");
            document.querySelector(conditionId).MaterialProgress.setProgress(probability);
        },
        render: function () {
            var progressBarId = this.props.conditionId.toString().replace(".", "");
            return React.createElement(
                "div",
                { className: "conditionCard" },
                React.createElement(
                    "div",
                    { className: "demo-card-wide mdl-card mdl-shadow--2dp" },
                    React.createElement(
                        "div",
                        { className: "mdl-card__title" },
                        React.createElement(
                            "h2",
                            { className: "mdl-card__title-text" },
                            this.props.label
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mdl-card__supporting-text" },
                        (this.props.probability * 100).toFixed(2),
                        " %",
                        React.createElement("div", { ref: "progressBar", id: "progressBar_" + progressBarId, className: "mdl-progress mdl-js-progress" })
                    )
                )
            );
        }
    });

    var Symptoms = React.createClass({
        displayName: "Symptoms",

        render: function () {
            var diagnosticResult = this.props.symptomResult;

            var coditions = [].map(function (item) {
                return React.createElement("div", null);
            });

            if (diagnosticResult && diagnosticResult.conditions) {
                var sortedConditions = _.sortBy(diagnosticResult.conditions, function (condition) {
                    return condition.probability * -1;
                }).slice(0, 5);

                coditions = sortedConditions.map(function (condition) {
                    return React.createElement(ConditionResult, { key: condition.name, label: condition.name, probability: condition.probability, conditionId: condition.probability * 100000 });
                });
            }

            var questions = [].map(function (item) {
                return React.createElement("div", null);
            });

            if (diagnosticResult && diagnosticResult.evidence) {
                var groupedQuestions = _.groupBy(diagnosticResult.evidence, function (value) {
                    return value.type + '#' + value.text;
                });

                questions = _.map(groupedQuestions, function (group) {
                    var model = {
                        question: group[0].text,
                        id: group[0].text.replace(/\s/g, ''),
                        answers: _.map(group, function (q, key) {
                            return { name: q.name, choice_id: q.choice_id, id: q.id };
                        })
                    };

                    return React.createElement(Question, { key: model.id, question: model.question, answers: model.answers });
                });
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "condition-cards" },
                    React.createElement(
                        "ul",
                        { className: "questions-list" },
                        questions
                    ),
                    coditions
                )
            );
        }
    });

    var VitalSignCharts = React.createClass({
        displayName: "VitalSignCharts",

        getInitState: function () {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                loadCharts: false,
                temperatureVitalSignsDef: emptyVitalSigns.temperatureVitalSignsDef,
                bloodPressureDef: emptyVitalSigns.bloodPressureDef,
                bloodOxygenDef: emptyVitalSigns.bloodOxygenDef,
                heartRateDef: emptyVitalSigns.heartRateDef,
                weightDef: emptyVitalSigns.weightDef
            };
        },
        handleChartsClick: function (state) {
            this.setState({
                loadCharts: true,
                temperatureVitalSignsDef: state.temperatureVitalSignsDef,
                bloodPressureDef: state.bloodPressureDef,
                bloodOxygenDef: state.bloodOxygenDef,
                heartRateDef: state.heartRateDef,
                weightDef: state.weightDef
            });
        },
        render: function () {
            if (!this.state) {
                return React.createElement(
                    "div",
                    { role: "tabpanel", className: "tab-pane", id: "vital-signs" },
                    " "
                );
            } else {
                if (!this.state.loadCharts) {
                    return React.createElement(
                        "div",
                        { role: "tabpanel", className: "tab-pane", id: "vital-signs" },
                        " "
                    );
                } else {
                    return React.createElement(
                        "div",
                        { role: "tabpanel", className: "tab-pane", id: "vital-signs" },
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
                    );
                }
            }
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
                /*area: undefined,*/
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
            }).attr("r", 12).attr("class", 'circle').attr("data-legend", function (d) {
                return d.label;
            }).style("fill", function (d) {
                return d.color;
            }).on("click", function (d) {
                tip.show(d);d3.select(this).style("stroke", d.color).style("fill", "white").style("stroke-width", 2);
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
                        color: "#7E57C2",
                        label: props.dataSource.label
                    });

                    dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
                }
                data = tempArray1;
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
                        color: "#311B92",
                        label: props.dataSource.label
                    });

                    tempArray.push({
                        dateTime: moment(props.dataSource.values[i].time),
                        value: props.dataSource.values[i].value.diastolic,
                        line: {
                            y1: props.dataSource.values[i].value.systolic,
                            y2: props.dataSource.values[i].value.diastolic
                        },
                        color: "#7E57C2",
                        label: props.dataSource.label
                    });

                    dataXTickValues.push(moment(props.dataSource.values[i].time).format("YYYY-MM-DDThh:mm:ss"));
                }
                data = tempArray;
            }

            var uniqueArray = this.removeDuplicate(dataXTickValues);

            var x = d3.time.scale().range([0, width]),
                x2 = d3.time.scale().range([0, width]),
                y = d3.scale.linear().range([height, 0]),
                y2 = d3.scale.linear().range([height2, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(function (d, i) {
                if (i == 0 || i == uniqueArray.length - 1) {
                    return "";
                }

                var fmt = d3.time.format('%b-%d');
                return fmt(d);
            }).tickValues(uniqueArray),
                xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(function (d, i) {
                if (i == 0 || i == uniqueArray.length - 1) {
                    return "";
                }

                var fmt = d3.time.format('%b-%d');
                return fmt(d);
            }).tickValues(uniqueArray);

            var yAxis = d3.svg.axis().scale(y).orient("left").ticks(num_ticks);

            var zoom = d3.behavior.zoom().on("zoom", function () {
                tip.hide();
                focus.selectAll('circle').attr('cx', function (d) {
                    return x(d.dateTime);
                }).attr('cy', function (d) {
                    return y(d.value);
                });

                if (props.type == "bloodPressure") {
                    component.fillLines(focus, data, x, y, num_ticks, width);
                }

                component.fillCircles(focus, tip, data, x, y);

                focus.select(".x.grid").call(xAxis);

                // Force changing brush range
                brush.extent(x.domain());

                svg1.select(".brush").call(brush);
            });

            var svg = d3.select(chartRef[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).call(zoom);

            svg.append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);

            var focus = svg.append("g").attr("class", "focus").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Set up zoom behavior
            zoom.x(x);

            var svg1 = d3.select(chartContextRef[0]).append("svg").attr("width", width + margin.left + margin.right).attr("height", height2 + margin.top + margin.bottom);

            var context = svg1.append("g").attr("class", "context").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function (d) {
                return d.value + " " + props.unit + " on " + moment(d.dateTime).format("MM/DD hh:mm");
            });

            svg.call(tip);

            var brush = d3.svg.brush().x(x2).on("brush", function () {
                tip.hide();
                x.domain(brush.empty() ? x2.domain() : brush.extent());

                if (props.type == "bloodPressure") {
                    component.fillLines(focus, data, x, y, num_ticks, width);
                }

                component.fillCircles(focus, tip, data, x, y);

                focus.select(".x.axis").call(xAxis);

                // Reset zoom scale', s domain
                zoom.x(x);
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
            }

            if (props.type == "bloodPressure") {
                component.fillLines(focus, data, x, y, num_ticks, width);
            }

            component.fillCircles(focus, tip, data, x, y);

            focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

            focus.append("g").attr("class", "y axis").call(yAxis);

            if (props.type != "bloodPressure") {
                context.selectAll('circle').data(data).enter().append("circle").attr("cx", function (d) {
                    return x2(d.dateTime);
                }).attr("cy", function (d) {
                    return y2(d.value);
                }).attr("r", 3).style("stroke", function (d) {
                    return d.color;
                }).style("fill", "none").style("stroke-width", 2);
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
                { className: "chart-card-square mdl-card mdl-shadow--2dp", ref: "graphicWrapper" },
                React.createElement(
                    "div",
                    { className: "mdl-card__title" },
                    React.createElement(
                        "h2",
                        { className: "mdl-card__title-text" },
                        this.props.label
                    )
                ),
                React.createElement(
                    "div",
                    { className: "mdl-card__supporting-text" },
                    React.createElement("div", { className: "graphic", id: "graphic", ref: "graphic" })
                ),
                React.createElement(
                    "div",
                    { className: "mdl-card__actions mdl-card--border" },
                    React.createElement("div", { className: "graphic", id: "graphicContext", ref: "graphicContext" })
                )
            );
        }
    });

    var UserGeneralInfo = React.createClass({
        displayName: "UserGeneralInfo",

        getInitialState: function () {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                user: undefined
            };
        },
        componentDidMount: function () {
            var userId = Bridge.Redirect.getQueryStringParam()["userId"];
            var component = this;

            Bridge.Provider.getPatientDetails(userId, function (result) {
                indeterminateProgress.end();
                component.setState({
                    user: result.data
                });
            });
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "demo-list-action mdl-list" },
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "call"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.mobile : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "mobile"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "place"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.address.addressLine1 : "",
                            this.state.user ? ", " + this.state.user.address.town : "",
                            this.state.user ? ", " + this.state.user.address.county : "",
                            this.state.user ? ", " + this.state.user.address.country : "",
                            this.state.user ? ", " + this.state.user.address.postCode : ""
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "message"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.email : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "email"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "group"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.sex : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "sex"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-list__item mdl-list__item--two-line" },
                    React.createElement(
                        "span",
                        { className: "mdl-list__item-primary-content" },
                        React.createElement(
                            "i",
                            { className: "material-icons mdl-list__item-avatar" },
                            "assignment"
                        ),
                        React.createElement(
                            "span",
                            null,
                            this.state.user ? this.state.user.nhsNumber : ""
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-sub-title" },
                            "nhs number"
                        )
                    )
                ),
                React.createElement("div", { className: "divider" }),
                React.createElement("div", { className: "clear" })
            );
        }
    });

    var ProviderPatientProfileDetails = React.createClass({
        displayName: "ProviderPatientProfileDetails",

        getInitialState: function () {
            var emptyVitalSigns = VitalSignsFactory.createEmptyVitalSings();
            return {
                temperatureVitalSignsDef: emptyVitalSigns.temperatureVitalSignsDef,
                bloodPressureDef: emptyVitalSigns.bloodPressureDef,
                bloodOxygenDef: emptyVitalSigns.bloodOxygenDef,
                heartRateDef: emptyVitalSigns.heartRateDef,
                weightDef: emptyVitalSigns.weightDef,
                symptomResult: undefined,
                user: undefined,
                appointmentTime: "",
                name: "",
                onlineStatus: "",
                chartsLoaded: false
            };
        },
        socketCallback: function (message) {
            var event = message.data.event;
            var userId = message.data.user;

            if (event == "onlineStatus") {
                this.setState({ onlineStatus: message.data.status });
            }
        },
        handleChartsClick: function () {
            var component = this;
            if (Modernizr.svg) {
                // if svg is supported, draw dynamic chart
                /*if (component.refs["vitalSignCharts"].loadCharts) {
                    return;
                }*/

                /*if (component.state.chartsLoaded) {
                    return;
                }*/

                indeterminateProgress.start();
                var userId = Bridge.Redirect.getQueryStringParam()["userId"];
                Bridge.Provider.getPatientVitalSigns(userId, function (result) {
                    indeterminateProgress.end();
                    if (result.success) {
                        var newDataSource = VitalSignsFactory.createVitalSings(result.data);
                        component.setState({
                            temperatureVitalSignsDef: newDataSource.temperatureVitalSignsDef,
                            bloodPressureDef: newDataSource.bloodPressureDef,
                            bloodOxygenDef: newDataSource.bloodOxygenDef,
                            heartRateDef: newDataSource.heartRateDef,
                            weightDef: newDataSource.weightDef,
                            chartsLoaded: true
                        });
                        component.refs["vitalSignCharts"].handleChartsClick(component.state);
                    }
                });
            }
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

                var tabsBar = $(".mdl-tabs__tab-bar");
                var tabBarTop = tabsBar.offset().top;

                var layout = $(".mdl-layout");
                var st = 0;
                $(layout).scroll(function () {
                    st = $(layout).scrollTop();

                    if (st >= tabBarTop) {
                        tabsBar.css({ "position": "fixed", "background-color": "#EEEEEE", "width": "100%", "top": 0, "z-index": 10000 });
                    } else {
                        tabsBar.css({ "position": "", "background-color": "", "width": "", "top": "", "z-index": "" });
                    }
                });

                $('#patient-details-collapse').on('show.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').addClass('active');
                }).on('hide.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').removeClass('active');
                });
            });

            Bridge.Provider.socketCallBack = this.socketCallback;
        },
        formatDate: function (dateString) {
            var date = moment(dateString);
            return date.calendar();
        },
        handleCallClick: function () {
            var patientId = decodeURIComponent(Bridge.Redirect.getQueryStringParam()["userId"]);
            var onlineStatus = this.state.onlineStatus;

            if (onlineStatus == "offline") {
                return;
            }
            Bridge.Provider.callPatient(patientId, this.state.name, function (callResult) {});
        },
        handleSymptomsClick: function () {
            var time = this.state.appointmentTime;
            var userId = Bridge.Redirect.getQueryStringParam()["userId"];;
            if (time && time != "" && userId) {
                var unixTime = moment(time).valueOf();
                var component = this;
                if (unixTime) {
                    indeterminateProgress.start();
                    Bridge.Symptomate.getEvidenceBySlotId(userId, unixTime, function (result) {
                        if (result.success) {
                            component.setState({ symptomResult: result.data });
                        }

                        indeterminateProgress.end();
                    });
                }
            }
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
            var button = this.refs.callButton;
            button.addEventListener('click', this.handleCallClick);

            var vitalSignsLink = this.refs.vitalSignsLink;
            vitalSignsLink.addEventListener('click', this.handleChartsClick);

            var symptomsLink = this.refs.symptomsLink;
            symptomsLink.addEventListener('click', this.handleSymptomsClick);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "mdl-layout mdl-js-layout" },
                React.createElement(
                    "header",
                    { className: "mdl-layout__header" },
                    React.createElement(USER_PROFILE_PROGRESS, null),
                    React.createElement(
                        "div",
                        { className: "primary-bg profile-image-container" },
                        React.createElement("img", { src: "images/user.png", width: "120", height: "120", className: this.state.onlineStatus == "offline" ? "img-responsive center-block profile-user-photo" : "img-responsive center-block profile-user-photo" }),
                        React.createElement(
                            "div",
                            { className: "userName" },
                            React.createElement(
                                "h4",
                                null,
                                this.state.name ? this.state.name : name
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mdl-layout__tab-bar mdl-js-ripple-effect" },
                        React.createElement(
                            "a",
                            { href: "#user-info", className: "mdl-layout__tab is-active" },
                            React.createElement(
                                "i",
                                { className: "material-icons tab-icon show-mobile" },
                                "face"
                            ),
                            React.createElement(
                                "span",
                                { className: "hide-mobile" },
                                "User Info"
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "#vital-signs", className: "mdl-layout__tab", ref: "vitalSignsLink" },
                            React.createElement(
                                "i",
                                { className: "material-icons tab-icon show-mobile" },
                                "update"
                            ),
                            React.createElement(
                                "span",
                                { className: "hide-mobile" },
                                "Vital Signs"
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "#symptoms", className: "mdl-layout__tab", ref: "symptomsLink" },
                            React.createElement(
                                "i",
                                { className: "material-icons tab-icon show-mobile" },
                                "favorite"
                            ),
                            React.createElement(
                                "span",
                                { className: "hide-mobile" },
                                "Symptoms"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "call-fab-container" },
                        React.createElement(
                            "button",
                            { ref: "callButton", className: this.state.onlineStatus == "offline" ? "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored offline" : "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" },
                            React.createElement(
                                "i",
                                { className: "material-icons" },
                                "call"
                            )
                        )
                    )
                ),
                React.createElement(
                    "main",
                    { className: "mdl-layout__content" },
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "user-info" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(UserGeneralInfo, null)
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "vital-signs" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(VitalSignCharts, { ref: "vitalSignCharts" })
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "symptoms" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(Symptoms, { ref: "symtoms", symptomResult: this.state.symptomResult })
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderPatientProfileDetails, null), document.getElementById("provider-profile-details-container"));
})();