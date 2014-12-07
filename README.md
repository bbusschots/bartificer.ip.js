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
	var ip3 = new bartificer.ip.IP('192.168.000.001');
	var ip4 = new bartificer.ip.IP('11000000101010000000000000000001');
	var ip5 = new bartificer.ip.IP('0xc0a80001');
	var ip6 = new bartificer.ip.IP('c0a80001');
	
The constructors optionally takes one argument, a string to try parse as an IP
address. The passed value is interpreted by `.parse()`, so any value that 
function can interpret can be passed to the construtor. If no argument is 
passed, the object is initialised as representing `0.0.0.0`.

### .parse() ###

	ip1.parse('192.168.0.1');
	ip2.parse('192.168.000.001');
	ip3.parse('11000000101010000000000000000001');
	ip4.parse('0xc0a80001');
	ip5.parse('c0a80001');
	
A function for loading a value into an IP object. A valid IP address must be
passed as a string, or an error will be thrown. This function can parse strings
representing IP addresses in three formats; dotted quads (with or without
padding `0`s), binary strings, and hexidecimal strings (with or without the
`0x` prefix).

This function returns a reference to the calling object to facilitate function
chainging.

### .toString() ###

	var ipString = ip1.toString();
	
A function to return the value stored in an IP object as a string. IP addresses
are always rendred without `0` padding (`192.168.0.1` rather than 
`192.168.000.001`).

### .asDottedQuad() ###

	var ipString = ip1.asDottedQuad();
	
A synonym for `.toString()`.

### .fromDottedQuad() ###

	ip1.fromDottedQuad('192.168.0.1');
	ip2.fromDottedQuad('192.168.000.001');
	
A function to set the value stord in an IP object based on a dotted quad as a
string. Leading `0`s are permitted as long as no part of the quad is more than
three characters long.

This function returns a reference to the calling object to facilitate function
chainging.

### .asBinaryString() ###

	var binaryString = ip1.asBinaryString();
	
A function to return the value stored in an IP object as a string of 32 `1`s and
`0`s.

### .fromBinaryString() ###

	ip1.fromBinaryString('11000000101010000000000000000001');
	
A function to set the value stored in an IP object based on a string of 32 `1`s 
and `0`s.

This function returns a reference to the calling object to facilitate function
chainging.

### .asHexString() ###

	var hexString = ip1.asHexString();

A function to return the value stored in an IP object as a string of hexidecimal
characters, pre-fixed with `0x`, e.g. `0xc0a80001`.

### .fromHexString() ###

	ip1.fromHexString('0xc0a80001');
	ip1.fromHexString('c0a80001');
	
A function to set the value stored in an IP object based on a hexidecimal
string. Note that the `0x` prefix is optional.

This function returns a reference to the calling object to facilitate function
chainging.

### .clone() ###

	var ip2 = ip1.clone();
	
A function to return a new IP object representing the same value as the one
stored in the calling object.

### .equals() ###

	var ip1 = new bartificer.ip.IP('192.168.0.1');
	var ip2 = new bartificer.ip.IP('192.168.000.001');
	ip1.equals(ip2); # true
	ip1.equals('192.168.0.1'); # true
	ip1.equals('192.168.000.001'); # true
	ip1.equals('11000000101010000000000000000001'); # true
	ip1.equals('0xc0a80001'); # true
	ip1.equals('c0a80001'); # true
	
A function to test if a given value represents the same IP address as the one
stored in the calling object. The test value can be an IP object, or a string
representing an IP as a dotted quad, a binary string, or a hexidecimal string.

If the values match, true is returned, otherwise, `false` is returned.

### .bitwiseAnd() ###

	var binaryString1 = ip1.bitwiseAnd(ip2);
	var binaryString2 = ip1.bitwiseAnd(mask1);
	var binaryString3 = ip1.bitwiseAnd('11000000101010000000000000000001');
	var binaryString4 = ip1.bitwiseAnd('0xc0a80001');
	var binaryString5 = ip1.bitwiseAnd('c0a80001');
	var binaryString6 = ip1.bitwiseAnd('192.168.0.1');
	var binaryString7 = ip1.bitwiseAnd('192.168.000.001');
	
This function performs a bitwise binary AND operation between the calling object
and the passed value, which can be another IP object, a Netmask object, or a
string representing a 32bit binary number as a binary string, hex string, or
dotted quad. The value returned is a 32 character long string of `1`s and `0`s.

bartificer.ip.Netmask Class
---------------------------

This class models an IP Netmask. A netmask is very similar to an IP address, but
with more stringent restrictions. Like IP addresses, netmasks are 32bit binary
numbers, but unlike IP addresses, their bit value has to follow a fixed pattern;
zero or more `1`s followed by zero or more `0s`.

Because of this similarity, much of the functionality in `bartificer.ip.Netmask`
is the same as that in `bartificer.ip.IP`, but with extra checking added to all
functions that alter the value stored in the object. Another difference is that
a Netmask can be represented as simply the number of leading 1s in the netmask,
in fact, this is the default representation in CIDR.

### Constructor ###

	var mask1 = new bartificer.ip.Netmask();
	var mask2 = new bartificer.ip.Netmask(24);
	var mask3 = new bartificer.ip.Netmask('255.255.255.0');
	var mask4 = new bartificer.ip.Netmask('255.255.255.000');
	var mask5 = new bartificer.ip.Netmask('11111111111111111111111100000000');
	var mask6 = new bartificer.ip.Netmask('0xffffff00');
	var mask7 = new bartificer.ip.Netmask('ffffff00');
	
The constructors optionally takes one argument, a string to try parse as a 
netmask. The passed value is interpreted by `.parse()`, so any value that 
function can interpret can be passed to the construtor. If no argument is 
passed, the object is initialised as representing a zero-bit netmask.

### .parse() ###

	mask1.parse(24);
	mask2.parse('255.255.255.0');
	mask3.parse('255.255.255.000');
	mask4.parse('11111111111111111111111100000000');
	mask5.parse('0xffffff00');
	mask6.parse('ffffff00');
	
A function for loading a value into a Netmask object. A valid netmask must be
passed as a string, or an error will be thrown. This function can parse strings
representing netmasks in four formats; a number of bits, dotted quads (with or 
without padding `0`s), binary strings, and hexidecimal strings (with or without 
the `0x` prefix).

This function returns a reference to the calling object to facilitate function
chainging.

### .toString() ###

	var netmaskString = mask1.toString();
	
A function to return the value stored in a Netmask object as a string. The
netmask is rendered as a number of bits, e.g. `24`.

### .asNumBits() ###

	var netmaskInt = mask1.asNumBits();
	
A function to return the value stored in a Netmask object as the number of `1`s
at the start of the binary representation of the mask. This function returns the
same value as .toString(), but as a number rather than a string.

### .fromNumBits() ###

	mask1.fromNumbits(24);
	mask2.fromNumbits('24');

A function to set the value stored in a Netmask object based on the number of
`1`s at the start of the binary representation of the mask. The number of bits
can be passed as a number or a string.

This function returns a reference to the calling object to facilitate function
chainging.

### .asDottedQuad() ###

	var netmaskString = mask1.asDottedQuad();
	
A function to return the value stored in a Netmask object as a dotted quad, e.g.
`255.255.255.0`.

### .fromDottedQuad() ###

	mask1.fromDottedQuad('192.168.0.1');
	mask2.fromDottedQuad('192.168.000.001');
	
A function to set the value stord in a Netmask object based on a dotted quad as 
a string. Leading `0`s are permitted as long as no part of the quad is more than
three characters long.

This function returns a reference to the calling object to facilitate function
chainging.

### .asBinaryString() ###

	var binaryString = mask1.asBinaryString();
	
A function to return the value stored in a Netmask object as a string of 32 `1`s
and `0`s.

### .fromBinaryString() ###

	mask1.fromBinaryString('11111111111111111111111100000000');
	
A function to set the value stored in a Netmask object based on a string of 32
`1`s and `0`s.

This function returns a reference to the calling object to facilitate function
chainging.

### .asHexString() ###

	var hexString = mask1.asHexString();

A function to return the value stored in a Netmask object as a string of 
hexidecimal characters, pre-fixed with `0x`, e.g. `0xc0a80001`.

### .fromHexString() ###

	mask1.fromHexString('0xffffff00');
	mask2.fromHexString('ffffff00');
	
A function to set the value stored in a Netmask object based on a hexidecimal
string. Note that the `0x` prefix is optional.

This function returns a reference to the calling object to facilitate function
chainging.

### .clone() ###

	var mask2 = mask1.clone();
	
A function to return a new Netmask object representing the same value as the one
stored in the calling object.

### .equals() ###

	var mask1 = new bartificer.ip.Netmask(24);
	var mask2 = new bartificer.ip.Netmask('255.255.255.0');
	mask1.equals(mask2); # true
	mask1.equals(24); # true
	mask1.equals('24'); # true
	mask1.equals('255.255.255.0'); # true
	mask1.equals('255.255.255.000'); # true
	mask1.equals('11111111111111111111111100000000'); # true
	mask1.equals('0xffffff00'); # true
	mask1.equals('ffffff00'); # true
	
A function to test if a given value represents the same netmask as the one
stored in the calling object. The test value can be a Netmask object, a number
between 0 and 32 inclusive, or a string representing a netmask as a number 
between 0 and 32 inclusive, a dotted quad, a binary string, or a hexidecimal
string.

If the values match, true is returned, otherwise, `false` is returned.

### .bitwiseAnd() ###

	var binaryString = mask1.bitwiseAnd(mask2);
	var binaryString = mask1.bitwiseAnd(ip1);
	var binaryString = mask1.bitwiseAnd('11000000101010000000000000000001');
	var binaryString = mask1.bitwiseAnd('0xc0a80001');
	var binaryString = mask1.bitwiseAnd('c0a80001');
	var binaryString = mask1.bitwiseAnd('192.168.0.1');
	var binaryString = mask1.bitwiseAnd('192.168.000.001');
	
This function performs a bitwise binary AND operation between the calling object
and the passed value, which can be another Netmask object, an IP object, or a
string representing a 32bit binary number as a binary string, hex string, or
dotted quad. The value returned is a 32 character long string of `1`s and `0`s.