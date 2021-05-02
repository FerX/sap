/**
 * superSeasonAlgo
 * 
 * version 1.2
 * 
 * Author: FerX
**/


const superSeasonAlgoConfig = {
	message : 'NON AVERE FRETTA AD ENTRARE - DEVI AVER FRETTA AD USCIRE - 3gg senza un max'
}


function superSeasonAlgo($){
	console.log("start Super superSeasonAlgo")

	const url = window.location.pathname
	const urlWithPopUp = ["/system/strategies/","/system/strategies/recommendation","/system/strategies/scanner"]

	
	
	if(urlWithPopUp.indexOf(url)>-1){
		console.log("Activate inject data in PopUp")
		waitIfOpen()
	}
	
	function waitIfOpen(){
		waitForElement('#grid-modalPopup.in',function(){
			 injectDataInPopUp()
			 waitForNoElement('#grid-modalPopup.in',waitIfOpen )
		})
	}

	
	function waitForElement(selector,cb){
		if ($(selector).length) {
          return cb();
		}
        
	    setTimeout(function() {
	      waitForElement(selector, cb);
	    }, 100);
  	}
  	
	function waitForNoElement(selector,cb){
		if (!$(selector).length) {
          return cb();
		}
        
	    setTimeout(function() {
	      waitForNoElement(selector, cb);
	    }, 100);
  	}
  	

	function injectDataInPopUp(){
		var teste = $("thead .grid-label th");
	    var el = $("tr.info");
	    var skip = ['','Name','#Legs','Tickers','Enter','Exit','Actions'];
	    var data = {};
	    $.each(teste,function(index,testa){
	        
	        let key = testa.innerText.trim();
	        //valori da saltare
	        if(skip.indexOf(key)>-1){
	            return true;
	        }
	        let val = el.find("td").eq(index)[0].innerText.trim();
	        data[key]=val;
	    })
	    
	
	    var html='<div class="row superSeasonAlgo" style="margin-left:10px;">';
	    var label="";
	    $.each(data,function(index,value){
	        console.log(index+"="+value);
	        label="primary";
	        if(index=="Win%" && (value=="100%" || value.substr(0,2)>90)){
	            label="success";
	        }
	
	        if(index=="APW%" && (value=="100%" ||  value.substr(0,2)>50) ){
	            label="success";
	        }
	
	        if(index=="Days#" && value<20){
	            label="success";
	        }
	
	        if(index=="Corr5" && value>85){
	            label="success";
	        }
	
	
	        if(index=="WorstØ" && value>-200){
	            label="success";
	        }
	
	        if(index=="Chann%" && value>80){
	            label="success";
	        }
	
	        html+=" <div class=\"span2\">"+index+" <span class=\"label label-"+label+"\">"+value+"</span></span></div>";
	    })
	    
	    html+="</div>";
	    $("#grid-modalPopup .searchInfoBody").prepend(html);	

	}
	
	$('body').append("<div id='superMessage'>"+superSeasonAlgoConfig.message+"</div>");
	
	$('body').append("<div id='superPro'>PRO</div>");
	

}

jQuery(function(){superSeasonAlgo(jQuery)})

// Autoload css
var css = document.createElement("link")
css.rel = "stylesheet"
css.type = "text/css"
css.href = 'https://raw.githubusercontent.com/FerX/ferx.github.io/master/sap/sap.css'

document.getElementsByTagName('head')[0].appendChild(css);


