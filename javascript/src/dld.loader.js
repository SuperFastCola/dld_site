(function(win){

	var links = new Array();
	links.push("/css/style.css");

	var cssFontLinks = new Array();
	cssFontLinks.push("https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i|Oswald");
	
	var scripts = new Array();
	scripts.push("/javascript/dld.js");

	var scriptsloaded = 0; 
	var cssloaded = 0; 

	// creates the XMLHTTP Object
	function createXMLHttpRequest() {
		try	{
			return new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {}
		
		try{
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e) {}
		
		try{
			return new XMLHttpRequest();
			}
		catch(e){}
		
		return null;
	}

	function loadScript(scriptname){
		
		var xhr = createXMLHttpRequest();

		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState==4) 
			{// Request is finished
			
				if (xhr.status!=200)
				{
				}// end if 
				else{
					appendScript(xhr.responseText);
				}// end if 
			}// end main if
			else
			{	
				//showErrorPanel("An error occurred with your submission. Please contact customer support!");
			}
		}// end onreadystatechange function
		
		xhr.open("GET", scriptname, true);
		xhr.setRequestHeader("Content-type","application/javascript");
		xhr.send();
	}

	function loadCSS(linklocation){

		document.getElementById("loader").className="";
		document.getElementsByTagName("body").className="clip_car";

		document.getElementById("container").style.opacity="0";
		document.getElementById("portfolio_header").style.opacity="0";
		document.getElementById("navigation").style.opacity="0";
		
		if(typeof linklocation != "undefined"){

			var xhr = createXMLHttpRequest();

			xhr.onreadystatechange = function() 
			{
				if (xhr.readyState==4) 
				{// Request is finished
				
					if (xhr.status!=200)
					{
					}// end if 
					else{
						appendCSS(xhr.responseText);
					}// end if 
				}// end main if
				else
				{	
					//showErrorPanel("An error occurred with your submission. Please contact customer support!");
				}
			}// end onreadystatechange function
			
			xhr.open("GET", linklocation, true);
			xhr.setRequestHeader("Content-type","text/css");
			xhr.send();
		}
	}

	function unclipBodyRemoveCar(){
		setTimeout(function(){
			//jquery is loaded at this point
			var loader = document.getElementById("loader");
			document.body.removeChild(loader);
			document.body.className = "";
			
		},500);
	}

	function appendScript(output){
		var head = document.head || document.getElementsByTagName("head")[0];
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.text = output;
		head.appendChild(s);
		scriptsloaded++;

		//loadOtherScripts(scriptsloaded);

		if(scriptsloaded>scripts.length){
			document.getElementById("granny_says").innerHTML = "Pedal to the Metal!<i>Puddin'</i>";
		}

		if(scriptsloaded==scripts.length){
			//loadCSS(links[cssloaded]);
			document.getElementById("loader").className="right";
			unclipBodyRemoveCar();
			loadCSSFontLinks();

			var timeout = setTimeout(function(){
				document.getElementById("container").style.opacity="1";
				document.getElementById("portfolio_header").style.opacity="1";
				document.getElementById("navigation").style.opacity="1";


			},500);
		}
	}

	function appendCSS(output){
		var head = document.head || document.getElementsByTagName("head")[0];
		
		var dldcss = document.createElement("style");
		dldcss.text = "text/css";
		dldcss.media = "screen";
		head.appendChild(dldcss);

		if(dldcss.styleSheet){
			dldcss.styleSheet.cssText = output;
		}
		else{
			dldcss.appendChild(document.createTextNode(output));
		}

		cssloaded++;

		if(typeof links[cssloaded] != "undefined"){
			loadCSS(links[cssloaded]);
		}

		if(cssloaded==links.length){
			loadJquery();
		}
	}

	function loadJquery(){
		loadScript(scripts[0]);
	}

	function loadOtherScripts(indice){
		if(typeof scripts[indice] != "undefined"){
			loadScript(scripts[indice]);
		}
	}

	//https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
	function checkForAnimations(){

		var elm = document.createElement("div");
		document.body.appendChild(elm);

		var animation = false,
		    animationstring = 'animation',
		    keyframeprefix = '',
		    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
		    pfx  = '';

		if( elm.style.animationName !== undefined ) { animation = true; }    

		if( animation === false ) {
		  for( var i = 0; i < domPrefixes.length; i++ ) {
		    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
		      pfx = domPrefixes[ i ];
		      animationstring = pfx + 'Animation';
		      keyframeprefix = '-' + pfx.toLowerCase() + '-';
		      animation = true;
		      break;
		    }
		  }
		}

		document.body.removeChild(elm);
		return animation;
	}

	function loadCSSFontLinks(){
		var head = document.head || document.getElementsByTagName("head")[0];

		for(var i =0;i<cssFontLinks.length;i++){

			var l = document.createElement("link");
			l.href = cssFontLinks[i];
			l.rel = "stylesheet";
			l.type = "text/css";
			head.appendChild(l);
		}

	}
	//if( typeof window.addEventListener !="undefined" && !Boolean(navigator.userAgent.match(/msie\s(7|8|9)/i))){
	if(checkForAnimations() || Boolean(navigator.userAgent.match(/msie\s(9)/i)) ){
		document.addEventListener("DOMContentLoaded",function(){
			loadCSS(links[cssloaded]);
		});
	}
	else{
		document.getElementById("loader").className="";
		document.getElementById("granny_says").innerHTML = "Your engine lacks sass!<a href='http://www.deluxeluxury.com'>Older engines have to sit in lounge.</a>";	
	}

})();