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


function DialogController($scope, $mdDialog, $interval) {  

  $scope.state_message = '시작 버튼을 눌러주세요...';
  $scope.isComplete = true;

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
  var counter; 
  var validation;
  $scope.gestureValidation = function() {
  	  $scope.state_message = "제스처 확인중";
  	  
  	  $scope.seconds = 0;
	  $scope.determinateValue = 0;
	  $interval.cancel(counter);
	  validation = $interval(function() {
	    $scope.determinateValue += 2;
	    if ($scope.determinateValue % 20 == 0) {
	    	$scope.seconds = $scope.determinateValue / 20;
	    }
	    if ($scope.determinateValue > 100) {
	      $scope.determinateValue = 0;
	    }	    
	    if ($scope.seconds == 5) {
	    	$scope.stopCount();
	  	}
	  }, 100);	  
  };

  $scope.startCount = function() {
  	  $scope.state_message = "제스처 데이터를 수집중";

  	  $scope.seconds = 0;
	  $scope.determinateValue2 = 0;
	  $scope.determinateValue = 0;

	  counter = $interval(function() {
	    $scope.determinateValue2 += 2;
	    if ($scope.determinateValue2 % 20 == 0) {
	    	$scope.seconds = $scope.determinateValue2 / 20;
	    }
	    if ($scope.determinateValue > 100) {
	      $scope.determinateValue2 = 0;
	    }	    
	    if ($scope.seconds == 5) {
	    	$scope.gestureValidation();
	  	}
	  }, 100);	
  };

  $scope.stopCount = function() {
  	  $interval.cancel(validation);
  	  $scope.seconds = '';
  	  $scope.state_message = "시작 버튼을 눌러주세요...";
  	  $scope.isComplete = false;
  };
};

