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
  	recordedMotion = [];

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
  	  var cost = DTW(testMotion, recordedMotion);
  	  $mdToast.show(
	  	$mdToast.simple()
	 		.content(cost)
			.hideDelay(3000)
	  );
  };

  $scope.storeMotionData = function(ev) { 	

	var accel_x = ev.acceleration.x;
  	var accel_y = ev.acceleration.y;
  	var accel_z = ev.acceleration.z;
 	recordedMotion.push( Math.sqrt(Math.pow(accel_x, 2) + Math.pow(accel_y, 2) + Math.pow(accel_z, 2)) );


  	// If you want to check accel value, use following code	
  // 	$scope.$apply(function() {
  // 		var accel_x = ev.acceleration.x;
		// var accel_y = ev.acceleration.y;
		// var accel_z = ev.acceleration.z;
		// $scope.accel_x = Math.sqrt(Math.pow(accel_x, 2) + Math.pow(accel_y, 2) + Math.pow(accel_z, 2));
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

  // gesture similarity
    function DTW(firstSequence, secondSequence) {

	    var state = { 
	        distanceCostMatrix: null,
	        distance: function (x, y) {
	            var difference = x - y;
	            var squaredEuclideanDistance = difference * difference;
	            return squaredEuclideanDistance;
	        }
	    };

	    var cost = Number.POSITIVE_INFINITY;        
	    cost = computeOptimalPath(firstSequence, secondSequence, state);
	    return cost;

	};

	function computeOptimalPath(s, t, state) {
	    var start = new Date().getTime();
	    state.m = s.length;
	    state.n = t.length;
	    var distanceCostMatrix = createMatrix(state.m, state.n, Number.POSITIVE_INFINITY);

	    distanceCostMatrix[0][0] = state.distance(s[0], t[0]);

	    for (var rowIndex = 1; rowIndex < state.m; rowIndex++) {
	        var cost = state.distance(s[rowIndex], t[0]);
	        distanceCostMatrix[rowIndex][0] = cost + distanceCostMatrix[rowIndex - 1][0];
	    }

	    for (var columnIndex = 1; columnIndex < state.n; columnIndex++) {
	        var cost = state.distance(s[0], t[columnIndex]);
	        distanceCostMatrix[0][columnIndex] = cost + distanceCostMatrix[0][columnIndex - 1];
	    }

	    for (var rowIndex = 1; rowIndex < state.m; rowIndex++) {
	        for (var columnIndex = 1; columnIndex < state.n; columnIndex++) {
	            var cost = state.distance(s[rowIndex], t[columnIndex]);
	            distanceCostMatrix[rowIndex][columnIndex] =
	                cost + Math.min(
	                    distanceCostMatrix[rowIndex - 1][columnIndex],          // Insertion
	                    distanceCostMatrix[rowIndex][columnIndex - 1],          // Deletion
	                    distanceCostMatrix[rowIndex - 1][columnIndex - 1]);     // Match
	        }
	    }

	    var end = new Date().getTime();
	    var time = end - start;

	    state.distanceCostMatrix = distanceCostMatrix;
	    state.similarity = distanceCostMatrix[state.m - 1][state.n - 1];
	    return state.similarity;
	}

	function createMatrix(m, n, value) {
	    var matrix = [];
	    for (var rowIndex = 0; rowIndex < m; rowIndex++) {
	        matrix.push(createArray(n, value));
	    }

	    return matrix;
	};

	function createArray(length, value) {
	    if (typeof length !== 'number') {
	        throw new TypeError('Invalid length type');
	    }

	    if (typeof value === 'undefined') {
	        throw new Error('Invalid value: expected a value to be provided');
	    }

	    var array = new Array(length);
	    for (var index = 0; index < length; index++) {
	        array[index] = value;
	    }

	    return array;
	};
  
};







