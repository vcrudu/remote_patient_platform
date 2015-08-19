/**
 * Created by v.crudu on 02/03/2015.
 */

var express = require('express');
var jwt                 = require("jsonwebtoken");
var ordersController = require('./ordersController');
var devicesController = require('./devicesController');
var logging     = require('../logging');

(function(controllers){
    controllers.init = function(app){
        var apiRoutes = express.Router();

        logging.getLogger().trace("Call use router");
        apiRoutes.use(function(req,res,next){
            var token = req.body.token ||
                req.query.token || req.headers['x-access-token'];
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
                    if(err){
                        res.status(403).send({
                            success:false,
                            message: 'Failed to authenticate token.'
                        });
                    }else{
                        req.decoded = decoded;
                        next();
                    }
                });
            } else {
                return res.status(403).send({
                    success:false,
                    message:'No token provided.'
                });
            }
        });

        devicesController.init(apiRoutes);
        ordersController.init(apiRoutes);

        app.use('/v1/api',apiRoutes);

    };
})(module.exports);