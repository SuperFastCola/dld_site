
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
		$scope.selectedProject = null;

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

			if(typeof window.matchMedia != "undefined"){
				images_sub_directory = "images/" + ((window.matchMedia("(min-width: 320px)").matches && window.matchMedia("(max-width: 480px)").matches)?"mobile":"full")  + "/";
			}
			
			source += ('?=' + $scope.cacheBuster);

			images_sub_directory += "thumbs/";

			return { 'backgroundImage':'url(' + String(images_sub_directory + source) + ')' };
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

		$scope.$watch('scrollTop', function(newVal, oldVal){
		    if(newVal!=oldVal)
		        $scope.$broadcast('scrollTop',{"scrollTop":newVal})
		});

		$scope.isActiveProject = function(index) {
			return $scope.selectedProject === index;
		};

		
		$scope.showDetails = function(index){
			if($scope.selectedProject != index){
				$scope.selectedProject = null;	
			}
			else{
				$scope.selectedProject = null;
			}
			
		}

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
		    	
		    	$scope.scrollTop = $window.pageYOffset;
		    	$scope.windowHeight = $window.innerHeight;
		    	$scope.viewBottom = $scope.windowHeight;
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


 	//http://nahidulkibria.blogspot.com/2014/10/angullarjs-directive-to-watch-window.html
	app.directive('scrollposition', function($window) {  
		//passes scope to anonymous function

	  	return function($scope) {  

	   		return angular.element($window).bind('scroll', function() {  
	   			$scope.scrollTop = $window.pageYOffset;
	   			$scope.viewBottom = $window.pageYOffset + $window.innerHeight; 
	    		return $scope.$apply();  
	   		});  
	  	};  

 	}); 

	//http://www.undefinednull.com/2014/02/11/mastering-the-scope-of-a-directive-in-angularjs/
 	app.directive('showOnHoverParent',function(){
	      return {
	        link : function(scope, element, attrs) {

	            element.parent().bind('mouseover', function() {
	                element.removeClass("hidden");
	            });

	            element.parent().bind('mouseleave', function() {
	                 element.addClass("hidden");
	            });
	       	}
	   	};
	}); 


	 app.directive('checkObjectPosition',function(){
	      return {
	        link : function(scope, element, attrs) {

	        	if(element[0].getBoundingClientRect().top<scope.$parent.viewBottom){
	        		scope.backgroundStyle = scope.setBackgroundThumbnailImage(scope.x.image,scope.$index);
	        	}

	        	scope.$on('scrollTop', function(event, args){

	       //  		if(scope.$index==6){
	       //  			console.log(scope.x.id);
		   			// 	console.log(args.scrollTop);
		   			// 	console.log(window.innerHeight);
		   			// 	console.log(args.scrollTop + window.innerHeight);
		   			// 	console.log(element[0].getBoundingClientRect().top);
	   				// }

	        		if(element[0].getBoundingClientRect().top<window.innerHeight && typeof scope.backgroundStyle=="undefined"){
	        			scope.backgroundStyle = scope.setBackgroundThumbnailImage(scope.x.image,scope.$index);
	        		}


	        		// if(element[0].getBoundingClientRect().top < -(element[0].getBoundingClientRect().height)){
	        		// 	scope.setBackgroundThumbnailImage(scope.x.image,scope.$index);
	        		// }
	        		
				});

	       	}
	   	};
	}); 


	//http://www.undefinednull.com/2014/02/11/mastering-the-scope-of-a-directive-in-angularjs/
 	app.directive('hideOnHoverParent',function(){
	      return {
	        link : function(scope, element, attrs) {

	            element.parent().bind('mouseover', function() {
	                element.addClass("hidden");
	            });

	            element.parent().bind('mouseleave', function() {
	                 element.removeClass("hidden");
	            });
	       	}
	   	};
	}); 

 	//http://www.undefinednull.com/2014/02/11/mastering-the-scope-of-a-directive-in-angularjs/
 	app.directive('showOnParentClick',function(){
	      return {
	        link : function(scope, element, attrs) {

	            element.parent().bind('click', function() {
	                var eleClone = element.clone()
	                console.log(scope);
	            });
	       	}
	   	};
	}); 




})(window);
