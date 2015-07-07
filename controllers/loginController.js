/**
 * Created by Victor on 15/06/2015.
 */
(function(loginController){

    var passport = require("passport");
    loginController.init = function(app){
      app.post('/login', passport.authenticate('local'), function(req, res){
            res.redirect('/users/'+req.user.username);
      });
    };

})(model.exports);