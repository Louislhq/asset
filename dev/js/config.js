requirejs.config({
    urlArgs: "v=" + (new Date()).getTime(),
    baseUrl: '/dest/js/lib/',
    paths: {
        core: '../core',
        app: '../app',
        jQuery:'jquery-2.2.4.min'
    }

});


/*requirejs.onError = function(err){
    console.log(err);
};*/