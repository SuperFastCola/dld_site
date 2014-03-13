if(!window.console) console = {log:function(){}};

//starts namespaced anonymous private function
(function($){

	function initialize_dld_app(filter){

		var images_sub_directory = "images/full/";

		if(typeof window.matchMedia != "undefined"){
			images_sub_directory = "images/" + ((window.matchMedia("(max-width: 30em)").matches)?"mobile":"full")  + "/";
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

		var PortfolioItem = Backbone.Model.extend({

		});

	  	var PortfolioList = Backbone.Collection.extend({
	    	model: PortfolioItem
	  	});
	  	
	  	function showImage(e){
	  		this.model.set('image_loaded',true);

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
	  		

	  		$(this.el).find(".project-item-front").css("background-image","url(" +  this.model.get("image_source").src + ")");
	  	}

	  	function showDetailImage(e){
	  		$(this.el).find(".project-detail-image").css("background-image","url(" +  this.model.get("image_source").src + ")");
	  		$(this.el).find(".project-detail-area").removeClass("hidden");
	  	}

	  	var proj_id = 1;
	  	var proj_prefix = "proj_";


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

		    	$(this.el).addClass("project-holder");

		    	$(this.el).html('<div class="project-item-front"></div>');
		    	//$(this.el).append('<div class="project-item-back"></div>');


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

		    	/*if(this.model.has('description')){
		    		back.append('<div class="project-description">' + this.model.get('description') + '</div>');
		    	}

				if(this.model.has('role')){
		    		back.append('<div class="project-role">' + this.model.get('role') + '</div>');
		    	}

		    	if(this.model.has('tech')){
		    		back.append('<div class="project-tech">' + this.model.get('tech') + '</div>');
		    	}*/

				if(this.model.get('image')){

					this.model.set('image_loaded',false);

					$(this.el).attr("id",this.model.get('id'));

					var tempimage = new Image();
					tempimage.src = images_sub_directory  + "thumbs/" +  this.model.get('image') + "?t=" + (new Date().getTime());

					this.model.set("image_source",tempimage);

					// if(Browser.is("ie78") || Browser.is("ie9")){
					// 	console.log(tempimage.src);

					// 	$(tempimage).load(function(){
					// 		console.log(this);
					// 	});
					// }
					// else{
						$(tempimage).load($.proxy(showImage,this));	
					//}

					

					//$(this.el).find(".project-item-front").css("background-image","url(" + images_sub_directory +  this.model.get('image') + ")");

		    	}
		    	
		    	//if(this.model.get('name'))
		    	/*$(this.el).html('<p class="project-name">' + this.model.get('name') + '</p>');
		    	$(this.el).html(this.model.get('name'));
		    	$(this.el).html(this.model.get('name'));
		    	$(this.el).html(this.model.get('name'));
*/
	      		return this; // for chainable calls, like .render().el
		    },
		    unrender: function(){
	      		//$(this.el).remove();
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
		    initialize: function(){
		      _.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here
		      	//this.model.bind('change', this.render);
	      		//this.model.bind('remove', this.unrender);
		    },
		    events: {
	      		'click a.project-details-close':  'hideDetails'
	    	},
		    render: function(){

		    	/*$(window).scroll(function(){
		    		project_detail.hideDetails();
		    	});*/
				
				$("body").addClass('lighter');
		    	$(this.el).addClass("project-detail-holder");

		    	//if(window.matchMedia("(max-width: 22.308em)").matches || window.matchMedia("(max-width: 39.692em) and (min-width: 22.308em)").matches){
					$(this.el).css("top", ($(window).scrollTop() + 10) + "px");
		    	//}
		    	
		    	var detail_html = '<div class="project-detail-area hidden">';
		    	detail_html += '<div class="project-detail-image"></div>';
		    	detail_html += '<div class="project-detail-description"></div>';
		    	detail_html += '<a class="butn project-details-close">X</a>';
		    	detail_html += '</div>';

		    	$(this.el).html(detail_html);

		    	$(this.el).find(".project-detail-area").append('<p class="project-name">' + this.model.get("name") + '</p>');

		    	if(this.model.has("role")){
		    		$(this.el).find(".project-detail-description").append('<p class="project-role"><b>Role:</b>' + this.model.get("role") + '</p>');
		    	}

		    	if(this.model.has("tech")){
		    		$(this.el).find(".project-detail-description").append('<p class="project-role"><b>Tech:</b>' + this.model.get("tech") + '</p>');
		    	}

		    	if(this.model.has("url")){
		    		$(this.el).find(".project-detail-description").append('<a href="' + this.model.get("url") + '" class="project-link" target="new">View Project</a>');	
		    	}


		    	if(this.model.has("description")){
		    		$(this.el).find(".project-name").append('<span>' +  this.model.get("description") + '</span>');
		    	}

		    	if(this.model.get('image')){
					var tempimage = new Image();
					tempimage.src = images_sub_directory +  this.model.get('image');

					this.model.set("image_source",tempimage);
					$(tempimage).load($.proxy(showDetailImage,this));

					//$(this.el).find(".project-item-front").css("background-image","url(" + images_sub_directory +  this.model.get('image') + ")");

		    	}

		    	$("body").append(this.el);
		    	$(".portfolio_header").addClass('blurred');
		    	$(".portfolio_area").addClass('blurred');
		   		
	      		return this; // for chainable calls, like .render().el
		    },

		    hideDetails: function(){
		    	$(this.el).find(".project-detail-area").addClass('hidden');
		    	$("body").removeClass('lighter');

		    	setTimeout(function(){
					 $(".project-detail-holder").empty();
					 $(".project-detail-holder").remove();
					 $(".portfolio_header").removeClass('blurred');
					 $(".portfolio_area").removeClass('blurred');
					},500);
		    }
	
	  	});

 
		
		 var AllProjectsView = Backbone.View.extend({
			el: $('.portfolio_area'), // attaches `this.el` to an existing element.

			events: {
		  		//'click button#add': 'addItem'
			},
			initialize: function(){
				_.bindAll(this, 'render', 'appendItem');
				//_.bindAll(this, 'render', 'addItem', 'appendItem');

				this.collection = new PortfolioList();
		  		this.collection.bind('add', this.appendItem); // collection event binder

				this.render(); // not all views are self-rendering. This one is.
			},

			render: function(){
				var self = this;

				_(this.collection.models).each(function(item){ // in case collection is not empty
					self.appendItem(item);
				}, this);

			setTimeout(function(){
					 $('.portfolio_area').append('<div class="breaker"></div>');
					},1000);
			},

			addItem: function(){

				/*t(this.counter);
				
				this.counter++;
				var project = new Project();
				project.set({
					id: project.get('id') + this.counter // modify project defaults
				});

				this.collection.add(project); // add item to collection; view is updated via event 'add'*/

			},

			appendItem: function(item){
		  		var portSide = new ProjectView({
			        model: item
			    });		 

			    $(this.el).append(portSide.render().el);
			}

		});

		$(".butn_cv_open").bind(Browser.evt(),loadCV);

		function oneWindowOpen(hide){

			if(typeof hide != "undefined"){
				$("body").addClass('lighter');
				$(".portfolio_header").addClass('blurred');
				$(".portfolio_area").addClass('blurred');
			}
			else{
				$("body").removeClass('lighter');
				$(".portfolio_header").removeClass('blurred');	
				$(".portfolio_area").removeClass('blurred');
			}
		}

		function createCVArea(html){
			$("body").append('<div class="cv_area hidden"><a class="butn_cv_close">X</a><div class="cv_text">' + html + '</div></div>');

			oneWindowOpen(true);

			//manipulate first column
			$cv_first_column = $(".cv_text").find(".cv_column:first-child");
			$firstcolumn = $cv_first_column.clone();
			$cv_first_column.remove();

			//create nav items
			$(".cv_area").append('<a href="' + $firstcolumn.find("a").attr("href") + '" target="new" class="butn_cv_pdf">PDF</a>');
			$(".cv_area").append('<h1>' + $firstcolumn.find(".cv_maintitle").text() + '</h1>');


			setTimeout(function(){
				$(".cv_area").removeClass('hidden');
			},200);

			$(".butn_cv_close").bind(Browser.evt(),hideCV);
		}

		function hideCV(){
			$(".cv_area").addClass('hidden');

			oneWindowOpen();

			setTimeout(function(){
				$(".cv_area").remove();
			},600);
		}

		function loadCV(){
			Backbone.ajax({
		    dataType: "html",
		    url: "resume.html",
		    data: "",
		    success: function(val){
			    	//pull in ajax data and bind main view collection
			    	createCVArea(val);
		    	}
			});
		}


		var dld_portfolio = new AllProjectsView();

		startSpinner();

		Backbone.ajax({
		    dataType: "json",
		    url: "projects.json",
		    data: "",
		    success: function(val){

		    	//pull in ajax data and bind main view collection
		    	for(var i in val.projects){
		    		dld_portfolio.collection.add(val.projects[i]);  //or reset
		    	}

		    }
		});

		function changeImageSize(){
			if(typeof window.matchMedia != "undefined"){
				if(window.matchMedia("(max-width: 30em)").matches && Boolean(images_sub_directory.match("full"))){
					images_sub_directory = "images/mobile/";
				}
				else if(!window.matchMedia("(max-width: 30em)").matches && Boolean(images_sub_directory.match("mobile"))){
					images_sub_directory = "images/full/";
				}
			}
		}

		$(window).resize(function(){
			changeImageSize();
		});

	}//end initialize_dld_app

	//adds dld_init to window object
	this.anthonybaker = initialize_dld_app;

	//passes jquery into function
})(jQuery);


$(function(){
	anthonybaker();
});


