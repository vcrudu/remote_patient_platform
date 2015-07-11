/**
 * Created by Victor on 07/07/2015.
 */

module.exports=function(grunt){
    grunt.initConfig({
        jshint:{
            files: ['auth/**/*js',
                    'controllers/**/*js',
                    'repositories/**/*js',
                    'services/**/*js',
                    'test/**/*js',
                    'public/*.js',
                    'public/directives/*.js',
                    'public/services/*.js']
        },
        watch :{
            files: ['auth/**/*js',
                'controllers/**/*js',
                'repositories/**/*js',
                'services/**/*js',
                'test/**/*js',
                'public/*.js',
                'public/directives/*.js',
                'public/services/*.js'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
};