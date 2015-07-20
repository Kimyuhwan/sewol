'use strict';

angular.module('myApp.campaign_list', ['ngRoute','ngMaterial'])

.controller('CampaignListController', function($scope, $http, $location) {
	var campaign = this;  

	var imagePath = 'img/60.jpeg';
	$scope.messages = [{
	  face : imagePath,
	  what: 'Brunch this weekend?',
	  who: 'Min Li Chan',
	  when: '3:08PM',
	  notes: " I'll be in your neighborhood doing errands",
	  next: '/campaign_info'
	}, {
	  face : imagePath,
	  what: 'Brunch this weekend?',
	  who: 'Min Li Chan',
	  when: '3:08PM',
	  notes: " I'll be in your neighborhood doing errands",
	  next: '/icon'
	}];

	$scope.goNext = function (next) {
		$location.path(next);
	}

  // $http.get('https://demo1697037.mockable.io/test_message').success(function(data) {
  // 	console.log(data);
  //   campaign.campaigns = data;
  // });
});