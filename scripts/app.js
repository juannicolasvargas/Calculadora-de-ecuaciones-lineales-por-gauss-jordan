(function(){
	'use strict';
	angular.module('spades',[
		'ui.router',			// Routing
	])
	.run(['$rootScope',function($rootScope){
		$rootScope.alerts = [];
	}]);
})();