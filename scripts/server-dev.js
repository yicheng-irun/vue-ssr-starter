const path = require('path');
const nodemon = require('nodemon');

nodemon({
    script: path.resolve(__dirname, '../server/index.js'),
    ext: 'js',
    env: {
        NODE_ENV: 'development',
        NODE_SERVER_PORT: process.env.NODE_SERVER_PORT || 10001,
    },
    watch: [
        'server'
    ],
    // delay: 2500,
});

nodemon.on('start', function () {
    console.log('App has started');
}).on('quit', function () {
    console.log('App has quit');
    process.exit();
}).on('restart', function (files) {
    console.log('App restarted due to: ', files);
});