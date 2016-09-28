
(function() {

 
    var patientsGroupRepository = require('../repositories/patientsGroupRepository');
    module.exports.init = function (app) {
        app.get('/checkExistsGroupName', function (req, res) {


            if (!req.query.groupName) {
                res.json({
                    success: false
                });
            }
            
           
         
                        var byGroupId = {};

                        byGroupId.providerId = req.query.providerId;
                        byGroupId.groupName = req.query.groupName;
                       
                       

                        patientsGroupRepository.getOne(byGroupId, function (err, data) {


                            if (err) {

                                res.status(500).json({
                                    success: false
                                                     });
                            } else {


                                res.json({
                                    success: true
                                    

                                });

                            }

                        });

                   
                
          

        });
    };
})();
