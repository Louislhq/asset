define(function() {
    'use strict';
    (function(){
    	var cncnUI = window.cncnUI || {};
	    cncnUI = {
	    	_INSTALL: function(){
				window.cncnUI = cncnUI;
			},
	        base: {},
	        ui:{},
	        ci:{}
	    };
	    cncnUI._INSTALL();
    }(window));

    return cncnUI;
  });