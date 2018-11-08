(function(){
  'use strict';
  angular.module('spades')
  .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider) {
  	$urlRouterProvider.otherwise("/init");
    $stateProvider
    .state('app', {
      abstract: true,
      template: '<div class="page-container"><div ui-view class="ng-fadeInLeftShort"></div></div>',
      controller: 'GaussianEliminationController',
    })
    .state('app.init', {
      url: '/init',
      title: 'Gaussian Elimination',
      templateUrl: 'views/gaussian_elimination/index.html',
    })
    ;
  }]);
})();