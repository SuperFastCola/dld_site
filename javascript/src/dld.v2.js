
(function(win){

	if(!win.console) console = {log:function(){}};
	if(typeof win.matchMedia == "undefined"){
		this.matchMedia = function(myvar){
			return false;
		}
	}

	var internal = {};
	win.dld = internal;

	var app = angular.module('projectTriage', []);

	app.directive('myCreateNav',function(){
		console.log("text");
		return true;
	});

	app.controller('listProjects', function($scope,$http) {
		$scope.projects = null;
		$scope.types = null;
		$scope.selectedType = '';
		$scope.excludeIllos = true;

		$scope.createHamburger = function(rotate){
			var menu = document.getElementById("hamburger");
			var c = menu.getContext("2d");
			var w = 40;
			var h = 40;
			var lines = 3;
			var lineLength = 20;
			var lineWidth = 3;
			var lineColor = "#fff";
			var lineSpacing = 7.25;
			var lineStart = 12;

			menu.width = w
			menu.height = h;
			c.clearRect(0,0,w,w);
			c.globalAlpha = 1;

	  		for(var i=0; i<lines;i++){
	  			var positionY = (i==0)? lineStart : lineStart + (lineSpacing * i);

	  			var padding = (w - lineLength)/2;

	  			c.beginPath();
	  			c.lineWidth = lineWidth;
	  			c.strokeStyle = lineColor;
	  			c.lineCap="round";
	  			
	  			if(typeof rotate != "undefined" && rotate){
					c.moveTo(positionY,padding);
					c.lineTo(positionY,w - padding);
				}
				else{
					c.moveTo(padding,positionY);
					c.lineTo(w - padding,positionY);	
				}

				c.stroke();
	  		}	
	  		
		}

		$scope.currentDate = new Date();
		$scope.cacheBuster = 0;

		$scope.setBackgroundThumbnailImage = function(source,index){

			if($scope.cacheBuster===0){
				$scope.currentDate = new Date();
				$scope.cacheBuster = $scope.currentDate.getTime();
			}

			var images_sub_directory = "images/full/";

			console.log(window.matchMedia("(min-width: 320px)").matches);
			console.log(window.matchMedia("(max-width: 500px)").matches);

			if(typeof window.matchMedia != "undefined"){
				images_sub_directory = "images/" + ((window.matchMedia("(min-width: 320px)").matches && window.matchMedia("(max-width: 480px)").matches)?"mobile":"full")  + "/";
			}
			
			source += ('?=' + $scope.cacheBuster);

			images_sub_directory += "thumbs/";

			return {'background-image':'url(' + String(images_sub_directory + source) + ')'};
		}

		$scope.parseResponse = function(response){
			$scope.types = response.types;
			$scope.projects = response.projects;
			$scope.createHamburger();
		}

		$scope.showNav = false;

		$scope.navSlider = function(){
			$scope.showNav = !$scope.showNav;
			$scope.createHamburger($scope.showNav);
		}

		$scope.setType = function(type,index){
			$scope.selectedType = type;
			$scope.cacheBuster = 0;
			$scope.navSlider();
		}

		$scope.getFilter = function(){
			if($scope.selectedType==="illustration"){
				return {'type':($scope.selectedType)};
			}
			else{
				return {"type": ($scope.selectedType || undefined || '!illustration')};	
			}

		}

		$scope.isActive = function(index) {
			//return $scope.selectedType === index;
		};

		$http.get("/projects.json").success($scope.parseResponse);



	});
	
	//http://nahidulkibria.blogspot.com/2014/10/angullarjs-directive-to-watch-window.html
	app.directive('autoresize', function($window) {  
		//passes scope to anonymous function
	  	return function($scope) {  
	   			
				$scope.initializeWindowSize = function() {  
				$scope.maxHeight = Math.max(  
	 				document.body.scrollHeight, document.documentElement.scrollHeight,  
	 				document.body.offsetHeight, document.documentElement.offsetHeight,  
	 				document.body.clientHeight, document.documentElement.clientHeight,  
	 				window.innerHeight  
				);  
		    	
		    	$scope.windowHeight = $window.innerHeight;  
		    	return $scope.windowWidth = $window.innerWidth;  
		   };  

	   		$scope.initializeWindowSize();  

	   		return angular.element($window).bind('resize', function() {  
	   			$scope.initializeWindowSize();  	   		
	   			$scope.cacheBuster = 0;
	    		return $scope.$apply();  
	   		});  
	  	};  

 	});  



})(window);

