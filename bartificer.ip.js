// Copyright (c) 2014, Bart Busscots T/A Bartificer Web Solutions
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR 
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS 
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF 
// THE POSSIBILITY OF SUCH DAMAGE.

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
		
		// Make sure we get a string to parse, even if we were passed an object
		var netmaskString;
		if(isBin32Compatible(netmaskVal)){
			netmaskString = netmaskVal.asBinaryString();
		}else{
			netmaskString = String(netmaskVal);
		}
		
		// interpret the string
		if(netmaskString.match(/^\d{1,2}$/) && parseInt(netmaskVal) <= 32){
			return this.fromNumBits(netmaskString);
		}else if(isDottedQuad(netmaskString)){
			return this.fromDottedQuad(netmaskString);
		}else if(is32BitBinary(netmaskString)){
			return this.fromBinaryString(netmaskString);
		}else if(is32BitHex(netmaskString)){
			return this.fromHexString(netmaskString);
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
		
		// if arguments were passed, try init the object with them
		if(arguments.length >= 1){
			if(arguments.length == 1){
				this.parse(arguments[0]);
			}else{
				this.parse(arguments[0], arguments[1]);
			}
		}
	};
	
	// -- Function --
	// Purpose    : render the subnet in CIDR format
	// Returns    : a string
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
	//              1. a Subnet object
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
		}else{
			// we are working with strings
			if(arguments.length == 1){
				try{
					subnet = new Subnet(arguments[0]);
				}catch(err){
					return false;
				}
			}else{
				try{
					subnet = new Subnet(arguments[0], arguments[1]);
				}catch(err){
					console.log(err);
					return false;
				}
			}
		}
		
		// check the subnets are the same - if so return true
		if(this.toString() == subnet.toString()){
			return true;
		}
		
		// if we got here there were no valid args, so return false
		return false;
	};
	
	// -- Function --
	// Purpose    : Clone a Subnet object
	// Returns    : a new Subnet object representing the same value as this one
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   : 
	Subnet.prototype.clone = function(){
		return new Subnet(this.toString());
	};
	
	// -- Function --
	// Purpose    : get the network address
	// Returns    : an IP object
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : This function returns a clone, not a reference to the
	//              actual value stored in the object
	// See Also   :
	Subnet.prototype.address = function(){
		return this._netAddress.clone();
	};
	
	// -- Function --
	// Purpose    : get the net address as a dotted quad
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.addressAsString = function(){
		return this._netAddress.asDottedQuad();
	};
	
	// -- Function --
	// Purpose    : get the netmask
	// Returns    : a Netmask object
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.mask = function(){
		return this._netMask.clone();
	};
	
	// -- Function --
	// Purpose    : get the netmask as a dotted quad
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.maskAsString = function(){
		return this._netMask.asDottedQuad();
	};
	
	// -- Function --
	// Purpose    : get the netmask as a number of bits
	// Returns    : a number
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Subnet.prototype.maskAsNumBits = function(){
		return this._netMask.asNumBits();
	};
	
	// -- Function --
	// Purpose    : set stored subnet based on the arguments
	// Returns    : a reference to the object - to facilitate function chaining
	// Arguments  : 1. a string containing a valid IP seprated from a valid
	//                 netmask by a /
	//              -OR- 
	//              1. a string or object representing an IP address
	//              2. a string or object representing a netmask
	// Throws     : Throws error on invalid args
	// Notes      :
	// See Also   :
	Subnet.prototype.parse = function(){
		// figure out if we were called in 1 argument or 2 argument form and
		// interpret the args to create a IP and subnet objects
		var ipVal;
		var maskVal;
		if(arguments.length == 1){
			// we are the one argument form, so treat it like a string
			var subnetString = String(arguments[0]);
			var subnetParts = subnetString.split(/[/]/);
			if(subnetParts.length != 2){
				throw "parse error - failed to interpret the argument as a subnet: " + subnetString;
			}
			ipVal = subnetParts[0];
			maskVal = subnetParts[1];
		}else if(arguments.length > 1){
			ipVal = arguments[0];
			maskVal = arguments[1];
		}else{
			throw "invalid arguments - must provide at least one argument";
		}
		
		// try generate IP and Subnet objects based on the passed values
		var ip = new IP(ipVal); // can throw error
		var mask = new Netmask(maskVal); // can throw error
		
		
		// convert the passed IP to a network address
		var net = new IP(ip.bitwiseAnd(mask));
		
		// store the values
		this._netAddress = net;
		this._netMask = mask;
		
		// return a reference to self
		return this;
	};
	
	// -- Function --
	// Purpose    : calculate and return the broadcast address for this subnet
	// Returns    : an IP object
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   :
	Subnet.prototype.broadcast = function(){
		// start by inverting the netmask
		var inverseNetMask = this._netMask.bitwiseInvert();
		
		// or the inverse netmask with the net address to create the broadcast
		return new IP(this._netAddress.bitwiseOr(inverseNetMask));
	};
	
	// -- Function --
	// Purpose    : calculate and return the broadcast address for this subnet
	//              as a dotted quad
	// Returns    : a string
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : 
	// See Also   :
	Subnet.prototype.broadcastAsString = function(){
		return this.broadcast().toString();
	};
	
	// -- Function --
	// Purpose    : check if this subnet contains a given IP address
	// Returns    : true or false
	// Arguments  : 1. an IP address to test as a string or an IP Object
	// Throws     : NOTHING
	// Notes      : Returns false on invalid args. The net and broadcast
	//              addresses are considered to be containined within a subnet.
	// See Also   :
	Subnet.prototype.containsIP = function(ipVal){
		// make sure we got an argument - if not, return false
		if(arguments.length < 1){
			return false;
		}
		
		// interpret the test value and create an IP object from it
		var testIp;
		try{
			testIp = new IP(ipVal);
		}catch(err){
			// couldn't interpret the input, so return false
			return false;
		}
		
		// do the math
		if(this._netAddress.asBinaryString() == testIp.bitwiseAnd(this._netMask)){
			// the net addresses match, so return true
			return true;
		}
		
		// default to false
		return false;
	};
	
	// -- Function --
	// Purpose    : check if this subnet entirely contains a given Subnet within
	//              it
	// Returns    : true or false
	// Arguments  : 1. A Subnet object or a string representation of a subnet
	//              -- OR --
	//              1. An IP object, or a string representing an IP address
	//              2. A Netmask object, or a string representing a netmask
	// Notes      : Returns false on invalid args, and if both subnets are the
	//              same true is still returned.
	// See Also   :
	Subnet.prototype.containsSubnet = function(){
		// make sure we got an argument - if not, return false
		if(arguments.length < 1){
			return false;
		}
		
		// interpret the test values and create a Subnet object from them
		var subnet;
		if(arguments.length == 1){
			try{
				subnet = new Subnet(arguments[0]);
			}catch(err){
				return false;
			}
		}else{
			try{
				subnet = new Subnet(arguments[0], arguments[1]);
			}catch(err){
				return false;
			}
		}
		
		// if both the net address and broadcast address are contained in this
		// subnet, then the whole subnet is contained
		if(this.containsIP(subnet.address()) && this.containsIP(subnet.broadcast())){
			return true;
		}
		
		// default to false
		return false;
	};
	
	// -- Function --
	// Purpose    : check if this subnet contains a given IP address or Subnet
	// Returns    : true or false
	// Arguments  : 1. a representation of an IP address
	//              -- OR --
	//              1. a representation of a subnet
	//              -- OR --
	//              1. a representation of an IP address
	//              2. a representation of a netmask
	// Throws     : NOTHING
	// Notes      : Returns false on invalid args. An IP test is assumed unless
	//              there is more than one argument, the single argument is a
	//              Subnet object, or the single argument is a string containing
	//              a /
	// See Also   :
	Subnet.prototype.contains = function(){
		// make sure there is atleast one argument
		if(arguments.length < 1){
			return false;
		}
		
		// check for a subnet
		if(arguments[0] instanceof Subnet){
			return this.containsSubnet(arguments[0]);
		}
		if(arguments.length > 1){
			return this.containsSubnet(arguments[0], arguments[1]);
		}
		if(typeof arguments[0] == 'string' && arguments[0].match(/[/]/)){
			return this.containsSubnet(arguments[0]);
		}
		
		// if we got here, assume an IP
		return this.containsIP(arguments[0]);
	};
	
	// -- Function --
	// Purpose    : return the number of hosts the subnet can contain
	// Returns    : a whole number
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      : For the special case of a netmask of /32, 1 is returned.
	// See Also   :
	Subnet.prototype.numHosts = function(){
		// check for the special case of the single-host subnet
		if(this.maskAsNumBits() == 32){
			return 1;
		}
		
		// do the math
		var numHostBits = 32 - this.maskAsNumBits();
		var numHosts = Math.pow(2, numHostBits) - 2;
		
		// return
		return numHosts;
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
	// Purpose    : Render the 32bit address as a dotted quad
	// Returns    : a String
	// Arguments  : NONE
	// Throws     : NOTHING
	// Notes      :
	// See Also   :
	Bin32.prototype.toString = function(){
		return this.asDottedQuad();
	};
	
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
		if(isBin32Compatible(binVal)){
			return this.fromBinaryString(binVal.asBinaryString());
		}
		if(isDottedQuad(binVal)){
			return this.fromDottedQuad(binVal);
		}
		if(is32BitBinary(binVal)){
			return this.fromBinaryString(binVal);
		}
		if(is32BitHex(binVal)){
			return this.fromHexString(binVal);
		}
		
		// if we get here we were not able to parse the value, so throw an error
		throw "parse error - failed to parse the given value as representing a 32bit binary number: " + binVal;
	};
	
	// -- Function --
	// Purpose    : perform a bitwise OR between this object and another
	// Returns    : a binary string 32 bits long
	// Arguments  : NONE
	// Throws     : Throws an error on invalid args
	// Notes      : 
	// See Also   :
	Bin32.prototype.bitwiseInvert = function(){
		// do the math
		var localBinString = this.asBinaryString();
		var ans = '';
		for(var i = 0; i < localBinString.length; i++){
			if(localBinString.charAt(i) == '1'){
				ans += '0';
			}else{
				ans += '1';
			}
		}
		
		// sanity check the result
		if(!ans.match(/^[01]{32}$/)){
			throw "calculation error - unexpected result - expected 32bit binary string but got: " + ans;
		}
		
		//return the string
		return ans;
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
	
	// -- Function --
	// Purpose    : perform a bitwise OR between this object and another
	// Returns    : a binary string 32 bits long
	// Arguments  : 1. a string representing a 32bit binary number in some way
	//              --OR--
	//              1. a Bin32 compatible object
	// Throws     : Throws an error on invalid args
	// Notes      : 
	// See Also   :
	Bin32.prototype.bitwiseOr = function(inputVal){
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
			if(localBinString.charAt(i) == '1' || inputBinString.charAt(i) == '1'){
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
	
	// -- Function --
	// Purpose    : Increment the value of a 32bit number by 1
	// Returns    : a binary string 32 bits long
	// Arguments  : NONE
	// Throws     : Throws an error if we overflow 32bits
	// Notes      : 
	// See Also   :
	Bin32.prototype.increment = function(){
		// start with the current value of the object reversed
		var revBinString = this.asBinaryString().split('').reverse().join('');
		
		// apply the algorythm
		var ansRev = '';
		var i = 0;
		var zeroFlipped = false
		for(var i = 0; i < revBinString.length; i++){
			if(!zeroFlipped){
				if(revBinString.charAt(i) == '0'){
					ansRev += '1';
					zeroFlipped = true;
				}else{
					ansRev += '0';
				}
			}else{
				ansRev += revBinString.charAt(i);
			}
		}
		
		// make sure we haven't overflowed
		if(!zeroFlipped){
			throw "integer overflow";
		}
		
		//un-reverse and return the answer
		return ansRev.split('').reverse().join('');
	};
	
	// -- Function --
	// Purpose    : Decrement the value of a 32bit number by 1
	// Returns    : a binary string 32 bits long
	// Arguments  : NONE
	// Throws     : Throws an error if we overflow 32bits
	// Notes      : 
	// See Also   :
	Bin32.prototype.decrement = function(){
		// start with the current value of the object reversed
		var revBinString = this.asBinaryString().split('').reverse().join('');
		
		// apply the algorythm
		var ansRev = '';
		var i = 0;
		var oneFlipped = false
		for(var i = 0; i < revBinString.length; i++){
			if(!oneFlipped){
				if(revBinString.charAt(i) == '1'){
					ansRev += '0';
					oneFlipped = true;
				}else{
					ansRev += '1';
				}
			}else{
				ansRev += revBinString.charAt(i);
			}
		}
		
		// make sure we haven't overflowed
		if(!oneFlipped){
			throw "integer overflow";
		}
		
		//un-reverse and return the answer
		return ansRev.split('').reverse().join('');
	};
	
	//
	// === Exports =============================================================
	//
	
	bartificer.ip = {};
	bartificer.ip.IP = IP;
	bartificer.ip.Netmask = Netmask;
	bartificer.ip.Subnet = Subnet;
	bartificer.ip.isDottedQuad = isDottedQuad;
	bartificer.ip.is32BitHexString = is32BitHex;
	bartificer.ip.is32BitBinaryString = is32BitBinary;
	
}(window.bartificer = window.bartificer || {}));