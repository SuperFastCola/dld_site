
(function(win){

	if(!win.console) console = {log:function(){}};
	if(typeof win.matchMedia == "undefined"){
		this.matchMedia = function(myvar){
			return false;
		}
	}

	var internal = {};
	win.dld = internal;

	var app = angular.module('projectTriage', ['ngSanitize','ngRoute']);

	app.directive('myCreateNav',function(){
		return true;
	});

	app.controller('listProjects', function($scope, $compile, $sce, $rootScope, $http, $route, $routeParams, $location, $filter) {
		$scope.projects = null;
		$scope.contents = null;
		$scope.types = null;
		$scope.selectedType = '';
		$scope.excludeIllos = true;
		$scope.selectedProject = null;
		$scope.projectsHidden = false;
		$scope.sprites = null;

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

		$scope.getPath = function(){

			var parts = $location.path().split("/");

			if(parts[1]=="project"){
				  $scope.showProjectDetails();
				  $scope.projectsHidden = true;
			}
			else if(parts.length==1){
				$scope.showNav = true;
				$scope.setType("all");
			}
			else{
				for(var i in $scope.types){
					if(String(parts[1]).match($scope.types[i])){
						$scope.showNav = true;
						$scope.setType($scope.types[i],i);
					}
				}

			}

		}

		$scope.returnVideoURL = function(val){
			return $sce.trustAsResourceUrl(val);
		}

		$scope.parseResponse = function(response){
			$scope.types = response.types;
			$scope.projects = response.projects;
			$scope.contents = response.contents;
			$scope.sprites = response.sprites;
			$scope.createHamburger();
			$scope.getPath();
			$scope.renderSprites();
		}

		$scope.createSpriteObject = function(val){
			var header = angular.element(document.getElementById("portfolio_header"));
			val.el = document.createElement("div");
			//angular.element(val.el).removeClass('move');
			angular.element(val.el).addClass('sprite');
			angular.element(val.el).attr('id',val.sprite_id);

			setTimeout(function(){
				$scope.createAnimationStyle(val);	
				header.append(val.el);
			},500);
		}

		$scope.renderSprites = function(){
			for(var i in $scope.sprites){
				$scope.createSpriteObject($scope.sprites[i]);
			}
		}

		$scope.setAnimationMultiplier = function(width){
			var number = 0;

			if(width<700)
				number = 3;
			else if(width>1200)
				number = 15;
			else
				number=9;

			return number;
		}

		$scope.createAnimationStyle = function(obj){
			obj.styleid = "ani_style_" + obj.sprite_id;

			if(typeof document.getElementById(obj.styleid) != "undefined" && document.getElementById(obj.styleid) != null){
				angular.element(document.getElementById(obj.styleid)).remove();
			}

			var prefix = (String(navigator.userAgent).match(/webkit/i))?"-webkit-":"";

			obj.sprite_ani_name = "sprite_ani_" + obj.sprite_id;

			var direction = Math.round(Math.random() % 2);

			var styles = "@" + prefix + "keyframes " + obj.sprite_ani_name + " {\n";
			styles += "\t0% {background-position: " + obj.xCoor[direction][0] + "px " +  obj.yCoor[0] + "px;}\n";
			styles += "\t100% {background-position: " + obj.xCoor[direction][1] + "px " +  obj.yCoor[1] + "px;}\n";
			styles += "}\n";			

			//builddynamic style
			styles += "\n#" +  obj.sprite_id + "{\n";

			styles += "\tz-index:" + obj.position[1] + ";\n";
			styles += "\t" + prefix + "animation-name: " + obj.sprite_ani_name + ";\n";
  			styles += "\t" + prefix + "animation-duration: " + obj.walk_speed +  ";\n";
  			styles += "\t" + prefix + "animation-timing-function: steps(2);\n";
  			styles += "\t" + prefix + "animation-delay: 0s;\n";
  			styles += "\t" + prefix + "animation-iteration-count: infinite;\n";
  			styles += "\t" + prefix + "animation-direction: alternate;\n";
  			styles += "\t" + prefix + "animation-play-state: running;\n";

  			//var parent_width = Math.round(document.getElementById(obj.parent_element).getBoundingClientRect().width);
  			var style = window.getComputedStyle(document.getElementById(obj.parent_element),null);
  			var parent_width = Math.round(Number(String(style.getPropertyValue("width")).replace(/px/,"")));

  			//add transitions	
  			var multiplier = $scope.setAnimationMultiplier(parent_width);

  			if(String(obj.sprite_id).match(/bird/)){
  				multiplier = (parent_width<600)?2:4;
  			}

  			var randomTime = Math.ceil(Math.random()*multiplier);
  			if(randomTime<multiplier/2){
  				randomTime = multiplier/2 + Math.ceil(Math.random()*3);
  			}

  			var delayTime = Math.ceil(Math.random()*((parent_width<600)?6:3));

  			styles += "\t" + prefix + "transition: " +  prefix + "transform " +  randomTime + "s;\n";
  			styles += "\t" + prefix + "transition-timing-function: linear;\n";
  			styles += "\t" + prefix + "transition-delay: " + delayTime + "s;\n";
  			
  			//add general styles
  			styles += "\twidth:" + obj.dimensions[0] +  "px;\n";
  			styles += "\theight:" + obj.dimensions[1] +  "px;\n";
  			styles += "\ttop:" + obj.position[1] +  "px;\n";

  			styles += "\t" + prefix + "transform: translateX(" + ((!Boolean(direction))?parent_width: String('-'+obj.dimensions[0])) + "px);\n";
  			styles += "}\n";

  			styles += "\n#" +  obj.sprite_id + ".move{\n";
  			styles += "\t" + prefix + "transform: translateX(" + ((!Boolean(direction))?String('-'+ obj.dimensions[0]):parent_width) + "px);\n";
  			styles += "}\n";


			var head = document.head || document.getElementsByTagName("head")[0];
			var anistyle = document.createElement("style");

			anistyle.id = obj.styleid;
			anistyle.text = "text/css";
			anistyle.media = "screen";
			head.appendChild(anistyle);

			if(anistyle.styleSheet){
				anistyle.styleSheet.cssText = styles;
			}
			else{
				anistyle.appendChild(document.createTextNode(styles));
			}

			obj.el.addEventListener('webkitTransitionEnd', function(){$scope.animationCallback.call(obj)}, false);
        	obj.el.addEventListener('transitionend', function(){$scope.animationCallback.call(obj)}, false); //Firefox
        	obj.el.addEventListener('oTransitionEnd', function(){$scope.animationCallback.call(obj)}, false); //Opera

			setTimeout(function(){
				angular.element(document.getElementById(obj.sprite_id)).addClass("move");
			},1000);
		
		}

		$scope.animationCallback = function(){
			angular.element(document.getElementById(this.sprite_id)).remove();
			$scope.createSpriteObject(this);
			
		}

		$scope.showNav = false;
		$scope.showDescription = false;

		$scope.navSlider = function($event){

			if(typeof $event != "undefined"){
				$event.stopPropagation();	
			}
			
			$scope.showNav = !$scope.showNav;

			if(!$scope.showNav){
				window.scrollTo(0,0);
			}

			$scope.showDescription = true;
			$scope.hideProject($event)
			$scope.createHamburger($scope.showNav);
		}

		$scope.hideProject = function($event){
			delete $scope.projectImage;
			$scope.descriptionImageLoaded();
			$scope.projectsHidden = false;
			$scope.projectImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
			$scope.setInfoExpandedForDevice();

			if(typeof $event != "undefined"){
				$event.stopPropagation();
			}

			window.scrollTo(0,1);

			$scope.returnClipBody();
			$scope.showDescription = !$scope.showDescription;

		}

		$scope.setProjectDetails = function(obj){
			$scope.project = obj;
		}

		$scope.contentSection = false;

		$scope.setContentSection = function(val){

			delete $scope.contentSectioninfo;
			$scope.contentSection  = (typeof val == "undefined")?false:val;

			return $scope.contentSection;
		}

		$scope.setType = function(type,index){
			$scope.selectedType = type;
			$scope.setContentSection();

			switch(type){
				case 'all':
					$scope.selectedType = '';
					break;

				case 'about':
					$scope.setContentSection(true);
					$scope.contentSectioninfo = $scope.contents[index];
					$scope.downloadContent($scope.contents[index]);
					break;
			}
			$scope.cacheBuster = 0;
			$scope.navSlider();

			//change scroll position for new div without backgrounds.
			window.scrollBy(0,2);
		}

		$scope.getFilter = function(){
			// if($scope.selectedType==="illustration"){
			// 	return {'type':($scope.selectedType)};
			// }
			// else{
				//return {"type": ($scope.selectedType || undefined || '!illustration' || '!about')};	
			return {"type": ($scope.selectedType || undefined || '!about')};	
			//}
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

		angular.element(document).ready(function () {
        	$http.get("/projects.json").success($scope.parseResponse);
    	});
		

		$scope.hideHamburger = function(){
			if($scope.showDescription){
				return true;	
			}
			else{
				return false;
			}
			
		}

		$scope.descriptionImageLoaded = function(){
			if(this.projectImage!="data:image/gif;base64,R0lGODlhAQABAAAAACw=" && typeof this.projectImage != "undefined"){
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

			if(!$scope.showAllInfo){
				window.scrollTo(0,0);	
			}
			
		}

		$scope.expandForIllo = false;

		$scope.illustrationType = function(props){
			$scope.expandForIllo = false;
			for(var i  in props.type){
				if(props.type[i]=="illustration" && !props.description){
					$scope.expandForIllo = true;
				}
			}
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

		$scope.contentImage = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

		$scope.setContentImageSource = function(data){
			 $scope.contentImage = (typeof data != "undefined")?data:null;
			 $scope.$apply();
		}

		
		$scope.loadImage = function(file){

			$http({
					method: 'GET',
					url: file,
					responseType: "blob"
				}).then(function successCallback(response) {
				
					fr = new FileReader();
			        fr.onload = function(){
			            // this variable holds your base64 image data URI (string)
			            // use readAsBinary() or readAsBinaryString() below to obtain other data types
			           	
			           	$scope.setContentImageSource(fr.result);
			        };
			        fr.readAsDataURL(response.data);

				}, function errorCallback(response) {
					console.log(response);
			});

		}

		$scope.setDownloadedContent = function(val,scope){
			var oldEle = angular.element(document.getElementById("content-body-holder"));			
			oldEle.empty().append($compile(val)(oldEle.scope));
			
		}

		$scope.downloadContent = function(scope){	
        	$http({
					method: 'GET',
					url: ("/" + scope.contentFile)
				}).then(function successCallback(response) {
					var test = angular.element(document).find("#content-body-holder");
					$scope.setDownloadedContent(response.data,scope);

				}, function errorCallback(response) {
					console.log(response);
			});
       	}

       	$scope.showProjectDetails = function(passedScope){

       		var scope = (typeof passedScope != "undefined")?passedScope:$scope;
       		var scopeParent = (typeof scope.$parent.showDescription != "undefined")?scope.$parent:$scope;

       		var parts = $location.path().split("/");
       		var scopeProjectProperties = (typeof scope.x != "undefined")?scope.x:$filter("filter")($scope.projects, {id:parts[2]})[0];

       		scopeParent.showDescription = true;

        	scopeParent.returnClipBody(true);

        	if(typeof scopeProjectProperties.image != "undefined"){
        		scope.backgroundImage = scope.setBackgroundThumbnailImage({source:scopeProjectProperties.image,detail:true,returnURL:true});
        	}
        	scopeParent.setProjectDetails(scopeProjectProperties);
        	scopeParent.illustrationType(scopeProjectProperties);

        	$http({
					method: 'GET',
					responseType: 'arraybuffer',
					url: scope.backgroundImage
				}).then(function successCallback(response) {

					var blob = new Blob([response.data], {type: "image/jpeg"});
					scopeParent.projectImage = (window.URL || window.webkitURL).createObjectURL(blob);

					scope.descriptionImageLoaded();
					window.scrollTo(0,0);

					}, function errorCallback(response) {
						console.log(response);
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
       	}
		
		//http://stackoverflow.com/questions/15813850/detect-history-back-using-angular	
		$rootScope.$watch(function () {
				return $location.absUrl()
		}, function (newLocation, oldLocation) {
			if(oldLocation!=newLocation){
				$scope.getPath();
			}
		});

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


	app.controller('aboutController', function($scope,  $routeParams) {
		//console.log($routeParams);
        //$scope.message = 'Look! I am an about page.';
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
	            	scope.$parent.showProjectDetails(scope);
	            });
	       	}
	   	};
	}); 


})(window);

