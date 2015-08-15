
/**
 * Created by Victor on 15/08/2015.
 */
(function(){
    module.exports = function(args){

        //Todo-here implement question entity
        assert.ok(args.text,"Question text should be specified!");
        assert.ok(args.answerOptions, "Answer options should be specified!");

        var question = {text:args.text,answerOptions:args.answerOptions};
        return question;
    };
})();