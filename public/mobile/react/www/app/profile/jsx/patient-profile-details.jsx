/**
 * Created by Victor on 5/4/2016.
 */

(function() {
    "use strict";

    var intObj = {
        template: 3,
        parent: ".progress-bar-indeterminate"
    };
    var indeterminateProgress = new Mprogress(intObj);

    var USER_PROFILE_PROGRESS = React.createClass({
        componentDidMount: function() {
            indeterminateProgress.start();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div className="progress-bar-indeterminate"></div>
        }
    });

    var PatientMedicalInfo = React.createClass({
        getInitialState: function() {
            return {
                nhsNumber: "",
                ethnicity: "",
                height: "",
                weight: "",
            }
        },
        updateState: function(stateObject) {
            this.setState(stateObject);
        },
        handleEthnicityClick: function() {
            $(this.refs.sEthnicity).mobiscroll("show");
        },
        handleDiseasesClick: function() {
            $(this.refs.sDiseases).mobiscroll("show");
        },
        handleHeightClick: function() {
            $(this.refs.txtHeight).mobiscroll("show");
        },
        handleWeightClick: function() {
            $(this.refs.txtWeight).mobiscroll("show");
        },
        setupEthnicityClick: function() {
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
        setupDiseasesClick: function() {
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
        setupHeightClick: function() {
            var component = this;

            $(this.refs.txtHeight).mobiscroll().distance({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultUnit: 'm',
                units: ['m', 'in', 'ft'],
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtHeight, component.refs.txtHeightDiv);
                }
            }).mobiscroll('setVal', '1.5 m');

        },
        setupWeightClick: function() {
            var component = this;

            $(this.refs.txtWeight).mobiscroll().mass({
                theme: 'mobiscroll',
                display: 'bottom',
                defaultUnit: 'kg',
                max:300,
                units: ['kg', 'lb'],
                onClosed: function (valueText, inst) {
                    component.setRefElementValue(valueText, component.refs.txtWeight, component.refs.txtWeightDiv);
                }
            }).mobiscroll('setVal', '60 kg');

        },
        setRefElementValue: function(valueText, refElement, refElementDiv) {
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
        componentDidMount: function() {
            this.setupEthnicityClick();

            var txtEthnicity = this.refs.txtEthnicity;
            txtEthnicity.addEventListener("focus", this.handleEthnicityClick);

            this.setupDiseasesClick();

            var txtDiseases = this.refs.txtDiseases;
            txtDiseases.addEventListener("focus", this.handleDiseasesClick);

            this.setupHeightClick();
            this.setupWeightClick();

           // var txtHeight = this.refs.txtHeight;
           // txtHeight.addEventListener("focus", this.handleHeightClick);

        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.nhsNumber, this.refs.txtNhsNumber, this.refs.txtNhsNumberDiv);
            this.setRefElementValue(this.state.ethnicity, this.refs.txtEthnicity, this.refs.txtEthnicityDiv);
            this.setRefElementValue(this.state.diseases, this.refs.txtDiseases, this.refs.txtDiseasesDiv);
            this.setRefElementValue(this.state.height, this.refs.txtHeight, this.refs.txtHeightDiv);
            this.setRefElementValue(this.state.weight, this.refs.txtWeight, this.refs.txtWeightDiv);

            $(this.refs.sDiseases).mobiscroll('setVal', this.state.diseasesArray , true);
        },
        isValid: function() {
            var valid = true;
            this.setState({
                nhsNumber: $(this.refs.txtNhsNumber).val(),
                ethnicity: $(this.refs.txtEthnicity).val(),
                diseases: $(this.refs.txtDiseases).val(),
                height: $(this.refs.txtHeight).val(),
                weight: $(this.refs.txtWeight).val(),
            });

            if ($(this.refs.txtNhsNumber).val() == "") {
                $(this.refs.txtNhsNumberDiv).addClass("is-invalid");
                $(this.refs.txtNhsNumberDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({nhsNumber : $(this.refs.txtNhsNumber).val()});
            }

            if ($(this.refs.txtEthnicity).val() == "") {
                $(this.refs.txtEthnicityDiv).addClass("is-invalid");
                $(this.refs.txtEthnicityDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({ethnicity : $(this.refs.txtEthnicity).val()});
            }

            if ($(this.refs.txtDiseases).val() == "") {
                $(this.refs.txtDiseasesDiv).addClass("is-invalid");
                $(this.refs.txtDiseasesDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({diseases : $(this.refs.txtDiseases).val()});
            }

            if ($(this.refs.txtHeight).val() == "") {
                $(this.refs.txtHeightDiv).addClass("is-invalid");
                $(this.refs.txtHeightDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({height : $(this.refs.txtHeight).val()});
            }

            if ($(this.refs.txtWeight).val() == "") {
                $(this.refs.txtWeightDiv).addClass("is-invalid");
                $(this.refs.txtWeightDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({weight : $(this.refs.txtWeight).val()});
            }

            return valid;
        },
        render: function() {
            return <div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtNhsNumberDiv">
                    <i className="material-icons primary-icons md-36">fingerprint</i>
                    <input className="mdl-textfield__input" type="text" id="txtNhsNumber" ref="txtNhsNumber" />
                    <label className="mdl-textfield__label" htmlFor="txtNhsNumber">NHS Number</label>
                    <span className="mdl-textfield__error">NHS Number required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtEthnicityDiv">
                    <i className="material-icons primary-icons md-36">face</i>
                    <input className="mdl-textfield__input" type="text" id="txtEthnicity" ref="txtEthnicity" onClick={this.handleEthnicityClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtEthnicity">Choose Ethnicity</label>
                    <span className="mdl-textfield__error">Choose Ethnicity required!</span>
                </div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtDiseasesDiv">
                    <i className="material-icons primary-icons md-36">warning</i>
                    <label className="mdl-textfield__label" ref="labelTxtDiseases" htmlFor="txtDiseases">Diseases if any</label>
                    <input className="mdl-textfield__input" type="text" id="txtDiseases" ref="txtDiseases" onClick={this.handleDiseasesClick}/>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtHeightDiv">
                    <i className="material-icons primary-icons md-36">accessibility</i>
                    <input className="mdl-textfield__input" type="text" id="txtHeight" ref="txtHeight" onClick={this.handleHeightClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtHeight">Current Height</label>
                    <span className="mdl-textfield__error">Current Height required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtWeightDiv">
                    <i className="material-icons primary-icons md-36">adb</i>
                    <input className="mdl-textfield__input" type="text" id="txtWeight" ref="txtWeight" onClick={this.handleWeightClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtWeight">Current Weight</label>
                    <span className="mdl-textfield__error">Current Weight required!</span>
                </div>
                <div className="clear"></div>
                <select className="hide" name="Ethnicity" id="sEthnicity" ref="sEthnicity">
                    <option value="British / Mixed British">British / Mixed British</option>
                    <option value="Irish">Irish</option>
                    <option value="Other White Background">Other White Background</option>
                    <option value="Other White Background">White Caucasian</option>
                    <option value="White & BlackCaribbean">White & BlackCaribbean</option>
                    <option value="White & Black African">White & Black African</option>
                    <option value="Other Mixed Background">Other Mixed Background</option>
                    <option value="Indian / British Indian">Indian/ British Indian</option>
                    <option value="Pakistani / British Pakistani">Pakistani / British Pakistani</option>
                    <option value="Bangladeshi/British Bangladeshi">Bangladeshi / British Bangladeshi</option>
                    <option value="Other Asian Background">Other Asian Background</option>
                    <option value="Caribbean">Caribbean</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Other Black Background">Other Black Background</option>
                    <option value="Other ethnic group">Other ethnic group</option>
                </select>

                <select className="hide" name="Category" id="sDiseases" ref="sDiseases" multiple>
                    <option value="Asthma (on medication)">Asthma (on medication)</option>
                    <option value="Cancer">Cancer</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Epilepsy">Epilepsy</option>
                    <option value="Stroke/TIA">Stroke/TIA</option>
                    <option value="Hypertension (high blood pressure)">Hypertension (high blood pressure)</option>
                    <option value="Chronic heart disease">Chronic heart disease</option>
                    <option value="Chronic kidney disease">Chronic kidney disease</option>
                    <option value="Chronic lung disease">Chronic lung disease</option>
                    <option value="Hypothyroidism (underactive thyroid)">Hypothyroidism (underactive thyroid)</option>
                    <option value="Mental health concerns (give details)">Mental health concerns (give details)</option>
                    <option value="Previous operations">Previous operations</option>
                </select>
            </div>;
        }
    });

    var PatientAddress = React.createClass({
        getInitialState: function() {
            return {
                country: "",
                county: "",
                town: "",
                postCode: "",
                addressLine1: "",
                addressLine2: "",
                phone: "",
                mobile: "",
            }
        },
        updateState: function(stateObject) {
            this.setState(stateObject);
        },
        handleCountry: function() {
            $(this.refs.sCountries).mobiscroll("show");
        },
        setupCountrySelect: function() {
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
        setRefElementValue: function(valueText, refElement, refElementDiv) {
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
        componentDidMount: function() {
            this.setupCountrySelect();

            var txtCountry = this.refs.txtCountry;
            txtCountry.addEventListener("focus", this.handleCountry);
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.country, this.refs.txtCountry, this.refs.txtCountryDiv);
            this.setRefElementValue(this.state.county, this.refs.txtCounty, this.refs.txtCountyDiv);
            this.setRefElementValue(this.state.town, this.refs.txtTown, this.refs.txtTownDiv);
            this.setRefElementValue(this.state.postCode, this.refs.txtPostCode, this.refs.txtPostCodeDiv);txtMobile
            this.setRefElementValue(this.state.addressLine1, this.refs.txtAddressLine1, this.refs.txtAddressLine1Div);
            this.setRefElementValue(this.state.addressLine2, this.refs.txtAddressLine2, this.refs.txtAddressLine2Div);
            this.setRefElementValue(this.state.mobile, this.refs.txtMobile, this.refs.txtMobileDiv);
            this.setRefElementValue(this.state.phone, this.refs.txtPhone, this.refs.txtPhoneDiv);
        },
        isValid: function() {
            var valid = true;
            this.setState({
                country: $(this.refs.txtCountry).val(),
                county: $(this.refs.txtCounty).val(),
                town: $(this.refs.txtTown).val(),
                postCode: $(this.refs.txtPostCode).val(),
                addressLine1: $(this.refs.txtAddressLine1).val(),
                addressLine2: $(this.refs.txtAddressLine2).val(),
                mobile: $(this.refs.txtMobile).val(),
                phone: $(this.refs.txtPhone).val(),
            });

            if ($(this.refs.txtCountry).val() == "") {
                $(this.refs.txtCountryDiv).addClass("is-invalid");
                $(this.refs.txtCountryDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({country : $(this.refs.txtCountry).val()});
            }

            if ($(this.refs.txtCounty).val() == "") {
                $(this.refs.txtCountyDiv).addClass("is-invalid");
                $(this.refs.txtCountyDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({county : $(this.refs.txtCounty).val()});
            }

            if ($(this.refs.txtTown).val() == "") {
                $(this.refs.txtTownDiv).addClass("is-invalid");
                $(this.refs.txtTownDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({town : $(this.refs.txtTown).val()});
            }

            if ($(this.refs.txtPostCode).val() == "") {
                $(this.refs.txtPostCodeDiv).addClass("is-invalid");
                $(this.refs.txtPostCodeDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({postCode : $(this.refs.txtPostCode).val()});
            }

            if ($(this.refs.txtAddressLine1).val() == "") {
                $(this.refs.txtAddressLine1Div).addClass("is-invalid");
                $(this.refs.txtAddressLine1Div).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({addressLine1 : $(this.refs.txtAddressLine1).val()});
            }

            if ($(this.refs.txtMobile).val() == "") {
                $(this.refs.txtMobileDiv).addClass("is-invalid");
                $(this.refs.txtMobileDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({mobile : $(this.refs.txtMobile).val()});
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
        render: function() {
            return <div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtCountryDiv">
                    <i className="material-icons primary-icons md-36">language</i>
                    <input className="mdl-textfield__input" type="text" id="txtCountry" ref="txtCountry" onClick={this.handleCountry}/>
                    <label className="mdl-textfield__label" htmlFor="txtCountry">Country</label>
                    <span className="mdl-textfield__error">Country required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtCountyDiv">
                    <i className="material-icons primary-icons md-36">language</i>
                    <input className="mdl-textfield__input" type="text" id="txtCounty" ref="txtCounty"/>
                    <label className="mdl-textfield__label" htmlFor="txtCounty">County</label>
                    <span className="mdl-textfield__error">County required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtTownDiv">
                    <i className="material-icons primary-icons md-36">home</i>
                    <input className="mdl-textfield__input" type="text" id="txtTown" ref="txtTown"/>
                    <label className="mdl-textfield__label" htmlFor="txtTown">Town</label>
                    <span className="mdl-textfield__error">Town required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtPostCodeDiv">
                    <i className="material-icons primary-icons md-36">place</i>
                    <input className="mdl-textfield__input" type="text" id="txtPostCode" ref="txtPostCode"/>
                    <label className="mdl-textfield__label" htmlFor="txtPostCode">Post Code</label>
                    <span className="mdl-textfield__error">Post Code required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtAddressLine1Div">
                    <i className="material-icons primary-icons md-36">map</i>
                    <input className="mdl-textfield__input" type="text" id="txtAddressLine1" ref="txtAddressLine1"/>
                    <label className="mdl-textfield__label" htmlFor="txtAddressLine1">Address Line 1</label>
                    <span className="mdl-textfield__error">Address Line 1 required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtAddressLine2Div">
                    <i className="material-icons primary-icons md-36">map</i>
                    <input className="mdl-textfield__input" type="text" id="txtAddressLine2" ref="txtAddressLine2"/>
                    <label className="mdl-textfield__label" htmlFor="txtAddressLine2">Address Line 2</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtPhoneDiv">
                    <i className="material-icons primary-icons md-36">local_phone</i>
                    <input className="mdl-textfield__input" type="text" id="txtPhone" ref="txtPhone"/>
                    <label className="mdl-textfield__label" htmlFor="txtPhone">Phone</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtMobileDiv">
                    <i className="material-icons primary-icons md-36">stay_current_portrait</i>
                    <input className="mdl-textfield__input" type="text" id="txtMobile" ref="txtMobile"/>
                    <label className="mdl-textfield__label" htmlFor="txtMobile">Mobile</label>
                    <span className="mdl-textfield__error">Mobile required!</span>
                </div>
                <div className="clear"></div>
                <select id="sCountries" ref="sCountries" className="hide" name="Country">
                    <option value="Austria">Austria</option>
                    <option value="Belgium">Belgium</option>
                    <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                    <option value="Canada">Canada</option>
                    <option value="Finland">Finland</option>
                    <option value="Germany">Germany</option>
                    <option value="Greece">Greece</option>
                    <option value="Italy">Italy</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Moldova, Republic of">Moldova, Republic of</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Norway">Norway</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Romania">Romania</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Virgin Islands (British)">Virgin Islands (British)</option>
                    <option value="Virgin Islands (U.S.)">Virgin Islands (U.S.)</option>
                </select>
            </div>;
        }
    });

    var PatientBasicInfo = React.createClass({
        getInitialState: function() {
            return {
                title: "",
                firstName: "",
                surname: "",
                gender: "",
                dateOfBirth: ""
            }
        },
        updateState: function(stateObject) {
            this.setState(stateObject);
        },
        handleTitleClick: function() {
            $(this.refs.sTitle).mobiscroll("show");
        },
        handleGenderClick: function() {
            $(this.refs.sGender).mobiscroll("show");
        },
        handleBirthDayClick: function() {
            var birthDayPicker = $(this.refs.birthDayPicker);
            birthDayPicker.mobiscroll("show");
        },
        setupTitleSelect: function() {
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
        setupGenderSelect: function() {
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
        setupBirthDayCalendar: function() {
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
                }
            });
        },
        componentDidMount: function() {
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
        setRefElementValue: function(valueText, refElement, refElementDiv) {
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
        componentDidUpdate: function() {
            componentHandler.upgradeDom();

            this.setRefElementValue(this.state.title, this.refs.txtTitle, this.refs.txtTitleDiv);
            this.setRefElementValue(this.state.firstName, this.refs.txtFirstName, this.refs.txtFirstDiv);
            this.setRefElementValue(this.state.surname, this.refs.txtSurname, this.refs.txtSurnameDiv);
            this.setRefElementValue(this.state.gender, this.refs.txtGender, this.refs.txtGenderDiv);
            this.setRefElementValue(this.state.dateOfBirth, this.refs.txtBirthDay, this.refs.txtBirthDayDiv);
        },
        isValid: function() {
            var valid = true;
            this.setState({
                title: $(this.refs.txtTitle).val(),
                firstName: $(this.refs.txtFirstName).val(),
                surname: $(this.refs.txtSurname).val(),
                gender: $(this.refs.txtGender).val(),
                dateOfBirth: $(this.refs.txtBirthDay).val(),

            });

            if ($(this.refs.txtTitle).val() == "") {
                $(this.refs.txtTitleDiv).addClass("is-invalid");
                $(this.refs.txtTitleDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({title : $(this.refs.txtTitle).val()});
            }

            if ($(this.refs.txtFirstName).val() == "") {
                $(this.refs.txtFirstDiv).addClass("is-invalid");
                $(this.refs.txtFirstDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({firstName : $(this.refs.txtFirstName).val()});
            }

            if ($(this.refs.txtSurname).val() == "") {
                $(this.refs.txtSurnameDiv).addClass("is-invalid");
                $(this.refs.txtSurnameDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({surname : $(this.refs.txtSurname).val()});
            }

            if ($(this.refs.txtGender).val() == "") {
                $(this.refs.txtGenderDiv).addClass("is-invalid");
                $(this.refs.txtGenderDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({gender : $(this.refs.txtGender).val()});
            }

            if ($(this.refs.txtBirthDay).val() == "") {
                $(this.refs.txtBirthDayDiv).addClass("is-invalid");
                $(this.refs.txtBirthDayDiv).addClass("is-focused");
                valid = false;
            }
            else {
                this.setState({dateOfBirth : $(this.refs.txtBirthDay).val()});
            }

            return valid;
        },
        render: function() {
            return <div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtTitleDiv">
                    <i className="material-icons primary-icons md-36">person</i>
                    <input className="mdl-textfield__input" type="text" id="txtTitle" ref="txtTitle" onClick={this.handleTitleClick} />
                    <label className="mdl-textfield__label" htmlFor="txtTitle">Title</label>
                    <span className="mdl-textfield__error">Title required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtFirstDiv">
                    <i className="material-icons primary-icons md-36">person</i>
                    <input className="mdl-textfield__input" type="text" id="txtFirstName" ref="txtFirstName"/>
                    <label className="mdl-textfield__label" htmlFor="txtFirstName">First Name</label>
                    <span className="mdl-textfield__error">First Name required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtSurnameDiv">
                    <i className="material-icons primary-icons md-36">person</i>
                    <input className="mdl-textfield__input" type="text" id="txtSurname" ref="txtSurname"/>
                    <label className="mdl-textfield__label" htmlFor="txtSurname">Surname</label>
                    <span className="mdl-textfield__error">Surname required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtGenderDiv">
                    <i className="material-icons primary-icons md-36">person</i>
                    <input className="mdl-textfield__input" type="text" id="txtGender" ref="txtGender" onClick={this.handleGenderClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtGender">Gender</label>
                    <span className="mdl-textfield__error">Gender required!</span>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtBirthDayDiv">
                    <i className="material-icons primary-icons md-36">cake</i>
                    <input className="mdl-textfield__input" type="text" id="txtBirthDay" ref="txtBirthDay" onClick={this.handleBirthDayClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtBirthDay">Date of Birth</label>
                    <span className="mdl-textfield__error">Date of Birth required!</span>
                </div>
                <div className="clear"></div>
                <select className="hide" name="Title" id="sTitle" ref="sTitle">
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                </select>
                <select className="hide" name="Gender" id="sGender" ref="sGender">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="NoAnswer">Prefer not to answer</option>
                </select>
                <input id="birthDayPicker" ref="birthDayPicker" className="hide"/>
            </div>;
        }
    });

    var ProviderPatientProfileDetails = React.createClass({
        getInitialState: function() {
            return {
                userName: "",
                userDetails: undefined
            };
        },
        socketCallback: function(message) {
        },
        componentDidMount: function() {
            componentHandler.upgradeDom();
            var component = this;
            $(document).ready(function () {
                $('#patient-details-collapse')
                    .on('show.bs.collapse', function (a) {
                        $(a.target).prev('.panel-heading').addClass('active');
                    })
                    .on('hide.bs.collapse', function (a) {
                        $(a.target).prev('.panel-heading').removeClass('active');
                    });
            });

            Bridge.Patient.getDetails(function (result) {
                indeterminateProgress.end();
                if (result.success) {
                    component.setState({userDetails: result.data});

                    var userTitle = result.data.title ? result.data.title : "";
                    var userName = result.data.name ? result.data.name : "";
                    var userSurname = result.data.surname ? result.data.surname : "";

                    var finalName = userTitle;
                    if (finalName == "") {
                        finalName = userName;
                    }
                    else {
                        finalName += " " + userName;
                    }

                    if (finalName == "") {
                        finalName = userSurname;
                    }
                    else {
                        finalName += " " + userSurname;
                    }

                    component.setState({userName: finalName});

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
                        mobile: result.data.mobile ? result.data.mobile : "",
                    });

                    var healthProblemsText = "";
                    if(result.data.healthProblems){
                        healthProblemsText = result.data.healthProblems.reduce(function(all, healthProblem) {
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
                }
            });
        },
        createUUID:  function() {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },
        handleDone: function() {
            if (!this.refs.patientInfoComponent.isValid()) {
                if ($(this.refs.basicAddress).hasClass("is-active")) {
                    $(this.refs.basicAddress).removeClass("is-active")
                    $(this.refs.basicAddressContent).removeClass("is-active")
                }
                if ($(this.refs.basicMedical).hasClass("is-active")) {
                    $(this.refs.basicMedical).removeClass("is-active")
                    $(this.refs.basicMedicalContent).removeClass("is-active")
                }

                if (!$(this.refs.basicInfoTab).hasClass("is-active")) {
                    $(this.refs.basicInfoTab).addClass("is-active")
                    $(this.refs.basicInfoTabContent).addClass("is-active")
                }
                return;
            }

            if (!this.refs.patientAddress.isValid()) {
                if ($(this.refs.basicInfoTab).hasClass("is-active")) {
                    $(this.refs.basicInfoTab).removeClass("is-active")
                    $(this.refs.basicInfoTabContent).removeClass("is-active")
                }

                if (!$(this.refs.basicAddress).hasClass("is-active")) {
                    $(this.refs.basicAddress).addClass("is-active")
                    $(this.refs.basicAddressContent).addClass("is-active")
                }

                if ($(this.refs.basicMedical).hasClass("is-active")) {
                    $(this.refs.basicMedical).removeClass("is-active")
                    $(this.refs.basicMedicalContent).removeClass("is-active")
                }
                return;
            }

            if (!this.refs.patientMedicalInfo.isValid()) {
                if ($(this.refs.basicInfoTab).hasClass("is-active")) {
                    $(this.refs.basicInfoTab).removeClass("is-active")
                    $(this.refs.basicInfoTabContent).removeClass("is-active")
                }

                if ($(this.refs.basicAddress).hasClass("is-active")) {
                    $(this.refs.basicAddress).removeClass("is-active")
                    $(this.refs.basicAddressContent).removeClass("is-active")
                }

                if (!$(this.refs.basicMedical).hasClass("is-active")) {
                    $(this.refs.basicMedical).addClass("is-active")
                    $(this.refs.basicMedicalContent).addClass("is-active")
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

            Bridge.Patient.saveDetails(objectToPost, function(result) {
                indeterminateProgress.start();
                if (result.success) {
                    indeterminateProgress.end();
                }
            });
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();

            var doneButton = this.refs.doneButton;
            doneButton.addEventListener("click", this.handleDone);
        },
        render: function() {
            return <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <USER_PROFILE_PROGRESS />
                    <div className="primary-bg profile-image-container">
                        <img src="images/user.png" width="120" height="20" className="img-responsive center-block profile-user-photo" />
                        <div className="userName"><h4>{this.state.userName}</h4></div>
                    </div>
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                        <a href="#basic-info" className="mdl-layout__tab is-active" ref="basicInfoTab">Basic Info</a>
                        <a href="#address" className="mdl-layout__tab" ref="basicAddress">Address</a>
                        <a href="#medical" className="mdl-layout__tab" ref="basicMedical">Medical</a>
                    </div>
                    <div className="mdl-card__menu">
                        <button ref="doneButton" className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i className="material-icons">done</i>
                            <span className="mdl-button__ripple-container"><span className="mdl-ripple is-animating"></span>
                            </span>
                        </button>
                    </div>
                </header>
                <main className="mdl-layout__content">
                    <section className="mdl-layout__tab-panel is-active" id="basic-info" ref="basicInfoTabContent">
                        <div className="page-content">
                            <PatientBasicInfo ref="patientInfoComponent"/>
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="address" ref="basicAddressContent">
                        <div className="page-content">
                            <PatientAddress ref="patientAddress"/>
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="medical" ref="basicMedicalContent">
                        <div className="page-content">
                            <PatientMedicalInfo ref="patientMedicalInfo"/>
                        </div>
                    </section>
                </main>
            </div>
        }
    });

    ReactDOM.render(<ProviderPatientProfileDetails />, document.getElementById("patient-profile-details-container"));
})();