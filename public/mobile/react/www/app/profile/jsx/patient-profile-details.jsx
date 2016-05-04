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

    var PatientAddress = React.createClass({
        handleCountry: function() {
            $(this.refs.sCountries).mobiscroll("show");
        },
        setupCountrySelect: function() {
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
        componentDidMount: function() {
            this.setupCountrySelect();

            var txtCountry = this.refs.txtCountry;
            txtCountry.addEventListener("focus", this.handleCountry);
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtCountryDiv">
                    <input className="mdl-textfield__input" type="text" id="txtCountry" ref="txtCountry" onClick={this.handleCountry}/>
                    <label className="mdl-textfield__label" htmlFor="txtCountry">Country</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtCountyDiv">
                    <input className="mdl-textfield__input" type="text" id="txtCounty" ref="txtCounty"/>
                    <label className="mdl-textfield__label" htmlFor="txtCounty">County</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtTownDiv">
                    <input className="mdl-textfield__input" type="text" id="txtTown" ref="txtTown"/>
                    <label className="mdl-textfield__label" htmlFor="txtTown">Town</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtPostCodeDiv">
                    <input className="mdl-textfield__input" type="text" id="txtPostCode" ref="txtPostCode"/>
                    <label className="mdl-textfield__label" htmlFor="txtPostCode">Post Code</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtAddressLine1Div">
                    <input className="mdl-textfield__input" type="text" id="txtAddressLine1" ref="txtAddressLine1"/>
                    <label className="mdl-textfield__label" htmlFor="txtAddressLine1">Address Line 1</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtAddressLine2Div">
                    <input className="mdl-textfield__input" type="text" id="txtAddressLine2" ref="txtAddressLine2"/>
                    <label className="mdl-textfield__label" htmlFor="txtAddressLine2">Address Line 2</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtPhoneDiv">
                    <input className="mdl-textfield__input" type="text" id="txtPhone" ref="txtPhone"/>
                    <label className="mdl-textfield__label" htmlFor="txtPhone">Phone</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtMobileDiv">
                    <input className="mdl-textfield__input" type="text" id="txtMobile" ref="txtMobile"/>
                    <label className="mdl-textfield__label" htmlFor="txtMobile">Mobile</label>
                </div>
                <div className="clear"></div>
                <select id="sCountries" ref="sCountries" className="hide" name="Country">
                    <optgroup label="A">
                        <option value="Afganistan">Afganistan</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                    </optgroup>
                    <optgroup label="B">
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Bulgaria">Bulgaria</option>
                    </optgroup>
                    <optgroup label="C">
                        <option value="Cambodia">Cambodia</option>
                        <option value="Canada">Canada</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Croatia">Croatia</option>
                    </optgroup>
                    <optgroup label="D">
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                    </optgroup>
                    <optgroup label="E">
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Estonia">Estonia</option>
                    </optgroup>
                    <optgroup label="F">
                        <option value="Falkland Islands">Falkland Islands</option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="Fiji">Fiji</option>
                    </optgroup>
                    <optgroup label="G">
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guyana">Guyana</option>
                    </optgroup>
                    <optgroup label="H">
                        <option value="Haiti">Haiti</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                    </optgroup>
                    <optgroup label="I">
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iraq"Iraq></option>
                        <option value="Ireland">Ireland</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                    </optgroup>
                    <optgroup label="J">
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jordan">Jordan</option>
                    </optgroup>
                    <optgroup label="K">
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Korea">Korea</option>
                        <option value="Kuwait">Kuwait</option>
                    </optgroup>
                    <optgroup label="L">
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libya">Libya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                    </optgroup>
                    <optgroup label="M">
                        <option value="Macau">Macau</option>
                        <option value="Macedonia">Macedonia</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                    </optgroup>
                    <optgroup label="N">
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Norway">Norway</option>
                    </optgroup>
                    <optgroup label="O">
                        <option value="Oman">Oman</option>
                    </optgroup>
                    <optgroup label="P">
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Panama">Panama</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                    </optgroup>
                    <optgroup label="Q">
                        <option value="Qatar">Qatar</option>
                    </optgroup>
                    <optgroup label="R">
                        <option value="Reunion Island">Reunion Island</option>
                        <option value="Romania">Romania</option>
                        <option value="Russian Federation">Russian Federation</option>
                        <option value="Rwanda">Rwanda</option>
                    </optgroup>
                    <optgroup label="S">
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                    </optgroup>
                    <optgroup label="T">
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Togo">Togo</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                    </optgroup>
                    <optgroup label="U">
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                    </optgroup>
                    <optgroup label="V">
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Vatican">Vatican</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Virgin Islands">Virgin Islands</option>
                    </optgroup>
                    <optgroup label="W">
                        <option value="Wallis and Futuna Islands">Wallis and Futuna Islands</option>
                        <option value="Western Sahara">Western Sahara</option>
                    </optgroup>
                    <optgroup label="Y">
                        <option value="Yemen">Yemen</option>
                    </optgroup>
                    <optgroup label="Z">
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                    </optgroup>
                </select>
            </div>;
        }
    });

    var PatientBasicInfo = React.createClass({
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
        setupGenderSelect: function() {
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
        setupBirthDayCalendar: function() {
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
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtTitleDiv">
                    <input className="mdl-textfield__input" type="text" id="txtTitle" ref="txtTitle" onClick={this.handleTitleClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtTitle">Title</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="text" id="txtFirstName" />
                    <label className="mdl-textfield__label" htmlFor="txtFirstName">First Name</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" type="text" id="txtSurname" />
                    <label className="mdl-textfield__label" htmlFor="txtSurname">Surname</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtGenderDiv">
                    <input className="mdl-textfield__input" type="text" id="txtGender" ref="txtGender" onClick={this.handleGenderClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtGender">Gender</label>
                </div>
                <div className="clear"></div>
                <div className="mdl-textfield mdl-js-textfield" ref="txtBirthDayDiv">
                    <input className="mdl-textfield__input" type="text" id="txtBirthDay" ref="txtBirthDay" onClick={this.handleBirthDayClick}/>
                    <label className="mdl-textfield__label" htmlFor="txtBirthDay">Date of Birth</label>
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
        socketCallback: function(message) {
        },
        componentDidMount: function() {
            $(document).ready(function() {
                $('#patient-details-collapse')
                    .on('show.bs.collapse', function(a) {
                        $(a.target).prev('.panel-heading').addClass('active');
                    })
                    .on('hide.bs.collapse', function(a) {
                        $(a.target).prev('.panel-heading').removeClass('active');
                    });
            });

            indeterminateProgress.end();
        },
        componentDidUpdate: function() {
            componentHandler.upgradeDom();
        },
        render: function() {
            return <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <USER_PROFILE_PROGRESS />
                    <div className="primary-bg profile-image-container">
                        <img src="images/user.png" width="120" height="120" className="img-responsive center-block profile-user-photo" />
                        <div className="userName"><h4>User Name</h4></div>
                    </div>
                    <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
                        <a href="#basic-info" className="mdl-layout__tab is-active">Basic Info</a>
                        <a href="#address" className="mdl-layout__tab">Address</a>
                        <a href="#medical" className="mdl-layout__tab">Medical</a>
                    </div>
                    <div className="call-fab-container">
                        <button ref="photoCamera" className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
                            <i className="material-icons">photo_camera</i>
                        </button>
                    </div>
                </header>
                <main className="mdl-layout__content">
                    <section className="mdl-layout__tab-panel is-active" id="basic-info">
                        <div className="page-content">
                            <PatientBasicInfo />
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="address">
                        <div className="page-content">
                            <PatientAddress />
                        </div>
                    </section>
                    <section className="mdl-layout__tab-panel" id="medical">
                        <div className="page-content">
                        </div>
                    </section>
                </main>
            </div>
        }
    });

    ReactDOM.render(<ProviderPatientProfileDetails />, document.getElementById("patient-profile-details-container"));
})();