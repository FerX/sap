/**
 * superSeasonAlgo
 * 
 * version 1.x
 * 
 * Author: FerX
 * Additional features : Subbacqueo
 * 
 * changelog
 * 
 *
 * 1.x aggiunta possibilità di selezionare le righe per il calcolo. Aggiunto config per anni percentile low e high 
 * 1.x aggiunte righe con dati statistici calcolati su un numero di anni selezionabile. Nomi funzioni e dati in inglese. 
 * 1.3 agganciatata scritta PRO con il logo, configurazione esterna
 * 
**/


//RB Nomi in Camel Case
//RB aggiunta possibilità di selezionare le righe per il calcolo. Aggiunto config per anni percentile low e high 
//RB aggiunte righe con dati statistici calcolati su un numero di anni selezionabile. Nomi funzioni e dati in inglese. 

/*
var SAP = {
	slogan : 'Slogan',
	showPro: false  
};

var configSAP = {
	slogan : 'Slogan',
	showPro: false  
};
var configBT = {
	years : 15,
	high_perc : .95,
	low_perc : .05,
	high_perc_name : "95°perc",
	low_perc_name : "5°perc",
};
*/	


//Backtest calculated data feature
	
// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);

//calculate the quantile q of data listed in an array arr
const quantile = (arr, q) => {
	const sorted = asc(arr);
	const pos = (sorted.length - 1) * q;
	const base = Math.floor(pos);
	const rest = pos - base;
	if (sorted[base + 1] !== undefined) {
	return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
	} else {
	return sorted[base];
	}
};

//BACKTEST FEATURES
//lower percentile (default 5%)
const qLow = arr => quantile(arr, configBT.low_perc);

//BACKTEST FEATURES
//median (50%)
const q50 = arr => quantile(arr, .50);
const median = arr => q50(arr);

//BACKTEST FEATURES
//higher percentile (default 95%)
const qHigh = arr => quantile(arr, configBT.high_perc);

//BACKTEST FEATURES
//write the column array "data" in the column "colonna"  of the table-array "table" passed with header
function WriteTable(table, data, colonna) {

	riga=1; //rows 0 is the table header
	for (let element of data) {

		for (let key in element) {
			table.rows[riga].cells[colonna].innerHTML=element.data;
		}
		riga++;
	}
}

//BACKTEST FEATURES
//calculate the statistical data of the backtest table
function CalculateData() {

	//create table array for calculation
	var MyTableArray = [];

	//create a column array for calculated data 
	var CalculatedData = new Array(7); //MIN,MAX,AVERAGE,STD_DEV,HIGH_PERC,50°PERC,LOW_PERC

	//Reference to the tables in the SA backtest page. 
	var BtTables = document.getElementsByTagName("table");

	//The table to be copied is the second one
	var BtDetailTable = BtTables[1];

	//Get the collection of checkboxes of the rows
	var BtCheckRow = document.getElementsByClassName("check_row");

	//Calculate the number of rows excluding the rows of the calculated data + header (8 total) (this function is executed once the additional rows are already created)
	var RowLengthMax = BtDetailTable.rows.length-8;

	//Read how many rows of the table the user want to analyze
	//var rowLength = parseInt(document.getElementById("myText").value);
	//var RowLength=configBT.years;
	var RowLength=RowLengthMax;
	
	//if the specified rows are greater than the existing, the rows are blocked to the maximum 
	//if (RowLength>RowLengthMax) {
	//	RowLength=RowLengthMax;
	//}

	//copy the backtest table to the data table-array (excluding headers and calculated data, row by row)
	for (var i = 8; i < (RowLength+8); i++){

		//take the collection of the cells of the row   
		var RowCells = BtDetailTable.rows.item(i).cells;

		//Count how many cells there are
		var CellLength = RowCells.length;

		//if the row is selected by the checkbox, copy the row cell-by-cell in a new row array
		if(BtCheckRow[i-8].checked){
			var MyTableRow = new Array (CellLength);
			for(var j = 0; j < CellLength; j++){	
				MyTableRow[j] = RowCells.item(j).innerText;
			}
			//push the copied row in the data table-array
			MyTableArray.push(MyTableRow);
		}
	}

	//clean the table
	for (i=1;i<13;i++)
	{
		let CalculatedData = [
		{ data: ""},
		{ data: ""},
		{ data: ""},
		{ data: ""},
		{ data: ""},
		{ data: ""},
		{ data: ""}
		];
		
		//write the column in the table of the page
		WriteTable(BtDetailTable, CalculatedData, i);
	}
	
	
	//write the table
	if (MyTableArray.length!==0){

		// process the columns with numeric data
		let ColumnsTobeProcessed = [2,4,5,6,7,9,11,12];
	
		for (let c of ColumnsTobeProcessed) {
	
			//convert the text content of every cell of the column to float
			var Col = MyTableArray.map(function(value,index) { return value[c]; }).map(function (x) {return parseFloat(x); });
			
			
			//calculate the minimum and round to 2 decimal digit
			var ValMin=Math.min(...Col).toFixed(2);
	
			//calculate the maximum and round to 2 decimal digit
			var ValMax=Math.max(...Col).toFixed(2);
	
			//calculate the average and round to 2 decimal digit
			var ValMed=0;
			for (var n of Col) {
			ValMed+=n;	
			}
			ValMed=parseFloat(ValMed/Col.length).toFixed(2);
	
			//calculate the standard deviation and round to 2 decimal digit
			var ValDevStd=0;
			var ArrayAux=[...Col];//copia l'array dei valori
			for (var m of ArrayAux) {
			m-=ValMed;
			m=Math.pow(m,2);
			ValDevStd+=m;
			}
			ValDevStd/=(Col.length-1);
			ValDevStd=Math.sqrt(ValDevStd);
			ValDevStd=parseFloat(ValDevStd).toFixed(2);
	
			//higher percentile 
			var ValHighPerc=qHigh(Col).toFixed(2);
	
			//median (50 percentile)
			var ValMedian=q50(Col).toFixed(2);
	
			//lower percentile 
			var ValLowPerc=qLow(Col).toFixed(2);
	
			//prepare the column array with calculated data 
			let CalculatedData = [
			{ data: ValMin},
			{ data: ValMax},
			{ data: ValMed},
			{ data: ValDevStd},
			{ data: ValHighPerc},
			{ data: ValMedian},
			{ data: ValLowPerc}
			];
			
			//write the column in the table of the page
			WriteTable(BtDetailTable, CalculatedData, c);
		}
	
		// process the columns with dates
		ColumnsTobeProcessed = [1,3,8,10];
	
		for (let c of ColumnsTobeProcessed) {
			
			//align the year of the dates to allow a correct comparison by month and day. "-" dates are set to 0.
			Col = MyTableArray.map(function(value) { return value[c]; }).map(function (x) {
	
				if (x!='-')
				{
					var d = new Date(x);
					d.setFullYear(2000);
					return d;
				}
				
				else return 0;//if the date is "-"
	
			});
	
			//remove the dates "-" 
			for( i = 0; i < Col.length; i++){ 
				if ( Col[i] === 0) {
					Col.splice(i, 1); 
				}
			}
	
			//calculate the minimum and round to 2 decimal digit
			DataMin=new Date(Math.min(...Col));
			StrMin = DataMin.getDate()+'/'+(DataMin.getMonth()+1);
	
			//calculate the maximum and round to 2 decimal digit
			DataMax=new Date (Math.max(...Col));
			StrMax = DataMax.getDate()+'/'+(DataMax.getMonth()+1);
	
			//other statistics to be valuated later if necessary for dates
			
			//prepare the column array with calculated data 
			let CalculatedData = [
				{ data: StrMin},
				{ data: StrMax},
			];
	
			//write the column in the table of the page
			WriteTable(BtDetailTable, CalculatedData, c);
		}	
	
	}
	
	//write the message of the calculated data
	//document.getElementById("anni").innerHTML = "Sono stati processati " + (rowLength) +" anni.";
}	

function SetData(yy) {
	
	//Get the collection of checkboxes of the rows
	var BtCheckRow = document.getElementsByClassName("check_row");
	
	i=0;
	for (c of BtCheckRow)
	{
		c.checked=false;
		if ((i)<yy) {
			c.checked=true;
		}
		i++;
	}
}

function superSeasonAlgo($){
	console.log("start Super superSeasonAlgo")
	
	let config = {
		slogan: '',
		showPro: true
	}
	
	if(SAP && SAP.slogan){
		config.slogan = configSAP.slogan
	}
	
	if(SAP && SAP.showPro!==undefined){
		config.showPro = configSAP.showPro
	}
	
	const url = window.location.pathname
	const urlWithPopUp = ["/system/strategies/","/system/strategies/recommendation","/system/strategies/scanner"]

	//Backtest URL
	const urlWithBacktest = ["/system/multi-analyze/backtest/"]

	//Condition to inject the backtest code 
	if(url.includes(urlWithBacktest)){
		console.log("Activate inject data in Backtest")
		injectDataInBackTest()
	}
	
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
	
	//BACKTEST FEATURES
	function injectDataInBackTest(){
		
		
		//BACKTEST FEATURES
		//create  as many rows as they are in the table-array data
		//created rows are inserted at the start of "table" in the document, immediately after the header
		//the content of data is used as column header of the new rows
		//the other cells are left blank.
		//13 cells in total are created per each rows
		function GenerateTable(table, data) {
			
			//insert the rows for calculated data
			for (let element of data) {
		
				//skip the header
				let row = table.insertRow(1);
		
				//column header
				for (key in element) {
					let cell = row.insertCell();
					cell.style.textAlign = 'center';
					cell.style.fontStyle = 'italic';
					cell.style.fontWeight = 'bold';
					let text = document.createTextNode(element[key]);
					cell.appendChild(text);
				}
		
				//blank cells
				for (let step = 0; step < 12; step++) {
					let cell = row.insertCell();
					cell.style.textAlign = 'center';
				}
				
			}
			
			//add a checkbox for each row of the table to select the rows to be processed
			for (step = 8;step < table.rows.length; step++){
				
				var tr = table.rows[step];
				var td = document.createElement('td');
		    	var BtCheckBox = document.createElement("INPUT");
			    BtCheckBox.setAttribute("type", "checkbox");
			    BtCheckBox.setAttribute("class", "check_row");
			    
			    if(step-8<configBT.years){
			    	BtCheckBox.setAttribute("checked", "true");	
			    }
			    
			    td.appendChild(BtCheckBox);
				tr.appendChild(td);
		
			}
			
			
		}
		
		//create a textbox to specify the amount of data to use for calculation
		//clicking the button, the function to calulate the statistical data is invoked
		
		/*
		var html='<div class="row SSA_BT_Input" style="text-align:center;">';
			html+='<p>Specifica gli anni su cui fare i calcoli</p>'
			html+='<input type="text" id="myText" value="15">';
			html+='<button onclick="calculate_data()">Aggiorna</button>'
			html+='<p id="anni"></p>'
			html+='<p>RB1.10</p>'
			html+='</div>';
		*/
		
		var html='<div class="row SSA_BT_Input" style="text-align:center;">';
			html+='<p>Specifica gli anni su cui fare i calcoli</p>'
			html+='<p>'
			html+='<button onclick="SetData(5)">Ultimi 5</button>'
			html+='<button onclick="SetData(10)">Ultimi 10</button>'
			html+='<button onclick="SetData(15)">Ultimi 15</button>'
			html+='<button onclick="SetData(99)">Tutti</button>'
			html+='<button onclick="SetData(0)">Pulisci</button>'
			html+='</p>'
			html+='<p></p>'
			html+='<p><button onclick="CalculateData()">Aggiorna</button></p>'
			html+='<p>RB1.10</p>'
			html+='</div>';
		

		//select the backtest chart as a refernce in the DOM
		var BtChart = document.getElementById("snippet--backtest-chart");
		
		//insert the text box after the chart
		$(html).insertAfter(BtChart);

		//prepare the header column of the table for calculated data
		let CalculatedDataHeader= [
			{ name: configBT.low_perc_name},
			{ name: "MEDIANA"},
			{ name: configBT.high_perc_name},
			{ name: "DEV_STD"},
			{ name: "MED"},
			{ name: "MAX"},
			{ name: "MIN"}
		];

		//Reference to the tables in the SA backtest page. 
		var BtTables = document.getElementsByTagName("table");

		//The table to be copied is the second one
		var BtDetailTable = BtTables[1];

		//generate the table in the document
		GenerateTable(BtDetailTable, CalculatedDataHeader);

		//fill the table with calculated data based on default specified years
		CalculateData();

	}
	
	
	if(config.slogan){
	    $('body').append("<div id='superMessage'>"+config.slogan+"</div>");	
	}
	if(config.showPro){
	    $('body a.brand').append("<div id='superPro'>PRO</div>");
	}
	

}

jQuery(function(){superSeasonAlgo(jQuery)})

// Autoload css
var css = document.createElement("link")
css.rel = "stylesheet"
css.type = "text/css"
css.href = 'https://cdn.jsdelivr.net/gh/FerX/sap@main/sap.css'

document.getElementsByTagName('head')[0].appendChild(css);


