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
        setupEthnicityClick: function () {
            var component = this;

            $(this.refs.sEthnicity).mobiscroll().select({
                theme: 'mobiscroll',
                display: 'bottom',
                minWidth: 200,
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtEthnicity, component.refs.txtEthnicityDiv);
                }
            });

            $("#sEthnicity_dummy").hide();
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
        componentDidMount: function () {
            this.setupEthnicityClick();

            var txtEthnicity = this.refs.txtEthnicity;
            txtEthnicity.addEventListener("focus", this.handleEthnicityClick);
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.nhsNumber, this.refs.txtNhsNumber, this.refs.txtNhsNumberDiv);
            this.setRefElementValue(this.state.ethnicity, this.refs.txtEthnicity, this.refs.txtEthnicityDiv);
            this.setRefElementValue(this.state.height, this.refs.txtHeight, this.refs.txtHeightDiv);
            this.setRefElementValue(this.state.weight, this.refs.txtWeight, this.refs.txtWeightDiv);
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtNhsNumberDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtNhsNumber", ref: "txtNhsNumber" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtNhsNumber" },
                        "NHS Number"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtEthnicityDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtEthnicity", ref: "txtEthnicity", onClick: this.handleEthnicityClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtEthnicity" },
                        "Choose Ethnicity"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtHeightDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtHeight", ref: "txtHeight" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtHeight" },
                        "Current Height"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtWeightDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtWeight", ref: "txtWeight" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtWeight" },
                        "Current Weight"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "ul",
                    { className: "mdl-list" },
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Do you have any of the following diseases?"
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Asthma (on medication)"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkAsthma" },
                                React.createElement("input", { type: "checkbox", id: "chkAsthma", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Cancer"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkCancer" },
                                React.createElement("input", { type: "checkbox", id: "chkCancer", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Diabetes"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkDiabetes" },
                                React.createElement("input", { type: "checkbox", id: "chkDiabetes", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Epilepsy"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkEpilepsy" },
                                React.createElement("input", { type: "checkbox", id: "chkEpilepsy", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Stroke/TIA"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkStroke" },
                                React.createElement("input", { type: "checkbox", id: "chkStroke", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Hypertension (high blood pressure)"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkHypertension" },
                                React.createElement("input", { type: "checkbox", id: "chkHypertension", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Chronic heart disease"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkChronicHeartDisease" },
                                React.createElement("input", { type: "checkbox", id: "chkChronicHeartDisease", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Chronic kidney disease"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkChronicKidneyDisease" },
                                React.createElement("input", { type: "checkbox", id: "chkChronicKidneyDisease", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Chronic lung disease"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkChronicLungDisease" },
                                React.createElement("input", { type: "checkbox", id: "chkChronicLungDisease", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Hypothyroidism (underactive thyroid)"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkHypothyroidism" },
                                React.createElement("input", { type: "checkbox", id: "chkHypothyroidism", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Mental health concerns (give details)"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkMentalHealthConcerns" },
                                React.createElement("input", { type: "checkbox", id: "chkMentalHealthConcerns", className: "mdl-checkbox__input" })
                            )
                        )
                    ),
                    React.createElement(
                        "li",
                        { className: "mdl-list__item" },
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-primary-content" },
                            "Previous operations"
                        ),
                        React.createElement(
                            "span",
                            { className: "mdl-list__item-secondary-action" },
                            React.createElement(
                                "label",
                                { className: "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect", htmlFor: "chkPreviousOperations" },
                                React.createElement("input", { type: "checkbox", id: "chkPreviousOperations", className: "mdl-checkbox__input" })
                            )
                        )
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
                group: true,
                minWidth: [50, 100],
                maxWidth: [50, 230],
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtCountry, component.refs.txtCountryDiv);
                }
            });

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
        componentDidMount: function () {
            this.setupCountrySelect();

            var txtCountry = this.refs.txtCountry;
            txtCountry.addEventListener("focus", this.handleCountry);
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.country, this.refs.txtCountry, this.refs.txtCountryDiv);
            this.setRefElementValue(this.state.county, this.refs.txtCounty, this.refs.txtCountyDiv);
            this.setRefElementValue(this.state.town, this.refs.txtTown, this.refs.txtTownDiv);
            this.setRefElementValue(this.state.postCode, this.refs.txtPostCode, this.refs.txtPostCodeDiv);
            this.setRefElementValue(this.state.addressLine1, this.refs.txtAddressLine1, this.refs.txtAddressLine1Div);
            this.setRefElementValue(this.state.addressLine2, this.refs.txtAddressLine2, this.refs.txtAddressLine2Div);
            this.setRefElementValue(this.state.mobile, this.refs.txtMobile, this.refs.txtMobileDiv);
            this.setRefElementValue(this.state.phone, this.refs.txtPhone, this.refs.txtPhoneDiv);
        },
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtCountryDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtCountry", ref: "txtCountry", onClick: this.handleCountry }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtCountry" },
                        "Country"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtCountyDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtCounty", ref: "txtCounty" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtCounty" },
                        "County"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtTownDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtTown", ref: "txtTown" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtTown" },
                        "Town"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtPostCodeDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtPostCode", ref: "txtPostCode" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtPostCode" },
                        "Post Code"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtAddressLine1Div" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtAddressLine1", ref: "txtAddressLine1" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtAddressLine1" },
                        "Address Line 1"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtAddressLine2Div" },
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
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtMobile", ref: "txtMobile" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtMobile" },
                        "Mobile"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "select",
                    { id: "sCountries", ref: "sCountries", className: "hide", name: "Country" },
                    React.createElement(
                        "optgroup",
                        { label: "A" },
                        React.createElement(
                            "option",
                            { value: "Afganistan" },
                            "Afganistan"
                        ),
                        React.createElement(
                            "option",
                            { value: "Albania" },
                            "Albania"
                        ),
                        React.createElement(
                            "option",
                            { value: "Algeria" },
                            "Algeria"
                        ),
                        React.createElement(
                            "option",
                            { value: "Argentina" },
                            "Argentina"
                        ),
                        React.createElement(
                            "option",
                            { value: "Australia" },
                            "Australia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Austria" },
                            "Austria"
                        ),
                        React.createElement(
                            "option",
                            { value: "Azerbaijan" },
                            "Azerbaijan"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "B" },
                        React.createElement(
                            "option",
                            { value: "Bahamas" },
                            "Bahamas"
                        ),
                        React.createElement(
                            "option",
                            { value: "Bahrain" },
                            "Bahrain"
                        ),
                        React.createElement(
                            "option",
                            { value: "Bolivia" },
                            "Bolivia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Brazil" },
                            "Brazil"
                        ),
                        React.createElement(
                            "option",
                            { value: "Bulgaria" },
                            "Bulgaria"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "C" },
                        React.createElement(
                            "option",
                            { value: "Cambodia" },
                            "Cambodia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Canada" },
                            "Canada"
                        ),
                        React.createElement(
                            "option",
                            { value: "Chile" },
                            "Chile"
                        ),
                        React.createElement(
                            "option",
                            { value: "China" },
                            "China"
                        ),
                        React.createElement(
                            "option",
                            { value: "Colombia" },
                            "Colombia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Czech Republic" },
                            "Czech Republic"
                        ),
                        React.createElement(
                            "option",
                            { value: "Croatia" },
                            "Croatia"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "D" },
                        React.createElement(
                            "option",
                            { value: "Denmark" },
                            "Denmark"
                        ),
                        React.createElement(
                            "option",
                            { value: "Djibouti" },
                            "Djibouti"
                        ),
                        React.createElement(
                            "option",
                            { value: "Dominica" },
                            "Dominica"
                        ),
                        React.createElement(
                            "option",
                            { value: "Dominican Republic" },
                            "Dominican Republic"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "E" },
                        React.createElement(
                            "option",
                            { value: "Ecuador" },
                            "Ecuador"
                        ),
                        React.createElement(
                            "option",
                            { value: "Egypt" },
                            "Egypt"
                        ),
                        React.createElement(
                            "option",
                            { value: "El Salvador" },
                            "El Salvador"
                        ),
                        React.createElement(
                            "option",
                            { value: "Ethiopia" },
                            "Ethiopia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Estonia" },
                            "Estonia"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "F" },
                        React.createElement(
                            "option",
                            { value: "Falkland Islands" },
                            "Falkland Islands"
                        ),
                        React.createElement(
                            "option",
                            { value: "Faroe Islands" },
                            "Faroe Islands"
                        ),
                        React.createElement(
                            "option",
                            { value: "Finland" },
                            "Finland"
                        ),
                        React.createElement(
                            "option",
                            { value: "France" },
                            "France"
                        ),
                        React.createElement(
                            "option",
                            { value: "Fiji" },
                            "Fiji"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "G" },
                        React.createElement(
                            "option",
                            { value: "Gambia" },
                            "Gambia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Georgia" },
                            "Georgia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Germany" },
                            "Germany"
                        ),
                        React.createElement(
                            "option",
                            { value: "Ghana" },
                            "Ghana"
                        ),
                        React.createElement(
                            "option",
                            { value: "Guatemala" },
                            "Guatemala"
                        ),
                        React.createElement(
                            "option",
                            { value: "Guinea" },
                            "Guinea"
                        ),
                        React.createElement(
                            "option",
                            { value: "Guyana" },
                            "Guyana"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "H" },
                        React.createElement(
                            "option",
                            { value: "Haiti" },
                            "Haiti"
                        ),
                        React.createElement(
                            "option",
                            { value: "Honduras" },
                            "Honduras"
                        ),
                        React.createElement(
                            "option",
                            { value: "Hong Kong" },
                            "Hong Kong"
                        ),
                        React.createElement(
                            "option",
                            { value: "Hungary" },
                            "Hungary"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "I" },
                        React.createElement(
                            "option",
                            { value: "Iceland" },
                            "Iceland"
                        ),
                        React.createElement(
                            "option",
                            { value: "India" },
                            "India"
                        ),
                        React.createElement(
                            "option",
                            { value: "Indonesia" },
                            "Indonesia"
                        ),
                        React.createElement("option", { value: "Iraq", Iraq: true }),
                        React.createElement(
                            "option",
                            { value: "Ireland" },
                            "Ireland"
                        ),
                        React.createElement(
                            "option",
                            { value: "Israel" },
                            "Israel"
                        ),
                        React.createElement(
                            "option",
                            { value: "Italy" },
                            "Italy"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "J" },
                        React.createElement(
                            "option",
                            { value: "Jamaica" },
                            "Jamaica"
                        ),
                        React.createElement(
                            "option",
                            { value: "Japan" },
                            "Japan"
                        ),
                        React.createElement(
                            "option",
                            { value: "Jordan" },
                            "Jordan"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "K" },
                        React.createElement(
                            "option",
                            { value: "Kazakhstan" },
                            "Kazakhstan"
                        ),
                        React.createElement(
                            "option",
                            { value: "Kenya" },
                            "Kenya"
                        ),
                        React.createElement(
                            "option",
                            { value: "Kiribati" },
                            "Kiribati"
                        ),
                        React.createElement(
                            "option",
                            { value: "Korea" },
                            "Korea"
                        ),
                        React.createElement(
                            "option",
                            { value: "Kuwait" },
                            "Kuwait"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "L" },
                        React.createElement(
                            "option",
                            { value: "Latvia" },
                            "Latvia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Lebanon" },
                            "Lebanon"
                        ),
                        React.createElement(
                            "option",
                            { value: "Lesotho" },
                            "Lesotho"
                        ),
                        React.createElement(
                            "option",
                            { value: "Liberia" },
                            "Liberia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Libya" },
                            "Libya"
                        ),
                        React.createElement(
                            "option",
                            { value: "Liechtenstein" },
                            "Liechtenstein"
                        ),
                        React.createElement(
                            "option",
                            { value: "Lithuania" },
                            "Lithuania"
                        ),
                        React.createElement(
                            "option",
                            { value: "Luxembourg" },
                            "Luxembourg"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "M" },
                        React.createElement(
                            "option",
                            { value: "Macau" },
                            "Macau"
                        ),
                        React.createElement(
                            "option",
                            { value: "Macedonia" },
                            "Macedonia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Madagascar" },
                            "Madagascar"
                        ),
                        React.createElement(
                            "option",
                            { value: "Malaysia" },
                            "Malaysia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Mexico" },
                            "Mexico"
                        ),
                        React.createElement(
                            "option",
                            { value: "Monaco" },
                            "Monaco"
                        ),
                        React.createElement(
                            "option",
                            { value: "Mongolia" },
                            "Mongolia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Montenegro" },
                            "Montenegro"
                        ),
                        React.createElement(
                            "option",
                            { value: "Montserrat" },
                            "Montserrat"
                        ),
                        React.createElement(
                            "option",
                            { value: "Morocco" },
                            "Morocco"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "N" },
                        React.createElement(
                            "option",
                            { value: "Namibia" },
                            "Namibia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Nauru" },
                            "Nauru"
                        ),
                        React.createElement(
                            "option",
                            { value: "Nepal" },
                            "Nepal"
                        ),
                        React.createElement(
                            "option",
                            { value: "Netherlands" },
                            "Netherlands"
                        ),
                        React.createElement(
                            "option",
                            { value: "New Caledonia" },
                            "New Caledonia"
                        ),
                        React.createElement(
                            "option",
                            { value: "New Zealand" },
                            "New Zealand"
                        ),
                        React.createElement(
                            "option",
                            { value: "Nigeria" },
                            "Nigeria"
                        ),
                        React.createElement(
                            "option",
                            { value: "Norway" },
                            "Norway"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "O" },
                        React.createElement(
                            "option",
                            { value: "Oman" },
                            "Oman"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "P" },
                        React.createElement(
                            "option",
                            { value: "Pakistan" },
                            "Pakistan"
                        ),
                        React.createElement(
                            "option",
                            { value: "Palau" },
                            "Palau"
                        ),
                        React.createElement(
                            "option",
                            { value: "Panama" },
                            "Panama"
                        ),
                        React.createElement(
                            "option",
                            { value: "Paraguay" },
                            "Paraguay"
                        ),
                        React.createElement(
                            "option",
                            { value: "Peru" },
                            "Peru"
                        ),
                        React.createElement(
                            "option",
                            { value: "Philippines" },
                            "Philippines"
                        ),
                        React.createElement(
                            "option",
                            { value: "Poland" },
                            "Poland"
                        ),
                        React.createElement(
                            "option",
                            { value: "Portugal" },
                            "Portugal"
                        ),
                        React.createElement(
                            "option",
                            { value: "Puerto Rico" },
                            "Puerto Rico"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "Q" },
                        React.createElement(
                            "option",
                            { value: "Qatar" },
                            "Qatar"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "R" },
                        React.createElement(
                            "option",
                            { value: "Reunion Island" },
                            "Reunion Island"
                        ),
                        React.createElement(
                            "option",
                            { value: "Romania" },
                            "Romania"
                        ),
                        React.createElement(
                            "option",
                            { value: "Russian Federation" },
                            "Russian Federation"
                        ),
                        React.createElement(
                            "option",
                            { value: "Rwanda" },
                            "Rwanda"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "S" },
                        React.createElement(
                            "option",
                            { value: "Samoa" },
                            "Samoa"
                        ),
                        React.createElement(
                            "option",
                            { value: "San Marino" },
                            "San Marino"
                        ),
                        React.createElement(
                            "option",
                            { value: "Saudi Arabia" },
                            "Saudi Arabia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Senegal" },
                            "Senegal"
                        ),
                        React.createElement(
                            "option",
                            { value: "Serbia" },
                            "Serbia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Sierra Leone" },
                            "Sierra Leone"
                        ),
                        React.createElement(
                            "option",
                            { value: "Singapore" },
                            "Singapore"
                        ),
                        React.createElement(
                            "option",
                            { value: "Slovakia" },
                            "Slovakia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Slovenia" },
                            "Slovenia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Somalia" },
                            "Somalia"
                        ),
                        React.createElement(
                            "option",
                            { value: "South Africa" },
                            "South Africa"
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
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "T" },
                        React.createElement(
                            "option",
                            { value: "Taiwan" },
                            "Taiwan"
                        ),
                        React.createElement(
                            "option",
                            { value: "Tanzania" },
                            "Tanzania"
                        ),
                        React.createElement(
                            "option",
                            { value: "Thailand" },
                            "Thailand"
                        ),
                        React.createElement(
                            "option",
                            { value: "Togo" },
                            "Togo"
                        ),
                        React.createElement(
                            "option",
                            { value: "Tunisia" },
                            "Tunisia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Turkey" },
                            "Turkey"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "U" },
                        React.createElement(
                            "option",
                            { value: "Uganda" },
                            "Uganda"
                        ),
                        React.createElement(
                            "option",
                            { value: "Ukraine" },
                            "Ukraine"
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
                            { value: "Uruguay" },
                            "Uruguay"
                        ),
                        React.createElement(
                            "option",
                            { value: "Uzbekistan" },
                            "Uzbekistan"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "V" },
                        React.createElement(
                            "option",
                            { value: "Vanuatu" },
                            "Vanuatu"
                        ),
                        React.createElement(
                            "option",
                            { value: "Vatican" },
                            "Vatican"
                        ),
                        React.createElement(
                            "option",
                            { value: "Venezuela" },
                            "Venezuela"
                        ),
                        React.createElement(
                            "option",
                            { value: "Vietnam" },
                            "Vietnam"
                        ),
                        React.createElement(
                            "option",
                            { value: "Virgin Islands" },
                            "Virgin Islands"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "W" },
                        React.createElement(
                            "option",
                            { value: "Wallis and Futuna Islands" },
                            "Wallis and Futuna Islands"
                        ),
                        React.createElement(
                            "option",
                            { value: "Western Sahara" },
                            "Western Sahara"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "Y" },
                        React.createElement(
                            "option",
                            { value: "Yemen" },
                            "Yemen"
                        )
                    ),
                    React.createElement(
                        "optgroup",
                        { label: "Z" },
                        React.createElement(
                            "option",
                            { value: "Zambia" },
                            "Zambia"
                        ),
                        React.createElement(
                            "option",
                            { value: "Zimbabwe" },
                            "Zimbabwe"
                        )
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

            var maxDate = new Date();
            birthDayPicker.mobiscroll().calendar({
                theme: "material",
                display: "bottom",
                dateFormat: "mm/dd/yyyy",
                maxDate: maxDate,
                onSelect: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtBirthDay, component.refs.txtBirthDayDiv);
                }
            }).mobiscroll("setDate", maxDate, true);
        },
        componentDidMount: function () {
            this.setupTitleSelect();
            this.setupGenderSelect();
            this.setupBirthDayCalendar();

            var txtTitle = this.refs.txtTitle;
            txtTitle.addEventListener("focus", this.handleTitleClick);

            var txtGender = this.refs.txtGender;
            txtGender.addEventListener("focus", this.handleGenderClick);

            var txtBirthDay = this.refs.txtBirthDay;
            txtBirthDay.addEventListener("focus", this.handleBirthDayClick);
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
        render: function () {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtTitleDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtTitle", ref: "txtTitle", onClick: this.handleTitleClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtTitle" },
                        "Title"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtFirstDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtFirstName", ref: "txtFirstName" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtFirstName" },
                        "First Name"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtSurnameDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtSurname", ref: "txtSurname" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtSurname" },
                        "Surname"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtGenderDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtGender", ref: "txtGender", onClick: this.handleGenderClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtGender" },
                        "Gender"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield", ref: "txtBirthDayDiv" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtBirthDay", ref: "txtBirthDay", onClick: this.handleBirthDayClick }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtBirthDay" },
                        "Date of Birth"
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
                userDetails: undefined
            };
        },
        socketCallback: function (message) {},
        componentDidMount: function () {
            componentHandler.upgradeDom();
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
                    component.refs.patientMedicalInfo.updateState({
                        nhsNumber: result.data.nhsNumber ? result.data.nhsNumber : "",
                        ethnicity: result.data.ethnicity ? result.data.ethnicity : "",
                        height: result.data.height ? result.data.height : "",
                        weight: result.data.weight ? result.data.weight : ""
                    });
                }
            });
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
        },
        render: function () {
            return React.createElement(
                "div",
                { className: "mdl-layout mdl-js-layout mdl-layout--fixed-header" },
                React.createElement(
                    "header",
                    { className: "mdl-layout__header" },
                    React.createElement(USER_PROFILE_PROGRESS, null),
                    React.createElement(
                        "div",
                        { className: "primary-bg profile-image-container" },
                        React.createElement("img", { src: "images/user.png", width: "120", height: "120", className: "img-responsive center-block profile-user-photo" }),
                        React.createElement(
                            "div",
                            { className: "userName" },
                            React.createElement(
                                "h4",
                                null,
                                this.state.userName
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mdl-layout__tab-bar mdl-js-ripple-effect" },
                        React.createElement(
                            "a",
                            { href: "#basic-info", className: "mdl-layout__tab is-active" },
                            "Basic Info"
                        ),
                        React.createElement(
                            "a",
                            { href: "#address", className: "mdl-layout__tab" },
                            "Address"
                        ),
                        React.createElement(
                            "a",
                            { href: "#medical", className: "mdl-layout__tab" },
                            "Medical"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "call-fab-container" },
                        React.createElement(
                            "button",
                            { ref: "photoCamera", className: "mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" },
                            React.createElement(
                                "i",
                                { className: "material-icons" },
                                "photo_camera"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "mdl-card__menu" },
                        React.createElement(
                            "button",
                            { className: "mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" },
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
                        )
                    )
                ),
                React.createElement(
                    "main",
                    { className: "mdl-layout__content" },
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel is-active", id: "basic-info" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(PatientBasicInfo, { ref: "patientInfoComponent" })
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "address" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(PatientAddress, { ref: "patientAddress" })
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "medical" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(PatientMedicalInfo, { ref: "patientMedicalInfo" })
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderPatientProfileDetails, null), document.getElementById("patient-profile-details-container"));
})();