if(!window.console) console = {log:function(){}};
if(typeof window.matchMedia == "undefined"){
	this.matchMedia = function(myvar){
		return false;
	}
}

//starts namespaced anonymous private function
(function($){

	function initialize_dld_app(filter){

		var images_sub_directory = "images/full/";

		if(typeof window.matchMedia != "undefined"){
			images_sub_directory = "images/" + ((!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches)?"mobile":"full")  + "/";
		}


		var project_detail = undefined;

		function t(message){
			console.log(message);
		}

		Backbone.sync = function(method, model, success, error){
			success.success();
			/*t(method);
			t(model);
			t(success);
			t(error);*/
	  	}

	  	var projectvideo = null;

		var PortfolioItem = Backbone.Model.extend({

		});

	  	var PortfolioList = Backbone.Collection.extend({
	    	model: PortfolioItem
	  	});
	  	
	  	function showImage(e){

	  		if(!Boolean(this.model.get('image_loaded') )){
		  		$(this.el).find(".project-item-front").css("background-image","url(" +  this.model.get("image_source").src + ")");
		  		this.model.set('image_loaded',true);
		  		$(this.el).removeClass('flipped');
	  		}

	  		if($(this.el).hasClass('flipped')){
	  			$(this.el).removeClass('flipped');	
	  		}


	  		var total = _.filter(this.model.collection.pluck("image_loaded"),function(loaded){
	  			if(loaded){
	  				return true;
	  			}
	  			else{
	  				return false;
	  			}
	  		});

	  		if(total.length = this.model.collection.length){
	  			stopSpinner();
	  		}
	  		
	  	}

		function getProportion(reproVal,origVal1,origVal2){
			
			/*
			Proportion Calculator
			
			(Repro width / original width) * original height = repro height;
			(original width / Repro width) * 100 = enlargement percentage
			*/
			
			var newproportion = Math.floor((reproVal/origVal1) * origVal2);
			return newproportion;
		}

		function reloadDetailImage(e){

	  		this.model.set("detail_image_loading",false);
	  		$(this.el).find(".project-detail-image").css("background-image","url(" +  this.model.get("image_detail_source").src + ")");
	  	}

	  	function showDetailImage(e){

	  		this.model.set("detail_image_loading",false);

	  		$(this.el).find(".project-detail-image").css("background-image","url(" +  this.model.get("image_detail_source").src + ")");
	  		$(this.el).find(".project-detail-area").removeClass("hidden");
	  		stopSpinner();

	  		if(this.model.get("illo")){	  			
		  		var nh = getProportion($(this.el).find(".project-detail-image").width(),this.model.get("image_detail_source").width,this.model.get("image_detail_source").height);

				if(nh < $(this.el).height()){
					$(this.el).find(".project-detail-image").removeClass("playing");
				  	$(this.el).find(".project-detail-image").addClass("centered");
				}
			}

	  	}

	  	var proj_id = 1;
	  	var proj_prefix = "proj_";


	  	function addProject(){
	  		$(this.el).removeClass('flipped');
	  	}

	  	function removeProject(){
	  		$(this.el).remove();
	      	this.undelegateEvents();
	  	}

	  	var ProjectView = Backbone.View.extend({
		    //tagName: 'li', // name of (orphan) root tag in this.el
		    initialize: function(){
		      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
		      	//this.model.bind('change', this.render);
	      		//this.model.bind('remove', this.unrender);
		    },
		    events: {
	      		'mouseover':  'showDetailButn',
	      		'mouseout':  'hideDetailButn',

	      		'click':  'flip',
	      		'click a.project-details-close':  'reflip'
	      		//'click span.delete': 'remove'
	    	},
		    render: function(){

		    	$(this.el).addClass("project-holder flipped");

		    	$(this.el).html('<div class="project-item-front"></div>');
		    	//$(this.el).append('<div class="project-item-back"></div>');

		    	$(this.el).bind(Browser.evt("override"),function(){
		    		ga('send', 'event', 'Project View', $(this).find(".project-name").text());
		    	});


		    	var front = $(this.el).find(".project-item-front");
		    	front.empty();

		    	// var back = $(this.el).find(".project-item-back");
		    	// back.empty();

		    	front.append('<a class="butn project-details-butn hidden">Project Details</a>');
		    	//back.append('<a class="butn project-details-close">X</a>');

		    	if(this.model.has('name')){

		    		var name = '<div class="project-name">' + this.model.get('name') + '</div>';
		    		front.append(name)
		    		//back.append(name);
		    	}

		    	if(this.model.has('image')){
		    		this.model.set('image_loaded',false);
		    		this.model.set('image_loading',false);
		    	}

		    	/*if(this.model.has('description')){
		    		back.append('<div class="project-description">' + this.model.get('description') + '</div>');
		    	}

				if(this.model.has('role')){
		    		back.append('<div class="project-role">' + this.model.get('role') + '</div>');
		    	}

		    	if(this.model.has('tech')){
		    		back.append('<div class="project-tech">' + this.model.get('tech') + '</div>');
		    	}*/
		    	
		    	//if(this.model.get('name'))
		    	/*$(this.el).html('<p class="project-name">' + this.model.get('name') + '</p>');
		    	$(this.el).html(this.model.get('name'));
		    	$(this.el).html(this.model.get('name'));
		    	$(this.el).html(this.model.get('name'));

*/				//setTimeout($.proxy(addProject,this),this.model.get("timer"));	
	      		return this; // for chainable calls, like .render().el
		    },
		    loadProjectImage: function(){
		    	if(this.model.has('image') && !this.model.get('image_loading')){

		    		this.model.set('image_loading',true);

					$(this.el).attr("id",this.model.get('id'));

					var tempimage = new Image();
					tempimage.src = images_sub_directory  + "thumbs/" +  this.model.get('image') + "?t=" + (new Date().getTime());

					this.model.set("image_source",tempimage);

					$(tempimage).load($.proxy(showImage,this));	
		    	}
		    },
		    unrender: function(){
		    	$(this.el).addClass('flipped')
		    	setTimeout($.proxy(removeProject,this),250);	
	    	},

	    	showDetailButn: function(){
	    		$(this.el).find(".project-item-front").find(".project-name").addClass('hidden');
	    		$(this.el).find(".project-details-butn").removeClass('hidden');
	    	},

	    	hideDetailButn: function(){
	    		$(this.el).find(".project-item-front").find(".project-name").removeClass('hidden');
	    		$(this.el).find(".project-details-butn").addClass('hidden');
	    	},

	    	flip: function(){

	    	/*	$(".project-holder").removeClass('flipped');
	    		$(this.el).addClass('flipped');*/

	    		
	    		project_detail = new DetailsView({
			        model: this.model
			    });		 

			    project_detail.render();

		      /*var swapped = {
		        id: this.model.get('name'),
		        name: this.model.get('id')
		      };
		      this.model.set(swapped);*/
		    },
		    reflip: function(){
	    		$(this.el).removeClass('flipped');
	    		this.hideDetailButn();

	    		return false;

		      /*var swapped = {
		        id: this.model.get('name'),
		        name: this.model.get('id')
		      };
		      this.model.set(swapped);*/
		    }
	  	});


		var DetailsView = Backbone.View.extend({
		    //tagName: 'li', // name of (orphan) root tag in this.el
		    defaults:{
		    	"image_source":null
		    },

		    initialize: function(){
		      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
		      	//this.model.bind('change', this.render);
	      		//this.model.bind('remove', this.unrender);
		    },
		    events: {
	      		'click a.project-details-close':  'hideDetails',
	      		'click a.project-details-show':  'showFullImage',
	      		'click a.video':  'playVideo',
	      		'click a.video-close': 'stopVideo'
	    	},
		    render: function(){

		    	/*$(window).scroll(function(){
		    		project_detail.hideDetails();
		    	});*/
				
				startSpinner();
				
				$("body").addClass('lighter');

				if($(".project-detail-holder")){
					$(".project-detail-holder").remove();
				}

		    	$(this.el).addClass("project-detail-holder");
		    	$(this.el).attr("id","");

		    	//if(window.matchMedia("(max-width: 22.308em)").matches || window.matchMedia("(max-width: 39.692em) and (min-width: 22.308em)").matches){
					//$(this.el).css("top", ($(window).scrollTop() + 10) + "px");
		    	//}

		    	var illo = (this.model.get("type").indexOf("illo")<0)?false:true;

		    	if(illo){
		    		this.model.set("illo",true);
		    	}

		    	
		    	var detail_html = '<div class="project-detail-area hidden' + ((illo)?" view_image":"") + '" id="projectdetails">';

		    	detail_html += '<div class="project-detail-image"></div>';

		    	if(!illo){
		    		detail_html += '<div class="project-detail-description"></div>';
		    		detail_html += '<a class="butn project-details-show">View Image</a>';
		    	}

		    	detail_html += '<a class="butn project-details-close">X</a>';
		    	detail_html += '</div>';

		    	$(this.el).html(detail_html);

		    	$(this.el).find(".project-detail-image").addClass("playing");
	

		    	if(!illo){
		    		$(this.el).find(".project-detail-area").append('<p class="project-name">' + this.model.get("name") + '</p>');
		    	}

		    	if(this.model.has("role")){
		    		$(this.el).find(".project-detail-description").append('<p class="project-role"><b>Role:</b>' + this.model.get("role") + '</p>');
		    	}

		    	if(this.model.has("tech")){
		    		$(this.el).find(".project-detail-description").append('<p class="project-role"><b>Tech:</b>' + this.model.get("tech") + '</p>');
		    	}

		    	if(this.model.has("url")){

		    		if((Browser.is("mobile") && this.model.has("mobile")) || !Browser.is("mobile")){
		    			$(this.el).find(".project-detail-description").append('<a href="' + this.model.get("url") + '" class="project-link view-project" target="new">View Project</a>');	
		    		}
		    	}

		    	if(this.model.has("vimeo")){
		    		$(this.el).find(".project-detail-description").append('<a class="project-link video">Video</a>');
		    		
		    		if($(this.el).find(".view-project").length==0){
		    			$(this.el).find(".video").addClass("right_aligned");
		    		}
		    	}


		    	if(this.model.has("description")){
		    		$(this.el).find(".project-name").append('<span>' +  this.model.get("description") + '</span>');
		    	}


		    	if(this.model.has('image')){

		    		this.model.set('detail_image_loading',false);		    	

		    		var tempimage = new Image();
					tempimage.src = images_sub_directory +  this.model.get('image') + "?t=" + new Date().getTime();

					if(!this.model.get("detail_image_loading")){
			    		try{
							this.model.set("image_detail_source",tempimage);
							this.model.set('detail_image_loading',true);
							$(tempimage).load($.proxy(showDetailImage,this));
						}
						catch(e){

							for(var i in this.model.attributes){
								//console.log(i + " " + this.model.attributes[i]);
							}
						}
					}

					//$(this.el).find(".project-item-front").css("background-image","url(" + images_sub_directory +  this.model.get('image') + ")");
		    	}

		    	$("body").append(this.el);
		    	
		    	if(!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){
		    		$(".projects_navigation").css("display","none");
		    	}

		    	if(Browser.is("firefox")){
		    		$(".portfolio_header").addClass("stopani");
		    	}

		    	//here
		    	onWindowOpen(true);
		    	/*$(".portfolio_header").addClass('blurred');
		    	$(".butn_cv_open").addClass('blurred');
		    	$(".portfolio_area").addClass('blurred');*/

		    	adjustDetailHeight();

/*		    	if(illo){
		    		this.showFullImage();
		    	}*/

	      		return this; // for chainable calls, like .render().el
		    },
		    reloadFullDetailImage: function(){

		    	if(!this.model.get('detail_image_loading')){

		    		var detailtempimage = new Image();
					detailtempimage.src = images_sub_directory +  this.model.get('image') + "?t=" + new Date().getTime();

					this.model.set('detail_image_loading',true);
					this.model.set("image_detail_source",detailtempimage);


					$(detailtempimage).load($.proxy(reloadDetailImage,this));
		    	}
		    },
		    hideDetails: function(){
		    	$(this.el).find(".project-detail-area").addClass('hidden');

		    	if(!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){
		    		$(".projects_navigation").css("display","block");
		    	}

		    	$("body").removeClass('lighter');

		    	if($(".portfolio_header").hasClass("stopani")){
			    	$(".portfolio_header").removeClass("stopani");
			    	restartCharacters();
		    	}

		    	setTimeout(function(){
					 $(".project-detail-holder").empty();
					 $(".project-detail-holder").remove();
					 projectvideo = null;
					 onWindowOpen();
					},500);
		    },
		    showFullImage: function(){
		    	$element = $(this.el).find(".project-detail-area");
		    	
		    	if(!$element.hasClass("view_image")){
					$element.addClass("view_image");

					var iw = this.model.get("image_detail_source").width;
					var ih = this.model.get("image_detail_source").height;

					$(".project-details-show").html("Minimize");

					var nh = getProportion($(this.el).find(".project-detail-image").width(),this.model.get("image_detail_source").width,this.model.get("image_detail_source").height);

			  		if(nh < $(this.el).height()){
			  			$(this.el).find(".project-detail-image").removeClass("playing");
			  			$(this.el).find(".project-detail-image").addClass("centered");
			  		}

		    	}else{
		    		$element.removeClass("view_image");
		    		$(".project-details-show").html("View Image");

		    		$(this.el).find(".project-detail-image").removeClass("centered");
		    		
		    		if(!$(this.el).find(".project-detail-image").hasClass("playing")){
		    			$(this.el).find(".project-detail-image").addClass("playing");
		    		}	
		    	}
		    },
		    playVideo: function(){
		    	$(".portfolio_header").addClass("stopani");

		    	$("body").addClass('hide_overage');
		    	$("body").append('<div id="video_holder" class="hidden"></div>');
		    	$("#video_holder").append('<a class="butn video-close">x</a>');
		    	$(".video-close").bind("click",this.stopVideo);

		    	adjustVideoPosition();

		    	projectvideo = new Video(320,240,"video_holder",true);
		    	projectvideo.vimeo = this.model.get("vimeo");
		    	projectvideo.setOverride(true);
		    	projectvideo.attachVideo();

		    	$(this.el).find(".project-detail-image").removeClass("playing");
		    	$(".project-detail-holder").css("visibility","hidden");

		    	setTimeout(function(){
		    		$("#video_holder").removeClass('hidden');
		    		adjustSubVideoPosition();
		    	},200);
		    },
		    stopVideo: function(){
		    	$(".project-detail-image").addClass("playing");

		    	$("body").removeClass('hide_overage');
		    	projectvideo.killVideo();
		    	$("#video_holder").addClass('hidden');
		    	$(".project-detail-holder").css("visibility","visible");

		    	setTimeout(function(){
		    		$("#video_holder").remove();
		    		projectvideo = null;
		    	},250);
		    }

	
	  	});
	
		function adjustCVHeight(){

			if(typeof $(".cv_area").height() != "undefined"){
				if($(".cv_area").height() < (window.innerHeight || document.documentElement.clientHeight)){
					var newtop = ((window.innerHeight || document.documentElement.clientHeight)/2 - $(".cv_area").height()/2) + $(window).scrollTop();
					//newtop -= Math.round(newtop * .25);
					$(".cv_area").css("top",newtop + "px");
				}
				else{
					$(".cv_area").css("top",($(window).scrollTop() + 10) + "px");
				}
			}
		}


		//gets hash value from url location
		function getHashFromAddress(){
			
			var hashValue;
			
			if(window.location.hash){
				hashValue=window.location.hash;
			}
			else{
				hashValue=location.hash;
			}
			
			return String(hashValue).replace(/#/,"");
		}

		function adjustSubVideoPosition(){
			if(typeof document.getElementById("video_holder") != "undefined"){

				var vhh = (window.innerHeight || document.documentElement.clientHeight);
				var vhw = (window.innerWidth || document.documentElement.clientWidth);

				var svw = vhw * .9;
				var svh = getProportion(svw,16,9);

				$("#subvideo").css({"width": svw + "px", "height": svh + "px", "margin-left": -(svw/2) + "px","margin-top": -(svh/2) + "px"});
				$(".video-close").css({"margin-left": -(svw/2) + "px","margin-top": -(svh/2 + 35) + "px"});
			}
		}

		function adjustVideoPosition(){
			if(typeof document.getElementById("video_holder") != "undefined"){

				var vhh = (window.innerHeight || document.documentElement.clientHeight);
				var vhw = (window.innerWidth || document.documentElement.clientWidth);

				var svw = vhw * .9;
				var svh = getProportion(svw,16,9);

				$("#video_holder").css({"width": vhw + "px", "height": vhh + "px","top":$(window).scrollTop() + "px"});
				$("#subvideo").css({"width": svw + "px", "height": svh + "px", "margin-left": -(svw/2) + "px","margin-top": -(svh/2) + "px"});

				adjustSubVideoPosition();
			}
		}

		function adjustDetailHeight(){
			if(typeof $(".project-detail-holder").height() != "undefined"){
				if($(".project-detail-holder").height() < (window.innerHeight || document.documentElement.clientHeight)){
					var newtop = ((window.innerHeight || document.documentElement.clientHeight)/2 - $(".project-detail-holder").height()/2) + $(window).scrollTop();
					//newtop -= Math.round(newtop * .25);
					$(".project-detail-holder").css("top",newtop + "px");
				}
				else{
					$(".project-detail-holder").css("top",($(window).scrollTop() + 10) + "px");
				}
			}
		}
 
		
		 var AllProjectsView = Backbone.View.extend({
			el: $('.portfolio_area'), // attaches `this.el` to an existing element.
			events: {
		  		//'click button#add': 'addItem'
			},
			initialize: function(){
				this.subviews = new Array();
				_.bindAll(this, 'render', 'appendItem');
				//_.bindAll(this, 'render', 'addItem', 'appendItem');

				this.collection = new PortfolioList();
		  		this.collection.bind('add', this.appendItem); // collection event binder
				this.render(); // not all views are self-rendering. This one is.
			},

			render: function(){
				var self = this;

				_.each(this.collection.models,function(item){ // in case collection is not empty					
					self.appendItem(item);
				}, this);

			setTimeout(function(){
					 $('.portfolio_area').append('<div class="breaker"></div>');
					},1000);
			},
			appendItem: function(item){
		  		var portSide = new ProjectView({
			        model: item
			    });		 

		  		this.subviews.push(portSide);

			    $(this.el).append(portSide.render().el);
			    checkProjectTops();
			}

		});

		function createAnimationStyle(obj){

			var styleid = "ani_style_" + obj.get("sprite_id");

			if(typeof document.getElementById(styleid) != "undefined"){
				$("#" + styleid).remove();
			}

			var prefix = (Browser.is("webkit"))?"-webkit-":"";

			var sprite_ani_name = "sprite_ani_" + obj.get("sprite_id");

			var direction = Math.round(Math.random() % 2);

			var styles = "@" + prefix + "keyframes " + sprite_ani_name + " {\n";
			styles += "\t0% {background-position: " + obj.get("xCoor")[direction][0] + "px " +  obj.get("yCoor")[0] + "px;}\n";
			styles += "\t100% {background-position: " + obj.get("xCoor")[direction][1] + "px " +  obj.get("yCoor")[1] + "px;}\n";
			styles += "}\n";			

			//builddynamic style
			styles += "\n#" +  obj.get("sprite_id") + "{\n";

			styles += "\tz-index:" + obj.get("position")[1] + ";\n";
			styles += "\t" + prefix + "animation-name: " + sprite_ani_name + ";\n";
  			styles += "\t" + prefix + "animation-duration: " + obj.get("walk_speed") +  ";\n";
  			styles += "\t" + prefix + "animation-timing-function: steps(2);\n";
  			styles += "\t" + prefix + "animation-delay: 0s;\n";
  			styles += "\t" + prefix + "animation-iteration-count: infinite;\n";
  			styles += "\t" + prefix + "animation-direction: alternate;\n";
  			styles += "\t" + prefix + "animation-play-state: running;\n";

  			var parent_width = $(obj.get("parent_element")).width();

  			//add transitions	
  			var multiplier = (parent_width<600)?5:10;

  			if(String(obj.get("sprite_id")).match(/bird/)){
  				multiplier = (parent_width<600)?2:5;
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
  			styles += "\twidth:" + obj.get("dimensions")[0] +  "px;\n";
  			styles += "\theight:" + obj.get("dimensions")[1] +  "px;\n";
  			styles += "\ttop:" + obj.get("position")[1] +  "px;\n";

  			styles += "\t" + prefix + "transform: translateX(" + ((!Boolean(direction))?parent_width: -(obj.get("dimensions")[0])) + "px);\n";

  			styles += "}\n";

  			styles += "\n#" +  obj.get("sprite_id") + ".move{\n";
  			styles += "\t" + prefix + "transform: translateX(" + ((!Boolean(direction))?-(obj.get("dimensions")[0]):parent_width) + "px);\n";
  			styles += "}\n";

			var head = document.head || document.getElementsByTagName("head")[0];
			var anistyle = document.createElement("style");

			anistyle.id = styleid;
			anistyle.text = "text/css";
			anistyle.media = "screen";
			head.appendChild(anistyle);

			if(anistyle.styleSheet){
				anistyle.styleSheet.cssText = styles;
			}
			else{
				anistyle.appendChild(document.createTextNode(styles));
			}

			setTimeout(function(){
				$("#" + obj.get("sprite_id")).addClass("move");
			},1000);
		
		}

		var AnimateThisObject = Backbone.Model.extend({
			defaults: {
				"yCoor": Array(0,100),
				"xCoor": Array(0,100),
				"dimensions": Array(100,200),
				"position": Array(10,10),
				"sprite_type": "characters",
				"sprite_image": undefined,
				"restart":false,
				"walk_speed": ".08s",
				"parent_element" :".portfolio_header"
			}
		});
		
		var ObjectsToAnimate = Backbone.Collection.extend({
			model: AnimateThisObject
		});

	 	var AnimatedObject = Backbone.View.extend({
			el: $('.portfolio_header'), // attaches `this.el` to an existing element.

			events: {
		  		//'click button#add': 'addItem'
			},
			initialize: function(){
				_.bindAll(this, 'render', 'appendItem');
				//_.bindAll(this, 'render', 'addItem', 'appendItem');

				this.collection = new ObjectsToAnimate();
		  		this.collection.bind('add', this.appendItem); // collection event binder
				this.render(); // not all views are self-rendering. This one is.
			},

			render: function(){
				var self = this;

				_.each(this.collection.models,function(item){ // in case collection is not empty					
					self.appendItem(item);
				}, this);
			},
			appendItem: function(item){
		  		var sprite = new SpriteView({
			        model: item
			    });		 	

		  		sprite.render();
			    //$(this.el).append(sprite.render().el);
			}

			
		});

		var SpriteView = Backbone.View.extend({
			initialize: function(){
				//console.log(this);
				this.listenTo(this.model, 'change', this.remove);
				_.bindAll(this, 'render');
			},
			aniCallBack: function(item){
				this.remove();
			},
			remove: function(){
				var cid = $(this.el).attr("title");
				$(this.el).remove();

				setTimeout($.proxy(function(){
					this.createObject();
				},this),2000);
			},
			addListeners: function(obj){

				if(typeof window.addEventListener != "undefined"){
	 				obj.addEventListener('webkitTransitionEnd', $.proxy(this.aniCallBack,this), false);
	        		obj.addEventListener('transitionend', $.proxy(this.aniCallBack,this), false); //Firefox
	        		obj.addEventListener('oTransitionEnd', $.proxy(this.aniCallBack,this), false); //Opera
	        	}
			},
			createObject:function(){
				$(this.el).removeClass('move');
				$(this.el).addClass('sprite');
				$(this.el).attr('id',this.model.get("sprite_id"));
				$(this.el).attr('title',this.model.cid);
				$(this.el).css("background-image","url(" + this.model.get("sprite_image") +  ")");
				
				createAnimationStyle(this.model);
				$(this.model.get("parent_element")).append($(this.el));
			},
			render: function(){
				this.createObject();
				this.addListeners(this.el);
			}
		});

		$(".butn_cv_open").bind(Browser.evt("override"),loadCV);

		function closeDetailWindow(){
			if(typeof project_detail != "undefined"){					
				project_detail.hideDetails();
			}
		}

		function onWindowOpen(hide){

			if(typeof hide != "undefined"){
				$("body").addClass('lighter');
				$(".portfolio_header").addClass('blurred');
				$(".butn_cv_open").addClass('blurred');
				$(".portfolio_area").addClass('blurred');
				$(".projects_navigation").addClass('blurred');
			}
			else{
				$("body").removeClass('lighter');
				
				$(".portfolio_header").removeClass('blurred');
				$(".butn_cv_open").removeClass('blurred');	
				$(".portfolio_area").removeClass('blurred');
				$(".projects_navigation").removeClass('blurred');
			}
		}

		function createCVArea(html){
			$("body").append('<div class="cv_area hidden"><a class="butn_cv_close">X</a><div class="cv_text">' + html + '</div></div>');

			onWindowOpen(true);

			//manipulate first column
			$cv_first_column = $(".cv_text").find(".cv_column:first-child");
			$firstcolumn = $cv_first_column.clone();
			$cv_first_column.remove();

			//create nav items
			$(".cv_area").append('<a href="' + $firstcolumn.find("a").attr("href") + '" target="new" class="butn_cv_pdf">PDF</a>');
			$(".cv_area").append('<h1>' + $firstcolumn.find(".cv_maintitle").html() + '</h1>');

			adjustCVHeight();

			setTimeout(function(){
				$(".cv_area").removeClass('hidden');
			},200);

			$(".butn_cv_close").bind(Browser.evt("override"),hideCV);
		}

		function hideCV(){
			$(".cv_area").addClass('hidden');
			$(".cv_area").css("top", -($(".cv_area").height()))

			onWindowOpen();

			setTimeout(function(){
				$(".cv_area").remove();
			},600);
		}

		function adjustNavTop(){
			if(!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){	
				$(".projects_navigation").css("top",($(window).scrollTop() + 10) + "px");
			}
		}

		function reduceProjectsNavForMobile(e){

				/*if(!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){
			    	$(".projects_navigation").addClass('hidden');
			    }
			    if(window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){
			    */
			    if(!window.matchMedia("(min-width: 46em)").matches && window.matchMedia("(max-width: 46em)").matches){	

			    	if(!$(".projects_navigation").hasClass("hidden")){
				    	$(".projects_navigation").addClass('hidden');
				    	$(".projects_navigation").css("top","10px");
			    	}
			    }
			    else{
			    	expandProjectsNavForMobile();
			    }
		}	

		function addRotatedClass(){
			if(typeof window.orientation != "undefined" && window.orientation==90 || window.orientation==-90){
				$(".projects_navigation").addClass('rotated');			    		
			}
			else{
			   $(".projects_navigation").removeClass('rotated');	
			}
		}

		function expandProjectsNavForMobile(e){

				$(".projects_navigation").removeClass('rotated');

				if(!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){

					if($(".projects_navigation").hasClass("hidden")){
			    		$(".projects_navigation").removeClass('hidden');
			    		//$(".projects_navigation").css("top","10px");
			    	}
			    }
			    //else if(window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){
			    else if(!window.matchMedia("(min-width: 46em)").matches && window.matchMedia("(max-width: 46em)").matches){	
			    	addRotatedClass();
			    	$(".projects_navigation").removeClass('hidden');
			    }
		}

		function loadCV(){
			Backbone.ajax({
		    dataType: "html",
		    url: "resume.html",
		    data: "",
		    success: function(val){
			    	//pull in ajax data and bind main view collection
			    	createCVArea(val);
			    	reduceProjectsNavForMobile();
			    	ga('send', 'event', 'Viewing CV ', 'True');	

		    	}
			});
		}

		var dld_portfolio = undefined;
		var work_projects = undefined;

		function filterProjects(val,type){
				var timeout = 600;
				var timeout_inc = 30;

				for(var i in val.projects){

		    		if(typeof type != "undefined"){

		    			if(_.indexOf(val.projects[i].type,type)!=-1){
		    				val.projects[i].timer = timeout;
		    				dld_portfolio.collection.add(val.projects[i]);  //or reset
		    			}
		    		}	
		    		else{
		    			val.projects[i].timer = timeout;

		    			if(_.indexOf(val.projects[i].type,'illo')==-1){
		    				//show all projects without illos
		    				dld_portfolio.collection.add(val.projects[i]);  //or reset
		    			}
		    			
		    		}

		    		timeout+=timeout_inc;
		    	}

		    //checkForAnimations() exist on index page
	    	if(typeof sprites_characters == "undefined" && checkForAnimations()){
	    		loadSpriteImage();
	    	}
		}

		function loadProjects(){
			startSpinner();
			dld_portfolio = new AllProjectsView();

			Backbone.ajax({
			    dataType: "json",
			    url: ("projects.json" + "?t=" + new Date().getTime()),
			    data: "",
			    success: function(val){

			    	//pull in ajax data and bind main view collection
			    	work_projects = val;

			    	if(getHashFromAddress()=="illos"){
			    		filterProjects(val,"illo");	
			    	}
			    	else{
			    		filterProjects(val);
			    	}

			    	
			    }
			});

		}
		
		var animations = new AnimatedObject();
		var sprites_characters = undefined;

		function loadSprites(){
			Backbone.ajax({
			    dataType: "json",
			    url: ("sprites.json" + "?t=" + new Date().getTime()),
			    data: "",
			    success: function(val){

			    	//pull in ajax data and bind main view collection
			    	for(var i in val.sprites){
			    		if(String(val.sprites[i].sprite_type).match(/character/) || typeof val.sprites[i].sprite_type == "undefined"){
							val.sprites[i].sprite_type = "character";
							val.sprites[i].sprite_image = sprites_characters.src;
			    		}			    		
			    		animations.collection.add(val.sprites[i]);  //or reset
			    	}
			    }
			});
		}

		function loadSpriteImage(){
			sprites_characters = new Image()
			sprites_characters.src = images_sub_directory + "sprites.png" + "?t=" + (new Date().getTime());			
			$(sprites_characters).load(loadSprites);
		}

	

		function reloadProjectThumbnail(e){
			dld_portfolio.collection.get(e.currentTarget.bb_cid).set("image_loaded",true);
			$("#" + e.currentTarget.id_to_reload).find(".project-item-front").css("background-image","url(" + e.currentTarget.src + ")");
		}

		function reloadThumbnails(){

			var modelImages = new Array();

			_.each(dld_portfolio.collection.models,function(object, key, list){

					var obj_id = dld_portfolio.collection.get(object.cid).get("id");
					var image_src = dld_portfolio.collection.get(object.cid).get("image");

					dld_portfolio.collection.get(object.cid).set("image_loaded",false);

					this.push({
						"id": dld_portfolio.collection.get(object.cid).get("id"),
						"cid": object.cid,
						"image": dld_portfolio.collection.get(object.cid).get("image")
					})

			},modelImages);

			_.each(modelImages,function(object){
				//console.log(dld_portfolio.collection.get(object).get("image"));

				if(typeof object.image != "undefined" && String(object.image).match(/\w/)){

					var tempimage = new Image();
					tempimage.src = images_sub_directory  + "thumbs/" +  object.image + "?t=" + (new Date().getTime());
					tempimage.id_to_reload = object.id;
					tempimage.bb_cid = object.cid;

					$(tempimage).load(reloadProjectThumbnail);				
				}

			});
			
		}


		function changeImageSizeLocation(e){

			var prev_sub_directory = images_sub_directory;

			if(typeof window.matchMedia != "undefined"){
				//if(window.matchMedia("(min-width: 30em)").matches && Boolean(images_sub_directory.match("full"))){
				if(!window.matchMedia("(min-width: 30em)").matches && window.matchMedia("(max-width: 30em)").matches){
					images_sub_directory = "images/mobile/";
					reduceProjectsNavForMobile();
				}
				else{
				//else if(!window.matchMedia("(min-width: 46em)").matches && Boolean(images_sub_directory.match("mobile"))){	
					images_sub_directory = "images/full/";
					expandProjectsNavForMobile();
				}
			}

			// console.log(e.currentTarget.orientation);
			// console.log("30em " + window.matchMedia("(max-width: 30em)").matches);
			// console.log("30em " + window.matchMedia("(min-width: 30em)").matches);
			// console.log("46em " + window.matchMedia("(min-width: 46em)").matches);
			//console.log(images_sub_directory);

			if(prev_sub_directory!=images_sub_directory){
				reloadThumbnails();
			}
		}

		function createSpinnerCSS(){

			if(typeof document.getElementById("spinner_middle") != "undefined"){
				$("#spinner_middle").remove();
			}

			var newtop = ((window.innerHeight || document.documentElement.clientHeight)/2) + $(window).scrollTop();
			var styles = '#spinnerback {top: ' + newtop+ 'px;}';
			styles += '#spinnerback.hidden { top: ' +  ($(window).scrollTop()-200)  + 'px; }';

			var head = document.head || document.getElementsByTagName("head")[0];
			var spinnerMiddle = document.createElement("style");

			spinnerMiddle.id = "spinner_middle";
			spinnerMiddle.text = "text/css";
			spinnerMiddle.media = "screen";

			head.appendChild(spinnerMiddle);

			if(spinnerMiddle.styleSheet){
				spinnerMiddle.styleSheet.cssText = styles;
			}
			else{
				var tn = document.createTextNode(styles);
				spinnerMiddle.appendChild(tn);
			}

		}

		createSpinnerCSS();

		function restartCharacters(){
			_.each(animations.collection.models,function(object,key,list){
				object.set("restart",!object.get("restart"));
			});
		}

		function checkProjectTops(){
			/*
			console.log("---");
			console.log("Scroll Top: " + $(window).scrollTop());
			console.log("Outer Height: " + $(".entries_area").outerHeight(true));

			var hidden_area = Number($(".entries_area").outerHeight(true))  - Number($(window).scrollTop());

			console.log("Height minus scrolltop: " + hidden_area);
			console.log("Hidden Area plus Scrolltop: " + (hidden_area + $(window).scrollTop()));
			*/

			var currentBottom = $(window).scrollTop() + (window.innerHeight || document.documentElement.clientHeight);

			_.each(dld_portfolio.subviews,function(object,key,list){

				var boxtop = object.el.getBoundingClientRect().top+$(window).scrollTop();
				if(boxtop<currentBottom && !object.model.get("image_loaded")){
					//console.log(currentBottom + " " + object.el.getBoundingClientRect().top + " " + $(window).scrollTop() + " " + (window.innerHeight || document.documentElement.clientHeight) + " " + object.model.get("image"));
					object.loadProjectImage();
				}

				if(boxtop<currentBottom && typeof $(object.el).attr("id") == "undefined" && object.model.get("image_loaded")){
					object.model.set("image_loaded",false);
					object.loadProjectImage();	
				}

			},dld_portfolio.subviews);

			/*$(".portfolio_area").find(".project-holder").each(function(){

			});*/

			
			if(currentBottom >= $(".entries_area").outerHeight(true)-5){
				//loadProjects();
			}
		}

		function showProjectsNavIfHidden(){
			if(window.matchMedia("(min-width: 30em)").matches && !window.matchMedia("(max-width: 30em)").matches){
		    	if($(".projects_navigation").css("display")=="none"){
		    		$(".projects_navigation").css("display","block");
		    	}
		    }
		}

		$(window).scroll(function(event) {
			createSpinnerCSS();

			// console.log(window.orientation!=90 && window.orientation!=-90);
			// console.log(!window.matchMedia("(min-width: 46em)").matches && window.matchMedia("(max-width: 46em)").matches);

			//if((!window.matchMedia("(min-width: 46em)").matches && window.matchMedia("(max-width: 46em)").matches) && (window.orientation!=90 && window.orientation!=-90) ){
			adjustDetailHeight();
			adjustCVHeight();
			//}
			
			adjustNavTop();
			adjustVideoPosition();
			checkProjectTops();
		});


		function reloadProjectDetailImage(){

			if(typeof project_detail != "undefined"){
				var im = $(project_detail.el).find(".project-detail-image").css("background-image");
				
				if(!Boolean(String(im).match(images_sub_directory)) && !project_detail.model.get("detail_image_loading")){
					console.log("Reloading Image");
					project_detail.reloadFullDetailImage();
				}
			}
		
		}

		if(typeof window.orientation != "undefined"){
			window.addEventListener("orientationchange", function(){
				changeImageSizeLocation();
				adjustDetailHeight();
				adjustCVHeight();
				restartCharacters();
				reduceProjectsNavForMobile();
				//expandProjectsNavForMobile();
				adjustVideoPosition();
				checkProjectTops();
			}, false);	
		}
		else{
			$(window).resize(function(){
				changeImageSizeLocation();
				createSpinnerCSS();
				adjustDetailHeight();
				adjustCVHeight();
				restartCharacters();
				reduceProjectsNavForMobile();
				adjustVideoPosition();
				checkProjectTops();
				showProjectsNavIfHidden();
				reloadProjectDetailImage();
			});
		}
		
		function destroyProjects(){

			_.each(dld_portfolio.subviews,function(object,key,list){
				object.unrender();
				dld_portfolio.collection.remove(object.model);
				object.model = null;
			},dld_portfolio.subviews);

			dld_portfolio.subviews = null;
			dld_portfolio.subviews = new Array();
		}

		function displayProjects(e){
				
				reduceProjectsNavForMobile();

				setTimeout(function(){
					adjustNavTop();
					checkProjectTops();
				},1000);

				scrollPageTo();

				destroyProjects();

				if(typeof $(this).attr("id") != "undefined"){
					var id = String($(this).attr("id")).replace(/work_/,"");
					filterProjects(work_projects,id);
				}
				else{
					filterProjects(work_projects,undefined);	
				}

		}

		$(".projects_navigation").find(".butn").not(".menu").each(function(){
			$(this).bind(Browser.evt("override"),$.proxy(displayProjects,$(this)));
			adjustNavTop();
		});

		$(".projects_navigation").find(".butn").not(".menu").each(function(){
			$(this).bind(Browser.evt("override"),function(){

				var project_id = (typeof $(this).attr("id") != "undefined")?$(this).attr("id"):"All";
				console.log(project_id);
				ga('send', 'event', 'Project Sorted By', project_id);	
			});
			
		});

		$(".projects_navigation").find(".butn:first").bind(Browser.evt("override"), function(){

			if(!$(".cv_area").hasClass('hidden')){
				hideCV();
			}
			
			adjustNavTop();
			expandProjectsNavForMobile();	
		});

		loadProjects();		


	}//end initialize_dld_app

	//adds dld_init to window object
	this.anthonybaker = initialize_dld_app;


	//passes jquery into function
})(jQuery);


/*$(function(){
	anthonybaker();

	TO DOS
	VIMEO VIDEOS
	IMAGE HEIGHT to large - disable slide show
	
	
});*/

