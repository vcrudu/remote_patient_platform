/**
 * Created by Victor on 5/4/2016.
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

        getInitialState: function () {
            return {
                explanation: {
                    supporting_evidence: [],
                    conflicting_evidence: []
                }
            };
        },
        handleConditionClick: function () {
            var explainContainer = this.refs.explainContainer;
            if (!this.state.explanation.supporting_evidence || this.state.explanation.supporting_evidence.length === 0) {
                var component = this;
                Bridge.Symptomate.getExplainPortObjectEvidence(this.props.diagnosticResult, this.props.targetId, function (result) {
                    indeterminateProgress.start();
                    if (result.success) {
                        Bridge.Symptomate.explainDiagnosis(result.data, function (explanationResult) {
                            if (explanationResult.success) {
                                component.setState({ explanation: explanationResult.data });
                                $(explainContainer).slideToggle();
                            } else {
                                debugger;
                            }

                            indeterminateProgress.end();
                        });
                    }
                });
            } else {
                $(explainContainer).slideToggle();
            }
        },
        componentDidMount: function () {
            var probability = this.props.probability * 100;
            var conditionId = "#progressBar_" + this.props.conditionId.toString().replace(".", "");
            document.querySelector(conditionId).MaterialProgress.setProgress(probability);

            componentHandler.upgradeDom();
            var explainMenuItem = this.refs.explainMenuItem;
            explainMenuItem.addEventListener("click", this.handleConditionClick);
        },
        render: function () {
            var progressBarId = this.props.conditionId.toString().replace(".", "");
            var component = this;
            var supportingEvidenceClass = "visible";
            var conflictingEvidenceClass = "visible";

            if (!component.state.explanation.supporting_evidence || component.state.explanation.supporting_evidence == 0) {
                supportingEvidenceClass = "hide";
            } else {
                supportingEvidenceClass = "visible";
            }

            if (!component.state.explanation.conflicting_evidence || component.state.explanation.conflicting_evidence == 0) {
                conflictingEvidenceClass = "hide";
            } else {
                conflictingEvidenceClass = "visible";
            }

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
                        React.createElement("div", { ref: "progressBar", id: "progressBar_" + progressBarId, className: "mdl-progress mdl-js-progress" }),
                        React.createElement(
                            "div",
                            { ref: "explainContainer", className: "explain-hide" },
                            React.createElement(
                                "h2",
                                { className: "mdl-card__title-text explain" },
                                "Explain"
                            ),
                            React.createElement(
                                "p",
                                { className: supportingEvidenceClass },
                                "I suggested this condition on the basis of the following symptoms:"
                            ),
                            React.createElement(
                                "ul",
                                { className: supportingEvidenceClass },
                                component.state.explanation.supporting_evidence.map(function (sEvidence) {
                                    var random = Math.random();
                                    return React.createElement(
                                        "li",
                                        { key: random, className: "bullet" },
                                        sEvidence.name
                                    );
                                })
                            ),
                            React.createElement(
                                "p",
                                { className: conflictingEvidenceClass },
                                "I have not found the presence of the following symptoms that could increase probability of this condition:"
                            ),
                            React.createElement(
                                "ul",
                                { className: conflictingEvidenceClass },
                                component.state.explanation.conflicting_evidence.map(function (cEvidence) {
                                    var random = Math.random();
                                    return React.createElement(
                                        "li",
                                        { key: random, className: "bullet" },
                                        cEvidence.name
                                    );
                                })
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mdl-card__menu" },
                        React.createElement(
                            "button",
                            { id: "card_menu_" + component.props.conditionId + "_" + component.props.slotId, className: "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" },
                            React.createElement(
                                "i",
                                { className: "material-icons" },
                                "more_vert"
                            )
                        ),
                        React.createElement(
                            "ul",
                            { className: "mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect", htmlFor: "card_menu_" + component.props.conditionId + "_" + component.props.slotId },
                            React.createElement(
                                "li",
                                { className: "mdl-menu__item", onClick: this.handleConditionClick, ref: "explainMenuItem" },
                                "Explain"
                            )
                        )
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
                    return React.createElement(ConditionResult, { key: condition.name, label: condition.name, probability: condition.probability, conditionId: condition.probability * 100000, slotId: diagnosticResult.slotId, targetId: condition.id, diagnosticResult: diagnosticResult });
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

    var PatientMedicalInfo = React.createClass({
        displayName: "PatientMedicalInfo",

        getInitialState: function () {
            return {
                nhsNumber: "",
                ethnicity: "",
                height: "",
                weight: ""
            };
        },
        updateState: function (stateObject) {
            this.setState(stateObject);
        },
        handleEthnicityClick: function () {
            $(this.refs.sEthnicity).mobiscroll("show");
        },
        handleDiseasesClick: function () {
            $(this.refs.sDiseases).mobiscroll("show");
        },
        handleHeightClick: function () {
            $(this.refs.txtHeight_Hidden).mobiscroll("show");
        },
        handleWeightClick: function () {
            $(this.refs.txtWeight_Hidden).mobiscroll("show");
        },
        setupEthnicityClick: function () {
            var component = this;

            $(this.refs.sEthnicity).mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtEthnicity, component.refs.txtEthnicityDiv);
                }
            });

            $("#sEthnicity_dummy").hide();
        },
        setupDiseasesClick: function () {
            var component = this;

            $(this.refs.sDiseases).mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                select: 'multiple',
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtDiseases, component.refs.txtDiseasesDiv);
                    if (valueText === "") {
                        this.refs.labelTxtDiseases.htmlFor = 'txtDiseases';
                    }
                }
            });

            $("#sDiseases_dummy").hide();
        },
        setupHeightClick: function () {
            var component = this;

            $(this.refs.txtHeight_Hidden).mobiscroll().distance({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultUnit: 'm',
                units: ['m', 'in', 'ft'],
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtHeight, component.refs.txtHeightDiv);
                }
            }).mobiscroll('setVal', '1.5 m');
        },
        setupWeightClick: function () {
            var component = this;

            $(this.refs.txtWeight_Hidden).mobiscroll().mass({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultUnit: 'kg',
                max: 300,
                units: ['kg', 'lb'],
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtWeight, component.refs.txtWeightDiv);
                }
            }).mobiscroll('setVal', '60 kg');
        },
        setRefElementValue: function (valueText, refElement, refElementDiv) {
            $(refElement).val(valueText);

            if (valueText != "") {
                if ($(refElementDiv).hasClass("is-focused")) {
                    $(refElementDiv).removeClass("is-focused");
                }
                if (!$(refElementDiv).hasClass("is-dirty")) {
                    $(refElementDiv).addClass("is-dirty");
                }
            }

            $(refElement).blur();
        },
        scrollTo: function (offsetTop) {
            $('.mdl-layout').animate({
                scrollTop: offsetTop
            }, 200);
        },
        componentDidMount: function () {
            var component = this;

            this.setupEthnicityClick();

            var txtEthnicity = this.refs.txtEthnicity;
            txtEthnicity.addEventListener("focus", function () {
                /*var offsetTop = $(txtEthnicity).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleEthnicityClick();
            });

            this.setupDiseasesClick();

            var txtDiseases = this.refs.txtDiseases;
            txtDiseases.addEventListener("focus", function () {
                /*var offsetTop = $(txtDiseases).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleDiseasesClick();
            });

            this.setupHeightClick();

            var txtHeight = this.refs.txtHeight;
            txtHeight.addEventListener("focus", function () {
                /*var offsetTop = $(txtHeight).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleHeightClick();
            });

            this.setupWeightClick();

            var txtWeight = this.refs.txtWeight;
            txtWeight.addEventListener("focus", function () {
                /*var offsetTop = $(txtWeight).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleWeightClick();
            });

            /*var txtNhsNumber = this.refs.txtNhsNumber;
            txtNhsNumber.addEventListener("focus", function() {
                var offsetTop = $(txtNhsNumber).offset().top;
                component.scrollTo(offsetTop);
            });*/
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.nhsNumber, this.refs.txtNhsNumber, this.refs.txtNhsNumberDiv);
            this.setRefElementValue(this.state.ethnicity, this.refs.txtEthnicity, this.refs.txtEthnicityDiv);
            this.setRefElementValue(this.state.diseases, this.refs.txtDiseases, this.refs.txtDiseasesDiv);
            this.setRefElementValue(this.state.height, this.refs.txtHeight, this.refs.txtHeightDiv);
            this.setRefElementValue(this.state.weight, this.refs.txtWeight, this.refs.txtWeightDiv);

            $(this.refs.sDiseases).mobiscroll('setVal', this.state.diseasesArray, true);
        },
        isValid: function () {
            var valid = true;
            this.setState({
                nhsNumber: $(this.refs.txtNhsNumber).val(),
                ethnicity: $(this.refs.txtEthnicity).val(),
                diseases: $(this.refs.txtDiseases).val(),
                height: $(this.refs.txtHeight).val(),
                weight: $(this.refs.txtWeight).val()
            });

            if ($(this.refs.txtNhsNumber).val() == "") {
                $(this.refs.txtNhsNumberDiv).addClass("is-invalid");
                $(this.refs.txtNhsNumberDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ nhsNumber: $(this.refs.txtNhsNumber).val() });
            }

            if ($(this.refs.txtEthnicity).val() == "") {
                $(this.refs.txtEthnicityDiv).addClass("is-invalid");
                $(this.refs.txtEthnicityDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ ethnicity: $(this.refs.txtEthnicity).val() });
            }

            if ($(this.refs.txtDiseases).val() == "") {
                $(this.refs.txtDiseasesDiv).addClass("is-invalid");
                $(this.refs.txtDiseasesDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ diseases: $(this.refs.txtDiseases).val() });
            }

            if ($(this.refs.txtHeight).val() == "") {
                $(this.refs.txtHeightDiv).addClass("is-invalid");
                $(this.refs.txtHeightDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ height: $(this.refs.txtHeight).val() });
            }

            if ($(this.refs.txtWeight).val() == "") {
                $(this.refs.txtWeightDiv).addClass("is-invalid");
                $(this.refs.txtWeightDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ weight: $(this.refs.txtWeight).val() });
            }

            return valid;
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtNhsNumberDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "fingerprint"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtNhsNumber", ref: "txtNhsNumber" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtNhsNumber" },
                        "NHS Number"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "NHS Number required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtEthnicityDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "face"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtEthnicity", ref: "txtEthnicity" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtEthnicity" },
                        "Choose Ethnicity"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Choose Ethnicity required!"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtDiseasesDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "warning"
                    ),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", ref: "labelTxtDiseases", htmlFor: "txtDiseases" },
                        "Diseases if any"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtDiseases", ref: "txtDiseases" })
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtHeightDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "accessibility"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtHeight", ref: "txtHeight" }),
                    React.createElement("input", { className: "mdl-textfield__input hide", type: "text", id: "txtHeight_Hidden", ref: "txtHeight_Hidden" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtHeight" },
                        "Current Height"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Current Height required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtWeightDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "adb"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtWeight", ref: "txtWeight" }),
                    React.createElement("input", { className: "mdl-textfield__input hide", type: "text", id: "txtWeight_Hidden", ref: "txtWeight_Hidden" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtWeight" },
                        "Current Weight"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Current Weight required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "select",
                    { className: "hide", name: "Ethnicity", id: "sEthnicity", ref: "sEthnicity" },
                    React.createElement(
                        "option",
                        { value: "British / Mixed British" },
                        "British / Mixed British"
                    ),
                    React.createElement(
                        "option",
                        { value: "Irish" },
                        "Irish"
                    ),
                    React.createElement(
                        "option",
                        { value: "Other White Background" },
                        "Other White Background"
                    ),
                    React.createElement(
                        "option",
                        { value: "Other White Background" },
                        "White Caucasian"
                    ),
                    React.createElement(
                        "option",
                        { value: "White & BlackCaribbean" },
                        "White & BlackCaribbean"
                    ),
                    React.createElement(
                        "option",
                        { value: "White & Black African" },
                        "White & Black African"
                    ),
                    React.createElement(
                        "option",
                        { value: "Other Mixed Background" },
                        "Other Mixed Background"
                    ),
                    React.createElement(
                        "option",
                        { value: "Indian / British Indian" },
                        "Indian/ British Indian"
                    ),
                    React.createElement(
                        "option",
                        { value: "Pakistani / British Pakistani" },
                        "Pakistani / British Pakistani"
                    ),
                    React.createElement(
                        "option",
                        { value: "Bangladeshi/British Bangladeshi" },
                        "Bangladeshi / British Bangladeshi"
                    ),
                    React.createElement(
                        "option",
                        { value: "Other Asian Background" },
                        "Other Asian Background"
                    ),
                    React.createElement(
                        "option",
                        { value: "Caribbean" },
                        "Caribbean"
                    ),
                    React.createElement(
                        "option",
                        { value: "Chinese" },
                        "Chinese"
                    ),
                    React.createElement(
                        "option",
                        { value: "Other Black Background" },
                        "Other Black Background"
                    ),
                    React.createElement(
                        "option",
                        { value: "Other ethnic group" },
                        "Other ethnic group"
                    )
                ),
                React.createElement(
                    "select",
                    { className: "hide", name: "Category", id: "sDiseases", ref: "sDiseases", multiple: true },
                    React.createElement(
                        "option",
                        { value: "Asthma (on medication)" },
                        "Asthma (on medication)"
                    ),
                    React.createElement(
                        "option",
                        { value: "Cancer" },
                        "Cancer"
                    ),
                    React.createElement(
                        "option",
                        { value: "Diabetes" },
                        "Diabetes"
                    ),
                    React.createElement(
                        "option",
                        { value: "Epilepsy" },
                        "Epilepsy"
                    ),
                    React.createElement(
                        "option",
                        { value: "Stroke/TIA" },
                        "Stroke/TIA"
                    ),
                    React.createElement(
                        "option",
                        { value: "Hypertension (high blood pressure)" },
                        "Hypertension (high blood pressure)"
                    ),
                    React.createElement(
                        "option",
                        { value: "Chronic heart disease" },
                        "Chronic heart disease"
                    ),
                    React.createElement(
                        "option",
                        { value: "Chronic kidney disease" },
                        "Chronic kidney disease"
                    ),
                    React.createElement(
                        "option",
                        { value: "Chronic lung disease" },
                        "Chronic lung disease"
                    ),
                    React.createElement(
                        "option",
                        { value: "Hypothyroidism (underactive thyroid)" },
                        "Hypothyroidism (underactive thyroid)"
                    ),
                    React.createElement(
                        "option",
                        { value: "Mental health concerns (give details)" },
                        "Mental health concerns (give details)"
                    ),
                    React.createElement(
                        "option",
                        { value: "Previous operations" },
                        "Previous operations"
                    )
                )
            );
        }
    });

    var PatientAddress = React.createClass({
        displayName: "PatientAddress",

        getInitialState: function () {
            return {
                country: "",
                county: "",
                town: "",
                postCode: "",
                addressLine1: "",
                addressLine2: "",
                phone: "",
                mobile: ""
            };
        },
        updateState: function (stateObject) {
            this.setState(stateObject);
        },
        handleCountry: function () {
            $(this.refs.sCountries).mobiscroll("show");
        },
        setupCountrySelect: function () {
            var component = this;

            $(this.refs.sCountries).mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultValue: 'United Kingdom',
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtCountry, component.refs.txtCountryDiv);
                }
            });

            var inst = $(this.refs.sCountries).mobiscroll('getInst');
            inst.setVal("United Kingdom", true, true);
            $("#sCountries_dummy").hide();
        },
        setRefElementValue: function (valueText, refElement, refElementDiv) {
            $(refElement).val(valueText);

            if (valueText != "") {
                if ($(refElementDiv).hasClass("is-focused")) {
                    $(refElementDiv).removeClass("is-focused");
                }
                if (!$(refElementDiv).hasClass("is-dirty")) {
                    $(refElementDiv).addClass("is-dirty");
                }
            }

            $(refElement).blur();
        },
        scrollTo: function (offsetTop) {
            $('.mdl-layout').animate({
                scrollTop: offsetTop
            }, 200);
        },
        componentDidMount: function () {
            var component = this;

            this.setupCountrySelect();

            var txtCountry = this.refs.txtCountry;
            txtCountry.addEventListener("focus", function () {
                /*var offsetTop = $(txtCountry).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleCountry();
            });

            /*var txtCounty = this.refs.txtCounty;
            txtCounty.addEventListener("focus", function() {
                var offsetTop = $(txtCounty).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtTown = this.refs.txtTown;
            txtTown.addEventListener("focus", function() {
                var offsetTop = $(txtTown).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtPostCode = this.refs.txtPostCode;
            txtPostCode.addEventListener("focus", function() {
                var offsetTop = $(txtPostCode).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtAddressLine1 = this.refs.txtAddressLine1;
            txtAddressLine1.addEventListener("focus", function() {
                var offsetTop = $(txtAddressLine1).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtAddressLine2 = this.refs.txtAddressLine2;
            txtAddressLine2.addEventListener("focus", function() {
                var offsetTop = $(txtAddressLine2).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtMobile = this.refs.txtMobile;
            txtMobile.addEventListener("focus", function() {
                var offsetTop = $(txtMobile).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtPhone = this.refs.txtPhone;
            txtPhone.addEventListener("focus", function() {
                var offsetTop = $(txtPhone).offset().top;
                component.scrollTo(offsetTop);
            });*/
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.country, this.refs.txtCountry, this.refs.txtCountryDiv);
            this.setRefElementValue(this.state.county, this.refs.txtCounty, this.refs.txtCountyDiv);
            this.setRefElementValue(this.state.town, this.refs.txtTown, this.refs.txtTownDiv);
            this.setRefElementValue(this.state.postCode, this.refs.txtPostCode, this.refs.txtPostCodeDiv);txtMobile;
            this.setRefElementValue(this.state.addressLine1, this.refs.txtAddressLine1, this.refs.txtAddressLine1Div);
            this.setRefElementValue(this.state.addressLine2, this.refs.txtAddressLine2, this.refs.txtAddressLine2Div);
            this.setRefElementValue(this.state.mobile, this.refs.txtMobile, this.refs.txtMobileDiv);
            this.setRefElementValue(this.state.phone, this.refs.txtPhone, this.refs.txtPhoneDiv);
        },
        isValid: function () {
            var valid = true;
            this.setState({
                country: $(this.refs.txtCountry).val(),
                county: $(this.refs.txtCounty).val(),
                town: $(this.refs.txtTown).val(),
                postCode: $(this.refs.txtPostCode).val(),
                addressLine1: $(this.refs.txtAddressLine1).val(),
                addressLine2: $(this.refs.txtAddressLine2).val(),
                mobile: $(this.refs.txtMobile).val(),
                phone: $(this.refs.txtPhone).val()
            });

            if ($(this.refs.txtCountry).val() == "") {
                $(this.refs.txtCountryDiv).addClass("is-invalid");
                $(this.refs.txtCountryDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ country: $(this.refs.txtCountry).val() });
            }

            if ($(this.refs.txtCounty).val() == "") {
                $(this.refs.txtCountyDiv).addClass("is-invalid");
                $(this.refs.txtCountyDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ county: $(this.refs.txtCounty).val() });
            }

            if ($(this.refs.txtTown).val() == "") {
                $(this.refs.txtTownDiv).addClass("is-invalid");
                $(this.refs.txtTownDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ town: $(this.refs.txtTown).val() });
            }

            if ($(this.refs.txtPostCode).val() == "") {
                $(this.refs.txtPostCodeDiv).addClass("is-invalid");
                $(this.refs.txtPostCodeDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ postCode: $(this.refs.txtPostCode).val() });
            }

            if ($(this.refs.txtAddressLine1).val() == "") {
                $(this.refs.txtAddressLine1Div).addClass("is-invalid");
                $(this.refs.txtAddressLine1Div).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ addressLine1: $(this.refs.txtAddressLine1).val() });
            }

            if ($(this.refs.txtMobile).val() == "") {
                $(this.refs.txtMobileDiv).addClass("is-invalid");
                $(this.refs.txtMobileDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ mobile: $(this.refs.txtMobile).val() });
            }

            /*if ($(this.refs.txtPhone).val() == "") {
                $(this.refs.txtPhoneDiv).addClass("is-invalid");
                $(this.refs.txtPhoneDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({phone : $(this.refs.txtPhone).val()});
            }*/

            return valid;
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtCountryDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "language"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtCountry", ref: "txtCountry", onClick: this.handleCountry }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtCountry" },
                        "Country"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Country required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtCountyDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "language"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtCounty", ref: "txtCounty" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtCounty" },
                        "County"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "County required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtTownDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "home"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtTown", ref: "txtTown" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtTown" },
                        "Town"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Town required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtPostCodeDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "place"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtPostCode", ref: "txtPostCode" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtPostCode" },
                        "Post Code"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Post Code required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtAddressLine1Div" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "map"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtAddressLine1", ref: "txtAddressLine1" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtAddressLine1" },
                        "Address Line 1"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Address Line 1 required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtAddressLine2Div" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "map"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtAddressLine2", ref: "txtAddressLine2" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtAddressLine2" },
                        "Address Line 2"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtPhoneDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "local_phone"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtPhone", ref: "txtPhone" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtPhone" },
                        "Phone"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtMobileDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "stay_current_portrait"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtMobile", ref: "txtMobile" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtMobile" },
                        "Mobile"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Mobile required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "select",
                    { id: "sCountries", ref: "sCountries", className: "hide", name: "Country" },
                    React.createElement(
                        "option",
                        { value: "Austria" },
                        "Austria"
                    ),
                    React.createElement(
                        "option",
                        { value: "Belgium" },
                        "Belgium"
                    ),
                    React.createElement(
                        "option",
                        { value: "British Indian Ocean Territory" },
                        "British Indian Ocean Territory"
                    ),
                    React.createElement(
                        "option",
                        { value: "Canada" },
                        "Canada"
                    ),
                    React.createElement(
                        "option",
                        { value: "Finland" },
                        "Finland"
                    ),
                    React.createElement(
                        "option",
                        { value: "Germany" },
                        "Germany"
                    ),
                    React.createElement(
                        "option",
                        { value: "Greece" },
                        "Greece"
                    ),
                    React.createElement(
                        "option",
                        { value: "Italy" },
                        "Italy"
                    ),
                    React.createElement(
                        "option",
                        { value: "Luxembourg" },
                        "Luxembourg"
                    ),
                    React.createElement(
                        "option",
                        { value: "Moldova, Republic of" },
                        "Moldova, Republic of"
                    ),
                    React.createElement(
                        "option",
                        { value: "New Zealand" },
                        "New Zealand"
                    ),
                    React.createElement(
                        "option",
                        { value: "Norway" },
                        "Norway"
                    ),
                    React.createElement(
                        "option",
                        { value: "Portugal" },
                        "Portugal"
                    ),
                    React.createElement(
                        "option",
                        { value: "Romania" },
                        "Romania"
                    ),
                    React.createElement(
                        "option",
                        { value: "Spain" },
                        "Spain"
                    ),
                    React.createElement(
                        "option",
                        { value: "Sweden" },
                        "Sweden"
                    ),
                    React.createElement(
                        "option",
                        { value: "Switzerland" },
                        "Switzerland"
                    ),
                    React.createElement(
                        "option",
                        { value: "United Arab Emirates" },
                        "United Arab Emirates"
                    ),
                    React.createElement(
                        "option",
                        { value: "United Kingdom" },
                        "United Kingdom"
                    ),
                    React.createElement(
                        "option",
                        { value: "United States" },
                        "United States"
                    ),
                    React.createElement(
                        "option",
                        { value: "Virgin Islands (British)" },
                        "Virgin Islands (British)"
                    ),
                    React.createElement(
                        "option",
                        { value: "Virgin Islands (U.S.)" },
                        "Virgin Islands (U.S.)"
                    )
                )
            );
        }
    });

    var PatientBasicInfo = React.createClass({
        displayName: "PatientBasicInfo",

        getInitialState: function () {
            return {
                title: "",
                firstName: "",
                surname: "",
                gender: "",
                dateOfBirth: ""
            };
        },
        updateState: function (stateObject) {
            this.setState(stateObject);
        },
        handleTitleClick: function () {
            $(this.refs.sTitle).mobiscroll("show");
        },
        handleGenderClick: function () {
            $(this.refs.sGender).mobiscroll("show");
        },
        handleBirthDayClick: function () {
            var birthDayPicker = $(this.refs.birthDayPicker);
            birthDayPicker.mobiscroll("show");
        },
        setupTitleSelect: function () {
            var component = this;

            $(this.refs.sTitle).mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                minWidth: 200,
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtTitle, component.refs.txtTitleDiv);
                }
            });

            $("#sTitle_dummy").hide();
        },
        setupGenderSelect: function () {
            var component = this;

            $(this.refs.sGender).mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                minWidth: 200,
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtGender, component.refs.txtGenderDiv);
                }
            });

            $("#sGender_dummy").hide();
        },
        setupBirthDayCalendar: function () {
            var birthDayPicker = $(this.refs.birthDayPicker);
            var component = this;

            var currYear = new Date().getFullYear();
            var currentDate = new Date(new Date().setFullYear(currYear - 20));
            birthDayPicker.mobiscroll().date({
                theme: "material",
                display: "bottom",
                dateFormat: "mm/dd/yyyy",
                defaultValue: currentDate,
                max: new Date(),
                onSelect: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtBirthDay, component.refs.txtBirthDayDiv);
                },
                onClosed: function (valueText, inst) {
                    if ($(component.refs.txtBirthDayDiv).hasClass("is-focused")) {
                        $(component.refs.txtBirthDayDiv).removeClass("is-focused");
                    }
                }
            });
        },
        scrollTo: function (offsetTop) {
            $('.mdl-layout').animate({
                scrollTop: offsetTop
            }, 200);
        },
        componentDidMount: function () {
            var component = this;
            this.setupTitleSelect();
            this.setupGenderSelect();
            this.setupBirthDayCalendar();

            var txtTitle = component.refs.txtTitle;
            txtTitle.addEventListener("focus", function () {
                /*var offsetTop = $(txtTitle).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleTitleClick();
            });

            var txtBirthDay = component.refs.txtBirthDay;
            txtBirthDay.addEventListener("focus", function () {
                /*var offsetTop = $(txtBirthDay).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleBirthDayClick();
            });

            var txtGender = this.refs.txtGender;
            txtGender.addEventListener("focus", function () {
                /*var offsetTop = $(txtGender).offset().top;
                component.scrollTo(offsetTop);*/
                component.handleGenderClick();
            });

            /*var txtFirstName = this.refs.txtFirstName;
            txtFirstName.addEventListener("focus", function() {
                var offsetTop = $(txtFirstName).offset().top;
                component.scrollTo(offsetTop);
            });
              var txtSurname = this.refs.txtSurname;
            txtSurname.addEventListener("focus", function() {
                var offsetTop = $(txtSurname).offset().top;
                component.scrollTo(offsetTop);
            });*/
        },
        setRefElementValue: function (valueText, refElement, refElementDiv) {
            $(refElement).val(valueText);

            if (valueText != "") {
                if ($(refElementDiv).hasClass("is-focused")) {
                    $(refElementDiv).removeClass("is-focused");
                }
                if (!$(refElementDiv).hasClass("is-dirty")) {
                    $(refElementDiv).addClass("is-dirty");
                }
            }

            $(refElement).blur();
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.title, this.refs.txtTitle, this.refs.txtTitleDiv);
            this.setRefElementValue(this.state.firstName, this.refs.txtFirstName, this.refs.txtFirstDiv);
            this.setRefElementValue(this.state.surname, this.refs.txtSurname, this.refs.txtSurnameDiv);
            this.setRefElementValue(this.state.gender, this.refs.txtGender, this.refs.txtGenderDiv);
            this.setRefElementValue(this.state.dateOfBirth, this.refs.txtBirthDay, this.refs.txtBirthDayDiv);
        },
        isValid: function () {
            var valid = true;
            this.setState({
                title: $(this.refs.txtTitle).val(),
                firstName: $(this.refs.txtFirstName).val(),
                surname: $(this.refs.txtSurname).val(),
                gender: $(this.refs.txtGender).val(),
                dateOfBirth: $(this.refs.txtBirthDay).val()

            });

            if ($(this.refs.txtTitle).val() == "") {
                $(this.refs.txtTitleDiv).addClass("is-invalid");
                $(this.refs.txtTitleDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ title: $(this.refs.txtTitle).val() });
            }

            if ($(this.refs.txtFirstName).val() == "") {
                $(this.refs.txtFirstDiv).addClass("is-invalid");
                $(this.refs.txtFirstDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ firstName: $(this.refs.txtFirstName).val() });
            }

            if ($(this.refs.txtSurname).val() == "") {
                $(this.refs.txtSurnameDiv).addClass("is-invalid");
                $(this.refs.txtSurnameDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ surname: $(this.refs.txtSurname).val() });
            }

            if ($(this.refs.txtGender).val() == "") {
                $(this.refs.txtGenderDiv).addClass("is-invalid");
                $(this.refs.txtGenderDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ gender: $(this.refs.txtGender).val() });
            }

            if ($(this.refs.txtBirthDay).val() == "") {
                $(this.refs.txtBirthDayDiv).addClass("is-invalid");
                $(this.refs.txtBirthDayDiv).addClass("is-focused");
                valid = false;
            } else {
                this.setState({ dateOfBirth: $(this.refs.txtBirthDay).val() });
            }

            return valid;
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtTitleDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "person"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtTitle", ref: "txtTitle", onClick: this.handleTitleClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtTitle" },
                        "Title"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Title required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtFirstDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "person"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtFirstName", ref: "txtFirstName" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtFirstName" },
                        "First Name"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "First Name required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtSurnameDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "person"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtSurname", ref: "txtSurname" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtSurname" },
                        "Surname"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Surname required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtGenderDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "person"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtGender", ref: "txtGender", onClick: this.handleGenderClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtGender" },
                        "Gender"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Gender required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtBirthDayDiv" },
                    React.createElement(
                        "i",
                        { className: "material-icons primary-icons md-36" },
                        "cake"
                    ),
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtBirthDay", ref: "txtBirthDay", onClick: this.handleBirthDayClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtBirthDay" },
                        "Date of Birth"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-textfield__error" },
                        "Date of Birth required!"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "select",
                    { className: "hide", name: "Title", id: "sTitle", ref: "sTitle" },
                    React.createElement(
                        "option",
                        { value: "Mr." },
                        "Mr."
                    ),
                    React.createElement(
                        "option",
                        { value: "Mrs." },
                        "Mrs."
                    ),
                    React.createElement(
                        "option",
                        { value: "Ms." },
                        "Ms."
                    )
                ),
                React.createElement(
                    "select",
                    { className: "hide", name: "Gender", id: "sGender", ref: "sGender" },
                    React.createElement(
                        "option",
                        { value: "Male" },
                        "Male"
                    ),
                    React.createElement(
                        "option",
                        { value: "Female" },
                        "Female"
                    ),
                    React.createElement(
                        "option",
                        { value: "NoAnswer" },
                        "Prefer not to answer"
                    )
                ),
                React.createElement("input", { id: "birthDayPicker", ref: "birthDayPicker", className: "hide" })
            );
        }
    });

    var ProviderPatientProfileDetails = React.createClass({
        displayName: "ProviderPatientProfileDetails",

        getInitialState: function () {
            return {
                userName: "",
                userDetails: undefined,
                symptomResult: undefined
            };
        },
        socketCallback: function (message) {},
        componentDidMount: function () {
            componentHandler.upgradeDom();

            var doneButton = this.refs.doneButton;
            doneButton.addEventListener("click", this.handleDone);

            window.addEventListener('resize', function () {
                is_keyboard = window.innerHeight < initial_screen_size;
                is_landscape = screen.height < screen.width;

                if ($(document.activeElement)) {
                    var offsetTop = $(document.activeElement).offset().top;
                    $('.mdl-layout').animate({
                        scrollTop: offsetTop
                    }, 200);
                }
            });

            var component = this;
            $(document).ready(function () {
                $('#patient-details-collapse').on('show.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').addClass('active');
                }).on('hide.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').removeClass('active');
                });
            });

            Bridge.Patient.getDetails(function (result) {
                indeterminateProgress.end();
                if (result.success) {
                    component.setState({ userDetails: result.data });

                    var userTitle = result.data.title ? result.data.title : "";
                    var userName = result.data.name ? result.data.name : "";
                    var userSurname = result.data.surname ? result.data.surname : "";

                    var finalName = userTitle;
                    if (finalName == "") {
                        finalName = userName;
                    } else {
                        finalName += " " + userName;
                    }

                    if (finalName == "") {
                        finalName = userSurname;
                    } else {
                        finalName += " " + userSurname;
                    }

                    component.setState({ userName: finalName });

                    component.refs.patientInfoComponent.updateState({
                        title: result.data.title ? result.data.title : "",
                        firstName: result.data.name ? result.data.name : "",
                        surname: result.data.surname ? result.data.surname : "",
                        gender: result.data.gender ? result.data.gender : "",
                        dateOfBirth: result.data.dateOfBirth ? moment(result.data.dateOfBirth).format("MM/DD/YYYY") : ""
                    });

                    component.refs.patientAddress.updateState({
                        country: result.data.address && result.data.address.country ? result.data.address.country : "",
                        county: result.data.address && result.data.address.county ? result.data.address.county : "",
                        town: result.data.address && result.data.address.town ? result.data.address.town : "",
                        postCode: result.data.address && result.data.address.postCode ? result.data.address.postCode : "",
                        addressLine1: result.data.address && result.data.address.addressLine1 ? result.data.address.addressLine1 : "",
                        addressLine2: result.data.address && result.data.address.addressLine2 ? result.data.address.addressLine2 : "",
                        phone: result.data.phone ? result.data.phone : "",
                        mobile: result.data.mobile ? result.data.mobile : ""
                    });

                    var healthProblemsText = "";
                    if (result.data.healthProblems) {
                        healthProblemsText = result.data.healthProblems.reduce(function (all, healthProblem) {
                            if (all === "") {
                                all = healthProblem;
                            } else {
                                all = all + ", " + healthProblem;
                            }
                            return all;
                        }, "");
                    }

                    component.refs.patientMedicalInfo.updateState({
                        nhsNumber: result.data.nhsNumber ? result.data.nhsNumber : "",
                        ethnicity: result.data.ethnicity ? result.data.ethnicity : "",
                        height: result.data.height ? result.data.height : "",
                        weight: result.data.weight ? result.data.weight : "",
                        diseases: healthProblemsText,
                        diseasesArray: result.data.healthProblems ? result.data.healthProblems : []
                    });

                    Bridge.Symptomate.getLastEvidence(function (result) {
                        if (result.success) {
                            component.setState({ symptomResult: result.data });
                        }
                    });
                }
            });
        },
        createUUID: function () {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
        handleDone: function () {
            if (!this.refs.patientInfoComponent.isValid()) {
                if ($(this.refs.basicAddress).hasClass("is-active")) {
                    $(this.refs.basicAddress).removeClass("is-active");
                    $(this.refs.basicAddressContent).removeClass("is-active");
                }
                if ($(this.refs.basicMedical).hasClass("is-active")) {
                    $(this.refs.basicMedical).removeClass("is-active");
                    $(this.refs.basicMedicalContent).removeClass("is-active");
                }

                if (!$(this.refs.basicInfoTab).hasClass("is-active")) {
                    $(this.refs.basicInfoTab).addClass("is-active");
                    $(this.refs.basicInfoTabContent).addClass("is-active");
                }
                return;
            }

            if (!this.refs.patientAddress.isValid()) {
                if ($(this.refs.basicInfoTab).hasClass("is-active")) {
                    $(this.refs.basicInfoTab).removeClass("is-active");
                    $(this.refs.basicInfoTabContent).removeClass("is-active");
                }

                if (!$(this.refs.basicAddress).hasClass("is-active")) {
                    $(this.refs.basicAddress).addClass("is-active");
                    $(this.refs.basicAddressContent).addClass("is-active");
                }

                if ($(this.refs.basicMedical).hasClass("is-active")) {
                    $(this.refs.basicMedical).removeClass("is-active");
                    $(this.refs.basicMedicalContent).removeClass("is-active");
                }
                return;
            }

            if (!this.refs.patientMedicalInfo.isValid()) {
                if ($(this.refs.basicInfoTab).hasClass("is-active")) {
                    $(this.refs.basicInfoTab).removeClass("is-active");
                    $(this.refs.basicInfoTabContent).removeClass("is-active");
                }

                if ($(this.refs.basicAddress).hasClass("is-active")) {
                    $(this.refs.basicAddress).removeClass("is-active");
                    $(this.refs.basicAddressContent).removeClass("is-active");
                }

                if (!$(this.refs.basicMedical).hasClass("is-active")) {
                    $(this.refs.basicMedical).addClass("is-active");
                    $(this.refs.basicMedicalContent).addClass("is-active");
                }
                return;
            }

            var healthProblems = this.refs.patientMedicalInfo.state.diseases.split(", ");

            var objectToPost = {
                "id": this.state.userDetails.id,
                "name": this.refs.patientInfoComponent.state.firstName,
                "surname": this.refs.patientInfoComponent.state.surname,
                "email": this.state.userDetails.email,
                "title": this.refs.patientInfoComponent.state.title,
                "dateOfBirth": moment(this.refs.patientInfoComponent.state.dateOfBirth, "MM/DD/YYYY").format("YYYY-MM-DD"),
                "gender": this.refs.patientInfoComponent.state.gender,
                "address": {
                    "id": this.refs.patientAddress.state.id ? this.refs.patientAddress.state.id : this.createUUID(),
                    "country": this.refs.patientAddress.state.country,
                    "county": this.refs.patientAddress.state.county,
                    "town": this.refs.patientAddress.state.town,
                    "addressLine1": this.refs.patientAddress.state.addressLine1,
                    "addressLine2": this.refs.patientAddress.state.addressLine2 == "" ? undefined : this.refs.patientAddress.state.addressLine2,
                    "postCode": this.refs.patientAddress.state.postCode
                },
                "ethnicity": this.refs.patientMedicalInfo.state.ethnicity,
                "nhsNumber": this.refs.patientMedicalInfo.state.nhsNumber,
                "otherIdentifiers": [],
                "healthProblems": healthProblems,
                "phone": this.refs.patientAddress.state.phone,
                "mobile": this.refs.patientAddress.state.mobile,
                "weight": this.refs.patientMedicalInfo.state.weight,
                "height": this.refs.patientMedicalInfo.state.height
            };

            Bridge.Patient.saveDetails(objectToPost, function (result) {
                indeterminateProgress.start();
                if (result.success) {
                    indeterminateProgress.end();
                }
            });
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "mdl-layout mdl-js-layout mdl-layout--header primary-bg" },
                React.createElement(
                    "button",
                    { ref: "doneButton", className: "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect done-button" },
                    React.createElement(
                        "i",
                        { className: "material-icons" },
                        "done"
                    ),
                    React.createElement(
                        "span",
                        { className: "mdl-button__ripple-container" },
                        React.createElement("span", { className: "mdl-ripple is-animating" })
                    )
                ),
                React.createElement(USER_PROFILE_PROGRESS, null),
                React.createElement(
                    "div",
                    { className: "profile-image-container" },
                    React.createElement("img", { src: "images/user.png", width: "120", height: "20", className: "img-responsive center-block profile-user-photo" })
                ),
                React.createElement(
                    "div",
                    { className: "userName" },
                    React.createElement(
                        "h4",
                        null,
                        this.state.userName
                    )
                ),
                React.createElement(
                    "div",
                    { className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect" },
                    React.createElement(
                        "div",
                        { className: "mdl-tabs__tab-bar" },
                        React.createElement(
                            "a",
                            { href: "#basic-info", className: "mdl-tabs__tab is-active", ref: "basicInfoTab" },
                            React.createElement(
                                "i",
                                { className: "material-icons tab-icon show-mobile" },
                                "face"
                            ),
                            React.createElement(
                                "span",
                                { className: "hide-mobile" },
                                "Basic Info"
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "#address", className: "mdl-tabs__tab", ref: "basicAddress" },
                            React.createElement(
                                "i",
                                { className: "material-icons tab-icon show-mobile" },
                                "home"
                            ),
                            React.createElement(
                                "span",
                                { className: "hide-mobile" },
                                "Address"
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "#medical", className: "mdl-tabs__tab", ref: "basicMedical" },
                            React.createElement(
                                "i",
                                { className: "material-icons tab-icon show-mobile" },
                                "gesture"
                            ),
                            React.createElement(
                                "span",
                                { className: "hide-mobile" },
                                "Medical"
                            )
                        ),
                        React.createElement(
                            "a",
                            { href: "#symptoms", className: "mdl-tabs__tab", ref: "basicMedical" },
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
                        "main",
                        null,
                        React.createElement(
                            "div",
                            { className: "mdl-tabs__panel is-active", id: "basic-info", ref: "basicInfoTabContent" },
                            React.createElement(PatientBasicInfo, { ref: "patientInfoComponent" })
                        ),
                        React.createElement(
                            "div",
                            { className: "mdl-tabs__panel", id: "address", ref: "basicAddressContent" },
                            React.createElement(PatientAddress, { ref: "patientAddress" })
                        ),
                        React.createElement(
                            "div",
                            { className: "mdl-tabs__panel", id: "medical", ref: "basicMedicalContent" },
                            React.createElement(PatientMedicalInfo, { ref: "patientMedicalInfo" })
                        ),
                        React.createElement(
                            "div",
                            { className: "mdl-tabs__panel", id: "symptoms", ref: "symptoms" },
                            React.createElement(Symptoms, { ref: "symtoms", symptomResult: this.state.symptomResult })
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderPatientProfileDetails, null), document.getElementById("patient-profile-details-container"));
})();