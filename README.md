bartificer.ip.js
================

A collection of Javascript 'classes' for representing and processing IP
addresses, IP Netmasks, and IP Subnets.

bartificer.ip.IP Class
----------------------

This class models an IP address.

### Constructor ###

	var ip1 = new bartificer.ip.IP();
	var ip2 = new bartificer.ip.IP('192.168.0.1');
	
The constructors optionally takes one argument, a string to try parse as an IP
address. The passed value is interpreted by `.parse()`, so any value that 
function can interpret can be passed to the construtor. If no argument is 
passed, the object is initialised as representing `0.0.0.0`.

### .parse() ###

	ipInstance1.parse('192.168.0.1');
	ipInstance2.parse('192.168.000.001');
	ipInstance3.parse('11000000101010000000000000000001');
	ipInstance4.parse('0xc0a80001');
	ipInstance5.parse('c0a80001');
	
A function for loading a value into an IP object. A valid IP address must be
passed as a string, or an error will be thrown. The function can parse strings
representing IP addresses in three formats, dotted quads (with or without
padding `0`s), binary strings, and hexidecimal strings (with or without the
`0x` prefix).

This function returns a reference to the calling object to facilitate function
chainging.

### .toString() ###

	var ipString = ipInstance.toString();
	
A function to return the value stored in an IP object as a string. IP addresses
are always rendred without `0` padding (`192.168.0.1` rather than 
`192.168.000.001`).

### .asDottedQuad() ###

	var ipString = ipInstance.asDottedQuad();
	
A synonym for `.toString()`.

### .fromDottedQuad() ###

	ipInstance1.fromDottedQuad('192.168.0.1');
	ipInstance2.fromDottedQuad('192.168.000.001');
	
A function to set the value stord in an IP object based on a dotted quad as a
string. Leading `0`s are permitted as long as no part of the quad is more than
three characters long.

This function returns a reference to the calling object to facilitate function
chainging.

### .asBinaryString() ###

	var binaryString = ipInstance.asBinaryString();
	
A function to return the value stored in an IP object based on a string of 32 
`1`s and `0`s.

### .fromBinaryString() ###

	ipInstance1.fromBinaryString('11000000101010000000000000000001');
	
A function to set the value stored in an IP object based on a string of 32 `1`s 
and `0`s.

This function returns a reference to the calling object to facilitate function
chainging.

### .asHexString() ###

	var hexString = ipInstance.asHexString();

A function to return the value stored in an IP object as a string of hexidecimal
characters, pre-fixed with `0x`, e.g. `0xc0a80001`.

### .fromHexString() ###

	ipInstance1.fromHexString('0xc0a80001');
	ipInstance2.fromHexString('c0a80001');
	
A function to set the value stored in an IP object based on a hexidecimal
string. Note that the `0x` prefix is optional.

This function returns a reference to the calling object to facilitate function
chainging.

### .clone() ###

	var ipInstance2 = ipInstance1.clone();
	
A function to return a new IP object representing the same value as the one
stored in the calling object.

### .equals() ###

	var ipInstance1 = new bartificer.ip.IP('192.168.0.1');
	var ipInstance2 = new bartificer.ip.IP('192.168.000.001');
	ipInstance1.equals(ipInstance2); # true
	ipInstance1.equals('192.168.0.1'); # true
	ipInstance1.equals('192.168.000.001'); # true
	ipInstance1.equals('11000000101010000000000000000001'); # true
	ipInstance1.equals('0xc0a80001'); # true
	ipInstance1.equals('c0a80001'); # true
	
A function to test if a given value represents the same IP address as the one
stored in the calling object. The test value can be an IP object, or a string
representing an IP as a dotted quad, a binary string, or a hexidecimal string.

If the values match, true is returned, otherwise, `false` is returned.

### .bitwiseAnd() ###

	var binaryString = ipInstance1.bitwiseAnd(ipInstance2);
	var binaryString = ipInstance1.bitwiseAnd(netmaskInstance1);
	var binaryString = ipInstance1.bitwiseAnd('11000000101010000000000000000001');
	var binaryString = ipInstance1.bitwiseAnd('0xc0a80001');
	var binaryString = ipInstance1.bitwiseAnd('c0a80001');
	var binaryString = ipInstance1.bitwiseAnd('192.168.0.1');
	var binaryString = ipInstance1.bitwiseAnd('192.168.000.001');
	
This function performs a bitwise binary AND operation between the calling object
and the passed value, which can be another IP obect, a Netmask object, or a
string representing a 32bit binary number as a binary string, hex string, or
dotted quad. The value returned is a 32 character long string of `1`s and `0`s.