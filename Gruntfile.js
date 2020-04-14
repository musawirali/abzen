module.exports = function(grunt) {
 grunt.initConfig({
   copy: {
     serve: {
       src: 'dist/apps/serve/main.js',
       dest: 'apps/admin-server/src/assets/abzen.js',
     },
   },
   watch: {
     serve: {
       files: 'dist/apps/serve/main.js',
       tasks: ['copy'],
     },
   },
 });
 
 grunt.loadNpmTasks('grunt-contrib-copy');
 grunt.loadNpmTasks('grunt-contrib-watch');
}