'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  "ngSanitize",
  // templates
  'myApp.campaign_list',  
  'myApp.campaign_info',
  'myApp.icon',
  // version
  'myApp.version',
  //video
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.poster"
])


.config(['$routeProvider','$mdThemingProvider', function($routeProvider, $mdThemingProvider) {  
  /// routeProvider ///
  $routeProvider.when('/campaign_list', {
    templateUrl: 'templates/campaign_list/campaign_list.html',
    controller: 'CampaignListController'
  });
  $routeProvider.when('/campaign_info', {
    templateUrl: 'templates/campaign_info/campaign_info.html',
    controller: 'CampaignInfoController'
  });
  $routeProvider.when('/icon', {
    templateUrl: 'templates/icon/icon.html',
    controller: 'iconCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/campaign_list'});

  /// mdThemingProvider ///
  $mdThemingProvider.theme('default')
          .primaryPalette('light-blue')
          .accentPalette('green')
          .warnPalette('blue');

}]);


  

