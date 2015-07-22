function DialogController($scope, $mdDialog, $interval, $mdToast, $window, localStorageService) {  

  // dialog functions
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  
  // progress liner variables.
  var recorder; 
  var validator;

  // initial values
  $scope.state_message = '시작 버튼을 눌러주세요...';
  $scope.isComplete = true;
  var testReady = true;

  // record motion data
  var key_testMotion = 'testMotion';
  var testMotion = [];
  var recordedMotion = [];

  // when start get accelerometer data... (currently using local storage)
  if(!localStorageService.isSupported) {
    console.log('local storage service is not supported');
  }

  // remove for developer
  // removeItem(key_testMotion);

  // receive test data from local storage
  testMotion = getItem(key_testMotion);
  if(testMotion === null) {
  	var testMotion = [];
  	testReady = false;
  } 

  // for checking
  $mdToast.show(
  	$mdToast.simple()
  		.content('Test Ready : ' + testReady)
  		.hideDelay(3000)
  );
  

  $scope.startRecording = function() {

  	if ($window.DeviceMotionEvent) {	  	  
	  // register startRecordingGesture
	  $window.addEventListener('devicemotion', $scope.storeMotionData, false); 

	  // message change
  	  $scope.state_message = "제스처 데이터를 수집중";
  	  $scope.seconds = 0;
	  $scope.determinateValue2 = 0;
	  $scope.determinateValue = 0;

	  // recorder start
	  recorder = $interval(function() {
	    $scope.determinateValue2 += 2;
	    if ($scope.determinateValue2 % 20 == 0) {
	    	$scope.seconds = $scope.determinateValue2 / 20;
	    }
	    if ($scope.determinateValue > 100) {
	      $scope.determinateValue2 = 0;
	    }	    
	    if ($scope.seconds == 5) {
	    	// remove eventlistner
	    	$window.removeEventListener('devicemotion', $scope.storeMotionData, false);
	    	if(testReady) {
	    		// start validation
	    		$scope.gestureValidation();	
	    	} else {
	    		setItem(key_testMotion, recordedMotion);
	    		$scope.cancel();
	    	}	    	
	  	}
	  }, 100);	

	} else {		
		// it is not supported
		$mdToast.show(
			$mdToast.simple()
				.content('지원하지 않는 디바이스 혹은 브라우저 입니다.')
				.hideDelay(3000)
		);
	}
  };

  $scope.gestureValidation = function() {

  	  // variables change
  	  $scope.state_message = "제스처 확인중";  	  
  	  $scope.seconds = 0;
	  $scope.determinateValue = 0;
	  $interval.cancel(recorder);

	  // validater start 
	  validator = $interval(function() {
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

  $scope.stopCount = function() {
  	  $interval.cancel(validator);
  	  $scope.seconds = '';
  	  $scope.state_message = "시작 버튼을 눌러주세요...";
  	  $scope.isComplete = false;  

  	  // test 
  	  $mdToast.show(
	  	$mdToast.simple()
	 		.content(testMotion[0] + " , " + recordedMotion[0])
			.hideDelay(3000)
	  );	
  };

  $scope.storeMotionData = function(ev) { 	

	var accel_x = ev.acceleration.x;
  	var accel_y = ev.acceleration.y;
  	var accel_z = ev.acceleration.z;
  	recordedMotion.push( Math.sqrt(Math.pow(accel_x, 2) + Math.pow(accel_y, 2) + Math.pow(accel_z, 2)) );

  	// If you want to check accel value, use following code	
  	// $scope.$apply(function() {
  	// 	var accel_x = ev.acceleration.x;
	// 	var accel_y = ev.acceleration.y;
	// 	var accel_z = ev.acceleration.z;
	// 	$scope.accel_x = Math.sqrt(Math.pow(accel_x, 2) + Math.pow(accel_y, 2) + Math.pow(accel_z, 2));
  	// });
  	// 
	
  };



  // local storage functions
  function setItem(key, val) {
  	return localStorageService.set(key, val);
  }

  function getItem(key) {
  	return localStorageService.get(key);
  }

  function removeItem(key) {
   return localStorageService.remove(key);
  }
  
};







