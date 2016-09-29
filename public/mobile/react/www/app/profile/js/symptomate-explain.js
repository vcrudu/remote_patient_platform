/**
 * Created by Victor on 9/8/2016.
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

    var SymptomateExplain = React.createClass({
        displayName: "SymptomateExplain",

        getInitialState: function () {
            return {
                conditionProbability
            };
        },
        componentDidMount: function () {},
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
                        "Symptomate Explain."
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(SymptomateExplain, null), document.getElementById("symptomate-explain"));
})();