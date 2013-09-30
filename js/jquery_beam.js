/**
 * 
 */

var spans = 1;
var prev_spans = 0;
var length;
var load_item = 1;
var row_added = 0;
var L_row_count = 1;
var load_entries = 0;
var spanLoadCount;

/** Initialize single span from start **/
/**$(document).ready(function(){
	// $("#geo").append("<p>No. of Spans =" + spans + "</p>");
	var a = document.getElementById("srow1").insertCell(-1);
	a.innerHTML="<th>d</th>";
	var b = document.getElementById("srow1").insertCell(-1);
	b.innerHTML="<th>P</th>";
	var c = document.getElementById("inrow1").insertCell(-1);
	c.innerHTML='<input id="d1"></input>';
	var d = document.getElementById("inrow1").insertCell(-1);
	d.innerHTML='<input id="P1"></input>';
});**/

/** Set div navigation buttons **/
$(document).ready(function(){
	$("#togeo").click(function(){
		$("div").hide();
		$("#geo").show();
	});
});

$(document).ready(function(){
	$("#toloads").click(function(){
		$("div").hide();
		$("#loads").show();
	});
});

$(document).ready(function(){
	$("#tores").click(function(){
		$("div").hide();
		$("#results").show();
	});
});

$(document).ready(function(){
	$("#tocombo").click(function(){
		$("div").hide();
		$("#combo").show();
	});
});

/** Set width of all tables to half screen **/
$(document).ready(function(){
	var tw = screen.width/2;
	$("table").attr("width",tw);
//	$("#loadtable").attr("height",screen.width/3);
});

/** Initialize load table before any input **/
$(document).ready(function(){
	$("input").attr("size","4");
	setLoadSpans();
	setLoadInfo();
});
	
/** Read spans value when change **/
$(document).ready(function(){
		$("#spans").change(function(){
			makeSpanTable();			
			makeLoadTables();
			$("input").attr("size","4");
			setLoadSpans();
		});
});	

/** Make new rows in load table when presses add_load **/
$(document).ready(function(){
	$("#add_load").click(function(){
		$("#loadsin").show();
		$("#add_load").hide();
		setLoadSpans();
		setLoadCase();
		setLoadType();
		setLoadInfo();
		$("input").attr("size","4");
	});
});

$(document).ready(function(){
	$("#accept_load").click(function(){
		addLoadRow();
		$("#loadsin").hide();
		$("#add_load").show();
	});
});

/** Listen for changes to loadtype **/
$(document).ready(function(){
	$(".loadtype").change(function(){
		$(this).addClass("Ltype_changed");
		setLoadInfo();
	});
});


/** Creating span geometry table based on spans entered **/			
	function makeSpanTable(){		
			// check if is a number
			var n;
			prev_spans=spans;
			var x = new String(document.getElementById("spans").value);
			if(isNaN(x)){	
				alert("No. of Spans must be a nonzero positive integer.");
				if(spans > 1){ $("#spans").val(spans); }
				else{ $("#spans").val("1"); }
			}		
			else{ n = Number(x);
				// check if zero or negative
				if(n==0 || n<0){ 
					alert("No. of Spans must be a nonzero positive integer.");
					if(spans > 1){ $("#spans").val(spans); }
					else{ $("#spans").val("1"); }
				}
				//check if integer
				else{
					if(n%1 != 0){
						alert("No. of Spans must be a nonzero positive integer.");
						if(spans > 1){ $("#spans").val(spans); }
						else{ $("#spans").val("1"); }
						}
						else{
						//check if span changed
							if(n==spans){ 
							return;
							}													
							else{
								spans = n;
								//$("#geo").append("<p>No. of Spans =" + spans + "</p>");
							}
						}		
				}
			}
			
			// finish number check
			// create span geometry input table
			// i end support prompt
			
			var table = document.getElementById("par");
			// delete extra rows when reducing number of spans
			var current_last_row = prev_spans*2+1;
			if(prev_spans>spans){
				for(var i = current_last_row; i > spans*2+1; i--){
					table.deleteRow(i);
				}
				return;
			}
			// add rows when increasing number of spans
			var t_row = 4;
			var count = 2;
			var add_rows = spans;
			if(prev_spans<spans){
				t_row=prev_spans*2+2;
				count=prev_spans+1;
				add_rows=spans-prev_spans+1;
			}		
			//tableObject.deleteRow(index)			
			for(var i = add_rows; i > 1; i--){
				
			var rowb = table.insertRow(t_row++);
			rowb.innerHTML='<td class="noborder"></td><th>'+ count +'</th><td><input id="L'+ count +'"></input></td><td><input id="E'+ count +'"></input></td><td><input id="I'+count+'"></input></td>';				
				
			count++;	
			var rowa = table.insertRow(t_row++);
			rowa.innerHTML='<td><select id="support'+count+'"><option value="pinned">Pinned</option><option value="free">Free</option><option value="slider">Slider</option></select></td>';
			
			//rowb.addClass("added");
			}
			//var v = 3;
			//$("#support"+v).css("background-color","yellow");
	}
	
	
	function makeLoadTables(){
		if(prev_spans==spans){return;}
		var table = document.getElementById("loadtable");
		if(prev_spans>spans){
			for(var i=prev_spans-spans;i>0;i--){
				table.deleteRow(-1);
				table.deleteRow(-1);
			}
			
		}
		if(prev_spans<spans){		
			for(var i=prev_spans+1;i<=spans;i++){
				var space_row = table.insertRow(-1);
				space_row.style.height="10px";
				var new_row = table.insertRow(-1);
				new_row.innerHTML='<td class="noborder"><table id="span'+i+'loads"><tr><th colspan="3">Span '+i+'</th></tr><tr><th>Load Case</th><th>Load Type</th><th>Load Info.</th></tr><tr><td id="noLoads'+i+'" colspan="5">No Loads Entered</td></tr></table></td>';				
				$("table").attr("width",screen.width/2);	
			}
		}
	}
	
	/** Sending load input to appropriate table **/		
	function addLoadRow(){
		//this function is different from makeSpanTable()
		//only span # select options change when no. of spans changes
		// IMPORTANT: loadtable id's are "spanNo"-"rowNo"-"colNo"
			// example 2-3-4 is: span 2, row 3, column 4
		var spanNo = $("#loadspan_in").val();
		
		var table = document.getElementById("span"+spanNo+"loads");
		var e = table.rows[2].cells.length;
		if(e==1){table.deleteRow(-1);}
		var rowNo = table.rows.length-1;
		//add loads from input row	
		var inrow = table.insertRow(-1);			
		var Ltype;
		var LtAbbr;
		var x = $("#loadcase_in").val();
		if(x=="dead"){Lcase="DL";}
		if(x=="live"){Lcase="LL";}
		var y = $("#loadtype_in").val();
		if(y=="point"){
			Ltype = "Point Load";
			LtAbbr = "pt";
			var a = $("#a").val();
			var p = $("#p").val();
			Linfo= 'a = <input id="'+spanNo+'-'+rowNo+'-3" value="'+a+'"</input>; P = <input id="'+spanNo+'-'+rowNo+'-4" value="'+p+'"</input>';
				}
		if(y=="uniform"){
			Ltype = "Uniform Load";
			LtAbbr = "un";
			var q = $("#q").val();
			Linfo= 'q = <input id="'+spanNo+'-'+rowNo+'-3" value="'+q+'"</input>';
				}
		//if(Ltype=="point")
		inrow.innerHTML='<td id="'+spanNo+'-'+rowNo+'-1" abbr="'+Lcase+'">'+Lcase+'</td><td id="'+spanNo+'-'+rowNo+'-2" class="loadtype" class="Ltype_changed" abbr="'+LtAbbr+'">'+Ltype+'</td><td id="loadinfo'+L_row_count+'" class="loadinfo">'+Linfo+'</td></tr>';
		//inrow.innerHTML='<td><select id="loadcase'+L_row_count+'"><option value="dead">DL</option><option value="live">LL</option><select></td><td id="loadspan'+L_row_count+'" class="loadspan" class="new_loadspan"></td><td><select id="loadtype_in" class="loadtype" class="Ltype_changed"><option value="point">Point Load</option><option value="uniform">Uniform Load</option></select></td><td id="loadinfo'+L_row_count+'" class="loadinfo"></td></tr>';
		$("input").attr("size","4");
		row_added=1;
		L_row_count++;
		}
	
	/** set spans in select of load table **/
	function setLoadSpans(){
		$("#loadspan_in").empty();
		for(var i = 1;i<=spans;i++ ){
			$("#loadspan_in").append('<option value="'+i+'">'+i+'</option>');
		}
		$(".new_loadspan").addClass("loadspan");
		$("select").removeClass("new_loadspan");
		row_added=0;
		return;
		
		/**if(prev_spans==spans){return;}
		if(spans>prev_spans){
		for(var i = spans-(spans-prev_spans)+1;i<=spans;i++ ){
			$(".loadspan").append('<option value="'+i+'">'+i+'</option>');
		}
		}
		if(spans<prev_spans){
			for(var i = prev_spans-spans;i>0;i-- ){
				$(".loadspan > option:last-child").remove();
			}
			}**/
		
	}

	function setLoadCase(){
		$("#loadcase_in").empty();
		$("#loadcase_in").append('<option value="dead">DL</option><option value="live">LL</option><option value="wind">WL</option>');
		
	}
	
	function setLoadType(){
		$("#loadtype_in").empty();
		$("#loadtype_in").append('<option value="point">Point Load</option><option value="uniform">Uniform Load</option>');
	}
	
	function setLoadInfo(){
		var cur_type = $("#loadtype_in").val();
		$("#loadinfo_in").empty();
		if(cur_type == "point"){
			$("#loadinfo_in").append('a =<input id="a"></input>; P =<input id="p"></input>');
		}
		if(cur_type == "uniform"){
			$("#loadinfo_in").append('q =<input id="q"></input>');
		}
		
	}
	
	
	