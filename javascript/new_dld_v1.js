if(!window.console) console = {log:function(){}};

//starts namespaced anonymous private function
(function($){

	function initialize_dld_app(filter){

		var images_sub_directory = "images/full/";
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
	  		$(this.el).find(".project-item-front").css("background-image","url(" +  this.model.get("image_source").src + ")");
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

		    	$(this.el).addClass("project-holder");

		    	$(this.el).html('<div class="project-item-front"></div>');
		    	$(this.el).append('<div class="project-item-back"></div>');


		    	var front = $(this.el).find(".project-item-front");
		    	front.empty();

		    	var back = $(this.el).find(".project-item-back");
		    	back.empty();

		    	front.append('<a class="butn project-details-butn hidden">Project Details</a>');
		    	back.append('<a class="butn project-details-close">X</a>');

		    	if(this.model.has('name')){

		    		var name = '<div class="project-name">' + this.model.get('name') + '</div>';
		    		front.append(name)
		    		back.append(name);
		    	}

		    	if(this.model.has('description')){
		    		back.append('<div class="project-description">' + this.model.get('description') + '</div>');
		    	}

				if(this.model.has('role')){
		    		back.append('<div class="project-role">' + this.model.get('role') + '</div>');
		    	}

		    	if(this.model.has('tech')){
		    		back.append('<div class="project-tech">' + this.model.get('tech') + '</div>');
		    	}

				if(this.model.get('image')){
					var tempimage = new Image();
					tempimage.src = images_sub_directory +  this.model.get('image');

					this.model.set("image_source",tempimage);
					$(tempimage).load($.proxy(showImage,this));

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

	    		$(".project-holder").removeClass('flipped');
	    		$(this.el).addClass('flipped');

/*
	    		project_detail = new DetailsView({
			        model: this.model
			    });		 
			    $(".portfolio_area").append(project_detail.render().el);
*/
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
	      		
	    	},
		    render: function(){

		   		$(this.el).html("DETAILS");


	      		return this; // for chainable calls, like .render().el
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

			/*	setTimeout(function(){
					 $('.portfolio_area').append('<div class="breaker"></div>');
					},1000);*/
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

		var dld_portfolio = new AllProjectsView();

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

	}//end initialize_dld_app

	//adds dld_init to window object
	this.anthonybaker = initialize_dld_app;

	//passes jquery into function
})(jQuery);


$(function(){
	anthonybaker();
});


