/**
 * 
 */

	var L_span; //Span length array arranged by span
	var EI_span; //E*I array arranged by span
	
	// Master arrays; One for each Load Type
		// Key: arrayName[loadCase][parameter]
			// loadCase: 0-DL; 1-LL;
			// parameter: 0-"caseName"; 1-Lindex; 2-EIindex; 3-kTarget; 4-s_key; 5-U; 6-P;
			// 				7-V; 8-M; 9-D; 10-K_big; 11-P_big;
	var POINT;
	
			// parameter: 0-"caseName"; 1-Lindex; 2-EIindex; 3-kTarget; 4-s_key; 5-U; 6-P; 7-P_o
	var UNIF;
	
	
	/** Run Analysis when click run **/
	$(document).ready(function(){
		$("#run").click(function(){
			
			initializeAll();
			//alert("debug: reached");
			gatherGeometry();
			gatherPointLoads(0);
			//gatherUnifLoads(0);
			solvePointReactions(0);
			//alert("debug: reached");
			//solveUnifReactions(0);
			getBigKP(0);
			solvePointVMD(0);
			//alert("debug: reached");
			
			printResults();
		});
	});
	
	function initializeAll(){
		// initialize global variables		
		L_span=createArray(spans);
		EI_span=createArray(spans);
		POINT = createArray(2,14);
		POINT[0][0] = "DL";
		POINT[1][0]="LL";
		UNIF = createArray(2,8);
		UNIF[0][0] = "DL";
		UNIF[1][0]="LL";
	}
	
	function solvePointReactions(LC_index){
		var Lindex=POINT[LC_index][1];
		var EIindex=POINT[LC_index][2];
		var kTarget=POINT[LC_index][3];
		var P=POINT[LC_index][6];
		//alert("Debug Reached; P ="+P);
	var K=structureMatrix(Lindex, EIindex);
	 
	//alert("Debug Reached");
	// get pt_K_small
	var K_small = abbrevK(K, kTarget);
	var mat = toMatrix(K_small);
	 /** for(var i=0;i<mat.length;i++){
			alert("K_small="+mat[i]);
			} **/
	//alert("Debug Reached");
	//alert("P_pt_DL="+P_pt_DL);
	var P_small = abbrevP(P, kTarget);
	//alert("Debug Reached");
	//alert("P_small="+P_small);
	var U_small=luEvaluate(K_small, P_small);
	var x = K[1].length-1;
	//alert("x="+x);
	var U = inflateU(U_small, kTarget, x);
	//alert("U="+U);
	var P=yaleXvector(K, U);
	//alert("P="+P);
	POINT[LC_index][6]=P;
	}
	
	function solveUnifReactions(LC_index){
		var Lindex=UNIF[LC_index][1];
		var EIindex=UNIF[LC_index][2];
		var kTarget=UNIF[LC_index][3];
		var P=UNIF[LC_index][6];
		var P_o=UNIF[LC_index][7];
		alert("P_o="+P_o);
		//alert("Lindex = "+Lindex);
		//alert("EIindex = "+EIindex);
	var K=structureMatrix(Lindex, EIindex);
	
	//for(var i=0;i<K.length;i++){
	//alert("K = "+K[i]);
	//}
	// get pt_K_small
	var K_small = abbrevK(K, kTarget);
	//alert("K_small="+K_small);
	//alert("P_pt_DL="+P_pt_DL);
	var P_comb = matrixSub(P,P_o);
	//alert("P_comb = "+P_comb);
	var P_small = abbrevP(P_comb, kTarget);
	//alert("P_small="+P_small);
	var U_small=luEvaluate(K_small, P_small);
	alert("U_small="+U_small);
	var x = K.length;
	//alert("x="+x);
	var U = inflateU(U_small, kTarget, x);
	//alert("U="+U);
	var kxu=matrixMultiply(K, U);
	alert("kxu="+kxu);
	var P=matrixAdd(kxu,P_o);
	alert("P="+P);
	UNIF[LC_index][6]=P;
	}
	
	function getBigKP(LC_index){
		var P=POINT[LC_index][6];
		var Lindex=POINT[LC_index][1];
		var EIindex=POINT[LC_index][2];
		//var sKey=POINT[LC_index][4];
		var L_big = new Array(); // length of elements after each member is split into 30 elements
		var EI_big = new Array();
		var P_big = new Array();
		// build L_big and EI_big and P_big
		var j=0;
		var pct=0;
		var e_ct=0;
		//alert("debug: reached");
		for(var i=0;i<spans;i++){
			var L_cur = L_span[i];
			var EI_cur = EI_span[i];
			//alert("current L = "+L_cur);
			var n = 20;
			var z = n;
			var spanTrack=0;
			while(n>0){
				//alert("debug: reached, this segment = "+Lindex[j]);
				spanTrack+=Lindex[j];
				var x=Math.round(spanTrack/L_cur*z);
				//alert("debug: x= "+x);

				if(x==z){ //last part of current span
					//alert("debug: reached");
					for(var h=0;h<n;h++){
						EI_big[e_ct]=EI_cur;
						L_big[e_ct++]=Lindex[j]/n;	
						if(h==0){
							P_big.push(P[pct++], P[pct++]);
						}
						else{
							P_big.push(0, 0);
						}
					}
					j++;
					break;
				}
				else{
					//alert("debug: reached");
					var e = Math.round(Lindex[j]/L_cur*z);
					n-=e;
					for(var h=0;h<e;h++){
						EI_big[e_ct]=EI_cur;
						L_big[e_ct++]=Lindex[j]/e;
						if(h==0){
							P_big.push(P[pct++], P[pct++]);
						}
						else{
							P_big.push(0, 0);
						}
					}
				}
				j++;
			}
		}
		P_big.push(P[pct++], P[pct++]);

		//alert("debug: reached, L_big = "+L_big);
		//alert("debug: reached, EI_big = "+EI_big);
		alert("P_big. = "+P_big);
		// finished building EI_big and L_big and P_big
		// now create k_big
		alert("P_big.length = "+P_big.length);
		var K_big;
		K_big=structureMatrix(L_big, EI_big);
		//for(var q=0;q<8;q++){
			
		//	}
		var y = K_big[1].length-1;
		//var h = EI_big.length;
		alert("debug: reached K_big.length= "+y);
		//alert("debug: reached EI_big.length= "+EI_big.length);
		//alert("debug: reached L_big.length= "+L_big.length);

		//alert("debug: reached, K_big values = "+K_big[0]);
		POINT[LC_index][10]=K_big;
		POINT[LC_index][11]=P_big;
		POINT[LC_index][12]=L_big;
		POINT[LC_index][13]=EI_big;
	}	
		
	function solvePointVMD(LC_index){
		var K_big=POINT[LC_index][10];
		var P_big=POINT[LC_index][11];
		var L_big=POINT[LC_index][12];
		var EI_big=POINT[LC_index][13];
		var D;
		D=luEvaluate(K_big, P_big);
		//alert("D = "+D);
		/** var mat = toMatrix(K_big);
		  for(var i=0;i<mat.length;i++){
				alert("K_big="+mat[i]);
				} **/
		var x = D.length;
		
		//alert("debug: reached D.length = "+x);
		//alert("debug: reached D = "+D);
		var V = new Array();
		var M = new Array();
		var e_total = P_big.length/2-1;
		for(var i=0;i<e_total-1;i++){
			var k = twoStiffness(L_big[i]);
			var eik = scalarXarray(EI_big[i]/L_big[i],k);
			var u = [D[i*2],D[i*2+1],D[i*2+2],D[i*2+3]];
			var s = matrixMultiply(eik, u);
			V[i]=s[0];
			M[i]=s[1];
		}
		// last element will include both i and j nodes
		var last = e_total-1;
		var k = elementStiffness(L_big[last]);
		var eik = scalarXarray(EI_big[last]/L_big[last],k);
		var u = [D[last*2],D[last*2+1],D[last*2+2],D[last*2+3]];
		var s = matrixMultiply(eik, u);
		V[last]=s[0];
		M[last]=s[1];
		V[last+1]=s[2];
		M[last+1]=s[3];
		//POINT[LC_index][4]=K_big;
		POINT[LC_index][7]=V;
		POINT[LC_index][8]=M;
		POINT[LC_index][9]=D;
	}
	
	function gatherGeometry(){
		// gather L, E, I
		for(var i=0; i<spans; i++){
			var s = i+1;
			L_span[i]=Number(document.getElementById("L"+s).value);
			var x = Number(document.getElementById("E"+s).value)*Number(document.getElementById("I"+s).value);
			EI_span[i]=x;
		}
	}
	
	function gatherPointLoads(LC_index){
		var Lindex = new Array();
		var EIindex = new Array();	
		var kTarget = new Array();
		var P = new Array();
		var sKey = new Array(); // for keeping track of what row is a support
		// var K = new Array();
		// var U = new Array();
		var kRowCt = 0;	
		var LoadCase=POINT[LC_index][0];
		// gather first support condition
		// for now assume all supports pinned
		var cur_s = $("#support1").val();
		if(cur_s=="pinned"){		
			kTarget.splice(0, 0, 1);	
		}
		
		// No unknown displacements if "fixed"
		
		if(cur_s=="free"){	
			kTarget.splice(0, 0, 0, 1);
		}
		
		if(cur_s=="slider"){		
			kTarget.splice(0, 0, 0);
		}
		sKey.splice(0, 0, 0,1);
		kRowCt = 2;
		// Gather Loads and configure elements span by span
		//var cur_element = 0;

		for(var v=0;v<spans;v++){
			var point_count = 0; // keeps track of how many point loads were entered in current span
			var cur_L = L_span[v];
			var cur_EI = EI_span[v];
			var a_array = new Array();  // array of 'a' values for 'point loads' for current span
			var a_p_array = new Array(); // array of 'P' vals with matching 'a' vals for current span
			
			var cur_span = v+1;

			var cur_rows = document.getElementById("span"+cur_span+"loads").rows;
			var total_rows = cur_rows.length-2;
			for(var i=0;i<total_rows;i++){
				if(cur_rows[2].cells.length==1){continue;}
				cur_row = i+1;
				//get load case
				var Lcase = document.getElementById(cur_span+"-"+cur_row+"-1").abbr;
						
				//get load type
				var Ltype=document.getElementById(cur_span+"-"+cur_row+"-2").abbr;
				
				if(Ltype=="pt" && Lcase==LoadCase){	 //collect 'a' values for point loads				
					var a = Number(document.getElementById(cur_span+"-"+cur_row+"-3").value);
					var p = Number(document.getElementById(cur_span+"-"+cur_row+"-4").value);
					a_array[point_count]=a;
					a_p_array[point_count++]=[a,p];
					var t=kTarget.length;
					kTarget.splice(t, 0, kRowCt, kRowCt+1);
					kRowCt+=2;
					}
				
			}
			
			// Completed gathering load info for current span
			// Build L and P arrays
			// check if any point loads this span
//alert("point_count ="+point_count);			
			if(point_count!=0){ //one or more point loads in this span
				// sort a_array
				a_array.sort(function(a,b){return a-b});
				var p_array = createArray(point_count); // create 'P' array to match sorted 'a' array
				for(var i=0;i<point_count;i++){
					var x = a_array.indexOf(a_p_array[i][0]);
					p_array[x]=a_p_array[i][1];			
				}

				// create element L array for current span using sorted 'a' array
				var cur_pt_L = createArray(point_count+1); // array of element lengths for point load   
										// config for current span to be spliced into parent array
				cur_pt_L[0]=a_array[0];
				for(var i=1;i<point_count;i++){
					cur_pt_L[i]=a_array[i]-a_array[i-1];
				}
				cur_pt_L[point_count]=cur_L-a_array[point_count-1];

				// insert zeros in appropriate locations of 'P' array
				p_array.splice(point_count,0,0);//zero at end of p_array
				for(var i=point_count-1;i>=0;i--){
					p_array.splice(i,0,0);//insert zero before each point load
				}
				p_array.splice(0,0,0);// insert zero at beginning of p_array (two zeros up front)
			}
			else{//no point loads entered for this span
				
				var p_array = [0,0];
				var cur_pt_L = [cur_L];				
			}
			// set up EIindex_pt_DL 
			for(var i=0;i<cur_pt_L.length;i++){
				var c = EIindex.length;
				EIindex.splice(c, 0, cur_EI);
			}
			// add current span element length for point to stucture element L array
			for(var i=0;i<cur_pt_L.length;i++){
				var z = Lindex.length;
				Lindex.splice(z, 0, cur_pt_L[i]);
			}
			//add current span p_array to P
			for(var i=0;i<p_array.length;i++){
				var d = P.length;
				P.splice(d, 0, p_array[i]);
			}
			
			
			//alert("debug: checkpoint reached");
			//get next support
			var s = cur_span+1;
			cur_s = document.getElementById("support"+s).value;
			//alert("next support: "+cur_s);
			var c=sKey.length;
			sKey.splice(c, 0, kRowCt, kRowCt+1);
			if(cur_s=="pinned"){
				var t=kTarget.length;
				kRowCt++;
				kTarget.splice(t, 0, kRowCt);
				kRowCt++;
			}
			
			// No unknown displacements if "fixed"
			if(cur_s=="fixed"){	
				kRowCt+2;
			}
			
			if(cur_s=="free"){	
				var t=kTarget.length;
				kTarget.splice(t, 0, kRowCt, kRowCt+1);
				kRowCt+2;
			}
			
			if(cur_s=="slider"){
				var t=kTarget.length;
				kTarget.splice(t, 0, kRowCt);
				kRowCt+2;
			}
				
		}
		
		//add last two zeros at end of P_pt_DL
		var d = P.length;
		P.splice(d, 0, 0,0);		
		//now have complete Lindex, P, EIindex, kTarget
		POINT[LC_index][1]=Lindex;
		POINT[LC_index][2]=EIindex;
		POINT[LC_index][3]=kTarget;
		POINT[LC_index][4]=sKey;
		POINT[LC_index][6]=P;
	}
	
	function gatherUnifLoads(LC_index){
		//var Lindex = new Array();
		//var EIindex = new Array();	
		var kTarget = new Array();
		var P = new Array((spans+1)*2);
		var P_o = new Array((spans+1)*2);
		// Initialize P_o with all zeros
		for(var i=0;i<P_o.length;i++){
			P_o[i]=0;
		}
		// var K = new Array();
		// var U = new Array();
		var kRowCt = 0;	
		var LoadCase=UNIF[LC_index][0];
		// gather first support condition
		// for now assume all supports pinned
		var cur_s = $("#support1").val();
		if(cur_s=="pinned"){		
			kTarget.splice(0, 0, 1);	
		}
		
		// No unknown displacements if "fixed"
		
		if(cur_s=="free"){	
			kTarget.splice(0, 0, 0, 1);
		}
		
		if(cur_s=="slider"){		
			kTarget.splice(0, 0, 0);
		}
		kRowCt = 2;
		// Gather Loads and configure elements span by span
		var cur_element = 0;
		var point_count = 0; // keeps track of how many point loads were entered in current span
		
		for(var j=0;j<spans;j++){
			var cur_L = L_span[j];
			var cur_EI = EI_span[j];
			var loaded_span = 0;
			var cur_span = j+1;
			var cur_rows = document.getElementById("span"+cur_span+"loads").rows;
			var total_rows = cur_rows.length-2;
			for(var i=0;i<total_rows;i++){
				if(cur_rows[2].cells.length==1){continue;}
				cur_row = i+1;
				//get load case
				var Lcase = document.getElementById(cur_span+"-"+cur_row+"-1").abbr;
						
				//get load type
				var Ltype=document.getElementById(cur_span+"-"+cur_row+"-2").abbr;
				if(Ltype=="un" && Lcase==LoadCase){	 //collect 'q' values for point loads
					loaded_span++;
					var q = Number(document.getElementById(cur_span+"-"+cur_row+"-3").value);
					// Calculate fixed end forces
					// 'i' end
					var shear = -q*cur_L/2;
					var moment_j = q*Math.pow(cur_L,2)/12;
					var moment_i = -moment_j;
					// add fixed end forces to P_o
					P_o[cur_span*2-2]+=shear;
					P_o[cur_span*2-1]+=moment_i;
					P_o[cur_span*2]+=shear;
					P_o[cur_span*2+1]+=moment_j;
					}
				
			}
			
			// Completed gathering load info for current span	
			//alert("debug: checkpoint reached");
			//get next support
			var s = cur_span+1;
			cur_s = document.getElementById("support"+s).value;
			
			if(cur_s=="pinned"){
				var t=kTarget.length;
				kRowCt++;
				kTarget.splice(t, 0, kRowCt);
				kRowCt++;
			}
			// No unknown displacements if "fixed"
			if(cur_s=="fixed"){	
				kRowCt+2;
			}
			
			if(cur_s=="free"){	
				var t=kTarget.length;
				kTarget.splice(t, 0, kRowCt, kRowCt+1);
				kRowCt+2;
			}
			
			if(cur_s=="slider"){
				var t=kTarget.length;
				kTarget.splice(t, 0, kRowCt);
				kRowCt+2;
			}
		}
		//finished going through all spans
		// for uniform loading 'P' is all zeros
		for(var i=0;i<P.length;i++){
			P[i]=0;
		}
		//alert("P = "+P);
		//now have complete Lindex, P, EIindex, kTarget
		UNIF[LC_index][1]=L_span;
		UNIF[LC_index][2]=EI_span;
		UNIF[LC_index][3]=kTarget;
		UNIF[LC_index][6]=P;
		UNIF[LC_index][7]=P_o;
	}
	
	function abbrevK(K, target){
		var b = target.length;
		var A=new Array();
		var IA=new Array(b+1);
		IA[b]=0;
		var JA=new Array();
		var small_k = [A,IA,JA];
		for(var i = 0; i < b; i++){
			var q = target[i];
			for(var j = 0; j < b; j++){
				var t = target[j];
				// get appropriate value from K
				var x=yaleGet(K,q,t);	
				//build small_k in Yale format
			//Reference: small_k[i][j] = K[q][t];
				small_k=yaleInsert(small_k,x,i,j);
			}
		}
		return small_k;
	}
			
	function abbrevP(P, target){
		var b = target.length;
		var small_p = createArray(b);
		for(var i = 0; i < b; i++){
			var q = target[i];
			small_p[i] = P[q];
			}
		
		return small_p;
	}	
	
	function inflateU(small_u, target, N){
		var U = createArray(N);
		var j = 0;
		for(var i=0; i<N; i++){			
			if(i==target[j]){
				U[i]=small_u[j];
				j++;
			}
			else{
				U[i]=0;
			}
		}
		return U;
	}
	
	
	function printResults(){
		// For now, just print P_pt
		$("#noRun").remove();
		var P_pt=POINT[0][6];
		var f = P_pt.length;
		var z = 20; //No. of elements per span
		table = document.getElementById("res_table");
		for(var i=0; i<f;i++){
			var nRow = table.insertRow(-1);
			var n = P_pt[i].toFixed(3);
			nRow.innerHTML="<td>"+n+"</td>";			
		}
		var V=POINT[0][7];
		var M=POINT[0][8];
		var D=POINT[0][9];//includes vertical and rotational displacement
		var a = V.length;
		// write VMD values to table
		var table2 = document.getElementById("vmd_table");
		var j=0;
		while(j<a){
			var nRow = table2.insertRow(-1);
			var v_data = V[j].toFixed(3);
			var m_data = M[j].toFixed(3);
			var d1_data = D[j*2].toFixed(3);
			var d2_data = D[j*2+1].toFixed(3);
			if(j==0 || j%z==0){
				var num = j/z+1;
				nRow.innerHTML="<td>Span "+num+"</td><td>"+v_data+"</td><td>"+m_data+"</td><td>"+d1_data+"</td><td>"+d2_data+"</td>";
				j+=z/4;
			}
			else{
				nRow.innerHTML='<td class="noborder"></td><td>'+v_data+"</td><td>"+m_data+"</td><td>"+d1_data+"</td><td>"+d2_data+"</td>";			
				if(j%z==z-1){j+=1;}
				if(j%z==3*z/4){j+=(z/4-1);}
				else{j+=z/4;}
			}
		}
		$("#vmd_table").show();
	}
	
	