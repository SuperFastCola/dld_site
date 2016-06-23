
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

	  		$scope.$broadcast('scrollTop',{"scrollTop":0})
	  		
		}

		$scope.currentDate = new Date();
		$scope.cacheBuster = 0;
		$scope.clipBody = false;

		$scope.returnClipBody = function(val){
			$scope.clipBody = (typeof val == "undefined")?false:val;
			return $scope.clipBody;
		}

		$scope.setBackgroundThumbnailImage = function(obj){

			if($scope.cacheBuster===0){
				$scope.currentDate = new Date();
				$scope.cacheBuster = $scope.currentDate.getTime();
			}

			var images_sub_directory = "images/full/";

			if(typeof window.matchMedia != "undefined"){
				images_sub_directory = "images/" + ((window.matchMedia("(min-width: 320px)").matches && window.matchMedia("(max-width: 480px)").matches)?"mobile":"full")  + "/";
			}
			
			obj.source += ('?=' + $scope.cacheBuster);

			if(typeof obj.detail == "undefined"){
				images_sub_directory += "thumbs/";	
			}

			if(typeof obj.returnURL != "undefined"){
				return String(images_sub_directory + obj.source);	
			}
			else{
				return { 'backgroundImage':'url(' + String(images_sub_directory + obj.source) + ')' };
			}
			
		}

		$scope.parseResponse = function(response){
			$scope.types = response.types;
			$scope.projects = response.projects;
			$scope.createHamburger();
		}

		$scope.showNav = false;
		$scope.showDescription = false;

		$scope.navSlider = function($event){

			if(typeof $event != "undefined"){
				$event.stopPropagation();	
			}
			
			$scope.showNav = !$scope.showNav;
			$scope.showDescription = true;
			$scope.hideProject($event)
			$scope.createHamburger($scope.showNav);
		}

		$scope.hideProject = function($event){
			delete $scope.projectImage;
			$scope.descriptionImageLoaded();
			$scope.projectImage = '//:0';
			$scope.setInfoExpandedForDevice();

			if(typeof $event != "undefined"){
				$event.stopPropagation();
			}

			$scope.returnClipBody();
			$scope.showDescription = !$scope.showDescription;

		}

		$scope.setProjectDetails = function(obj){
			$scope.project = obj;
		}

		$scope.setType = function(type,index){
			$scope.selectedType = type;
			$scope.cacheBuster = 0;
			$scope.navSlider();
			//change scroll position for new div without backgrounds.
			window.scrollBy(0,2);
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
		    if(newVal!=oldVal){
		        $scope.$broadcast('scrollTop',{"scrollTop":newVal});
		    }
		});


		$scope.$watch('mobile', function(newVal, oldVal){
		    if(newVal!=oldVal){
		        $scope.$broadcast('windowResize',{"newWidth":newVal});
		    }
		});

		$scope.checkMobile = function(){
			$scope.mobile = ((window.matchMedia("(min-width: 320px)").matches && window.matchMedia("(max-width: 480px)").matches)?"mobile":"full");
		}

		$scope.mobile = "full";


		$scope.isActiveProject = function(index) {
			return $scope.selectedProject === index;
		};

		$http.get("/projects.json").success($scope.parseResponse);

		$scope.descriptionImageLoaded = function(){
			if(this.projectImage!="//:0" && typeof this.projectImage != "undefined"){
				return true;
			}
			else{
				return false;
			}
		}

		$scope.setInfoExpandedForDevice = function(){
			if($scope.mobile=="full"){
				$scope.showAllInfo = true;
			}
			else{
				$scope.showAllInfo = false;
			}
		}

		$scope.checkMobile();
		$scope.setInfoExpandedForDevice();

		$scope.expandInfo = function(){
			$scope.showAllInfo = !$scope.showAllInfo;
		}

		$scope.loadBackground = function(scope){
			
			if(scope.imageLoading){
				scope.imageLoading = false;

				scope.backgroundImage = scope.setBackgroundThumbnailImage({source:scope.x.image,returnURL:true});

				$http({
					method: 'GET',
					responseType: 'arraybuffer',
					url: scope.backgroundImage
				}).then(function successCallback(response) {
						scope.imageLoaded = true;

						var blob = new Blob([response.data], {type: "image/jpeg"});
						scope.backgroundStyle = {"backgroundImage":"url(" + (window.URL || window.webkitURL).createObjectURL(blob) + ")"};
					}, function errorCallback(response) {
						console.log(response);
				});
			}
		};


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
	   			$scope.$broadcast('scrollTop',{"scrollTop":$scope.scrollTop});
	   			$scope.checkMobile();
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


	app.directive('checkObjectPosition',function($http){


	      return {
	        link : function(scope, element, attrs) {

	        	if(element[0].getBoundingClientRect().top<scope.$parent.viewBottom){
	        		scope.$parent.loadBackground(scope);
	        	}

	        	scope.$on('windowResize', function(event, args){

	        		var testStyle = null;

	        		if(typeof scope.backgroundStyle != "undefined" && typeof scope.backgroundStyle.backgroundImage != "undefined"){
	        			var testStyle = String(scope.backgroundStyle.backgroundImage).match(scope.$parent.mobile);
	        		}

	        		if(testStyle==null){
	        			scope.backgroundStyle = scope.setBackgroundThumbnailImage({source:scope.x.image});	
	        		}
	        		
	        	});


	        	scope.$on('scrollTop', function(event, args){

	        		if(element[0].getBoundingClientRect().top<window.innerHeight && typeof scope.backgroundStyle=="undefined"){
	        			scope.$parent.loadBackground(scope);
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
 	app.directive('showOnClick',function($http){
	      return {
	        link : function(scope, element, attrs) {

	            element.bind('click', function($event) {
	            	scope.$parent.showDescription = !scope.$parent.showDescription;

	            	scope.$parent.returnClipBody(true);
	            	scope.backgroundImage = scope.setBackgroundThumbnailImage({source:scope.x.image,detail:true,returnURL:true});
	            	scope.$parent.setProjectDetails(scope.x);

	            	$http({
  						method: 'GET',
  						responseType: 'arraybuffer',
  						url: scope.backgroundImage
						}).then(function successCallback(response) {

 						var blob = new Blob([response.data], {type: "image/jpeg"});
						scope.$parent.projectImage = (window.URL || window.webkitURL).createObjectURL(blob);

						scope.descriptionImageLoaded();

  						}, function errorCallback(response) {
  							console.log(response);
    						// called asynchronously if an error occurs
    						// or server returns response with an error status.
  					});

	            });
	       	}
	   	};
	}); 




})(window);

