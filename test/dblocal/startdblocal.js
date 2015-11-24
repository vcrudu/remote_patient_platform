(function(){
    var exec = require('child_process').exec,
        child;
    var path = require('path');

    var pathdb = path.resolve('../') + "\\dblocal";


    var dbstart= function(){
        child = exec('startdb.cmd', pathdb,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }


            });
    }
    module.exports={
        dbstart:dbstart
    }
})();