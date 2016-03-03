/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        componentDidMount: function() {

            return <p>Hello1</p>;
        },
        render : function (){
            return (
                <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                    {this.props.children}
            </div>
            );
        }
    });


    ReactDOM.render(<ProviderAvailabilityCalendar author="vasea" children="its okey"/>, document.getElementById("provider-availability"));
})();