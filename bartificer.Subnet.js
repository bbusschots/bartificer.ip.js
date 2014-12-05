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
		this._netAddress = new IP();
		this._netMask = new Netmask();
	};
	
	// -- Function --
	// Purpose    : PRIVATE setter function
	// Returns    : reference to the object - to facilitate function chaninging
	// Arguments  : 1. an IP object
	//              2. a Netmask object
	// Throws     : Throws an error on invalid args
	// Notes      : This function does not blindly store the IP, instead it
	//              converts it to a network address based on the netmask.
	// See Also   :
	bartificer.Subnet.prototype._set = function(ip, netmask){
		// validate args
		if(!(ip instanceof IP && netmask instanceof Netmask)){
			throw "invalid args";
		}
		
		// store the netmask
		this._netMask = netmask;
		
		//convert the IP to a netaddress and store
		this._netAddress = new IP().set(ip.bitwiseAnd(this._netMask));
	};
	
	// -- Function --
	// Purpose    : render the subnet as a string
	// Returns    : a string in CIDR format
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	bartificer.Subnet.prototype.toString = function(){
		return '' + this._netAddress.asDottedQuad() + '/' + this._netMask.asNumBits();
	};
	
	// -- Function --
	// Purpose    : set stored subnet based on string input
	// Returns    : a reference to the object - to facilitate function chaining
	// Arguments  : 1. a string containing a valid IP seprated from a valid
	//                 netmask by a /
	//              -OR- 
	//              1. a string containing a valid IP
	//              2. a string containing a valid netmask
	// Throws     : Throws error on invalid args
	// Notes      :
	// See Also   :
	bartificer.Subnet.prototype.parse = function(){
		// get the passed IP and subnet
		var ipString = '';
		var netmaskString = '';
		if(arguments.length == 2){
			ipString = String(arguments[0]);
			netmaskString = String(arguments[1]);
		}else if(arguments.length == 1){
			var combinedString = String(arguments[0]);
			var subnetParts = combinedString.split(/[/]/);
			if(subnetParts.length == 2){
				ipString = subnetParts[0];
				netmaskString = subnetParts[1];
			}else{
				throw "invalid arguments - failed to split IP and netmask declarations";
			}
		}else{
			throw "invalid number of arguments - must be 1 or 2";
		}
		
		// try parse the IP
		var ip;
		try{
			ip = new IP().fromDottedQuad(ipString);
		}catch(err){
			throw "failed to parse IP address (" + err + ")";
		}
		
		// try parse the netmask
		var netmask;
		if(netmaskString.match(/^\d{1,2}$/) && parseInt(netmaskString) <= 32){
			netmask = new Netmask().fromNumBits(netmaskString);
		}else if(isDottedQuad(netmaskString)){
			netmask = new Netmask().fromDottedQuad(netmaskString); // will throw an error if not a valid netmask
		}else if(is32BitHex(netmaskString)){
			netmask = new Netmask().fromHexString(netmaskString); // will throw an error if not a valid netmask
		}else{
			throw "failed to parse netmask (" + netmaskString + ")";
		}
		
		// go ahead and set the value of this object
		this._set(ip, netmask);
		
		// return a reference to self
		return this;
	};
	
	//
	// === PRIVATE Helper Variables ============================================
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
	var HEX_REVERSE_LOOKUP_TABLE = {
		'0': '0000',
		'1': '0001',
		'2': '0010',
		'3': '0011',
		'4': '0100',
		'5': '0101',
		'6': '0110',
		'7': '0111',
		'8': '1000',
		'9': '1001',
		'a': '1010',
		'b': '1011',
		'c': '1100',
		'd': '1101',
		'e': '1110',
		'f': '1111'
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
	// Purpose    : A helper function for converting a decimal number an 8bit
	//              binary number
	// Returns    : an 8-character long string of 0s and 1s
	// Arguments  : 1. a whole number between 0 and 255 inclusive
	// Throws     : Throws and error on invalid args
	// Notes      :
	// See Also   :
	function dec2bin8bit(decVal){
		// validate args
		var decString = String(decVal);
		var decInt = parseInt(decVal);
		if(!(decString.match(/^[\d]{1,3}$/) && decInt <= 255)){
			throw "invalid args";
		}
		
		// do the math
		var reverseBits = [];
		var intermediateNum = decInt;
		while(intermediateNum > 0){
			reverseBits.push(intermediateNum % 2);
			intermediateNum = Math.floor(intermediateNum / 2);
		}
		
		// padd out to 8 bits if needed
		while(reverseBits.length < 8){
			reverseBits.push(0);
		}
		
		// convert the calculated bits to a string
		var ans = '' + reverseBits.reverse().join('');
		
		// sanity test the result
		if(!ans.match(/^[01]{8}$/)){
			throw "calculation error - result was not an 8 bit binary string (" + ans + ")";
		}
		
		//return the validated result
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
	
	// -- Function --
	// Purpose    : A helper function for one hex character to 4 bits
	// Returns    : a four character long string of 1s and 0s
	// Arguments  : 1. a single hex character
	// Throws     : Throws and error on invalid args
	// Notes      : This function is case in-sensitive
	// See Also   :
	function hex2fourBits(hexVal){
		// ensure we got valid args
		var hexString = String(hexVal).toLowerCase();
		if(!hexString.match(/^[0-9a-f]{1}$/)){
			throw "invalid args";
		}
	
		// do the conversion using the previously defined lookup table and return
		return HEX_REVERSE_LOOKUP_TABLE[hexString];
	}
	
	// -- Function --
	// Purpose    : A helper function to check if a string contains a valid 
	//              dotted quad.
	// Returns    : true or false
	// Arguments  : 1. a string to test
	// Throws     : NOTHING
	// Notes      : If no argument is passed false is returned
	// See Also   :
	function isDottedQuad(testVal){
		var testString = String(testVal);
		
		// first make sure the string is at least plausible
		if(!testString.match(/^[\d]{1,3}([.][\d]{1,3}){3}$/)){
			return false; // can't possibly be valid
		}
		
		// next split the quad and make sure each value is between 0 and 255 inc
		var quadParts = testString.split(/[.]/);
		if(quadParts.length != 4){
			return false; // this shouldn't be possible, but lets be thurough
		}
		for(var i = 0; i < quadParts.length; i++){
			if(parseInt(quadParts[i]) > 255){
				return false; // at least one part of the quad is too big
			}
		}
		
		// if we got here all is well, so return true
		return true;
	}
	
	// -- Function --
	// Purpose    : A helper function to check if a string contains a valid 
	//              32bir hex string.
	// Returns    : true or false
	// Arguments  : 1. a string to test
	// Throws     : NOTHING
	// Notes      : If no argument is passed false is returned
	// See Also   :
	function is32BitHex(testVal){
		var testString = String(testVal).toLowerCase();
		if(testString.match(/^(0x)?[0-9a-f]{8}$/)){
			return true;
		}
		return false;
	}
	
	//
	// === PRIVATE Helper Classes ==============================================
	//
	
	//
	// --- The IP Class --------------------------------------------------------
	//
	
	// inherit from a 32bit binary number
	function IP(){};
	IP.prototype = new Bin32();
	IP.prototype.constructor = IP;
	
	//
	// --- The Netmask Class ---------------------------------------------------
	//
	
	// inherit from a 32bit binary number
	function Netmask(){};
	Netmask.prototype = new Bin32();
	Netmask.prototype.constructor = Netmask;
	
	// -- Function --
	// Purpose    : Set the value contained in this netmask to a given value
	//              (over ridding the setter in Bin32)
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. A string representing a 32bit netmask in binary
	// Throws     : Throws an error on invalid args
	// Notes      :
	// See Also   :
	Netmask.prototype.set = function(initVal){
		// ensure valid args
		var initString = String(initVal);
		if(!(initString.match(/^1*0*$/) && initString.length == 32)){
			throw "invalid args";
		}
	
		// load the passed value into the object (using the parent constructor)
		Bin32.prototype.set.call(this, initVal);
	
		// return the object
		return this;
	};
	
	// -- Function --
	// Purpose    : get the stored value as a number of bits
	// Returns    : An integer between 0 and 32
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Netmask.prototype.asNumBits = function(){
		var binString = this.get();
		return (binString.match(/1/g) || []).length;
	};
	
	// -- Function --
	// Purpose    : set the value stored in the object based on a number of bits
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. an integer between 0 and 32
	// Throws     : Throws an error on invalid args
	// Notes      :
	// See Also   :
	Netmask.prototype.fromNumBits = function(bitsVal){
		// validate args
		var bitsString = String(bitsVal);
		var bitsInt = parseInt(bitsVal)
		if(!(bitsString.match(/^\d+$/) && bitsInt <= 32)){
			throw "invalid args";
		}
		
		// set the value
		for(var i = 0; i < this.bits.length; i++){
			if(i < bitsInt){
				this.bits[i] = 1;
			}else{
				this.bits[i] = 0;
			}
		}
		
		// return reference to self
		return this;
	};
	
	// -- Function --
	// Purpose    : set the value stored in the object based on a dotted quad
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. a dotted quad that is also a valid netmask
	// Throws     : Throws an error on invalid args
	// Notes      : Overrides the function from Bin32 to add extra validation
	// See Also   :
	Netmask.prototype.fromDottedQuad = function(quadVal){
		// validate args
		if(!isDottedQuad(quadVal)){
			throw "invalid args";
		}
		
		// convert to a string of bits using Bin32
		var bitString = new Bin32().fromDottedQuad(quadVal).get();
		
		// make sure the bits are a valid netmask
		if(!bitString.match(/^1*0*$/)){
			throw "dotted quad does not represent a valid netmask";
		}
		
		// call the setter
		return this.set(bitString);
	};
	
	// -- Function --
	// Purpose    : set the value stored in the object based on a hex string
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. hex string that is also a valid netmask
	// Throws     : Throws an error on invalid args
	// Notes      : Overrides the function from Bin32 to add extra validation
	// See Also   :
	Netmask.prototype.fromHexString = function(hexVal){
		// validate args
		if(!is32BitHex(hexVal)){
			throw "invalid args";
		}
		
		// convert to a string of bits using Bin32
		var bitString = new Bin32().fromHexString(hexVal).get();
		
		// make sure the bits are a valid netmask
		if(!bitString.match(/^1*0*$/)){
			throw "hex string does not represent a valid netmask";
		}
		
		// call the setter
		return this.set(bitString);
	};
	
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
		this.bits = [];
		for(var i = 0; i < 32; i++){
			this.bits[i] = 0;
		}
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
	// Purpose    : load a dotted quad into the object
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. a string containing a valid dotted quad
	// Throws     : Throws an error in invalid args
	// Notes      :
	// See Also   :
	Bin32.prototype.fromDottedQuad = function(dottedQuadVal){
		// validate the args
		var dottedQuadString = String(dottedQuadVal);
		if(!isDottedQuad(dottedQuadString)){
			throw "invalid args";
		}
		
		// split the quad and convert each of the bits to binary and concat
		var quadParts = dottedQuadString.split(/[.]/);
		var ans = '';
		for(var i = 0; i < quadParts.length; i++){
			ans += dec2bin8bit(quadParts[i]);
		}
		
		// sanity check the resulting binary number
		if(!ans.match(/^[01]{32}$/)){
			throw "calculation error - did not get the expected 32bit binary string";
		}
		
		// store the bits
		this.set(ans);
		
		// return a reference to self
		return this;
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
	
	// -- Function --
	// Purpose    : load a hex value into this object
	// Returns    : A reference to the object - to facilitate function chainging
	// Arguments  : 1. a string containing a valid 23bit hex string
	// Throws     : Throws an error on invalid args
	// Notes      : This function accepts strings with or without the 0x prefix
	// See Also   :
	Bin32.prototype.fromHexString = function(hexVal){
		// validate args
		var hexString = String(hexVal).toLowerCase();
		if(!is32BitHex(hexString)){
			throw "invalid args"
		}
		
		// strip the optional 0x prefix
		hexString = hexString.replace(/^0x/, '');
		
		// assemble a binary string on hex character at a time
		var ans = '';
		for(var i = 0; i < hexString.length; i++){
			ans += hex2fourBits(hexString.charAt(i));
		}
		
		// sanity check it
		if(!ans.match(/^[01]{32}$/)){
			throw "calculation error - expected to produce 32bit string (" + ans + ")";
		}
		
		// set the value of the object
		this.set(ans);
		
		// return a reference to self
		return this;
	};
	
	// -- Function --
	// Purpose    : perform a bitwise AND between this object and another
	// Returns    : a binary string 32 bits long
	// Arguments  : 1. an object containing an attribute bits that's a 32 long
	//                 array
	// Throws     : Throws an error on invalid args
	// Notes      : This function doesn't check for type to facilitate
	//              polymorphism, instead it checks that a property bits exists,
	//              is an array, is 32 characters long, and contains all 1s and
	//              0s
	// See Also   :
	Bin32.prototype.bitwiseAnd = function(binInstance){
		// validate args
		if(!(binInstance && binInstance.bits)){
			throw "invalid args";
		}
		if(!(toString.call(binInstance.bits) === "[object Array]")){
			throw "invalid args";
		}
		if(binInstance.bits.length != 32){
			throw "invalid args";
		}
		if(!binInstance.bits.join('').match(/^[01]{32}$/)){
			throw "invalid args";
		}
		
		// do the math
		var ans = '';
		for(var i = 0; i < this.bits.length; i++){
			if(this.bits[i] == 1 && binInstance.bits[i] == 1){
				ans += '1';
			}else{
				ans += '0';
			}
		}
		
		// sanity check the result
		if(!ans.match(/^[01]{32}$/)){
			throw "calculation error - expected 32bit binary string (" + ans + ")";
		}
		
		//return the string
		return ans;
	};
	
}(window.bartificer = window.bartificer || {}));