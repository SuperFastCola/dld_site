
(function(win){

		if(!window.console) console = {log:function(){}};

		Browser.prototype.makes = new Object();
		Browser.prototype.events = new Object();
		Browser.prototype.alertbox = false;
		//Browser.prototype.flash = new Object();

		function Browser(){
			//browser
			var _p = new Array();
			_p.push(['ie7',/msie\s7/i]);
			_p.push(['ie8',/msie\s8/i]);
			_p.push(['ie78',/msie\s(7|8)/i]);
			_p.push(['ie9',/msie\s9/i]);
			_p.push(['ie10',/msie\s10/i]);
			_p.push(['arm',/ARM/i]); //surface tablet variables
			_p.push(['touch',/touch/i]); //surface tablet variables
			_p.push(['blackberry',/blackberry|RIM/i]);
			_p.push(['windowsnt5',/windows\snt\s5/i]); //windows xp
			_p.push(['windowsnt6',/windows\snt\s6/i]); //windows 7 and up
			_p.push(['ios',/os\s[34567]{1}/i]);
			_p.push(['macosx',/mac\sos\sx/i]);
			_p.push(['android',/android\s[0-9]{1}/i]);
			_p.push(['firefox',/firefox/i]);
			_p.push(['opera',/opera/i]);
			_p.push(['safari',/safari/i]);
			_p.push(['chrome',/chrome/i]);
			_p.push(['opera',/opera/i]);
			_p.push(['webkit',/webkit/i]);

			//push new makes to end of array
			//will have to rebuild to interate through an object instead of an array

			
			//build is object holdeing selected browser types
			for(var i=0; i<_p.length;i++){
				var pat = new RegExp(_p[i][1])
				//if(Boolean(pat.exec(navigator.userAgent))){
					this.makes[_p[i][0]] = (pat.exec(navigator.userAgent))?true:false;
				//}
			}

			// //flash plugin check
			// for(var i in navigator.plugins){
			// 	if(String(navigator.plugins[i].name).match(/shockwave\sflash/i)){
			// 		this.flash.installed = true;
			// 		var temp = String(navigator.plugins[i].description).match(/flash\s([0-9]*)?(\.)?([0-9]*)?/i);
			// 		this.flash.version_part1 = Number(Array(temp)[0][1]);
			// 		this.flash.version_part2 = Number(Array(temp)[0][3]);
			// 	}
			// }//end flash chck

			function returnMakesArrayForSpecialCase(caseName,makeobj){
				var makesMatch = false;
				for(var i=0; i<makeobj.length; i++){
					if(String(caseName).match(makeobj[i][0])){
						makesMatch = makeobj[i];
					}
				}
				return makesMatch;
			}

			//special cases
			//Android with Version Number
			var temp = String(navigator.userAgent).match(returnMakesArrayForSpecialCase("android",_p)[1]);
			if(this.makes.android) this.makes.android_v = String(temp).match(/[0-9]{1}/i);
			else this.makes.android_v = false;

			//iOS Version Number
			temp = String(navigator.userAgent).match(returnMakesArrayForSpecialCase("ios",_p)[1]);
			if(this.makes.ios) this.makes.ios_v = String(temp).match(/[0-9]{1}/i);
			else this.makes.ios_v = false;

			//IE11
			if(this.makes.windowsnt6 && Boolean(String(navigator.userAgent).match(/Windows/i)) && Boolean(String(navigator.userAgent).match(/Trident/i)) && Boolean(String(navigator.userAgent).match(/rv:11/i))){
				this.makes.ie11 = true;
			}
			else{
				this.makes.ie11 = false;
			}

			//unset
			temp = null;

			//this are overridden externally
			//false by default
			this.makes.mobile = false;
			this.makes.tablet = false; //this is used in overiding to check for tablet right now.

			//safari under xp
			if(this.makes.windowsnt5 && this.makes.safari && !this.makes.chrome) this.makes.xpsafari = true;
			else this.makes.xpsafari = false;

			//Remove Safari if Chrome
			if(this.makes.safari && this.makes.chrome) this.makes.safari = false;

			//ie 10 on surface
			if(this.makes.ie10 && this.makes.arm && this.makes.touch) this.makes.surface = true;
			else this.makes.surface = false;

			//mobile device
			if(this.makes.ios || this.makes.android || this.makes.surface) this.makes.mobile = true;
			else this.makes.mobile = false;

			if(this.is("ie78") || this.is("firefox")) this.alertbox = true
			else this.alertbox = false;


			//display keys in "IS" object
			this.getKeys = function(console){
				
				if(this.alertbox){
					var string = "Browsers.is Object Keys:\n";
					for(var i=0; i<_p.length; i++){
						console.log(i+1);
						string += (_p[i][0] + ((_p[(i+1)])?", ":""));
					}
					alert(string);
				}
				else{
					return _p;
				}
				
			}

			this.touchStart = function(){		
				if(this.makes.surface){ return "MSPointerDown";} 
				else{ return "touchstart"; }
			}

			this.touchMove = function(){		
				if(this.makes.surface){ return "MSPointerMove";} 
				else{ return "touchmove"; }
			}

			this.touchEnd = function(){
				if(this.makes.surface){ return "MSPointerUp"; }
				else{ return "touchend"; }
			}

			this.clickEvents = function(mobile){
				this.events.down = (mobile)?this.touchStart():"mousedown";
				this.events.up = (mobile)?this.touchEnd():"mouseup";
				this.events.over = (mobile)?this.touchStart():"mouseover";
				this.events.out = (mobile)?this.touchEnd():"mouseout";
				this.events.move = (mobile)?this.touchMove():"mousemove";
				this.events.click = (mobile)?this.touchEnd():"click";
			}


			this.clickEvents(this.makes.mobile);

		}

		//override mobile settings
		Browser.prototype.setMobile = function(switcher){
			this.makes.mobile = switcher;
			this.clickEvents(switcher);	
		}

		//override mobile settings
		Browser.prototype.setTablet = function(switcher){
			this.makes.tablet = switcher;
			this.clickEvents(switcher);
		}

		//displays curretn user agent
		Browser.prototype.thisBrowser = function(){
			if(this.alertbox){
				alert("User Agent:\n" + navigator.userAgent);
			}
			else{
				console.log(navigator.userAgent);	
			}
		}

		//Display Type for Targeted Browser
		Browser.prototype.showMakes = function(){

			var string = "Makes: ";

			for (var i in this.makes){
				if(this.alertbox){
					string+= i + " " + this.makes[i] + "\n";					
				}
				else{
					console.log(i + " " + this.makes[i]);
				}
			}

			if(this.alertbox) alert(string);
		}

		//Display Type for Targeted Browser
		Browser.prototype.is = function(pattern){
			//return (typeof this.makes[pattern] !='undefined')?true:false;
			return this.makes[pattern];
		}

		Browser.prototype.evt = function(type){
			switch(type){
				case 'down':
					return this.events.down;
				break;

				case 'up':
					return this.events.up;
				break;

				case 'over':
					return this.events.over;
				break;

				case 'out':
					return this.events.out;
				break;

				case 'move':
					return this.events.move;
				break;

				default:
					return this.events.click;
				break;
			}//end switch
		}

		win.Browser = new Browser();

}(window));