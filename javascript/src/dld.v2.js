
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
		$scope.selectedType = '';

		$scope.createHamburger = function(){
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
			
			//c.globalAlpha = .5;
			c.rect(0,0,w,w);
			//c.fillStyle = "#000";
			//c.fill();
			c.globalAlpha = 1;


	  		for(var i=0; i<lines;i++){
	  			var positionY = (i==0)? lineStart : lineStart + (lineSpacing * i);

	  			var padding = (w - lineLength)/2;

	  			c.beginPath();
	  			c.lineWidth = lineWidth;
	  			c.strokeStyle = lineColor;
	  			c.lineCap="round";
				c.moveTo(padding,positionY);
				c.lineTo(w - padding,positionY);
				c.stroke();
	  		}	
	  		
		}

		$scope.parseResponse = function(response){
			$scope.projects = response.projects;
			$scope.createHamburger();
		}

		$scope.showNav = false;

		$scope.navSlider = function(){
			$scope.showNav = !$scope.showNav;
			console.log($scope.showNav);
		}

		$scope.setType = function(type,index){
			$scope.selectedType = index;
		}

		$scope.isActive = function(index) {
			return $scope.selectedType === index;
		};

		$http.get("/projects.json").success($scope.parseResponse);

	});


})(window);

