
var lrSnippet = require('connect-livereload')({port: 35729 });
var livereloadMiddleware = function(connect, options){

    return [
        lrSnippet
        ,connect.static(options.base)
        ,connect.directory(options.base)
    ]
};

module.exports = function (grunt){

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('default', ['protractor:dev']);
  grunt.registerTask('test', ['karma:watch']);

    var karmaConfig = function(configFile, customOptions) {
      var options = { configFile: configFile, keepalive: true };
      var travisOptions = process.env.TRAVIS && { browsers: ['Chrome'], reporters: 'dots' };
      return grunt.util._.extend(options, customOptions, travisOptions);
    };

  grunt.initConfig(
  {
  	connect: {dev: {options: {base: 'app',keepalive: true, open: true, middleware: livereloadMiddleware}}}
  ,karma:  {
              unit: { options: karmaConfig('karma.conf.js', { singleRun:true, autoWatch: false, browsers: ['Chrome']})},
              watch: { options: karmaConfig('karma.conf.js', { singleRun:false, autoWatch: true}) }
            }

  ,protractor: {
    options: {
      keepAlive: true, // If false, the grunt process stops when the test fails.
      noColor: false, // If true, protractor will not use colors in its output.
      args: {
        // Arguments passed to the command
      }
    },
    dev: {
      options: {configFile: "test/protractor/config.js", // Target-specific config file
        args: {} // Target-specific arguments
      }
    }}
  })};