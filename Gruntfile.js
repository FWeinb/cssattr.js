module.exports = function (grunt) {

    var src = [
                'src/cssparser/PropertyValueParser.js',
                'src/cssparser/CSSParser.js',

                'src/style/StyleGenerator.js',
                'src/style/NodeObserver.js',

                'src/cssattr.js'
    ];

    // Include intro/outro in Dist build;
    var srcDist = src.slice(0);
        srcDist.unshift('src/intro.js');
        srcDist.push('src/outro.js');

    // Just load the devintro to have all modules in globale space.
    var srcDev = src.slice(0);
        srcDev.unshift('src/devintro.js');

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        meta :{
          banner :  '/*! CSS3 attr() Polyfill - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'+
                    ' * \n'+
                    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n'+
                    ' */\n'
        },
        concat : {
          options : {
            banner : '<%= meta.banner %>'
          },
          dist : {
            src : srcDist,
            dest : 'dist/cssattr.js'
          },
          dev : {
            src : srcDev,
            dest : 'dev/cssattr.js'
          }
        },
        uglify : {
          options : {
            banner : '<%= meta.banner %>',
            report : 'gzip'
          },
          dist : {
            files : {
              'dist/cssattr.min.js' : ['dist/cssattr.js']
            }
          }
        },
        jshint : {
          options: {
                 jshintrc: '.jshintrc',
          },
          dist : ['Gruntfile.js', 'dist/cssattr.js'],
          dev : ['dev/cssattr.js']
        },
        karma : {
          options :{
            configFile : 'karma.conf.js'
          },
          dist : {
            singleRun: true
          },
          dev : {
            background: true
          }
        },
        watch : {
          scripts : {
            files : ['src/**/*.js'],
            tasks : ['devBuild', 'karma:dev:run']
          },
          testChanged : {
            files : ['test/**/*.test.js'],
            tasks : ['karma:dev:run']
          }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build',     ['concat:dist', 'jshint:dist', 'test', 'uglify']);
    grunt.registerTask('devBuild',  ['concat:dev', 'jshint:dev']);
    grunt.registerTask('test',      ['devBuild' ,'karma:dist']);
    grunt.registerTask('dev',       ['devBuild', 'karma:dev', 'watch' ]);

};