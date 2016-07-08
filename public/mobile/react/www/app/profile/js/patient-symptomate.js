/**
 * Created by Victor on 6/22/2016.
 */

(function () {

    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var Checkbox = ReactMDL.Checkbox;
    var RadioGroup = ReactMDL.RadioGroup;
    var Radio = ReactMDL.Radio;
    var Button = ReactMDL.Button;
    var Card = ReactMDL.Card;
    var CardTitle = ReactMDL.CardTitle;
    var CardText = ReactMDL.CardText;
    var ProgressBar = ReactMDL.ProgressBar;
    var List = ReactMDL.List;
    var ListItem = ReactMDL.ListItem;

    var ChoiceButton = React.createClass({
        displayName: "ChoiceButton",

        handleClick: function () {
            this.props.onClicked(this.props.id);
        },
        render: function () {
            return React.createElement(
                Button,
                { key: this.props.question.id + "_" + this.props.id + "_button", ripple: true, onClick: this.handleClick, className: "accent-color" },
                this.props.label
            );
        }
    });

    var numberOfPosts = 10;

    var ConditionResult = React.createClass({
        displayName: "ConditionResult",

        render: function () {
            return React.createElement(
                "div",
                { className: "conditionCard" },
                React.createElement(
                    Card,
                    { shadow: 0 },
                    React.createElement(
                        CardTitle,
                        null,
                        this.props.label
                    ),
                    React.createElement(
                        CardText,
                        null,
                        (this.props.probability * 100).toFixed(2),
                        " %",
                        React.createElement(ProgressBar, { progress: this.props.probability * 100, className: "progress-bar-result" })
                    )
                )
            );
        }
    });

    var SingleQuestion = React.createClass({
        displayName: "SingleQuestion",

        getInitialState: function () {
            return {
                question: this.props.question
            };
        },
        handleNext: function (choice_id) {
            var answers = [];
            answers.push({
                "id": this.props.question.items[0].id,
                "choice_id": choice_id,
                "name": this.props.question.items[0].name,
                "type": this.props.question.type,
                "text": this.props.question.text
            });
            this.props.handleNext(answers, this.updateQuestion);
        },
        handlePrev: function () {
            this.props.handlePrev(this.updateQuestion);
        },
        updateQuestion: function (question) {
            if (this.isMounted()) {
                this.setState({ question: question });
            }
        },
        render: function () {
            var component = this;
            var question = component.props.question.items[0];

            var questionsButtons = question.choices.map(function (choise) {
                return React.createElement(ChoiceButton, { key: choise.id + "_" + question.id, question: question, id: choise.id, label: choise.label, onClicked: component.handleNext });
            });

            return React.createElement(
                "div",
                { className: "group_multiple" },
                React.createElement(
                    "div",
                    { className: "question" },
                    component.props.question.text
                ),
                React.createElement(
                    "div",
                    { className: "answer-buttons" },
                    React.createElement(
                        Button,
                        { ripple: true, onClick: component.handlePrev },
                        "Back"
                    ),
                    questionsButtons
                )
            );
        }
    });

    var GroupSingleQuestion = React.createClass({
        displayName: "GroupSingleQuestion",

        getInitialState: function () {
            return {
                question: this.props.question
            };
        },
        onChange: function (event) {
            var answerId = $(event.target).attr("value");
            var isChecked = $(event.target).is(":checked");

            var answer = _.find(this.state.question.items, function (answer) {
                return answer.id === answerId;
            });

            if (answer) {
                answer.selected = isChecked;
            }

            this.state.question.items.map(function (answer) {
                if (answer.id != answerId) {
                    answer.selected = false;
                }
            });
        },
        handleNext: function () {
            var selectedAnswers = _.filter(this.state.question.items, function (answer) {
                return answer.selected === true;
            });

            if (selectedAnswers && selectedAnswers.length > 0) {
                var answers = [];

                for (var j = 0; j < selectedAnswers.length; j++) {
                    answers.push({
                        "id": selectedAnswers[j].id,
                        "choice_id": "present",
                        "name": selectedAnswers[j].name,
                        "type": this.state.question.type,
                        "text": this.state.question.text
                    });
                }

                this.props.handleNext(answers, this.updateQuestion);
            }
        },
        handlePrev: function () {
            this.props.handlePrev(this.updateQuestion);
        },
        updateQuestion: function (question) {
            if (this.isMounted()) {
                this.setState({ question: question });
            }
        },
        render: function () {
            var component = this;

            var questions = [].map(function (item) {
                return React.createElement("div", null);
            });

            if (this.props.question && this.props.question.items && this.props.question.items.length > 0) {
                questions = this.props.question.items.map(function (answer) {
                    return React.createElement(
                        ListItem,
                        { key: answer.id + "_check" },
                        React.createElement(
                            Radio,
                            { key: answer.id, value: answer.id, ripple: true },
                            answer.name
                        )
                    );
                });
            }

            return React.createElement(
                "div",
                { className: "group_single" },
                React.createElement(
                    "div",
                    { className: "question" },
                    this.props.question.text
                ),
                React.createElement(
                    RadioGroup,
                    { name: "groupSingleQuestion", onChange: component.onChange },
                    React.createElement(
                        List,
                        null,
                        questions
                    )
                ),
                React.createElement(
                    Button,
                    { ripple: true, onClick: this.handlePrev },
                    "Back"
                ),
                React.createElement(
                    Button,
                    { ripple: true, onClick: this.handleNext, className: "accent-color" },
                    "Next"
                )
            );
        }
    });

    var GroupMultipleQuestion = React.createClass({
        displayName: "GroupMultipleQuestion",

        getInitialState: function () {
            return {
                question: this.props.question
            };
        },
        onChange: function (event) {
            var parent = $(event.target).parent();
            var answerId = parent.attr("data-reactid").split("$")[3];
            var isChecked = $(event.target).is(":checked");

            var answer = _.find(this.state.question.items, function (answer) {
                return answer.id === answerId;
            });

            if (answer) {
                answer.selected = isChecked;
            }
        },
        handleNext: function () {
            if (this.state.question.items && this.state.question.items.length > 0) {
                var answers = [];

                for (var j = 0; j < this.state.question.items.length; j++) {
                    var choice = this.state.question.items[j].selected ? "present" : "absent";
                    answers.push({
                        "id": this.state.question.items[j].id,
                        "choice_id": choice,
                        "name": this.state.question.items[j].name,
                        "type": this.state.question.type,
                        "text": this.state.question.text
                    });
                }

                this.props.handleNext(answers, this.updateQuestion);
            }
        },
        handlePrev: function () {
            this.props.handlePrev(this.updateQuestion);
        },
        updateQuestion: function (question) {
            if (this.isMounted()) {
                this.setState({ question: question });
            }
        },
        render: function () {
            var component = this;
            var questions = [].map(function (item) {
                return React.createElement("div", null);
            });

            if (this.props.question && this.props.question.items && this.props.question.items.length > 0) {
                questions = this.props.question.items.map(function (answer) {
                    return React.createElement(
                        ListItem,
                        { key: answer.id + "_check" },
                        React.createElement(Checkbox, { key: answer.id, label: answer.name, ripple: true, onChange: component.onChange })
                    );
                });
            }

            return React.createElement(
                "div",
                { className: "group_multiple" },
                React.createElement(
                    "div",
                    { className: "question" },
                    this.props.question.text
                ),
                React.createElement(
                    List,
                    null,
                    questions
                ),
                React.createElement(
                    Button,
                    { ripple: true, onClick: this.handlePrev },
                    "Back"
                ),
                React.createElement(
                    Button,
                    { ripple: true, onClick: this.handleNext, className: "accent-color" },
                    "Next"
                )
            );
        }
    });

    var SymptomQuestions = React.createClass({
        displayName: "SymptomQuestions",

        handleNext: function (answers, updateQuestion) {
            this.props.handleNext(answers, updateQuestion);
        },
        handlePrev: function (updateQuestion) {
            this.props.handlePrev(updateQuestion);
        },
        render: function () {
            var component = this;
            var questionType = component.props.question ? component.props.question.type : "";

            var question = undefined;

            switch (questionType) {
                case "group_multiple":
                    question = function () {
                        return React.createElement(GroupMultipleQuestion, { question: component.props.question, handleNext: component.handleNext, handlePrev: component.handlePrev });
                    };
                    break;
                case "group_single":
                    question = function () {
                        return React.createElement(GroupSingleQuestion, { question: component.props.question, handleNext: component.handleNext, handlePrev: component.handlePrev });
                    };
                    break;
                case "single":
                    question = function () {
                        return React.createElement(SingleQuestion, { question: component.props.question, handleNext: component.handleNext, handlePrev: component.handlePrev });
                    };
                    break;
                default:
                    question = function () {
                        return React.createElement("div", null);
                    };
                    break;
            }

            return React.createElement(
                "div",
                { className: this.props.show ? "show" : "hide" },
                question()
            );
        }
    });

    var CommonSymptoms = React.createClass({
        displayName: "CommonSymptoms",

        getInitialState: function () {
            return {
                commonSymptoms: [],
                selectedSymptoms: []
            };
        },
        setCommonSymptoms: function (symtoms) {
            this.setState({ commonSymptoms: symtoms });
        },
        onChange: function (event) {
            var parent = $(event.target).parent();
            var symptomId = parent.attr("data-reactid").split("$")[3];
            var isChecked = $(event.target).is(":checked");

            var symptom = _.find(this.state.commonSymptoms, function (symptom) {
                return symptom.id === symptomId;
            });
            if (symptom) {
                symptom.selected = isChecked;
            }
        },
        handleNext: function () {
            var selectedSymptoms = _.filter(this.state.commonSymptoms, function (symptom) {
                return symptom.selected === true;
            });

            if (selectedSymptoms && selectedSymptoms.length > 0) {
                var selections = [];

                for (var j = 0; j < selectedSymptoms.length; j++) {
                    selections.push({
                        "id": selectedSymptoms[j].id,
                        "choice_id": "present",
                        "name": selectedSymptoms[j].name,
                        "text": "Do you have any of following symptoms?",
                        "type": "group_multiple"
                    });
                }

                this.props.handleNext(selections, undefined);
            }
        },
        handlePrev: function () {
            this.props.handlePrev(undefined);
        },
        render: function () {
            var component = this;
            var symptoms = component.state.commonSymptoms.map(function (symptom) {
                return React.createElement(
                    ListItem,
                    { key: symptom.id + "_check" },
                    React.createElement(Checkbox, { key: symptom.id, label: symptom.name, ripple: true, onChange: component.onChange })
                );
            });

            return React.createElement(
                "div",
                { className: this.props.show ? "show" : "hide" },
                React.createElement(
                    "div",
                    { className: "question" },
                    "Do you have any of following symptoms?"
                ),
                React.createElement(
                    List,
                    null,
                    symptoms
                ),
                React.createElement(
                    Button,
                    { ripple: true, onClick: this.handleNext, className: "accent-color" },
                    "Next"
                )
            );
        }
    });

    var PatientSymptomateResult = React.createClass({
        displayName: "PatientSymptomateResult",

        goToBookAppointment: function () {
            Bridge.Redirect.redirectToWithLevelsUp("appointments/patient-appointments.html?slotId=" + this.props.slotId, 2);
        },
        render: function () {
            var diagnosticResult = this.props.diagnosticResult;

            var coditions = [].map(function (item) {
                return React.createElement("div", null);
            });

            if (diagnosticResult && diagnosticResult.conditions) {
                var sortedConditions = _.sortBy(diagnosticResult.conditions, function (condition) {
                    return condition.probability * -1;
                }).slice(0, 5);

                coditions = sortedConditions.map(function (condition) {
                    return React.createElement(ConditionResult, { key: condition.name, label: condition.name, probability: condition.probability });
                });
            }

            return React.createElement(
                "div",
                { className: this.props.show ? "show" : "hide" },
                React.createElement(
                    "div",
                    { className: this.props.slotId ? "show book-appointment-button" : "hide book-appointment-button" },
                    React.createElement(
                        Button,
                        { type: "button", className: "mdl-button mdl-button--accent", onClick: this.goToBookAppointment },
                        "Book Appointment"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "question" },
                    "Result"
                ),
                React.createElement(
                    "div",
                    { className: "condition-cards" },
                    coditions
                )
            );
        }
    });

    var PatientSymptomate = React.createClass({
        displayName: "PatientSymptomate",

        getInitialState: function () {
            return {
                commonSymptoms: [],
                selections: [],
                selectionStep: 0,
                diagnostic: { "sex": "male", "age": "29", "evidence": [] },
                diagnosticResponse: {},
                showCommonSymptoms: false,
                showQuestion: false,
                showResult: false,
                evidences: [],
                emptyEvidence: {},
                slotId: undefined
            };
        },
        getEmptyDiagnostic: function () {
            return this.state.emptyEvidence;
        },
        componentDidMount: function () {
            var component = this;
            Bridge.Symptomate.getEmptyEvidence(function (result) {
                if (result.success) {
                    Bridge.Symptomate.getSymptoms(function (symptomsResult) {
                        var tempArray = [];
                        if (symptomsResult.success) {
                            for (var i = 0; i < Bridge.Symptomate.commonSymptoms.length; i++) {
                                for (var j = 0; j < symptomsResult.data.length; j++) {
                                    if (Bridge.Symptomate.commonSymptoms[i].id === symptomsResult.data[j].id) {
                                        tempArray.push(symptomsResult.data[j]);
                                        break;
                                    }
                                }
                            }
                            component.setState({ commonSymptoms: tempArray, showCommonSymptoms: true, emptyEvidence: result.data, diagnostic: result.data });
                        }
                        component.refs.commonSymptoms.setCommonSymptoms(tempArray);

                        $(".mdl-progress-top").css('visibility', 'hidden');

                        var slotId = Bridge.Redirect.getQueryStringParam("slotId");
                        if (slotId) {
                            component.setState({ slotId: slotId.slotId });
                        }
                    });
                } else {
                    $(".mdl-progress-top").css('visibility', 'hidden');
                }
            });
        },
        buildDiagnostic: function (diagnostic) {
            var evidence = {
                sex: diagnostic.sex,
                age: diagnostic.age,
                evidence: []
            };

            for (var i = 0; i < diagnostic.evidence.length; i++) {
                evidence.evidence.push({
                    id: diagnostic.evidence[i].id,
                    choice_id: diagnostic.evidence[i].choice_id
                });
            }

            return evidence;
        },
        handleNext: function (selections, updateQuestion) {
            var component = this;
            $(".mdl-progress-top").css('visibility', 'visible');
            if (this.state.selectionStep < numberOfPosts) {
                var prevDiagnostics = jQuery.extend(true, {}, component.state.diagnostic);

                var diagnostic = jQuery.extend(true, {}, prevDiagnostics);
                for (var i = 0; i < selections.length; i++) {
                    diagnostic.evidence.push(selections[i]);
                }

                Bridge.Symptomate.sendDiagnosis(this.buildDiagnostic(diagnostic), function (diagnosisResult) {
                    if (diagnosisResult.success) {

                        var step = component.state.selectionStep + 1;
                        if (step > 0) {
                            component.setState({ showCommonSymptoms: false, showQuestion: true });
                        } else {
                            component.setState({ showCommonSymptoms: true, showQuestion: false });
                        }

                        var question = undefined;
                        if (diagnosisResult.data && diagnosisResult.data.question) {
                            question = diagnosisResult.data.question;
                        }

                        component.setState({ selectionStep: step, diagnostic: diagnostic, diagnosticResponse: diagnosisResult.data });
                        component.state.evidences.push(prevDiagnostics);

                        if (updateQuestion) {
                            updateQuestion(question);
                        }
                    }
                    $(".mdl-progress-top").css('visibility', 'hidden');
                });
            } else {
                component.setState({ showCommonSymptoms: false, showQuestion: false, showResult: true });
                var result = {};

                if (this.state.diagnosticResponse && this.state.diagnosticResponse.conditions) {
                    var sortedConditions = _.sortBy(this.state.diagnosticResponse.conditions, function (condition) {
                        return condition.probability * -1;
                    }).slice(0, 5);

                    result = sortedConditions;
                }

                Bridge.Symptomate.saveResultToStorage(component.state.slotId, result, component.state.diagnostic, function (data) {
                    $(".mdl-progress-top").css('visibility', 'hidden');
                });
            }
        },
        handlePrev: function (updateQuestion) {
            var component = this;
            if (this.state.selectionStep > 0) {
                $(".mdl-progress-top").css('visibility', 'visible');

                var step = this.state.selectionStep - 1;
                this.setState({ selectionStep: step });

                if (step == 0) {
                    this.setState(this.getInitialState);
                    $(".mdl-progress-top").css('visibility', 'hidden');
                } else {
                    Bridge.Symptomate.sendDiagnosis(component.state.evidences[component.state.evidences.length - 1], function (diagnosisResult) {
                        if (diagnosisResult.success) {
                            component.setState({ selectionStep: step, diagnostic: component.state.evidences[component.state.evidences.length - 1], diagnosticResponse: diagnosisResult.data });

                            if (updateQuestion) {
                                updateQuestion(diagnosisResult.data.question);
                            }

                            component.state.evidences.pop();
                        }

                        $(".mdl-progress-top").css('visibility', 'hidden');
                    });
                }
            }
        },
        render: function () {
            return React.createElement(
                Layout,
                null,
                React.createElement(ProgressBar, { indeterminate: true, ref: "progressBar", id: "progressBar", className: "mdl-progress-top" }),
                React.createElement(
                    Content,
                    null,
                    React.createElement(
                        "div",
                        { className: "page-content" },
                        React.createElement(CommonSymptoms, { show: this.state.showCommonSymptoms, ref: "commonSymptoms", handleNext: this.handleNext, handlePrev: this.handlePrev }),
                        React.createElement(SymptomQuestions, { show: this.state.showQuestion, question: this.state.diagnosticResponse.question, ref: "symptomQuestions", handleNext: this.handleNext, handlePrev: this.handlePrev }),
                        React.createElement(PatientSymptomateResult, { show: this.state.showResult, diagnosticResult: this.state.diagnosticResponse, slotId: this.state.slotId })
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientSymptomate, null), document.getElementById("patient-symptomate"));
})();