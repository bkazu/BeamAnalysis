/**This file will contain all mathematical functions
 * 
 **/
	
	// make xRows and xCols "global"
	var xRows;
	var xCols;
	
	var aRows;
	var aCols;
	var bRows;
	var bCols;
	
	var kRows;
	var kCols;
	
	var K_s;
	var u_global;
	var EI_values;
	

	function createArray(length) {
	    var arr = new Array(length || 0),
	        i = length;

	    if (arguments.length > 1) {
	        var args = Array.prototype.slice.call(arguments, 1);
	        while(i--) arr[length-1 - i] = createArray.apply(this, args);
	    }

	    return arr;
	}	
	
	function scalarXarray(scalar, array){
		var n = array.length;
		var m =	array[0].length;
			
		for(var i = 0; i < n; i++){
			for(var j = 0; j < m; j++){
				array[i][j] *= scalar;
			}
		}
		
		return array;
	}
	
	function matrixMultiply(a, b) {
		var i_a = a.length;
		var i_b = b.length;
		var j_b = b[0].length;
		var C;
		//alert("i_b="+i_b);
		if(isNaN(j_b)){//b is a vector
			j_b = 0;
			C = createArray(i_a);
				for(var w=0; w<i_a;w++){
					var dummy = 0;
					for(var i=0; i<i_b; i++){
						dummy=dummy + b[i]*a[w][i];
					}			
					C[w] = dummy;
				}				
			}
		else{
		C = createArray(i_a, j_b);
		
		// Check if matrices are compatible
		// if(j_a != i_b){
		// 	double[][] zero = {{0},{0}};
		// }
		
		// Main matrix multiplication code
		for(var v=0; v<j_b; v++){
			for(var w=0; w<i_a;w++){
				var dummy = 0;
				for(var i=0; i<i_b; i++){
					dummy=dummy + b[i][v]*a[w][i];
				}
					
				C[w][v] = dummy;
			}	
		}
		}
		return C;
		
	}
	
	function yaleXvector(a, b) {
		var i_a = a[1].length-1;
		var i_b = b.length;
		var C;
		//alert("i_b="+i_b);
			C = createArray(i_a);
				for(var w=0; w<i_a;w++){
					var dummy = 0;
					for(var i=0; i<i_b; i++){
						var x=yaleGet(a,w,i);
						dummy=dummy + b[i]*x;
					}			
					C[w] = dummy;
				}				
		return C;
		
	}
	
	function yaleInsert(yaleMat,entry, i, j){
		var A = yaleMat[0];
		var IA = yaleMat[1];
		var JA = yaleMat[2];
			if(isNaN(IA[i])){ //means this is the first nonzero in this row
				if(entry==0){return yaleMat;}
				for(var n=i+1;n<=IA.length-1;n++){
					if(IA[n]>=0){break;}
				}
				A.splice(IA[n], 0, entry );
				JA.splice(IA[n], 0, j);
				IA[i]=IA[n];
				for(var c=n; c<IA.length; c++){
					IA[c]=IA[c]+1;
				}
			}
			else{ //other nonzeros exist in same row
				for(var n=i+1;n<IA.length;n++){
					if(IA[n]>=0){break;}
				}
				var segment = JA.slice(IA[i],IA[n]);
				var Atarget = segment.indexOf(j);
				if(Atarget==-1){//no entry in this location
					//not the only value in this row
					if(entry==0){return yaleMat;}
					segment.push(j);
					segment.sort();
					var x = segment.indexOf(j);
					var place = IA[i]+x;
					A.splice(place,0, entry);
					JA.splice(place,0,j);
					for(var c=i+1; c<IA.length; c++){
						IA[c]=IA[c]+1;
					}
				}
				else{ //replace existing entry
					if(entry!=0){A[Atarget+IA[i]]=entry;}
					else{//new entry is a zero; old value must be removed
					A.splice(Atarget+IA[i],1);	
					JA.splice(Atarget+IA[i],1);
					for(var c=i+1; c<IA.length; c++){
						IA[c]=IA[c]-1;
					}
					}
				}	
			}
			var fin = [A,IA,JA];
			return fin;
	}
	
	function yaleGet(yaleMat, i, j){
		var A = yaleMat[0];
		var IA = yaleMat[1];
		var JA = yaleMat[2];
		var n = IA.length-1;
		var m = n; // assumes Yale is square
		var entry;	
				if(isNaN(IA[i])){
					entry=0;
				}
				else{
					for(var y=i+1;y<=IA.length-1;y++){
						if(IA[y]>=0){break;}
					}
					var segment = JA.slice(IA[i],IA[y]);
					var Atarget = segment.indexOf(j);
					var x;
					if(Atarget==-1){x=0;}
					else{x=A[Atarget+IA[i]];}
					entry=x;
				}
		return entry;
	}
	
	function matrixAdd(a, b){
		//assume a and b have the same dimensions
		var m = a.length; //rows
		var n = a[0].length; //cols
		if(isNaN(n)){ // if 'n' is NaN then 'a' and 'b' are vectors
			var c = createArray(m);
			for(var i = 0; i<m;i++){
				c[i]=a[i]+b[i];
			}
		}
		else{ // if 'n' is a Number then 'a' and 'b' are 2d matrices
			var c = createArray(m,n);
			for(var i=0;i<m;i++){
				for(var j=0;j<n;j++){
					c[i][j]=a[i][j]+b[i][j];
				}
			}
		}
		return c;
	}
	
	function matrixSub(a, b){
		//assume a and b have the same dimensions
		var m = a.length; //rows
		var n = a[0].length; //cols
		if(isNaN(n)){ // if 'n' is NaN then 'a' and 'b' are vectors
			var c = createArray(m);
			for(var i = 0; i<m;i++){
				c[i]=a[i]-b[i];
			}
		}
		else{ // if 'n' is a Number then 'a' and 'b' are 2d matrices
			var c = createArray(m,n);
			for(var i=0;i<m;i++){
				for(var j=0;j<n;j++){
					c[i][j]=a[i][j]-b[i][j];
				}
			}
		}
		return c;
	}
	
	/** transcribes any 2-d matrix into Yale Format **/
	function toYale(k){
		var n = k.length;
		var m = k[0].length;
		var A = new Array();
		var IA = new Array(n+1);
		var JA = new Array();
		for(var i=0;i<n;i++){
			for(var j=0;j<m;j++){
				if(k[i][j]!=0){
					A.push(k[i][j]);
					JA.push(j);
					if(isNaN(IA[i])){
						IA[i]=A.length-1;
					}
				}
			}
		}
		var x = A.length;
		IA[n]=x;
		var k_yale = [A, IA, JA];
		return k_yale;
	}
	
	function toMatrix(k){
		var A = k[0];
		var IA = k[1];
		var JA = k[2];
		//assume square matrix
		var n = IA.length-1;
		var m = n;
		var k_matrix= createArray(n,n);
		for(var i=0;i<n;i++){
			for(var j=0;j<m;j++){
				if(isNaN(IA[i])){
					//alert("first if; no values this row.");
					k_matrix[i][j]=0;
				}
				else{
					for(var y=i+1;y<=IA.length-1;y++){
						if(IA[y]>=0){break;}
					}
					var segment = JA.slice(IA[i],IA[y]);
					var Atarget = segment.indexOf(j);
					//alert("Atarget = "+Atarget);
					var x;
					if(Atarget==-1){x=0;}
					else{x=A[Atarget+IA[i]];}
					//alert("i = "+i+"; j = "+j);
					k_matrix[i][j]=x;
				}
			}
		}
		
		return k_matrix;
	}
	
	function makeX(){
		
		xRows = document.getElementById("rows").value;
		xCols = document.getElementById("columns").value;			
		//Fill in Table X with input elements
		var tableX = document.getElementById("X");
		tableX.border = "1";
		
		var row=tableX.insertRow(0);
		var span = Number(xCols)+1;
		row.innerHTML="<th colspan=" + span + ">Input Matrix X</th>";
		  
		  var row1 = tableX.insertRow(1);
		  row1.insertCell();
		for(var j=1;j<=xCols;j++){
			var cell = row1.insertCell(-1);
			cell.innerHTML="Column" + j;
		}
		
		var inputId=0;
		var rowCount = Number(xRows)+1;
		for(var i=2; i<=(rowCount);i++){
			var rowNum = i-1;
			var currentRow=tableX.insertRow(i);
			for(var j=0;j<=xCols;j++){
				
				if(j==0){
					var newCell = currentRow.insertCell(0);
					newCell.innerHTML="Row" + rowNum;	
				}
				else{
				var cell = currentRow.insertCell(-1);
				cell.innerHTML="<td><input id=" + inputId + "></input></td>";
				inputId++;
				}
			}
		}
		var txt1="<button onClick='scalarAns()'>Scalar*Matrix=?</button><br>"; 
		$("#test_1_b").append(txt1);
		$("#test_1_b").show();
	}
	
	function scalarAns(){
		var s = $("#scalar").val();
		var tableX = document.getElementById("X");
		xRows = Number(xRows);
		xCols = Number(xCols);
		var matX = createArray(xRows, xCols); 
		var targetId=0;
		// $("#answer_1").append("<p>Value xRows = " + xRows + "</p>");		
		// gather table values to form matrix "x"				
		for(var i=0; i<xRows;i++){
			for(var j=0;j<xCols;j++){
				matX[i][j] = Number(document.getElementById(targetId).value);
				targetId++;
			}
		}		
		var ans_1 = scalarXarray(s,matX);
		ans_1=toYale(ans_1);
		ans_1 = toMatrix(ans_1);
		// Print ans_1
		var ans_x = document.getElementById("ans_x");
		for(var i = 0; i < xRows; i++){
			currentRow = ans_x.insertRow(i);
			for(var j = 0; j < xCols; j++){
				var cell = currentRow.insertCell(-1);
				var xNum = ans_1[i][j];
				cell.innerHTML="<td>" + xNum + "</td>";
			}
		}
		document.getElementById("ans_x").border="1";
		$("#answer_1").show();
		
	}
	
	
	
	function buildTables(){
		aRows = Number(document.getElementById("1,1").value);		
		aCols = Number(document.getElementById("1,2").value);		
		bRows = Number(document.getElementById("2,1").value);		
		bCols = Number(document.getElementById("2,2").value);
		
		//Fill in Table A with input elements
		var tableA = document.getElementById("A");
		tableA.border = "1";
		
		var row=tableA.insertRow(0);
		var span = aCols+1;
		row.innerHTML="<th colspan=" + span + ">Input Matrix A</th>";
		  
		  var row1 = tableA.insertRow(1);
		  row1.insertCell();
		for(var j=1;j<=aCols;j++){
			var cell = row1.insertCell(-1);
			cell.innerHTML="Column" + j;
		}
		
		var inputId=0;
		var maxRow = aRows+1;
		for(var i=2; i<=maxRow;i++){
			var rowNum = i-1;
			var currentRow=tableA.insertRow(i);
			for(var j=0;j<=aCols;j++){
				
				if(j==0){
					var newCell = currentRow.insertCell(0);
					newCell.innerHTML="Row" + rowNum;	
				}
				else{
				var cell = currentRow.insertCell(-1);
				cell.innerHTML="<td><input id=" + inputId + "></input></td>";
				inputId++;
				}
			}
		}
		
		//Fill in Table B with input elements
		var tableB = document.getElementById("B");
		tableB.border = "1";
		
		var row=tableB.insertRow(0);
		var span = bCols+1;
		row.innerHTML="<th colspan=" + span + ">Input Matrix B</th>";
		  
		  var row1 = tableB.insertRow(1);
		  row1.insertCell();
		for(var j=1;j<=bCols;j++){
			var cell = row1.insertCell(-1);
			cell.innerHTML="Column" + j;
		}
		
		var maxRow = bRows+1;
		for(var i=2; i<=maxRow;i++){
			var rowNum = i-1;
			var currentRow=tableB.insertRow(i);
			for(var j=0;j<=bCols;j++){
				
				if(j==0){
					var newCell = currentRow.insertCell(0);
					newCell.innerHTML="Row" + rowNum;	
				}
				else{
				var cell = currentRow.insertCell(-1);
				cell.innerHTML="<td><input id=" + inputId + "></input></td>";
				inputId++;
				}
			}
		}
		
		var txt1="<button onClick='matrixAns()'>Gather Values</button><br>";// Create element with HTML  
		$("body").append(txt1);         // Append the new elements
		
		}
	
	function matrixAns(){
		var matA = createArray(aRows, aCols); 
		var targetId=0;
		
		
		// gather table values to form matrix "A"				
		for(var i=0; i<aRows;i++){
			for(var j=0;j<aCols;j++){
				matA[i][j] = Number(document.getElementById(targetId).value);
				targetId++;
			}
		}
		
		var matB = createArray(bRows, bCols); 
		// gather table values to form matrix "B"				
		for(var i=0; i<bRows;i++){
			for(var j=0;j<bCols;j++){
				matB[i][j] = Number(document.getElementById(targetId).value);
				targetId++;
			}
		}
		// $("#answer_2").append("<p>Debug: Value aRows = " + aRows + "</p>");
		
		var matC = matrixMultiply(matA, matB);
		
		// Print matC
	var ans_c = document.getElementById("ans_c");
	for(var i = 0; i < aRows; i++){
		currentRow = ans_c.insertRow(i);
		for(var j = 0; j < bCols; j++){
			var cell = currentRow.insertCell(-1);
			var xNum = matC[i][j];
			cell.innerHTML="<td>" + xNum + "</td>";
		}
	}
	document.getElementById("ans_c").border="1";
	$("#answer_2").show();
	}
	
	function matrixInsert(){
		var matrix = [[1,2,0,3],[0,2,0,0],[0,0,0,0],[0,0,0,0]]; 
		var IA = new Array(5);
		//IA[0]=0;
		//IA[1]=3;
		IA[4]=0;
		var A = new Array();
		var JA = new Array();
		//var yale = [A,IA,JA];
		//var yale = [[1,2,3,2],IA,[0,1,3,1]];
		//var r = matrix.length;
		//var c = matrix[0].length;
		//alert("r = "+r+", c = "+c);
		
		var yale = toYale(matrix);
		
		
		var add = 0;
		
		yale = yaleInsert(yale,add,1,1);
		
		var matC = toMatrix(yale);
		var rows = matC.length;
		var cols = matC[0].length;
		//alert("rows = "+rows+", cols = "+cols);
		// Print matC
	var ans_c = document.getElementById("ans_5");
	for(var i = 0; i < rows; i++){
		currentRow = ans_c.insertRow(i);
		for(var j = 0; j < cols; j++){
			var cell = currentRow.insertCell(-1);
			var xNum = matC[i][j];
			cell.innerHTML="<td>" + xNum + "</td>";
		}
	}
	document.getElementById("ans_5").border="1";
	}
	
	function makeK(){
		
		kRows = Number(document.getElementById("krows").value);
		kCols = Number(document.getElementById("kcolumns").value);			
		//Fill in Table K with input elements
		var tableK = document.getElementById("K");
		tableK.border = "1";
		
		var row=tableK.insertRow(0);
		var span = kCols+1;
		row.innerHTML="<th colspan=" + span + ">Input Matrix K</th>";
		  
		  var row1 = tableK.insertRow(1);
		  row1.insertCell();
		for(var j=1;j<=kCols;j++){
			var cell = row1.insertCell(-1);
			cell.innerHTML="Column" + j;
		}
		
		var inputId=0;
		var rowCount = kRows+1;
		for(var i=2; i<=(rowCount);i++){
			var rowNum = i-1;
			var currentRow=tableK.insertRow(i);
			for(var j=0;j<=kCols;j++){
				
				if(j==0){
					var newCell = currentRow.insertCell(0);
					newCell.innerHTML="Row" + rowNum;	
				}
				else{
				var cell = currentRow.insertCell(-1);
				cell.innerHTML="<td><input id=" + inputId + "></input></td>";
				inputId++;
				}
			}
		}
		
		//Fill in Table P with input elements
		var tableP = document.getElementById("P");
		tableP.border = "1";
		
		var row=tableP.insertRow(0);
		var span = 2;
		row.innerHTML="<th colspan=" + span + ">Input P vector</th>";
		  
		  var row1 = tableP.insertRow(1);
		  row1.insertCell();
			var cell = row1.insertCell(-1);
			cell.innerHTML="Column 1";		
		
		var rowCount = kRows+1;
		for(var i=2; i<=(rowCount);i++){
			var rowNum = i-1;
			var currentRow=tableP.insertRow(i);
			for(var j=0;j<=1;j++){				
				if(j==0){
					var newCell = currentRow.insertCell(0);
					newCell.innerHTML="Row" + rowNum;	
				}
				else{
				var cell = currentRow.insertCell(-1);
				cell.innerHTML="<td><input id=" + inputId + "></input></td>";
				inputId++;
				}
			}
		}
		var txt1="<button onClick='findLU()'>(L, U)=?</button>"; 
		var txt2="<button onClick='findDisp()'>Solve for Disp</button><br>";
		$("#test_3_b").append(txt1, txt2); 
		//$("#test_3_b").append("<p>Debug: hello? </p>");
		$("#test_3_b").show();
	}
	
	function findLU(){
		kRows = Number(kRows);
		kCols = Number(kCols);
		var matK = createArray(kRows, kCols); 
		var targetId=0;
		// $("#answer_1").append("<p>Value xRows = " + xRows + "</p>");		
		// gather table values to form matrix "K"				
		for(var i=0; i<kRows;i++){
			for(var j=0;j<kCols;j++){
				matK[i][j] = Number(document.getElementById(targetId).value);
				targetId++;
			}
		}
		var x = toYale(matK);
		var LU_pair = LUDecomp(x);
		var lower = LU_pair.L;
		var upper = LU_pair.U;
		lower = toMatrix(lower);
		upper = toMatrix(upper);
		//var Lval = lower[0][1];
		//$("#answer_3").append("<p>Value from lower = " + Lval + "</p>");
		// Print Original
		var tableL = document.getElementById("ans_O");
		for(var i = 0; i < kRows; i++){
			var currentRow = tableL.insertRow(i);
			for(var j = 0; j < kCols; j++){
				var cell = currentRow.insertCell(-1);
				var xNum = matK[i][j];
				cell.innerHTML="<td>" + xNum + "</td>";
			}
		}
		// Print lower
		var tableL = document.getElementById("ans_L");
		for(var i = 0; i < kRows; i++){
			var currentRow = tableL.insertRow(i);
			for(var j = 0; j < kCols; j++){
				var cell = currentRow.insertCell(-1);
				var xNum = lower[i][j];
				cell.innerHTML="<td>" + xNum + "</td>";
			}
		}
		// Print upper
		var tableU = document.getElementById("ans_U");
		for(var i = 0; i < kRows; i++){
			var currentRow = tableU.insertRow(i);
			for(var j = 0; j < kCols; j++){
				var cell = currentRow.insertCell(-1);
				var xNum = upper[i][j];
				cell.innerHTML="<td>" + xNum + "</td>";
			}
		}
		document.getElementById("ans_L").border="1";
		document.getElementById("ans_U").border="1";
		
		$("#answer_3").show();
		
	}
	
	function findDisp(){
		kRows = Number(kRows);
		kCols = Number(kCols);
		var matK = createArray(kRows, kCols); 
		var targetId=0;
		// $("#answer_1").append("<p>Value xRows = " + xRows + "</p>");		
		// gather table values to form matrix "K"				
		for(var i=0; i<kRows;i++){
			for(var j=0;j<kCols;j++){
				matK[i][j] = Number(document.getElementById(targetId).value);
				targetId++;
			}
		}
		// gather table values to form matrix "P
		var vectorP = createArray(kRows);
		for(var i=0; i<kRows;i++){
				vectorP[i] = Number(document.getElementById(targetId).value);
				targetId++;
		}
		
		var disp = luEvaluate(matK, vectorP);		
		
		//var Lval = lower[0][1];
		//$("#answer_3").append("<p>Value from lower = " + Lval + "</p>");
		
		// Print disp
		var tableD = document.getElementById("ans_disp");
		for(var i = 0; i < kRows; i++){
			var currentRow = tableD.insertRow(i);
				var cell = currentRow.insertCell(-1);
				var xNum = disp[i];
				cell.innerHTML="<td>" + xNum + "</td>";
			
		}
		document.getElementById("ans_disp").border="1";
		
		$("#answer_3").show();
		
	}
	
function pointLoad(){
	var L = Number(document.getElementById("span_length").value);
	var P = Number(document.getElementById("p_load").value);
	var a = Number(document.getElementById("p_loc").value);
	
	N = 2; // N = number of global elements
	
	L_index = [a, (L-a)];
	EI_values = [48000,30000];
	structureMatrix(L_index, N, EI_values);
	// want rows & columns 1,2,3,5 from K_s
	var target = [1, 2, 3, 5];
	var small_k = createArray(4,4);
	for(var i = 0; i < 4; i++){
		var q = target[i];
		for(var j = 0; j < 4; j++){
			var t = target[j];
		small_k[i][j] = K_s[q][t];
		}
	}
	
	var small_p = createArray(4);
	for(var i = 0; i < 4; i++){
		if(i==1){ small_p[i]=P; }
		else{ small_p[i]=0; }
	}
	
	
	
	u_global = luEvaluate(small_k, small_p);	
	u_global.splice(0,0,0);
	u_global.splice(4,0,0);
	
	$("#ans_4").append(u_global);
	$("#answer_4").show();
	
}


/** Method for finding shear, moment, and displacement diagrams **/
function VMDsolve(){
	// first solve for reaction forces at major nodes
	for(var i = 0; i<N;i++){
		var current_k = scalarxArray(EI_values[i]/L_index[i], elementStiffness(L_index[i]));
		var x = u_global;
		// get (slice) appropriate values from u_global
		var current_u = x.slice(i*2,4);
		// remove (splice) third row (index = 2) from current_k
		current_k.splice(2,1);
		$("#answer_4_b").append("<p>Debug: current_k = " + current_k + "</p>");
		
		
		
	}
	
	$("#answer_4_b").show();
}


	/** Method for LU Decomposition **/
	function LUDecomp(k) {
		// Assuming k is square matrix in Yale format
		// k = [A,IA,JA]
		// U =k;
		var N = k[1].length-1;
		/**var U_A = k[0];
		var U_IA = k[1];
		var U_JA = k[2];**/
		var upper = k;
		//alert("N = "+N);
		//set first 1 in place
		var L_A = new Array();
		var L_IA = new Array(N+1);
		L_IA[N]=0;
		var L_JA = new Array();
		var lower = [L_A,L_IA,L_JA];
		/**var n = 0; 
		while(n < N){
			// Insert ones along the diagonal in L_A 
			// L_IA to be formed later
			
		}**/
		// Do decomposition
		for(var j=0; j<N; j++){
			
			lower = yaleInsert(lower, 1, j, j);
			for(var i=(j+1);i<N; i++){
				
					var U_ij = yaleGet(upper,i,j);
					if(U_ij!=0){
						// L[i][j] = U[i][j] / U[j][j];
						var U_jj = yaleGet(upper,j,j);
						//alert("denominator = "+xD);
						var L_ij=U_ij/U_jj;
						lower = yaleInsert(lower, L_ij, i, j);
						//alert("made it"+lower[0]);
						for(var z=j; z<N; z++){
							//U[i][z] = U[i][z]-L[i][j]*U[j][z];
							//alert("z = "+z);
							var U_iz=yaleGet(upper,i,z);
							//alert("U_iz = "+U_iz);
							var U_jz = yaleGet(upper,j,z);
							//alert("U_jz = "+U_jz);
							U_iz-=L_ij*U_jz;
							//alert("new U_iz = "+U_iz);
							upper = yaleInsert(upper,U_iz, i, z);	
						}	
				}	
			}
		}
		
			/** // Do decomposition
			for(var j=0; j<(N-1); j++){
				for(var i=(j+1);i<N; i++){
					if(U[i][j] != 0){
						L[i][j] = U[i][j] / U[j][j];
						for(var z=j; z<N; z++){
							U[i][z] = U[i][z]-L[i][j]*U[j][z];
						}
					}
					else{ L[i][j]=0;}
				}
			} **/
		//L & U should be done
		// create an object to return upper and lower matrices
			var ULpair = new Object();
			
			var L = lower;
			var U = upper;
			//alert("end U_A = "+U_A);
			//alert("end U_IA = "+U_IA);
			//alert("end U_JA = "+U_JA);
			ULpair.L = L;
			ULpair.U = U;
			return ULpair;
		
	}
	
	/** Method for Forward and Backward Substitution including LU Decomposition **/
	// Returns displacement vector
      function luEvaluate(K, loads){
	  // Ax = b -> LUx = b. Then y is defined to be Ux
    	var n = Number(loads.length);
    	var LU_pair = LUDecomp(K);
	  var L = LU_pair.L;
	 // alert("L_A = "+L[0]);
	 // alert("L_IA = "+L_IA);
	  //alert("L_JA = "+L_JA);  
	  var U = LU_pair.U;
	 // alert("U_A = "+U[0]);
	  //alert("U_IA = "+U_IA);
	  //alert("U_JA = "+U_JA);
	  /**var mat = toMatrix(L);
	  for(var i=0;i<mat.length;i++){
			alert("Lower="+mat[i]);
			} **/ 
	  var i = 0;
	  var j = 0;
	  var x = createArray(n);
	  var y = createArray(n);
	  // Forward solve Ly = b
	  for(i = 0; i < n; i++){
	    y[i] = loads[i];
	    for (j = 0; j < i; j++)
	    {
			var z = yaleGet(L,i,j);
	      y[i] -= z * y[j];
	    }
		var z = yaleGet(L,i,i);
	    y[i] /= z;
	  }
	  // Backward solve Ux = y
	  for(i = n - 1; i >= 0; i--){
	    x[i] = y[i];
	    for (j = i + 1; j < n; j++)
	    {
	    	var z = yaleGet(U,i,j);
	      x[i] -= z * x[j];
	    }
	    var z = yaleGet(U,i,i);
	    x[i] /= z;
	  }
	  return x;
	 }
      
      function structureMatrix(L_index, EI_index){
    		// L_index contains length of each global element 
    	  var elements = L_index.length;
    	 
    		// elements = total number of global elements
    		// Initialize structure matrix   		
    		var N = (elements+1)*2;
    		var A=new Array();
        	var IA= createArray(N+1);
        	IA[N]=0;
        	var JA=new Array(); 
        	var K=[A,IA,JA];
    		if(elements==1){
    			var z;
    			var k = elementStiffness(L_index);
    			z = scalarXarray(EI_index,k);
    			var r=toYale(z);
    			return r;
    		}
    		var i_structure = 0;
    		var stiff_a = createArray(4, 4);
			var stiff_b = createArray(4, 4);
    		for(var i = 0; i < elements-1; i++){
    			var element_a_L = L_index[i];
    			var element_b_L = L_index[i+1];				
    			//alert("ooga start");
    			
    			stiff_a = elementStiffness(element_a_L);
    			stiff_a = scalarXarray(EI_index[i]/L_index[i],stiff_a);
    			stiff_b = elementStiffness(element_b_L);
    			stiff_b = scalarXarray(EI_index[i+1]/L_index[i+1],stiff_b);
    				// Special while statement to deal with first two rows
   				while(i_structure <=1){	
    				for(var j=0; j<4; j++){
    					K=yaleInsert(K,stiff_a[i_structure][j],i_structure,j);					
    				}
    				i_structure++;
    			}
    				
    				// If first two rows already done; Proceed with typical pattern
    				// Set up: Make it so 2 typical rows are filled at a time
    				for(var typ_row_count = 1; typ_row_count <= 2; typ_row_count++){
    				// Step 1: Check how many leading zeros are needed and insert them
    					//edit: no need to enter zeros in Yale format
    				var leading_zeros = (Math.floor(i_structure/2) - 1)*2;
    				var j=leading_zeros;			
    				// Step 2: Fill typical rows followed by trailing zeros
    				var i_a;
    				var j_a;			
    				if(i_structure % 2 == 0){ i_a = 2; }
    				else{ i_a = 3; }
    				for(j_a = 0; j_a < 2; j_a++){				
    					K=yaleInsert(K,stiff_a[i_a][j_a],i_structure,j);
    					j++;
    				}
    				var i_b;
    				var j_b;
    				if(i_structure % 2 == 0){ i_b = 0; }
    				else{ i_b = 1; }
    				for(j_b = 0; j_b < 2; j_b++){
    					var x = stiff_a[i_a][j_a] + stiff_b[i_b][j_b];
    					K=yaleInsert(K,x,i_structure,j);
    					j++;
    					j_a++;
    				}
    				while(j_b < 4){
    					K=yaleInsert(K,stiff_b[i_b][j_b],i_structure,j);
    					j++;
    					j_b++;
    				}	
    				i_structure++;
    				}
    				//alert("ooga i_structure = "+i_structure);
    				//alert("ooga i = "+i);
    				// special while statement for last 2 rows
    				while(i_structure >= N-2 && i_structure < N){
    					
    					// insert leading zeros
    					var leading_zeros = (Math.floor(i_structure/2) - 1)*2;
        				var j=leading_zeros;
        				// fill last 2 rows followed by trailing zeros
        				var i_b;
        				var j_b;
        				if(i_structure % 2 == 0){ i_b = 2; }
        				else{ i_b = 3; }
        				for(j_b = 0; j_b < 4; j_b++){
        					K=yaleInsert(K,stiff_b[i_b][j_b],i_structure,j);
        					j++;
        				}	
        				i_structure++;
    				}
    		}  		
    		return K;
    	}
      
      function elementStiffness(eLength){
    		// Assuming length is already in inches
    		var Lsq = Math.pow(eLength, 2);
    		var L = eLength;
    		var k_1 = [12/Lsq, 6/L, -12/Lsq, 6/L];
    		var k_2 = [6/L, 4, -6/L, 2];
    		var k_3 = [-12/Lsq, -6/L, 12/Lsq, -6/L];
    		var k_4 = [6/L, 2, -6/L, 4];
    		
    		var k_dub = [k_1, k_2, k_3, k_4]; 
    		return k_dub;
    		}
      
      function twoStiffness(eLength){
  		// Assuming length is already in inches
  		var Lsq = Math.pow(eLength, 2);
  		var L = eLength;
  		var k_1 = [12/Lsq, 6/L, -12/Lsq, 6/L];
  		var k_2 = [6/L, 4, -6/L, 2]; 		
  		var k_dub = [k_1, k_2]; 
  		return k_dub;
  		}
	
	