'use strict';

angular.module('myApp.campaign_info', ['ngRoute','ngMaterial'])

.controller('CampaignInfoController', function($scope, $http, $location) {
	var campaign = this;  	

	$scope.goNext = function (next) {
		$location.path(next);
	}

  // $http.get('https://demo1697037.mockable.io/test_message').success(function(data) {
  // 	console.log(data);
  //   campaign.campaigns = data;
  // });
});