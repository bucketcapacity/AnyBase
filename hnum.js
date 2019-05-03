//By Jens Dienst
//These are not styled comments
//
//I learned all too late that Javascript math sucks.
//If you're reading this, upset with my bad coding
//and lack of foresight, I apologize. pls no bully

function HNum(n, digits = '0123456789', base = digits.length, prec = 16, isComma = false, trail = false, fracSep = '.', commaLoc = 3) {
	
	
	//Logic checks.
	if(base != Math.floor(base)) {
		console.log("not integer base");
		return;
	}
	else if(digits.length < base) {
		console.log("not enough digits");
		return;
	}
	else if(base < 2) {
		console.log("base too small");
		return;
	}
	
	if(prec < 0) {
		console.log("invalid precision");
		return;
	}
	
	
	var comma;
	switch(fracSep){
	case '.':
	comma = ','
	break;
	case ',':
	comma = '.'
	break;
	default:
	console.log("invalid fractional seperator.");
	}
	
	var validChar = digits.split('').concat(['-',fracSep,comma]);
	
	if(typeof n !== "number") {
		for(i of n.toString()) {
			if(!(validChar.includes(i))) {
				console.log("invalid number");
				return;
			}
		}
	}
	
	
	this.number;
	this.value;
	this.base = base;
	this.digits = digits;
	this.prec = prec;
	this.isComma = isComma; //Boolean
	this.commaLoc = commaLoc;
	this.fracSep = fracSep;
	this.trail = trail; //Boolean
	this.comma = comma; //The comma character

	
	if(Math.abs(n) == Infinity || (!n && n !== 0)) {
		this.value = Number.parseFloat(n);
		this.number = n.toString();
		return;
	}
    
    var pracPrec;
	
	function stringToNum(n,digits,base,fracSep,comma) {
        var originalN = n;
        var origDig = digits;
		var both = n.split(fracSep);
        //Quick Fix
        pracPrec = n.length - both[0].length;
        //
		digits = digits.split('');
	
		var intejer = both[0].split(comma);
		n = intejer.join('');

		if(both[0] != n) {	
			isComma = true
		}
		
		var neg = 1;
		if(n[0] == '-') {
			neg = -1;
			temp = n.split('');
			temp.shift();
			n = temp.join('');
		}
        
        
        if(origDig.slice(0,11) == '0123456789' && base == 10) { //Added later on
            let enn = originalN.split(comma);
            let lastPart = enn[enn.length-1];
            let ind = lastPart.indexOf(fracSep);
            //document.getElementById('testOutput').innerHTML ="fracSep: "+fracSep + " lastPart "+lastPart+" ind "+ind
            if(ind !== -1) {
                lastPart = lastPart.split('');
                lastPart[ind] = '.';
                lastPart = lastPart.join('');
            }
            //document.getElementById('testOutput').innerHTML = lastPart;
            enn[enn.length - 1] = lastPart;
            let newN = enn.join('');
            //document.getElementById('testOutput').innerHTML = "this one "+originalN;
            return parseFloat(newN);
        }
        
	
		//Converts "integer" part into an integer. If number is invalid, returns
		//error
		var tempN = 0;
		for(let i = 0; i <n.length; i++) {
			tempN += digits.indexOf(n[n.length-1-i])*Math.pow(base,i);
		}
	
		n = tempN //Acts as an integer now
		var literal = n;
	
		//Start of mantissa processing
		var m = both[1]
		
		if(m && m[m.length-1] == '0') {
			trail = true;
		}
	
		//Checks to see if Mantissa is 0. If it isn't, it translate it into
		//a float
		var isZero = false;

		if (m == 0 || !m){
			isZero = true;
		}
		else {
			var tempM = 0;
			for(let i = 0; i<m.length;i++) {
				tempM += digits.indexOf(m[i])*Math.pow(base,-i-1);
			}
			m = tempM;
			literal += tempM;
		}

		return neg*literal;
	}	
	
	function numToString(num, isComma, trail, digits, base,fracSep,comma,commaLoc,sigfig) {
		digits = digits.split('');
		
		/*
		if(num == 0) {
			return '0';
		}
		*/
		
		var isNeg = false;
		var isZero = false;
		if(num < 0) {
			isNeg = true;
			num *= -1
		}
		
		n = Math.floor(num);
		m = num - n;

		
		if (m == 0 || !m || prec == 0){
			isZero = true;
		}
        
		//Translates float into the new mantissa.
		var finaldoz = [], x = 0, lastDigit;


		while(m != 0 && x <= sigfig){
			x++;
			let nextNum = Math.floor(m*Math.pow(base,x));
			m -= nextNum/Math.pow(base,x);
			finaldoz.push(digits[nextNum]);
		}

		//Rounding done in the new base.
		function round(number) {
			let lastDigit = digits.indexOf(number.pop());
			if (lastDigit >= Math.ceil(base/2)){
				let newLast = number[number.length-1];
				if (digits.indexOf(newLast) == base-1){
					round(number);
				}
				else {
					number.pop()
					number.push(digits[digits.indexOf(newLast)+1]);
				}
			}
		}
		if (x > sigfig && m != 0) {
			round(finaldoz);
		}
        
		if(finaldoz == '0') {
			n++;
			isZero = true;
		}
		
		//Translate integer into the new "integer"
		var final = [];
		if(n != 0) {
			var a = Math.log(n)/Math.log(base),rem = 0,dig = 0;
			a = Math.floor(a);

			while(n - Math.pow(base,a) >= 0) {
				a++;
			}
			a--


			while(a > 0){
				let rem = n%Math.pow(base,a);
				let dig = (n-rem)/Math.pow(base,a);
				final.push(digits[dig]);
				n = rem;
				a--;
			}

			final.push(digits[n])
		}
		else {
			final.push('0');
		}
		//integer part is now complete

		//Trailing zero check. if trail is false, it will remove ALL
		//trailing zeros, even those provided by the user. Supercedes sigfig.
		var trailAmount = sigfig - finaldoz.length;

		if(trail && trailAmount > 0) {
	
			for(i = 0;i < trailAmount;i++) {
				finaldoz.push('0');
			}
		} else if(!trail && finaldoz[finaldoz.length - 1] == '0') {
			while(finaldoz[finaldoz.length-1] == '0') {
				finaldoz.pop();
			}
		}

		//Reinserts comma. comma location's default is 3, can be changed.
		if(isComma) {
			for(let i = final.length-commaLoc;i > 0;i-=commaLoc) {
				final.splice(i,0,comma);
			}
		}
        
        if(finaldoz.join('')=='') {
            isZero = true;
        }
		
        //document.getElementById('testOutput').innerHTML = finaldoz.join('');

		return (isNeg ? '-' : '') +  final.join('')+ (isZero ? "" : fracSep + finaldoz.join(''))
	}
	
	
	
	if(typeof n === "number") {
		this.value = n;
		this.number = numToString(n,this.isComma,this.trail,this.digits,this.base,this.fracSep,comma,this.commaLoc,this.prec);
	}
	else {
		this.number = n;
		this.value = stringToNum(n,this.digits,this.base,this.fracSep,comma);
		this.isComma = isComma;
		this.trail = trail;
        //document.getElementById('testOutput').innerHTML = pracPrec
        //this.prec = pracPrec;
	}
	return;
}

HNum.prototype.commaTog = function(commaLoc){
	commaLoc = (commaLoc >= 1 && typeof commaLoc !== undefined && commaLoc%1 == 0) ? commaLoc : this.commaLoc;
	let foo = this.number.split(this.fracSep);
	if(!this.isComma) {
		let bar = foo[0].split('');
		for(let i = bar.length-commaLoc;i > 0;i-=commaLoc) {
			bar.splice(i,0,this.comma);
		}
		foo[0] = bar.join('');
	}
	else {
		let bar = foo[0].split(this.comma);
		foo[0] = bar.join('');
	}
	this.number = foo.join(this.fracSep);
	this.isComma = !this.isComma;
}


HNum.prototype.commaOn = function(commaLoc){
	if(!this.isComma) {
		this.commaTog(commaLoc);
	}
	else if(commaLoc != this.commaLoc && typeof commaLoc !== undefined) {
		this.commaTog();
		this.commaTog(commaLoc);
	}
}
HNum.prototype.commaOff = function(){
	if(this.isComma) {
		this.commaTog();
	}
}


HNum.prototype.trailTog = function(precision){
	precision = (precision >= 0 && typeof precision !== undefined && precision%1 == 0) ? precision : this.prec;
	let both = this.number.split(this.fracSep);
	if(both[1]) {
		both[1] = both[1].split('');
	}
	else {
		both[1] = [];
	}
	if(!this.trail) {
		while(both[1].length < precision) {
			both[1].push('0');
		}
	}
	else {
		while(both[1][both[1].length-1] == '0') {
			both[1].pop();
		}
	}
	if(both[1].length != 0) {
		both[1] = both[1].join('');
		this.number = both.join(this.fracSep);
	}
	else {
		this.number = both[0];
	}
	this.trail = !this.trail;
}



HNum.prototype.trailOn = function(precision) {
	if(!this.trail) {
	this.trailTog(precision);
	}
	else if(typeof precision !== undefined && precision != this.prec) {
		this.trailTog();
		this.trailTog(precision);
	}
}
HNum.prototype.trailOff =  function() {
	if(this.trail) {
		this.trailTog();
	}
}


//I know the rest of this is bad code, I just wanted to finish this.
HNum.prototype.changeBase = function(digits, base = digits.length) {
	temp = new HNum(this.value, digits, base, this.prec, this.isComma, this.trial, this.fracSep, this.commaLoc);
	if(temp.number) {
		this.number = temp.number;
		this.value = temp.value;
		this.base = temp.base;
		this.digits = temp.digits;
		this.prec = temp.prec;
		this.isComma = temp.isComma;
		this.commaLoc = temp.commaLoc;
		this.fracSep = temp.fracSep;
		this.trail = temp.trail;
		this.comma = temp.comma;
	}
}

HNum.prototype.add = function(n) {
	temp = new HNum(this.value+n, this.digits, this.base, this.prec, this.isComma, this.trial, this.fracSep, this.commaLoc);
	if(temp.number) {
		this.number = temp.number;
		this.value = temp.value;
		this.base = temp.base;
		this.digits = temp.digits;
		this.prec = temp.prec;
		this.isComma = temp.isComma;
		this.commaLoc = temp.commaLoc;
		this.fracSep = temp.fracSep;
		this.trail = temp.trail;
		this.comma = temp.comma;
	}
}

HNum.prototype.mult = function(n) {
	temp = new HNum(this.value*n, this.digits, this.base, this.prec, this.isComma, this.trial, this.fracSep, this.commaLoc);
	if(temp.number) {
		this.number = temp.number;
		this.value = temp.value;
		this.base = temp.base;
		this.digits = temp.digits;
		this.prec = temp.prec;
		this.isComma = temp.isComma;
		this.commaLoc = temp.commaLoc;
		this.fracSep = temp.fracSep;
		this.trail = temp.trail;
		this.comma = temp.comma;
	}
}

HNum.prototype.round = function(dig) {
	temp = new HNum(this.value, this.digits, this.base, dig, this.isComma, this.trial, this.fracSep, this.commaLoc);
	if(temp.number) {
		this.number = temp.number;
		this.value = temp.value;
		this.base = temp.base;
		this.digits = temp.digits;
		this.prec = temp.prec;
		this.isComma = temp.isComma;
		this.commaLoc = temp.commaLoc;
		this.fracSep = temp.fracSep;
		this.trail = temp.trail;
		this.comma = temp.comma;
	}
}

//Gives scientific notation. Input is sigfig.

//If prec given here is greater than the
//number's precision, it will give error.
//NOT ANYMORE

//THIS FUNCTION IS WRITTEN SCREWY because I used precision in the original 
//number to describe the length of the mantissa, instead of the sigfigs.
HNum.prototype.sci = function(prec, calc = false) {
	
	if(Math.abs(this.value) == Infinity || (!this.value && this.value !== 0)) {
		return this.number;
	}
	
	if(this.value == 0) {
		return "0*"+this.base+"^0";
	}
	
	if(prec < 0) {
		console.log("invalid sigfig");
		return;
	}
	
	function round(number,digits,base) {
		let lastDigit = digits.indexOf(number.pop());
		if (lastDigit >= Math.ceil(base/2)){
			let newLast = number[number.length-1];
			if (digits.indexOf(newLast) == base-1){
				round(number,digits,base);
			}
			else {
				number.pop()
				number.push(digits[digits.indexOf(newLast)+1]);
			}
		}
	}
/*
	if(prec > this.prec) {
		console.log("too precise");
		return;
	}*/

	var raw = this.number;
	raw = raw.split('');
	var isNeg = false;
	if(this.value < 0) {
		isNeg = true;
		raw.shift();
	}

	if(raw.indexOf(this.comma) !== -1) {
		for(i in raw) {
			if(raw[i] == this.comma) {
				raw.splice(i,1);
			}
		}
		//raw.splice(raw.indexOf(this.comma),1);
	}

	var pow;

	if(Math.abs(this.value) < 1) {
		var i;
		for(i = 2;i<raw.length;i++) {
			if(raw[i] != '0') {
				break;
			}
		}
		pow = -1*(i-1);
		//var len = raw.length;
		//raw = raw.slice(Number(i)+1,len);
		//console.log(pow,raw,i+1,len);
	}
	else if(raw.indexOf(this.fracSep) !== -1) {
		pow = raw.indexOf(this.fracSep) - 1;
		//raw.splice(pow+1,0);
		//raw.splice(raw.indexOf(this.fracSep),1);
	}
	else {
		pow = raw.length - 1;
	}
	
	if(raw.indexOf(this.fracSep) !== -1) {
		raw.splice(raw.indexOf(this.fracSep),1);
	}

	while(raw[0] == '0') {
		raw.shift();
	}

	//console.log("raw: "+raw);
	//m = raw.join('').split(this.fracSep);
	//m.join('');

	//m = m.slice(0,prec+1);
	

	

	if(prec) {
		raw = raw.slice(0,prec+1);
		while(raw.length <= prec && raw.length <= this.prec) {
			raw.push('0');
		}
		/*
		while(m.length < prec+2) {
			m.push('0');
		}
		*/

		//console.log("raw prec",raw);
		round(raw,this.digits,this.base);

		//raw = raw.slice(0,raw.indexOf(this.fracSep)).concat(this.fracSep).concat(m);
	}

	if(raw.length > 1) {
		raw.splice(1,0,this.fracSep);
	}
	raw = raw.join('');

	
	if(raw[raw.length-1] == '.') {
		raw = raw.slice(0,raw.length-1);
	}
	
	
	
	if(calc) {
		return (isNeg ? '-':'')+raw + "E"+ pow;
	}
	//return (isNeg ? '-':'')+raw + "*" + this.base + "^" + pow;
    return (isNeg ? '-':'')+raw + "*10^" + pow;
}



