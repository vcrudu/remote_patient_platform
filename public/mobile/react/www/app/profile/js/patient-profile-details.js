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

    var PatientAddress = React.createClass({
        displayName: "PatientAddress",

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
                    $(component.refs.txtCountry).val(valueText);
                    if ($(component.refs.txtCountryDiv).hasClass("is-focused")) {
                        $(component.refs.txtCountryDiv).removeClass("is-focused");
                    }
                    if (!$(component.refs.txtCountryDiv).hasClass("is-dirty")) {
                        $(component.refs.txtCountryDiv).addClass("is-dirty");
                    }
                    $(component.refs.txtCountry).blur();
                }
            });

            $("#sCountries_dummy").hide();
        },
        componentDidMount: function () {
            this.setupCountrySelect();

            var txtCountry = this.refs.txtCountry;
            txtCountry.addEventListener("focus", this.handleCountry);
        },
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
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
                    $(component.refs.txtTitle).val(valueText);
                    if ($(component.refs.txtTitleDiv).hasClass("is-focused")) {
                        $(component.refs.txtTitleDiv).removeClass("is-focused");
                    }
                    if (!$(component.refs.txtTitleDiv).hasClass("is-dirty")) {
                        $(component.refs.txtTitleDiv).addClass("is-dirty");
                    }
                    $(component.refs.txtTitle).blur();
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
                    $(component.refs.txtGender).val(valueText);
                    if ($(component.refs.txtGenderDiv).hasClass("is-focused")) {
                        $(component.refs.txtGenderDiv).removeClass("is-focused");
                    }
                    if (!$(component.refs.txtGenderDiv).hasClass("is-dirty")) {
                        $(component.refs.txtGenderDiv).addClass("is-dirty");
                    }
                    $(component.refs.txtGender).blur();
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
                    $(component.refs.txtBirthDay).val(valueText);
                    if ($(component.refs.txtBirthDayDiv).hasClass("is-focused")) {
                        $(component.refs.txtBirthDayDiv).removeClass("is-focused");
                    }
                    if (!$(component.refs.txtBirthDayDiv).hasClass("is-dirty")) {
                        $(component.refs.txtBirthDayDiv).addClass("is-dirty");
                    }

                    $(component.refs.txtBirthDay).blur();
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
        componentDidUpdate: function () {
            componentHandler.upgradeDom();
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
                    { className: "mdl-textfield mdl-js-textfield" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtFirstName" }),
                    React.createElement(
                        "label",
                        { className: "mdl-textfield__label", htmlFor: "txtFirstName" },
                        "First Name"
                    )
                ),
                React.createElement("div", { className: "clear" }),
                React.createElement(
                    "div",
                    { className: "mdl-textfield mdl-js-textfield" },
                    React.createElement("input", { className: "mdl-textfield__input", type: "text", id: "txtSurname" }),
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

        socketCallback: function (message) {},
        componentDidMount: function () {
            $(document).ready(function () {
                $('#patient-details-collapse').on('show.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').addClass('active');
                }).on('hide.bs.collapse', function (a) {
                    $(a.target).prev('.panel-heading').removeClass('active');
                });
            });

            indeterminateProgress.end();
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
                                "User Name"
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
                            React.createElement(PatientBasicInfo, null)
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "address" },
                        React.createElement(
                            "div",
                            { className: "page-content" },
                            React.createElement(PatientAddress, null)
                        )
                    ),
                    React.createElement(
                        "section",
                        { className: "mdl-layout__tab-panel", id: "medical" },
                        React.createElement("div", { className: "page-content" })
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderPatientProfileDetails, null), document.getElementById("patient-profile-details-container"));
})();