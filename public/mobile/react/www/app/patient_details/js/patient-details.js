/**
 * Created by Victor on 2/18/2016.
 */

(function () {

    "use strict";

    $.material.init();

    var ValidationDateOfBath = React.createClass({
        displayName: "ValidationDateOfBath",

        propTypes: {
            regexString: React.PropTypes.string,
            regex: React.PropTypes.object,
            compareTo: React.PropTypes.string,
            inputName: React.PropTypes.string.isRequired,
            inputId: React.PropTypes.string.isRequired,
            inputType: React.PropTypes.string.isRequired,
            inputLabel: React.PropTypes.string.isRequired,
            inputRequired: React.PropTypes.bool,
            validators: React.PropTypes.array,
            validatorMessages: React.PropTypes.array,
            lostFocusCallBack: React.PropTypes.func
        },
        getDefaultProps: function () {
            return {
                regexString: undefined,
                regex: undefined,
                compareTo: "",
                inputName: "validationInput",
                inputId: "validationInput",
                inputType: "text",
                inputLabel: "Validation Input",
                inputRequired: false,
                validators: [],
                validatorMessages: [],
                lostFocusCallBack: undefined
            };
        },
        getInitialState: function () {
            return {
                defaultFormGroupClassName: "form-group label-floating is-empty",
                validationMessage: ""
            };
        },
        validateComponent: function (component) {
            var componentValue = component.target.value;

            var isValid = true;

            for (var i = 0; i < this.props.validators.length; i++) {
                if (this.props.validators[i] == "required") {
                    if (componentValue === "") {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-empty is-focused " + Math.random().toString(36).slice(-5)
                        });
                        break;
                    }
                } else if (this.props.validators[i] == "compare") {
                    if (componentValue != this.props.compareTo) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5)
                        });
                        break;
                    }
                } else if (this.props.validators[i] == "pattern") {
                    if (!this.props.regex.test(componentValue)) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5)
                        });
                        break;
                    }
                }
            }

            if (isValid) {
                this.setState({
                    validationMessage: "",
                    defaultFormGroupClassName: "form-group label-floating " + Math.random().toString(36).slice(-5)
                });
            } else {
                this.setState({
                    validationMessage: this.props.validatorMessages[i],
                    defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5)
                });
            }

            return isValid;
        },
        onChange: function (component) {
            this.validateComponent(component);
        },
        onBlur: function (component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: this.state.defaultFormGroupClassName },
                React.createElement(
                    "i",
                    { className: "material-icons md-36 " },
                    this.props.inputIconName
                ),
                React.createElement(
                    "label",
                    { htmlFor: this.props.inputName, className: "control-label" },
                    this.props.inputLabel
                ),
                React.createElement("input", { type: this.props.inputType,
                    className: "form-control",
                    id: this.props.inputId,
                    name: this.props.inputName,
                    pattern: this.props.regexString,
                    required: this.props.inputRequired,
                    onChange: this.onChange,
                    onBlur: this.onBlur }),
                React.createElement(
                    "span",
                    { className: "help-block" },
                    this.state.validationMessage
                ),
                React.createElement("span", { className: "material-input" })
            );
        }
    });

    var ValidationInput = React.createClass({
        displayName: "ValidationInput",

        propTypes: {
            regexString: React.PropTypes.string,
            regex: React.PropTypes.object,
            compareTo: React.PropTypes.string,
            inputName: React.PropTypes.string.isRequired,
            inputId: React.PropTypes.string.isRequired,
            inputType: React.PropTypes.string.isRequired,
            inputLabel: React.PropTypes.string.isRequired,
            inputRequired: React.PropTypes.bool,
            validators: React.PropTypes.array,
            validatorMessages: React.PropTypes.array,
            lostFocusCallBack: React.PropTypes.func
        },
        getDefaultProps: function () {
            return {
                regexString: undefined,
                regex: undefined,
                compareTo: "",
                inputName: "validationInput",
                inputId: "validationInput",
                inputType: "text",
                inputLabel: "Validation Input",
                inputRequired: false,
                validators: [],
                validatorMessages: [],
                lostFocusCallBack: undefined
            };
        },
        getInitialState: function () {
            return {
                defaultFormGroupClassName: "form-group label-floating is-empty",
                validationMessage: ""
            };
        },
        validateComponent: function (component) {
            var componentValue = component.target.value;

            var isValid = true;

            for (var i = 0; i < this.props.validators.length; i++) {
                if (this.props.validators[i] == "required") {
                    if (componentValue === "") {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-empty is-focused " + Math.random().toString(36).slice(-5)
                        });
                        break;
                    }
                } else if (this.props.validators[i] == "compare") {
                    if (componentValue != this.props.compareTo) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5)
                        });
                        break;
                    }
                } else if (this.props.validators[i] == "pattern") {
                    if (!this.props.regex.test(componentValue)) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5)
                        });
                        break;
                    }
                }
            }

            if (isValid) {
                this.setState({
                    validationMessage: "",
                    defaultFormGroupClassName: "form-group label-floating " + Math.random().toString(36).slice(-5)
                });
            } else {
                this.setState({
                    validationMessage: this.props.validatorMessages[i],
                    defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5)
                });
            }

            return isValid;
        },
        onChange: function (component) {
            this.validateComponent(component);
        },
        onBlur: function (component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        render: function () {
            return React.createElement(
                "div",
                { className: this.state.defaultFormGroupClassName },
                React.createElement(
                    "i",
                    { className: "material-icons md-36 " },
                    this.props.inputIconName
                ),
                React.createElement(
                    "label",
                    { htmlFor: this.props.inputName, className: "control-label" },
                    this.props.inputLabel
                ),
                React.createElement("input", { type: this.props.inputType,
                    className: "form-control",
                    id: this.props.inputId,
                    name: this.props.inputName,
                    pattern: this.props.regexString,
                    required: this.props.inputRequired,
                    onChange: this.onChange,
                    onBlur: this.onBlur }),
                React.createElement(
                    "span",
                    { className: "help-block" },
                    this.state.validationMessage
                ),
                React.createElement("span", { className: "material-input" })
            );
        }
    });

    var PatientDetails = React.createClass({
        displayName: "PatientDetails",

        /* emailOnBlur: function(component, isValid) {
             var validFields = {
                 emailIsValid: isValid,
                 passwordIsValid: this.state.password.isValid,
                 confirmPasswordIsValid: this.state.confirmPassword.isValid,
                 surnameIsValid: this.state.surname.isValid,
                 givenNameIsValid: this.state.givenName.isValid
             };
             this.setState({email: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
         },
         passwordOnBlur: function(component, isValid) {
             var validFields = {
                 emailIsValid: this.state.email.isValid,
                 passwordIsValid: isValid,
                 confirmPasswordIsValid: this.state.confirmPassword.isValid,
                 surnameIsValid: this.state.surname.isValid,
                 givenNameIsValid: this.state.givenName.isValid
             };
             this.setState({password: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
         },
         confirmPasswordOnBlur: function(component, isValid) {
             var validFields = {
                 emailIsValid: this.state.email.isValid,
                 passwordIsValid: this.state.password.isValid,
                 confirmPasswordIsValid: isValid,
                 surnameIsValid: this.state.surname.isValid,
                 givenNameIsValid: this.state.givenName.isValid
             };
             this.setState({confirmPassword: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
         },
         surnameOnBlur: function(component, isValid) {
             var validFields = {
                 emailIsValid: this.state.email.isValid,
                 passwordIsValid: this.state.password.isValid,
                 confirmPasswordIsValid: this.state.confirmPassword.isValid,
                 surnameIsValid: isValid,
                 givenNameIsValid: this.state.givenName.isValid
             };
             this.setState({surname: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
         },
         givenNameOnBlur: function(component, isValid) {
             var validFields = {
                 emailIsValid: this.state.email.isValid,
                 passwordIsValid: this.state.password.isValid,
                 confirmPasswordIsValid: this.state.confirmPassword.isValid,
                 surnameIsValid: this.state.surname.isValid,
                 givenNameIsValid: isValid
             };
             this.setState({givenName: {value: component.target.value, isValid}, canSubmitForm: this.changeCanSubmit(validFields)});
         },*/
        getInitialState: function () {
            return {
                dateOfBath: { value: "", isValid: false },
                gender: { value: "", isValid: false },
                weight: { value: "", isValid: false },
                height: { value: "", isValid: false }

            };
        },
        changeCanSubmit: function (validFields) {
            var canSubmit = validFields.dateOfBath && validFields.gender && validFields.weight && validFields.height;

            return canSubmit;
        },
        handleSubmit: function (event) {
            event.preventDefault();
            var patientDetailsFormData = {
                dateOfBath: this.state.dateOfBath.value,
                gender: this.state.gender.value,
                weight: this.state.weight.value,
                height: this.state.height.value
            };

            //Add details to patient

            /*Bridge.signUp(patientDetailsFormData, function(result) {
                if (result.success) {
                    Bridge.Redirect.redirectToSignIn(result.data.email);
                }
                else {
                    Bridge.error(result, function() {});
                }
            });*/
        },

        componentDidMount: function () {
            var currYear = new Date().getFullYear();

            $('#inputDateOfBath').mobiscroll().date({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultValue: new Date(new Date().setFullYear(currYear - 20)),
                maxDate: new Date(),
                minDate: new Date(new Date().setFullYear(currYear - 120))
            });

            $('#inputGender').mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                minWidth: 200
            });

            $('#inputWeight').mobiscroll().number({
                theme: 'mobiscroll',
                display: 'bottom',
                maxWidth: 100
            });

            $('#inputHeight').mobiscroll().number({
                theme: 'mobiscroll',
                display: 'bottom',
                maxWidth: 100
            });
        },

        render: function () {
            return React.createElement(
                "form",
                { name: "DetailsForm", onSubmit: this.handleSubmit },
                React.createElement(
                    "div",
                    { className: "form-group label-floating is-empty" },
                    React.createElement(
                        "i",
                        { className: "material-icons md-36 " },
                        "person"
                    ),
                    React.createElement(
                        "label",
                        { htmlFor: "inputDateOfBath", className: "control-label" },
                        "Date of bath"
                    ),
                    React.createElement("input", { className: "form-control",
                        id: "inputDateOfBath",
                        name: this.props.inputName,
                        onChange: this.onChange,
                        onBlur: this.onBlur })
                ),
                React.createElement(
                    "div",
                    { className: "form-group label-floating is-empty" },
                    React.createElement(
                        "i",
                        { className: "material-icons md-36 " },
                        "person"
                    ),
                    React.createElement(
                        "label",
                        { htmlFor: "inputGender", className: "control-label" },
                        "Gender"
                    ),
                    React.createElement(
                        "select",
                        { className: "form-control", name: "Gender", id: "inputGender" },
                        React.createElement("option", { value: "4" }),
                        React.createElement(
                            "option",
                            { value: "1" },
                            "Male"
                        ),
                        React.createElement(
                            "option",
                            { value: "2" },
                            "Female"
                        ),
                        React.createElement(
                            "option",
                            { value: "3" },
                            "Unknown"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "form-group label-floating is-empty" },
                    React.createElement(
                        "i",
                        { className: "material-icons md-36 " },
                        "person"
                    ),
                    React.createElement(
                        "label",
                        { htmlFor: "inputWeight", className: "control-label" },
                        "Weight"
                    ),
                    React.createElement("input", { className: "form-control",
                        id: "inputWeight",
                        name: this.props.inputName,
                        onChange: this.onChange,
                        onBlur: this.onBlur })
                ),
                React.createElement(
                    "div",
                    { className: "form-group label-floating is-empty" },
                    React.createElement(
                        "i",
                        { className: "material-icons md-36 " },
                        "person"
                    ),
                    React.createElement(
                        "label",
                        { htmlFor: "inputWeight", className: "control-label" },
                        "Height"
                    ),
                    React.createElement("input", { className: "form-control",
                        id: "inputHeight",
                        name: this.props.inputName,
                        onChange: this.onChange,
                        onBlur: this.onBlur })
                ),
                React.createElement(
                    "div",
                    { className: "form-actions" },
                    React.createElement(
                        "button",
                        { type: "submit", href: "javascript:void(0);", className: "btn btn-next",
                            disabled: !this.state.canSubmitForm },
                        "ADD DETAILS"
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientDetails, null), document.getElementById("patientDetailsForm"));

    var PatientDetailsBack = React.createClass({
        displayName: "PatientDetailsBack",

        handleBackButton: function () {
            Bridge.Redirect.redirectToWithLevelsUp("landing/landing.html", 2);
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "a",
                    { href: "javascript:void(0);", className: "btn-back", title: "Back", onClick: this.handleBackButton },
                    React.createElement(
                        "i",
                        { className: "material-icons md-48 md-inactive" },
                        "keyboard_backspace"
                    )
                ),
                React.createElement(
                    "h2",
                    { className: "page-title" },
                    "Patient Details"
                )
            );
        }
    });

    ReactDOM.render(React.createElement(PatientDetailsBack, null), document.getElementById("back-button-container"));
})();