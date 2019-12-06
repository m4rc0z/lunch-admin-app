const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/authenticated/api', { target: 'http://lunchbackend:3005/', secure: false }));
};