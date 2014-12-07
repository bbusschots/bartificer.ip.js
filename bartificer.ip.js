// a self-extracting anonymous function to allow the bartificer namespace be used in a sane way
(function(bartificer, undefined){
	//
	// ==== PUBLIC Classes =====================================================
	//
	
	
	//
	// --- The Public IP Class -------------------------------------------------
	//
	
	// -- Function --
	// Purpose    : CONSTRUCTOR
	// Returns    : VOID - intended to be called via new
	// Arguments  : 1. OPTIONAL - a IP address as a string
	// Throws     : Throws an error if an invalid argument is passed
	// Notes      : This class inherits from Bin32 (not published)
	// See Also   :
	function IP(){
		// start by instantiating a blank object
		this._bits = gen32bitZeroArray();
		
		// if an argument was passed, try init the object with it
		if(arguments.length >= 1){
			this.parse(arguments[0]);
		}
	};
	IP.prototype = new Bin32();
	IP.prototype.constructor = IP;
	
	// -- Function --
	// Purpose    : Render the IP address as a String
	// Returns    : a String
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	IP.prototype.toString = function(){
		return this.asDottedQuad();
	};
		
	// -- Function --
	// Purpose    : Clone an IP object
	// Returns    : a new IP object representing the same value as this one
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   : 
	IP.prototype.clone = function(){
		return new IP(this.asDottedQuad());
	};
	
	//
	// --- The Public Netmask Class --------------------------------------------
	//
	
	// -- Function --
	// Purpose    : CONSTRUCTOR
	// Returns    : VOID - intended to be called via new
	// Arguments  : 1. OPTIONAL - a Netmask address as a string
	// Throws     : Throws an error if an invalid argument is passed
	// Notes      : This class inherits from Bin32 (not published)
	// See Also   :
	function Netmask(){
		this._bits = gen32bitZeroArray();
		
		// if an argument was passed, try init the object with it
		if(arguments.length >= 1){
			this.parse(arguments[0]);
		}
	};
	Netmask.prototype = new Bin32();
	Netmask.prototype.constructor = Netmask;
	
	// -- Function --
	// Purpose    : Render the Netmask address as a String
	// Returns    : a String
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Netmask.prototype.toString = function(){
		return String(this.asNumBits());
	};
	
	// -- Function --
	// Purpose    : Test if a passed value represents the netmask stored in this
	//              object
	// Returns    : true or false
	// Arguments  : 1. A Bin32 compatible object
	//              -OR-
	//              1. A string representing a 32bit number in some way
	// Throws     : NOTHING
	// Notes      : false is returned on invalid arguments. This function
	//              overrides Bin32.equals(), implementing extra tests before
	//              falling back to Bin32.equals() if no equality was found in
	//              the custom tests.
	// See Also   : 
	Netmask.prototype.equals = function(testVal){
		// make sure we have been passed a value to test
		if(arguments.length < 1){
			return false; // no args, so return false
		}
		
		// if we have something that might be a number of bits, check it
		if(typeof testVal == 'string' || typeof testVal == 'number'){
			if(String(testVal).match(/^\d{1,2}$/) && this.asNumBits() == parseInt(testVal)){
				return true;
			}
		}
		
		// if we didn't find a matching number of bits, let Bin32's
		// implementation of .equals() process the value
		return Bin32.prototype.equals.call(this, testVal);
	};
	
	// -- Function --
	// Purpose    : Clone a Netmask object
	// Returns    : a new Netmask object representing the same value as this one
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   : 
	Netmask.prototype.clone = function(){
		return new Netmask(this.asDottedQuad());
	};
	
	// -- Function --
	// Purpose    : Load the object from a binary string (over ridding the 
	//              same function from Bin32 with more restrictions)
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. A string representing a 32bit netmask in binary
	// Throws     : Throws an error on invalid args
	// Notes      :
	// See Also   :
	Netmask.prototype.fromBinaryString = function(initVal){
		// ensure valid args
		var initString = String(initVal);
		if(!(initString.match(/^1*0*$/) && initString.length == 32)){
			throw "parse error - expected a netmask as a binary string: " + initVal;
		}
	
		// load the passed value into the object (using the parent constructor)
		Bin32.prototype.fromBinaryString.call(this, initVal);
	
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
		var binString = this.asBinaryString();
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
			throw "parse error - expected an integer between 0 and 32 inclusive: " + bitsVal;
		}
		
		// set the value
		for(var i = 0; i < this._bits.length; i++){
			if(i < bitsInt){
				this._bits[i] = 1;
			}else{
				this._bits[i] = 0;
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
			throw "parse error - expected a dotted quad: " + quadVal;
		}
		
		// convert to a string of bits using Bin32
		var bitString = new Bin32().fromDottedQuad(quadVal).asBinaryString();
		
		// make sure the bits are a valid netmask
		if(!bitString.match(/^1*0*$/)){
			throw "parse error - dotted quad does not represent a valid netmask";
		}
		
		// call the setter
		return this.fromBinaryString(bitString);
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
			throw "parse error - expected a 32bit hex value: " + hexVal;
		}
		
		// convert to a string of bits using Bin32
		var bitString = new Bin32().fromHexString(hexVal).asBinaryString();
		
		// make sure the bits are a valid netmask
		if(!bitString.match(/^1*0*$/)){
			throw "parse error - hex string does not represent a valid netmask";
		}
		
		// call the setter
		return this.fromBinaryString(bitString);
	};
	
	// -- Function --
	// Purpose    : Load a value into the object
	// Returns    : a reference to the object (to enable function chaining)
	// Arguments  : 1. the String to parse
	// Throws     : Throws an error if the passed value can't be parsed as a
	//              netmask
	// Notes      : This function overrides Bin32.parse() completely and does
	//              not invoke the parent implementation at all.
	// See Also   :
	Netmask.prototype.parse = function(netmaskVal){
		// make sure we have been passed a value to test
		if(arguments.length < 1){
			throw "invalid arguments - must pass a value to parse";
		}
		
		// Figure out what we have been passed
		var netmaskString = String(netmaskVal);
		if(netmaskString.match(/^\d{1,2}$/) && parseInt(netmaskVal) <= 32){
			return this.fromNumBits(netmaskVal);
		}else if(isDottedQuad(netmaskVal)){
			return this.fromDottedQuad(netmaskVal);
		}else if(is32BitBinary(netmaskVal)){
			return this.fromBinaryString(netmaskVal);
		}else if(is32BitHex(netmaskVal)){
			return this.fromHexString(netmaskVal);
		}
		
		// if we get here we were not able to parse the value, so throw an error
		throw "parse error - failed to parse the given value as a netmask: " + netmaskVal;
	};
	
	//
	// --- The Public Subnet Class ---------------------------------------------
	//
	
	// -- Function --
	// Purpose    : CONSTRUCTOR
	// Returns    : VOID - intended to be called via new
	// Arguments  :
	// Throws     : 
	// Notes      :
	// See Also   :
	Subnet = function(){
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
	Subnet.prototype._set = function(ip, netmask){
		// validate args
		if(!(ip instanceof IP && netmask instanceof Netmask)){
			throw "invalid args";
		}
		
		// store the netmask
		this._netMask = netmask;
		
		//convert the IP to a netaddress and store
		this._netAddress = new IP().fromBinaryString(ip.bitwiseAnd(this._netMask));
	};
	
	// -- Function --
	// Purpose    : render the subnet as a string
	// Returns    : a string in CIDR format
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.toString = function(){
		return '' + this._netAddress.asDottedQuad() + '/' + this._netMask.asNumBits();
	};
	
	// -- Function --
	// Purpose    : check if a passed value represents the same subnet as the
	//              object
	// Returns    : true or false
	// Arguments  : 1. a string representing a subnet
	//              -OR-
	//              1. an IP address as a string
	//              2. a netmask as a string
	//              -OR-
	//              1. a bartificer.Subnet object
	// Throws     : NOTHING
	// Notes      : returns false on invalid args
	// See Also   :
	Subnet.prototype.equals = function(){
		// make sure we got at least one argument
		if(arguments.length < 1){
			return false;
		}
		
		// figure out what mode we are operating in, and try get a Subnet object
		var subnet;
		if(arguments[0] instanceof Subnet){
			// we have been passed a Subnet object, so just save it
			subnet = arguments[0];
		}else if(typeof arguments[0] == 'string'){
			// we are working with strings

			// see if we are the one argument or two argument form
			if(arguments.length > 1){
				// we are of the two-argument form
				try{
					subnet = new Subnet().parse(arguments[0], arguments[1]);
				}catch(err){
					return false;
				}
			}else{
				// we are of the one-argument form
				try{
					subnet = new Subnet().parse(arguments[0]);
				}catch(err){
					return false;
				}
			}
		}
		
		// check the subnets are the same - if so return true
		if(this.toString() == subnet.toString()){
			return true;
		}
		
		// if we got here there was no valid args, so return false
		return false;
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
	Subnet.prototype.parse = function(){
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
	
	// -- Function --
	// Purpose    : get the network address (as a dotted quad)
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.address = function(){
		return this._netAddress.asDottedQuad();
	};
	
	// -- Function --
	// Purpose    : get the network address as a binary string
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.addressAsBinaryString = function(){
		return this._netAddress.asBinaryString();
	};
	
	// -- Function --
	// Purpose    : get the netmask as a bit number
	// Returns    : an integer between 0 and 32 inclusive
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.mask = function(){
		return this._netMask.asNumBits();
	};
	
	// -- Function --
	// Purpose    : get the netmask as a dotted quad
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.maskAsDottedQuad = function(){
		return this._netMask.asDottedQuad();
	};
	
	// -- Function --
	// Purpose    : get the netmask as a hex string
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.maskAsHexString = function(){
		return this._netMask.asHexString();
	};
	
	// -- Function --
	// Purpose    : get the netmask as a binary string
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.maskAsBinaryString = function(){
		return this._netMask.asBinaryString();
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
	//              32bit binary string.
	// Returns    : true or false
	// Arguments  : 1. a string to test
	// Throws     : NOTHING
	// Notes      : If no argument is passed false is returned
	// See Also   :
	function is32BitBinary(testVal){
		var testString = String(testVal);
		if(testString.match(/^[01]{32}$/)){
			return true;
		}
		return false;
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
	
	// -- Function --
	// Purpose    : A helper function to check if an object is compatible with
	//              Bin32 functions
	// Returns    : true or false
	// Arguments  : 1. an object to
	// Throws     : NOTHING
	// Notes      : If no argument is passed false is returned. A compatible
	//              object is simply defined as one that implements 
	//              .asBinaryString()
	// See Also   :
	function isBin32Compatible(testVal){
		// if the test value is not an object - return false
		if(typeof testVal != 'object'){
			return false;
		}
		
		// if the test object does not define a function .asBinaryString - return false
		if(typeof testVal.asBinaryString != 'function'){
			return false;
		}
		
		// if we got here all is well, so return true
		return true;
	}
	
	// -- Function --
	// Purpose    : A helper function to creat a 32 long array of 0s
	// Returns    : an array of 32 0s
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   :
	function gen32bitZeroArray(){
		var bits = [];
		for(var i = 0; i < 32; i++){
			bits[i] = 0;
		}
		return bits;
	}
	
	
	//
	// === PRIVATE Helper Classes ==============================================
	//
	
	//
	// --- The 32bit binary number class ---------------------------------------
	//
	
	// -- Function --
	// Purpose    : CONSTRUCTOR
	// Returns    : VOID - expected to be called via new
	// Arguments  : 1. OPTIONAL - a value to initialise the object with
	// Throws     : NOTHING
	// Notes      : If an argument is passed it is loaded using .parse()
	// See Also   :
	function Bin32(){
		this._bits = gen32bitZeroArray();
		
		// if an argument was passed, try init the object with it
		if(arguments.length >= 1){
			this.parse(arguments[0]);
		}
	}
	
	// -- Function --
	// Purpose    : Test if a passed value represents the 32bit number stored in
	//              this object
	// Returns    : true or false
	// Arguments  : 1. A compatible object
	//              -OR-
	//              1. A 32bit number as some form of string
	// Throws     : NOTHING
	// Notes      : false is returned on invalid arguments. A compatible object
	//              is one that implements a function asBinaryString() 
	// See Also   : 
	Bin32.prototype.equals = function(testVal){
		// make sure we have been passed a value to test
		if(arguments.length < 1){
			return false; // no args, so return false
		}
		
		// check the type of the argument, and act accordingly
		if(typeof testVal == 'string'){
			// we have a string to test
			if(isDottedQuad(testVal) || is32BitBinary(testVal) || is32BitHex(testVal)){
				var testBin32 = new Bin32(testVal);
				if(this.asBinaryString() == testBin32.asBinaryString()){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else if(isBin32Compatible(testVal)){
			// we have been passed a 32bit number of some kind to test
			if(this.asBinaryString() == testVal.asBinaryString()){
				return true;
			}else{
				return false;
			}
		}
		
		// if we got here we were not able to interpret the argument, so return false
		return false;
	};

	
	// -- Function --
	// Purpose    : Return the stored value as a binary string.
	// Returns    : A string of 32 1s and 0s
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Bin32.prototype.asBinaryString = function(){
		return this._bits.join('');
	};

	// -- Function --
	// Purpose    : Set the value contained in this 32bit number to a given value
	// Returns    : A reference to the object - to enable function chaining
	// Arguments  : 1. A string representing a 32bit number
	// Throws     : Throws an error on invalid args
	// Notes      :
	// See Also   :
	Bin32.prototype.fromBinaryString = function(initVal){
		// ensure valid args
		var initString = String(initVal);
		if(!initString.match(/^[01]{32}$/)){
			throw "invalid args";
		}
	
		// load the passed value into the object
		for(var i = 0; i < initString.length; i++){
			if(initString.charAt(i) == 1){
				this._bits[i] = 1;
			}else{
				this._bits[i] = 0;
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
		var binString = this.asBinaryString();
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
			throw "invalid args - expected dotted quad as String got: " + dottedQuadVal;
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
		this.fromBinaryString(ans);
		
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
		var binString = this.asBinaryString();
		var ans = '0x' + fourBits2hex(binString.substring(0,4));
		ans += fourBits2hex(binString.substring(4,8));
		ans += fourBits2hex(binString.substring(8,12));
		ans += fourBits2hex(binString.substring(12,16));
		ans += fourBits2hex(binString.substring(16,20));
		ans += fourBits2hex(binString.substring(20,24));
		ans += fourBits2hex(binString.substring(24,28));
		ans += fourBits2hex(binString.substring(28));
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
		this.fromBinaryString(ans);
		
		// return a reference to self
		return this;
	};
	
	// -- Function --
	// Purpose    : Load a value into the object
	// Returns    : a reference to the object (to enable function chaining)
	// Arguments  : 1. the String to parse
	// Throws     : Throws an error if the passed value can't be parsed as a
	//              32bit value
	// Notes      :
	// See Also   :
	Bin32.prototype.parse = function(binVal){
		// Figure out what we have been passed
		if(isDottedQuad(binVal)){
			return this.fromDottedQuad(binVal);
		}else if(is32BitBinary(binVal)){
			return this.fromBinaryString(binVal);
		}else if(is32BitHex(binVal)){
			return this.fromHexString(binVal);
		}
		
		// if we get here we were not able to parse the value, so throw an error
		throw "parse error - failed to parse the given value as representing a 32bit binary number: " + binVal;
	};
	
	// -- Function --
	// Purpose    : perform a bitwise AND between this object and another
	// Returns    : a binary string 32 bits long
	// Arguments  : 1. a string representing a 32bit binary number in some way
	//              --OR--
	//              1. a Bin32 compatible object
	// Throws     : Throws an error on invalid args
	// Notes      : 
	// See Also   :
	Bin32.prototype.bitwiseAnd = function(inputVal){
		var inputInstance;
		
		// validate args
		if(typeof inputVal == 'string'){
			// we are a string, so try create a Bin32 object from the string
			if(is32BitBinary(inputVal)){
				inputInstance = new Bin32().fromBinaryString(inputVal);
			}else if(is32BitHex(inputVal)){
				inputInstance = new Bin32().fromHexString(inputVal);
			}else if(isDottedQuad(inputVal)){
				inputInstance = new Bin32().fromDottedQuad(inputVal);
			}else{
				throw "parse error - failed to interpret passed string as a 32bit number: " + inputVal;
			}
		}else{
			// not a string, so make sure the passed value is a compatible object
			if(!(isBin32Compatible(inputVal) && is32BitBinary(inputVal.asBinaryString()))){
				throw "invalid arguments - the object passed does not implement a function .asBinaryString()";
			}
			inputInstance = inputVal;
		}
		
		// calculate and sanity check the input binary string
		var inputBinString = String(inputInstance.asBinaryString());
		if(!is32BitBinary(inputBinString)){
			throw "parse error - failed to convert passed value to valid 32bit binary string";
		}
		
		// do the math
		var localBinString = this.asBinaryString();
		var ans = '';
		for(var i = 0; i < localBinString.length; i++){
			if(localBinString.charAt(i) == '1' && inputBinString.charAt(i) == '1'){
				ans += '1';
			}else{
				ans += '0';
			}
		}
		
		// sanity check the result
		if(!ans.match(/^[01]{32}$/)){
			throw "calculation error - unexpected result - expected 32bit binary string but got: " + ans;
		}
		
		//return the string
		return ans;
	};
	
	//
	// === Exports =============================================================
	//
	
	bartificer.ip = {};
	bartificer.ip.IP = IP;
	bartificer.ip.Netmask = Netmask;
	bartificer.ip.Subnet = Subnet;
	
}(window.bartificer = window.bartificer || {}));