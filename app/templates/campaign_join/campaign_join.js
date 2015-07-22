'use strict';

angular.module('myApp.campaign_join', ['ngRoute','ngMaterial'])

.controller('CampaignJoinController', function($scope, $mdDialog) {
	$scope.alert = '';	

	$scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'templates/gesture_recog/gesture_template.html',
      parent: angular.element(document.body),
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
});	

