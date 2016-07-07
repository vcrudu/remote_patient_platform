/**
 * Created by Victor on 6/22/2016.
 */

(function() {

    "use strict";

    var Layout = ReactMDL.Layout;
    var Content = ReactMDL.Content;
    var Checkbox  = ReactMDL.Checkbox;
    var RadioGroup   = ReactMDL.RadioGroup;
    var Radio  = ReactMDL.Radio;
    var Button  = ReactMDL.Button;
    var Card  = ReactMDL.Card;
    var CardTitle  = ReactMDL.CardTitle;
    var CardText  = ReactMDL.CardText;
    var ProgressBar  = ReactMDL.ProgressBar;
    var List  = ReactMDL.List;
    var ListItem  = ReactMDL.ListItem;

    var ChoiceButton = React.createClass({
        handleClick: function() {
            this.props.onClicked(this.props.id);
        },
        render: function() {
            return <Button key={this.props.question.id + "_" + this.props.id + "_button"} ripple onClick={this.handleClick} className="accent-color">{this.props.label}</Button>
        }
    });

    var numberOfPosts = 3;

    var ConditionResult = React.createClass({
        render: function() {
            return <div className="conditionCard">
                <Card shadow={0}>
                    <CardTitle>{this.props.label}</CardTitle>
                    <CardText>
                        {(this.props.probability * 100).toFixed(2)} %
                        <ProgressBar progress={(this.props.probability * 100)} className="progress-bar-result"/>
                    </CardText>
                </Card>
            </div>
        }
    });

    var SingleQuestion = React.createClass({
        getInitialState: function() {
            return {
                question: this.props.question
            }
        },
        handleNext: function(choice_id) {
            var answers = [];
            answers.push({ "id": this.props.question.items[0].id, "choice_id": choice_id })
            this.props.handleNext(answers, this.updateQuestion);
        },
        handlePrev: function() {
            this.props.handlePrev(this.updateQuestion);
        },
        updateQuestion: function(question) {
            if(this.isMounted()) {
                this.setState({question: question});
            }
        },
        render: function() {
            var component = this;
            var question = component.props.question.items[0];

            var questionsButtons = question.choices.map(function(choise) {
                return <ChoiceButton key={choise.id + "_" + question.id} question={question} id={choise.id} label={choise.label} onClicked={component.handleNext}/>
            });

            return <div className="group_multiple">
                <div className="question">{component.props.question.text}</div>

                <div className="answer-buttons">
                    <Button ripple onClick={component.handlePrev}>Back</Button>
                    {questionsButtons}
                </div>
            </div>
        }
    });

    var GroupSingleQuestion = React.createClass({
        getInitialState: function() {
            return {
                question: this.props.question
            }
        },
        onChange: function(event) {
            var answerId = $(event.target).attr("value");
            var isChecked = $(event.target).is(":checked");

            var answer = _.find(this.state.question.items, function(answer) {
                return answer.id === answerId;
            });

            if (answer) {
                answer.selected = isChecked;
            }

            this.state.question.items.map(function(answer) {
                if (answer.id != answerId) {
                    answer.selected = false;
                }
            });
        },
        handleNext: function() {
            var selectedAnswers = _.filter(this.state.question.items, function(answer) {
                return answer.selected === true;
            });

            if (selectedAnswers && selectedAnswers.length > 0) {
                var answers = [];

                for(var j=0; j < selectedAnswers.length; j++) {
                    answers.push({ "id": selectedAnswers[j].id, "choice_id": "present" })
                }

                this.props.handleNext(answers, this.updateQuestion);
            }
        },
        handlePrev: function() {
            this.props.handlePrev(this.updateQuestion);
        },
        updateQuestion: function(question) {
            if(this.isMounted()) {
                this.setState({question: question});
            }
        },
        render: function() {
            var component = this;

            var questions = [].map(function(item) {
                return <div></div>;
            });

            if (this.props.question && this.props.question.items && this.props.question.items.length > 0) {
                questions = this.props.question.items.map(function (answer) {
                    return <ListItem key={answer.id + "_check"}><Radio key={answer.id} value={answer.id} ripple>{answer.name}</Radio></ListItem>
                });
            }

            return <div className="group_single">
                <div className="question">{this.props.question.text}</div>

                <RadioGroup name="groupSingleQuestion" onChange={component.onChange}>
                    <List>
                        {questions}
                    </List>
                </RadioGroup>


                <Button ripple onClick={this.handlePrev}>Back</Button>
                <Button ripple onClick={this.handleNext} className="accent-color">Next</Button>
            </div>
        }
    });

    var GroupMultipleQuestion = React.createClass({
        getInitialState: function() {
            return {
                question: this.props.question
            }
        },
        onChange: function(event) {
            var parent = $(event.target).parent();
            var answerId = parent.attr("data-reactid").split("$")[3];
            var isChecked = $(event.target).is(":checked");

            var answer = _.find(this.state.question.items, function(answer) {
                return answer.id === answerId;
            });

            if (answer) {
                answer.selected = isChecked;
            }
        },
        handleNext: function() {
            if (this.state.question.items && this.state.question.items.length > 0) {
                var answers = [];

                for(var j=0; j < this.state.question.items.length; j++) {
                    var choice = this.state.question.items[j].selected ? "present" : "absent";
                    answers.push({ "id": this.state.question.items[j].id, "choice_id": choice })
                }

                this.props.handleNext(answers, this.updateQuestion);
            }
        },
        handlePrev: function() {
            this.props.handlePrev(this.updateQuestion);
        },
        updateQuestion: function(question) {
            if(this.isMounted()) {
                this.setState({question: question});
            }
        },
        render: function() {
            var component = this;
            var questions = [].map(function(item) {
                return <div></div>
            });

            if (this.props.question && this.props.question.items && this.props.question.items.length > 0) {
                questions = this.props.question.items.map(function (answer) {
                    return <ListItem key={answer.id+ "_check"}><Checkbox key={answer.id} label={answer.name} ripple onChange={component.onChange}></Checkbox></ListItem>
                });
            }

            return <div className="group_multiple">
                <div className="question">{this.props.question.text}</div>
                <List>
                    {questions}
                </List>

                <Button ripple onClick={this.handlePrev}>Back</Button>
                <Button ripple onClick={this.handleNext} className="accent-color">Next</Button>
            </div>
        }
    });

    var SymptomQuestions = React.createClass({
        handleNext: function(answers, updateQuestion) {
            this.props.handleNext(answers, updateQuestion);
        },
        handlePrev: function(updateQuestion) {
            this.props.handlePrev(updateQuestion);
        },
        render: function() {
            var component = this;
            var questionType = component.props.question ? component.props.question.type: "";

            var question = undefined;

            switch (questionType) {
                case "group_multiple":
                    question = function() {return <GroupMultipleQuestion question={component.props.question} handleNext={component.handleNext} handlePrev={component.handlePrev}/>}
                    break;
                case "group_single":
                    question = function() {return <GroupSingleQuestion question={component.props.question} handleNext={component.handleNext} handlePrev={component.handlePrev}/>}
                    break;
                case "single":
                    question = function() {return <SingleQuestion question={component.props.question} handleNext={component.handleNext} handlePrev={component.handlePrev}/>}
                    break;
                default:
                    question = function() {return <div></div>;}
                    break;
            }

            return <div className={this.props.show ? "show" : "hide"}>
                {question()}
            </div>
        }
    });

    var CommonSymptoms = React.createClass({
        getInitialState: function() {
            return {
                commonSymptoms: [],
                selectedSymptoms: []
            }
        },
        setCommonSymptoms: function(symtoms) {
            this.setState({commonSymptoms: symtoms});
        },
        onChange: function(event) {
            var parent = $(event.target).parent();
            var symptomId = parent.attr("data-reactid").split("$")[3];
            var isChecked = $(event.target).is(":checked");

            var symptom = _.find(this.state.commonSymptoms, function(symptom) {
                return symptom.id === symptomId;
            });
            if (symptom) {
                symptom.selected = isChecked;
            }
        },
        handleNext: function() {
            var selectedSymptoms = _.filter(this.state.commonSymptoms, function(symptom) {
                return symptom.selected === true;
            });

            if (selectedSymptoms && selectedSymptoms.length > 0) {
                var selections = [];

                for(var j=0; j < selectedSymptoms.length; j++) {
                    selections.push({ "id": selectedSymptoms[j].id, "choice_id": "present" })
                }

                this.props.handleNext(selections, undefined);
            }
        },
        handlePrev: function() {
            this.props.handlePrev(undefined);
        },
        render: function() {
            var component = this;
            var symptoms = component.state.commonSymptoms.map(function (symptom) {
                return <ListItem key={symptom.id + "_check"}><Checkbox key={symptom.id} label={symptom.name} ripple onChange={component.onChange}></Checkbox></ListItem>;
            });

            return <div className={this.props.show ? "show" : "hide"}>
                <div className="question">Do you have any of following symptoms?</div>
                <List>
                    {symptoms}
                </List>

                <Button ripple onClick={this.handleNext} className="accent-color">Next</Button>
            </div>
        }
    });

    var PatientSymptomateResult = React.createClass({
        goToBookAppointment: function() {
            Bridge.Redirect.redirectToWithLevelsUp("appointments/patient-appointments.html?slotId=" + this.props.slotId, 2);
        },
        render: function() {
            var diagnosticResult = this.props.diagnosticResult;

            var coditions = [].map(function(item) {
                return <div></div>;
            })

            if (diagnosticResult && diagnosticResult.conditions) {
                var sortedConditions = _.sortBy(diagnosticResult.conditions, function(condition){
                    return condition.probability * -1;
                }).slice(0, 5);

                coditions = sortedConditions.map(function (condition) {
                    return <ConditionResult key={condition.name} label={condition.name} probability={condition.probability}></ConditionResult>
                });
            }

            return <div className={this.props.show ? "show" : "hide"}>
                <div className={this.props.slotId ? "show book-appointment-button" : "hide book-appointment-button"}><Button type="button" className="mdl-button mdl-button--accent" onClick={this.goToBookAppointment}>Book Appointment</Button></div>

                <div className="question">
                    Result
                </div>

                <div className="condition-cards">
                    {coditions}
                </div>
            </div>
        }
    });

    var PatientSymptomate = React.createClass({
        getInitialState: function() {
            return {
                commonSymptoms: [],
                selections: [],
                selectionStep: 0,
                diagnostic: {"sex": "male", "age": "29", "evidence": []},
                diagnosticResponse: {},
                showCommonSymptoms: false,
                showQuestion: false,
                showResult: false,
                evidences:[],
                emptyEvidence: {},
                slotId: undefined
            }
        },
        getEmptyDiagnostic: function() {
            return this.state.emptyEvidence;
        },
        componentDidMount: function() {
            var component = this;
            Bridge.Symptomate.getEmptyEvidence(function(result) {
                if (result.success) {
                    Bridge.Symptomate.getSymptoms(function(symptomsResult) {
                        var tempArray = [];
                        if (symptomsResult.success) {
                            for(var i=0; i < Bridge.Symptomate.commonSymptoms.length; i++) {
                                for(var j=0; j < symptomsResult.data.length; j++) {
                                    if (Bridge.Symptomate.commonSymptoms[i].id === symptomsResult.data[j].id) {
                                        tempArray.push(symptomsResult.data[j]);
                                        break;
                                    }
                                }
                            }
                            component.setState({commonSymptoms: tempArray, showCommonSymptoms: true, emptyEvidence: result.data, diagnostic: result.data});
                        }
                        component.refs.commonSymptoms.setCommonSymptoms(tempArray);

                        $(".mdl-progress-top").css('visibility', 'hidden');

                        var slotId = Bridge.Redirect.getQueryStringParam("slotId");

                        if (slotId) {
                            component.setState({slotId: slotId.slotId});
                        }
                    });
                }
                else {
                    $(".mdl-progress-top").css('visibility', 'hidden');
                }
            })
        },
        handleNext: function(selections, updateQuestion) {
            var component = this;
            $(".mdl-progress-top").css('visibility', 'visible');
            if (this.state.selectionStep < numberOfPosts) {
                var prevDiagnostics = jQuery.extend(true, {}, component.state.diagnostic);

                var diagnostic = jQuery.extend(true, {}, prevDiagnostics);
                for(var i=0; i < selections.length; i++) {
                    diagnostic.evidence.push(selections[i]);
                }

                Bridge.Symptomate.sendDiagnosis(diagnostic, function(diagnosisResult) {
                    if (diagnosisResult.success) {

                        var step = component.state.selectionStep + 1;
                        if (step > 0) {
                            component.setState({showCommonSymptoms: false, showQuestion: true});
                        }
                        else {
                            component.setState({showCommonSymptoms: true, showQuestion: false});
                        }

                        var question = undefined;
                        if (diagnosisResult.data && diagnosisResult.data.question) {
                            question = diagnosisResult.data.question;
                        }

                        component.setState({selectionStep: step, diagnostic: diagnostic, diagnosticResponse: diagnosisResult.data});
                        component.state.evidences.push(prevDiagnostics);

                        if (updateQuestion) {
                            updateQuestion(question);
                        }
                    }
                    $(".mdl-progress-top").css('visibility', 'hidden');
                });
            }
            else {
                component.setState({showCommonSymptoms: false, showQuestion: false, showResult: true});
                var result = {};

                if (this.state.diagnosticResponse && this.state.diagnosticResponse.conditions) {
                    var sortedConditions = _.sortBy(this.state.diagnosticResponse.conditions, function(condition){
                        return condition.probability * -1;
                    }).slice(0, 5);

                    result = sortedConditions;
                }

                Bridge.Symptomate.saveResultToStorage(component.slotId, result, function(data) {
                    $(".mdl-progress-top").css('visibility', 'hidden');
                });
            }
        },
        handlePrev: function(updateQuestion) {
            var component = this;
            if (this.state.selectionStep > 0) {
                $(".mdl-progress-top").css('visibility', 'visible');

                var step = this.state.selectionStep - 1;
                this.setState({selectionStep: step});

                if (step == 0) {
                    this.setState(this.getInitialState);
                    $(".mdl-progress-top").css('visibility', 'hidden');
                }
                else {
                    Bridge.Symptomate.sendDiagnosis(component.state.evidences[component.state.evidences.length-1], function(diagnosisResult) {
                        if (diagnosisResult.success) {
                            component.setState({selectionStep: step, diagnostic: component.state.evidences[component.state.evidences.length-1], diagnosticResponse: diagnosisResult.data});

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
        render: function() {
            return <Layout>
                <ProgressBar indeterminate ref="progressBar" id="progressBar" className="mdl-progress-top"/>
                <Content>
                    <div className="page-content">
                        <CommonSymptoms show={this.state.showCommonSymptoms} ref="commonSymptoms" handleNext={this.handleNext} handlePrev={this.handlePrev}/>
                        <SymptomQuestions show={this.state.showQuestion} question={this.state.diagnosticResponse.question} ref="symptomQuestions" handleNext={this.handleNext} handlePrev={this.handlePrev}/>
                        <PatientSymptomateResult show={this.state.showResult} diagnosticResult={this.state.diagnosticResponse} slotId={this.state.slotId}/>
                    </div>
                </Content>
            </Layout>
        }
    });

    ReactDOM.render(<PatientSymptomate />, document.getElementById("patient-symptomate"));
})();