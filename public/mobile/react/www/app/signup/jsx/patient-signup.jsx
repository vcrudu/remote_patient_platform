/**
 * Created by Victor on 2/18/2016.
 */

(function() {

    "use strict";

    $.material.init();

    var ValidationInput = React.createClass({
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
            lostFocusCallBack: React.PropTypes.func,
        },
        getDefaultProps: function() {
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
        getInitialState: function() {
            return {
                defaultFormGroupClassName: "form-group label-floating is-empty",
                validationMessage: ""
            }
        },
        validateComponent: function(component) {
            var componentValue = component.target.value;

            var isValid = true;

            for(var i=0; i< this.props.validators.length; i++) {
                if (this.props.validators[i] == "required") {
                    if (componentValue === "") {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-empty is-focused " + Math.random().toString(36).slice(-5),
                        });
                        break;
                    }
                }
                else if (this.props.validators[i] == "compare") {
                    if (componentValue != this.props.compareTo) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5),
                        });
                        break;
                    }
                }
                else if (this.props.validators[i] == "pattern") {
                    if (!this.props.regex.test(componentValue)) {
                        isValid = false;
                        this.setState({
                            validationMessage: this.props.validatorMessages[i],
                            defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5),
                        });
                        break;
                    }
                }
            }

            if (isValid) {
                this.setState({
                    validationMessage: "",
                    defaultFormGroupClassName: "form-group label-floating " + Math.random().toString(36).slice(-5),
                });
            }
            else{
                this.setState({
                    validationMessage: this.props.validatorMessages[i],
                    defaultFormGroupClassName: "form-group label-floating has-error is-focused " + Math.random().toString(36).slice(-5),
                });
            }

            return isValid;
        },
        onChange: function(component) {
            this.validateComponent(component);
        },
        onBlur: function(component) {
            var isValid = this.validateComponent(component);
            this.props.lostFocusCallBack(component, isValid);
        },
        render: function () {
                return <div className={this.state.defaultFormGroupClassName}>
                    <label htmlFor={this.props.inputName} className="control-label">{this.props.inputLabel}</label>
                    <input type={this.props.inputType}
                           className="form-control"
                           id={this.props.inputId}
                           name={this.props.inputName}
                           pattern={this.props.regexString}
                           required={this.props.inputRequired}
                           onChange={this.onChange}
                           onBlur={this.onBlur}/>
                    <span className="help-block">{this.state.validationMessage}</span>
                    <span className="material-input"></span>
                </div>
        }
    });

    var PatientSignUp = React.createClass({
        emailOnBlur: function(component, isValid) {
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
        },
        getInitialState: function() {
            return {
                email: {value: "", isValid: false},
                password: {value: "", isValid: false},
                confirmPassword: {value: "", isValid: false},
                surname: {value: "", isValid: false},
                givenName: {value: "", isValid: false},
                canSubmitForm: false
            }
        },
        changeCanSubmit: function(validFields) {
            var canSubmit = validFields.emailIsValid
                && validFields.passwordIsValid
                &&  validFields.confirmPasswordIsValid
                &&  validFields.surnameIsValid
                &&  validFields.givenNameIsValid;

            return canSubmit;
        },
        componentDidUpdate: function() {
        },
        render: function () {
            return <form name="signUpForm">
                <ValidationInput inputLabel="Email"
                                 inputType="email"
                                 inputName="userEmail"
                                 inputId="userEmail"
                                 inputRequired={true}
                                 lostFocusCallBack={this.emailOnBlur}
                                 regexString="[A-Za-z0-9._%+-]{3,}@[a-zA-Z_-]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})"
                                 regex={/^[A-Za-z0-9._%+-]{3,}@[a-zA-Z_-]{3,}([.][a-zA-Z]{2,}|[.][a-zA-Z]{2,}[.][a-zA-Z]{2,})$/}
                                 validators={["required", "pattern"]}
                                 validatorMessages={["Email is required.", "Your email must look like an e-mail address."]} />
                <ValidationInput inputLabel="Password"
                                 inputType="password"
                                 inputName="userPassword"
                                 inputId="userPassword"
                                 inputRequired={true}
                                 lostFocusCallBack={this.passwordOnBlur}
                                 regexString="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})"
                                 regex={/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/}
                                 validators={["required", "pattern"]}
                                 validatorMessages={["Password is required.", "At least one number, one lowercase, one uppercase letter and at least six characters."]} />
                <ValidationInput inputLabel="Confirm Password"
                                 inputType="password"
                                 inputName="userConfirmPassword"
                                 inputId="userConfirmPassword"
                                 inputRequired={true}
                                 lostFocusCallBack={this.confirmPasswordOnBlur}
                                 regexString="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})"
                                 regex={/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{6,})$/}
                                 compareTo={this.state.password.value}
                                 validators={["required", "compare", "pattern"]}
                                 validatorMessages={["Confirm Password is required.", "Must match password from previous entry.", "At least one number, one lowercase, one uppercase letter and at least six characters."]} />
                <ValidationInput inputLabel="Surname"
                                 inputType="text"
                                 inputName="userSurname"
                                 inputId="userSurname"
                                 inputRequired={true}
                                 lostFocusCallBack={this.surnameOnBlur}
                                 validators={["required"]}
                                 validatorMessages={["Surname is required."]} />
                <ValidationInput inputLabel="Given name"
                                 inputType="text"
                                 inputName="givenNameSurname"
                                 inputId="givenNameSurname"
                                 inputRequired={true}
                                 lostFocusCallBack={this.givenNameOnBlur}
                                 validators={["required"]}
                                 validatorMessages={["Given Name is required."]} />
                <div className="form-actions">
                    <button type="submit" href="javascript:void(0);" className="btn btn-raised btn-info" disabled={!this.state.canSubmitForm}>Register</button>
                </div>
            </form>
        }
    });

    ReactDOM.render(<PatientSignUp />, document.getElementById("patientSignUpForm"));
})();