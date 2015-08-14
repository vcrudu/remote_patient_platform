/**
 * Created by Victor on 06/08/2015.
 */

(function(){

    module.exports.init = function(app){
        app.get('/v1/api/devices', function(req, res){
            var params = req.params;
        });

        app.get('/v1/api/devices/:model', function(req, res){
            var params = req.params;
        });

        app.post('/v1/api/devices', function(req, res){
            var body = req.body;
        });

        app.put('/v1/api/devices', function(req, res){
            var params = req.params;
        });

        app.put('/v1/api/devices/:model', function(req, res){
            var params = req.params;
        });

        app.delete('/v1/api/devices/:model', function(req, res){
            res.send(400);
        });
    };
})();