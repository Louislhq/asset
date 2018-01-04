requirejs.config({
    urlArgs: 'v=' + new Date().getTime(),
    baseUrl: '/dev/js/lib/',
    paths: {
        core: '../core',
        app: '../app',
        jquery: '../app/jquery',
        jQuery: 'jquery1.10.2'
    }
});
define('config', [], function () {
    return;
});