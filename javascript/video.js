(function(win){

		if(!window.console) console = {log:function(){}};

		//public instance variable 
		Video.prototype.holder = false;
		Video.prototype.poster = false;
		Video.prototype.vimeo = false;
		Video.prototype.changeExtension = true;
		Video.prototype.youtube = false;
		Video.prototype.override = false;

		//static class variable declared once for the class type
		Video.prototype.playHTML5 = false;

		//initial constructor for game
		function Video(width,height,container,autoplay){
			var _width = width;
			var _height = height;
			var _container = container;
			var _autoplay = (Boolean(autoplay))?true:false;


			if(typeof window.HTMLVideoElement != "undefined"){
				this.playHTML5 = true;
			}

			//getter functions
			this.getWidth = function(){ return _width;};
			this.getHeight = function(){ return _height;};

			this.setOverride = function(val){
				if(val){
					this.playHTML5 = false;
				}
				else{
					this.playHTML5 = true;
				}
			}

			this.setWidth = function(val){ 
				_width = val; 
				this.holder.width = val;
			};
			this.setHeight = function(val){
				_height = val; 
				this.holder.height = val;
			};

			this.getContainer = function(){ return _container;};

			this.getAutoPlay = function(){return _autoplay;};

			this.attachVideo = function(val,types){				
				if(Boolean(this.vimeo) && !this.playHTML5){
					this.createVimeo(this.vimeo);
				}
				else if(this.playHTML5){
					this.createHTMLVideo(val,types);
				}
				else{
					alert("Video Cannot Play");
				}
			}//end setSource

			//this.getFallBack = function(){ return _fallback;};
			//this.setFallBack = function(val){ _fallback = val;};

			this.createVimeo = function(vimeoID){

				var ie78 = new RegExp(/msie\s(7|8)/i);

				if(ie78.exec(navigator.userAgent)){
					this.holder = document.createElement('<iframe src="https://player.vimeo.com/video/' +  vimeoID + '?title=0&amp;byline=0&amp;portrait=0&amp;autoplay=1&amp;api=1" width="' + this.getWidth()  +  '" height="' + this.getHeight()  +  '"  id="subvideo" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>');
				}
				else{
					this.holder = document.createElement("iframe");
					this.holder.width = this.getWidth();
					this.holder.height =  this.getHeight();
					this.holder.id =  "subvideo";
					this.frameborder= 0;
					this.webkitAllowFullScreen = true;
					this.mozallowfullscreen = true;
					this.allowFullScreen = true;
					this.holder.src = "https://player.vimeo.com/video/"+ vimeoID + "?&api=1" + ((this.getAutoPlay())?"&autoplay=1":"");
				}
				this.appendVideoToParent();
			}

			this.createHTMLVideo = function(val,types){

				//types needs to be an array

				var moviefile = (this.changeExtension)?(String(val).replace(/\.\w{3}/,"")):val;
				this.holder = document.createElement("video"); 

				this.holder.width = this.getWidth();
				this.holder.height =  this.getHeight();
				this.holder.id =  "subvideo";
				this.holder.preload = "auto";
				this.holder.controls = true;

				if(this.getAutoPlay()){
					this.holder.autoplay = true;
				}

				if(this.poster){
					this.holder.poster = this.poster;
					this.holder.style.backgroundImage = 'url(' + this.poster + ')';
				}

				var sourceObjects = new Array();

				for(var i in types){

					var vtype = String(types[i]).toLowerCase();
					var source = document.createElement("source");
					
					switch(vtype){
						case 'mp4':
							source.src = (this.changeExtension)?(moviefile + ".mp4"):moviefile;
							source.type = "video/mp4";
						break;

						case 'webm':
							source.src = (this.changeExtension)?(moviefile + ".webm"):moviefile;
							source.type = "video/webm";
						break;

						case 'ogv':
							source.src = (this.changeExtension)?(moviefile + ".ogv"):moviefile;
							source.type = "video/ogg";
						break;
					}
					
					this.holder.appendChild(source);
					t(vtype);
				}

				var noVideo = document.createTextNode("Your browser does not support the video tag.");
				this.appendVideoToParent();
			}

		}


		//public function to attach game to parnet object
		Video.prototype.appendVideoToParent = function(){
			if(this.holder){
				var hldr = document.getElementById(this.getContainer());
				hldr.appendChild(this.holder);
			}
		}


		//public function to attach game to parnet object
		Video.prototype.playVideo = function(evt){
			if(this.playHTML5 && this.holder){
				this.holder.play();
			}
		}

		//public function to attach game to parnet object
		Video.prototype.stopVideo = function(evt){
			if(this.playHTML5 && this.holder){
				this.holder.pause();
			}
		}

		//public function to attach game to parnet object
		Video.prototype.killVideo = function(evt){

			if(this.holder){
				var hldr = document.getElementById(this.getContainer());
				hldr.removeChild(this.holder);
				this.holder = false;
			}

		}

		win.Video = Video;

}(window));
