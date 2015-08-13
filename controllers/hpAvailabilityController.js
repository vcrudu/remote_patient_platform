/**
 * Created by Victor on 06/08/2015.
 */

(function(){

    module.exports.init = function(app){
        app.get('/v1/api/availabilities', function(req, res){
            var params = req.params;
            res.send(400);
        });

        app.get('/v1/api/availabilities/:userId', function(req, res){
            var params = req.params;
            res.send(400);
        });

        app.post('/v1/api/availabilities', function(req, res){
            var body = req.body;
            res.send(400);
        });

        app.put('/v1/api/availabilities', function(req, res){
            res.send(400);
        });

        app.put('/v1/api/availabilities/:userId', function(req, res){
            var params = req.params;
            res.send(400);
        });

        app.delete('/v1/api/availabilities', function(req, res){
            res.send(400);
        });
    };
})();