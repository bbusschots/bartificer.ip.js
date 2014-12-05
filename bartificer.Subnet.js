// a self-extracting anonymous function to allow the bartificer namespace be used in a sane way
(function(bartificer, undefined){
	
	//
	// ==== The Public Subnet Class ============================================
	//
	
	// -- Function --
	// Purpose    : CONSTRUCTOR
	// Returns    : VOID - intended to be called via new
	// Arguments  :
	// Throws     : 
	// Notes      :
	// See Also   :
	bartificer.Subnet = function(){
		this.netAddress = new IP();
	};
	
	//
	// === PRIVATE Helper Variables
	//
	var HEX_LOOKUP_TABLE = {
		'0000': '0',
		'0001': '1',
		'0010': '2',
		'0011': '3',
		'0100': '4',
		'0101': '5',
		'0110': '6',
		'0111': '7',
		'1000': '8',
		'1001': '9',
		'1010': 'a',
		'1011': 'b',
		'1100': 'c',
		'1101': 'd',
		'1110': 'e',
		'1111': 'f'
	};
	
	//
	// === PRIVATE Helper Functions ============================================
	//
	
	// -- Function --
	// Purpose    : A helper function for converting a binary number to decimal
	// Returns    : A whole number
	// Arguments  : 1. a binary number to convert as a string of 1s and 0s
	// Throws     : Throws and error on invalid args
	// Notes      :
	// See Also   :
	function bin2dec(binVal){
		// ensure we got valid args
		var binString = String(binVal);
		if(!binString.match(/^[01]+$/)){
			throw "invalid args";
		}
	
		// do the math
		var ans = 0;
		var binReversedArray = binString.split('').reverse();
		for(var i = 0; i < binReversedArray.length; i++){
			if(binReversedArray[i] == 1){
				ans += Math.pow(2, i);
			}
		}
	
		// return the decimal number
		return ans;
	}
	
	// -- Function --
	// Purpose    : A helper function for converting 4 bits to a hex value
	// Returns    : A whole number
	// Arguments  : 1. a 4bit binary number as a string of 1s and 0s (must be 4 long)
	// Throws     : Throws and error on invalid args
	// Notes      :
	// See Also   :
	function fourBits2hex(binVal){
		// ensure we got valid args
		var binString = String(binVal);
		if(!binString.match(/^[01]{4}$/)){
			throw "invalid args";
		}
	
		// do the conversion using the previously defined lookup table and return
		return HEX_LOOKUP_TABLE[binString];
	}
	
	//
	// === PRIVATE Helper Classes ==============================================
	//
	
	//
	// --- The IP Class --------------------------------------------------------
	//
	
	// inherit from a 32bit binary number
	function IP(){}
	IP.prototype = new Bin32();
	IP.prototype.constructor = IP;
	
	//
	// --- The Netmask Class ---------------------------------------------------
	//
	
	//
	// --- The 32bit binary number class ---------------------------------------
	//
	
	// -- Function --
	// Purpose    : CONSTRUCTOR
	// Returns    : VOID - expected to be called via new
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   :
	function Bin32(){
		this.bits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	}
	
	// -- Function --
	// Purpose    : Return the stored value
	// Returns    : A string of 32 1s and 0s
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Bin32.prototype.get = function(){
		return this.bits.join('');
	};

	// -- Function --
	// Purpose    : Set the value contained in this 32bit number to a given value
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. A string representing a 32bit number
	// Throws     : Throws an error on invalid args
	// Notes      :
	// See Also   :
	Bin32.prototype.set = function(initVal){
		// ensure valid args
		var initString = String(initVal);
		if(!initString.match(/^[01]{32}$/)){
			throw "invalid args";
		}
	
		// load the passed value into the object
		for(var i = 0; i < initString.length; i++){
			if(initString.charAt(i) == 1){
				this.bits[i] = 1;
			}else{
				this.bits[i] = 0;
			}
		}
	
		// return the object
		return this;
	};
	
	// -- Function --
	// Purpose    : get the stored value as a dotted quad
	// Returns    : A string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Bin32.prototype.asDottedQuad = function(){
		var binString = this.get();
		var ans = '' + bin2dec(binString.substring(0,8));
		ans += '.' + bin2dec(binString.substring(8,16));
		ans += '.' + bin2dec(binString.substring(16,24));
		ans += '.' + bin2dec(binString.substring(24));
		return ans;
	};
	
	// -- Function --
	// Purpose    : get the stored value as hex
	// Returns    : A string (prefixed with 0x)
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Bin32.prototype.asHexString = function(){
		var binString = this.get();
		var ans = '' + fourbits2hex(binString.substring(0,4));
		ans += fourbits2hex(binString.substring(4,8));
		ans += fourbits2hex(binString.substring(8,12));
		ans += fourbits2hex(binString.substring(12,16));
		ans += fourbits2hex(binString.substring(16,20));
		ans += fourbits2hex(binString.substring(20,24));
		ans += fourbits2hex(binString.substring(24,28));
		ans += fourbits2hex(binString.substring(28));
		return ans;
	};
	
}(window.bartificer = window.bartificer || {}));