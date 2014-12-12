bartificer.ip.js
================

A collection of Javascript 'classes' for representing and processing IP
addresses, IP Netmasks, and IP Subnets.

Synopsys
--------

	// based on an IP and a netmask, get the network's net address and broadcast address
	var net1 = new new bartificer.ip.Subnet('192.168.0.10', '0xffffff00');
	window.alert('The CIDR representation of the subnet is: ' + net1.toString());
	window.alert('The network address is: ' + net1.addressAsString());
	window.alert('The broadcast address is: ' + net1.broadcastAsString());
	
	// declare an IP address
	var ip1 = new bartificer.ip.IP('192.168.0.20');
	
	// check if an IP address is within a subnet
	if(net1.contains(ip1)){
		window.alert("The subnet " + net1.toString() + 'contains the IP ' + ip1.toString());
	}
	
	// declare a netmask
	var mask1 = new bartificer.ip.Netmask(28);
	
	// declare a second subnet and see if it's contained within the first
	var net2 = new bartificer.ip.Subnet('192.168.0.17', mask1);
	if(net1.contains(net2)){
		window.alert("The subnet " + net1.toString() + ' contatains the sucnet ' + net2.toString());
	}
	

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

### .asBinaryString() ###

	var binaryString = ip1.asBinaryString();
	
A function to return the value stored in an IP object as a string of 32 `1`s and
`0`s.

### .fromBinaryString() ###

	ip1.fromBinaryString('11000000101010000000000000000001');
	
A function to set the value stored in an IP object based on a string of 32 `1`s 
and `0`s.

This function returns a reference to the calling object to facilitate function
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

### .clone() ###

	var ip2 = ip1.clone();
	
A function to return a new IP object representing the same value as the one
stored in the calling object.

### .equals() ###

	var ip1 = new bartificer.ip.IP('192.168.0.1');
	var ip2 = new bartificer.ip.IP('192.168.000.001');
	ip1.equals(ip2); // true
	ip1.equals('192.168.0.1'); // true
	ip1.equals('192.168.000.001'); // true
	ip1.equals('11000000101010000000000000000001'); // true
	ip1.equals('0xc0a80001'); // true
	ip1.equals('c0a80001'); // true
	
A function to test if a given value represents the same IP address as the one
stored in the calling object. The test value can be an IP object, or a string
representing an IP as a dotted quad, a binary string, or a hexidecimal string.

If the values match, true is returned, otherwise, `false` is returned.

### .bitwiseInvert() ###

	var binaryString = ip1.bitwiseInvert();
	
This function performs a bitwise binary inversion on the IP address, and returns
the result as a binary string.

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

### .bitwiseOr() ###

	var binaryString1 = ip1.bitwiseOr(ip2);
	var binaryString2 = ip1.bitwiseOr(mask1);
	var binaryString3 = ip1.bitwiseOr('11000000101010000000000000000001');
	var binaryString4 = ip1.bitwiseOr('0xc0a80001');
	var binaryString5 = ip1.bitwiseOr('c0a80001');
	var binaryString6 = ip1.bitwiseOr('192.168.0.1');
	var binaryString7 = ip1.bitwiseOr('192.168.000.001');
	
This function performs a bitwise binary OR operation between the calling object
and the passed value, which can be another IP object, a Netmask object, or a
string representing a 32bit binary number as a binary string, hex string, or
dotted quad. The value returned is a 32 character long string of `1`s and `0`s.

### .increment() ###

	var ip2 = new bartificer.ip.IP(ip1.increment());
	
This function returns a value one greater than the 32bit value stored in the
object as a binary string. If invoked on `255.255.255.255` an error is thrown.

### .decrement() ###

	var ip2 = new bartificer.ip.IP(ip1.decrement());
	
This function returns a value one less than the 32bit value stored in the
object as a binary string. If invoked on `0.0.0.0` an error is thrown.

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

### .toString() ###

	var netmaskString = mask1.toString();
	
A function to return the value stored in a Netmask object as a string. The
netmask is rendered as a dotted quad, e.g. `255.255.255.0`.

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

### .asBinaryString() ###

	var binaryString = mask1.asBinaryString();
	
A function to return the value stored in a Netmask object as a string of 32 `1`s
and `0`s.

### .fromBinaryString() ###

	mask1.fromBinaryString('11111111111111111111111100000000');
	
A function to set the value stored in a Netmask object based on a string of 32
`1`s and `0`s.

This function returns a reference to the calling object to facilitate function
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

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
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

### .clone() ###

	var mask2 = mask1.clone();
	
A function to return a new Netmask object representing the same value as the one
stored in the calling object.

### .equals() ###

	var mask1 = new bartificer.ip.Netmask(24);
	var mask2 = new bartificer.ip.Netmask('255.255.255.0');
	mask1.equals(mask2); // true
	mask1.equals(24); // true
	mask1.equals('24'); // true
	mask1.equals('255.255.255.0'); // true
	mask1.equals('255.255.255.000'); // true
	mask1.equals('11111111111111111111111100000000'); // true
	mask1.equals('0xffffff00'); // true
	mask1.equals('ffffff00'); // true
	
A function to test if a given value represents the same netmask as the one
stored in the calling object. The test value can be a Netmask object, a number
between 0 and 32 inclusive, or a string representing a netmask as a number 
between 0 and 32 inclusive, a dotted quad, a binary string, or a hexidecimal
string.

If the values match, true is returned, otherwise, `false` is returned.

### .bitwiseInvert() ###

	var binaryString = ip1.bitwiseInvert();
	
This function performs a bitwise binary inversion on the netmask, and returns
the result as a binary string.

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

### .bitwiseOr() ###

	var binaryString = mask1.bitwiseOr(mask2);
	var binaryString = mask1.bitwiseOr(ip1);
	var binaryString = mask1.bitwiseOr('11000000101010000000000000000001');
	var binaryString = mask1.bitwiseOr('0xc0a80001');
	var binaryString = mask1.bitwiseOr('c0a80001');
	var binaryString = mask1.bitwiseOr('192.168.0.1');
	var binaryString = mask1.bitwiseOr('192.168.000.001');
	
This function performs a bitwise binary OR operation between the calling object
and the passed value, which can be another Netmask object, an IP object, or a
string representing a 32bit binary number as a binary string, hex string, or
dotted quad. The value returned is a 32 character long string of `1`s and `0`s.

### .increment() ###

	var ip2 = new bartificer.ip.IP(ip1.increment());
	
This function returns a value one greater than the 32bit value stored in the
object as a binary string. If invoked on `255.255.255.255` an error is thrown.

### .decrement() ###

	var ip2 = new bartificer.ip.IP(ip1.decrement());
	
This function returns a value one less than the 32bit value stored in the
object as a binary string. If invoked on `0.0.0.0` an error is thrown.

bartificer.ip.Subnet Class
--------------------------

This class models an IP Subnet (CIDR).

### Constructor ###

	var net1 = new bartificer.ip.Subnet();
	var net2 = new bartificer.ip.Subnet('192.168.0.0/24');
	var net3 = new bartificer.ip.Subnet('192.168.0.0/255.255.255.0');
	var net4 = new bartificer.ip.Subnet('192.168.0.0/0xffffff00');
	var net5 = new bartificer.ip.Subnet('192.168.0.0/ffffff00');
	var net6 = new bartificer.ip.Subnet('192.168.0.0', '255.255.255.0');
	var net7 = new bartificer.ip.Subnet('192.168.0.0', '0xffffff00');
	var net8 = new bartificer.ip.Subnet('192.168.0.0', 'ffffff00');
	var net9 = new bartificer.ip.Subnet(ip1, mask1);
	
The constructor can take one or two arguments. If arguments are passed, they
are passed to the `.parse()` function for interpretation. If no arguments are
passed, the subnet will be initialised as `0.0.0.0/0.0.0.0`.

### .toString() ###

	var subnetString = net1.toString();
	
This function returns a representation of the stored subnet as a string in CIDR
format, e.g. `192.168.0.0/24`.

### .equals() ###

	var net1 = new bartificer.ip.Subnet('192.168.0.0/24');
	var net2 = new bartificer.ip.Subnet('192.168.0.0/255.255.255.0');
	var ip1 = new bartificer.ip.IP('192.168.0.0');
	var mask1 = new bartificer.ip.Netmask(24);
	net1.equals(net2); // true
	net1.equals('192.168.0.0/24'); // true
	net1.equals('192.168.0.1/24'); // true
	net1.equals('192.168.0.0/255.255.255.0'); // true
	net1.equals('192.168.0.0/0xffffff00'); // true
	net1.equals('192.168.0.0/ffffff00'); // true
	net1.equals(ip1, mask1); // true
	net1.equals('192.168.0.0', 24); // true
	net1.equals('192.168.0.0', '255.255.255.0'); // true
	net1.equals('192.168.0.0','0xffffff00'); // true
	net1.equals('192.168.0.0', 'ffffff00'); // true

This function compares the subnet represented by a Subnet object with another
subnet. The function can be used in single or double argument form.

This function accepts a Subnet object as a single argument as well as all single
and double argument forms accepted by the `.parse()` function.

It's more normal to represent a subnet as the network address and the netmask,
but the function will accpet any IP within the subnet, and hence correctly
interpret that the subnets expressed as `192.168.0.0/24` and `192.168.0.25/24`
represent the same subnet.

### .clone() ###

	var net2 = net1.clone();
	
This function returns a new Subnet object representing the same subnet as the
calling object.

### .address() ###

	var ip1 = net1.address();
	
This function returns the network address of the subnet as an IP object.

### .addressAsString() ###

	var ipString = net1.addressAsString();
	
This function returns the network address of the subnet as a string containing
a dotted quad.

### .mask() ###

	var mask1 = net1.mask();
	
This function returns the subnet's netmask as a Netmask object.

### .maskAsString() ###

	var maskString = net1.maskAsString();

This function returns the subnet's netmask as a string contianing a dotted quad.

### .maskAsNumBits() ###

	var numBits = net1.maskAsNumBits();
	
This function returns the number of bits in the subnet's netmask as a whole
number.

### .parse() ###

	net1.parse('192.168.0.0/24');
	net1.parse('192.168.0.1/24');
	net1.parse('192.168.0.0/255.255.255.0');
	net1.parse('192.168.0.0/0xffffff00');
	net1.parse('192.168.0.0/ffffff00');
	net1.parse(ip1, mask1);
	net1.parse('192.168.0.0', 24);
	net1.parse('192.168.0.0', '255.255.255.0');
	net1.parse('192.168.0.0','0xffffff00');
	net1.parse('192.168.0.0', 'ffffff00');
	
This function sets the value of a Subnet object based on one or two arguments
representing an IP address and a netmask.

Technically a subnet should be presented by the first IP address in the subnet,
known as the network address, and a netmask, however, any IP address within the
subnet can be combined with the netmask to generate the network address, so
this function accepts and IP address in the range.

In single argument form, the function expects a string representing an IP
address and one representing a netmask separated by the `/` character. In two 
argument form the function expects the first argument to represent an IP 
address, and the second a netmask. 

IP addresses can be represented as IP objects, dotted quads, hexidecimal
strings, or even binary strings. Netmasks can simiarly be represented by
a Netmask object, a dotted quad, a number of bits, a hexidecimal string, or a
binary string.

Hexidecimal strings may optionally contain the `0x` prefix.

This function returns a reference to the calling object to facilitate function
chainging. If interpretation of the supplied arguments fails, the function will
throw an error.

### .broadcast() ###

	var ip1 = net1.broadcast();

This function returns the broadcast address of a subnet as an IP object.

An error is thrown if this function is called on a subnet with a `/32` mask
because single host subnets don't have broadcast addresses.

### .broadcastAsString() ###

	var ipString = net1.broadcastAsString();
	
This function returns the broadcast address of a subnet as a string representing
a dotted quad.

### .asStarNotation() ###

	var subnetString = net1.asStarNotation();
	
This function returns the subnet in 'star notation', if possible. E.g. 
`192.168.0.1/24` would be rendered as `192.168.0.*`. This kind of notation is
only possible on subnets where the number of bits set in the netmask is
divisible by 8. Note that at the two edges, a mask with zero bits set will
return `*.*.*.*`, and a mask with 32 bits set will return the network address.

### .containsIP() ###

	var net1 = new bartificer.ip.Subnet('192.168.0.0/24');
	var ip1 = new bartificer.ip.IP('192.168.0.0');
	net1.containsIP(ip1); // true
	net1.containsIP('192.168.0.0'); // true
	net1.containsIP('192.168.0.25'); // true
	net1.containsIP('192.168.0.255'); // true
	
This function determines whether or not a given IP address is contianiend within
a subnet. If an invalid argument is supplied, false is returned. Both the
network address and broadcast address are considered to be contained in the
subnet.

### .containsSubnet() ###

	var net1 = new bartificer.ip.Subnet('192.168.0.0/24');
	var net2 = new bartificer.ip.Subnet('192.168.0.0/28');
	net1.containsSubnet(net1); // true
	net1.containsSubnet(net2); // true
	net1.containsSubnet('192.168.0.0/28'); // true
	net1.containsSubnet('192.168.0.0', 28); // true
	
This function determines wheter or not a given subnet is entirely contianed
within the calling subnet. The arguments can be a Subnet object, or any one
or two-form arguments accepted by the `.parse()` function.

If the two subnets are equal, they are considered to be entirely contained
within each other.

If invalid arguments are passed, false is returned.

### .contains() ###

	var net1 = new bartificer.ip.Subnet('192.168.0.0/24');
	var net2 = new bartificer.ip.Subnet('192.168.0.0/28');
	var ip1 = new bartificer.ip.IP('192.168.0.0');
	net1.contains(ip1); // true
	net1.contains('192.168.0.0'); // true
	net1.contains('192.168.0.25'); // true
	net1.contains('192.168.0.255'); // true
	net1.contains(net1); // true
	net1.contains(net2); // true
	net1.contains('192.168.0.0/28'); // true
	net1.contains('192.168.0.0', 28); // true
	
This fucntion is an intelligent synonym for both `.containsIP()` and 
`.containsSubnet()`. If a Subnet object is passed as the first argument, or
the first argument is a string contianing the character `/`, or there is more
than one argument, the argument(s) is/are passed to `.containsSubnet()` for
processing, otherwise the argument is passed to `.containsIP()`.

### .numHosts() ###

	var numHosts = net1.numHosts();
	
This function returns the number of IP addresses contained within the subnet
that can be used to address hosts. In the general case, this is the number of
possible IPs within the subnet minus the network address and the broadcast
address. The special case is where the netmask is 255.255.255.255, this is used
to address a single host in CIDR format, so this function returns 1.

### .firstHost() ###

	var ip1 = net1.firstHost();

This function returns an IP object representing the first usable IP address in
a subnet. For the special-case of single host subnets (`/32` netmask), the
network address is returned. For the special case of a subnet with a `/31`
subnet mask an error is thrown because there are no host IPs in such a subnet.

### .firstHost() ###

	var ip1 = net1.lastHost();

This function returns an IP object representing the last usable IP address in
a subnet. For the special-case of single host subnets (`/32` netmask), the
network address is returned. For the special case of a subnet with a `/31`
subnet mask an error is thrown because there are no host IPs in such a subnet.

Utility Functions
-----------------

### bartificer.ip.isDottedQuad() ###

	bartificer.ip.isDottedQuad('192.168.0.1'); // true
	bartificer.ip.isDottedQuad('192.168.00.001'); // true
	
This function returns `true` if passed a string representing a valid dotted 
quad, otherwise it returns `false`. Dotted quads are considerd valid with or
without the addition of leading `0`s to pad each part of the quad to three
characters.

### bartificer.ip.is32BitHexString() ###

	bartificer.ip.is32BitHexString('0xffffff00'); // true
	bartificer.ip.is32BitHexString('ffffff00'); // true
	
This function returns `true` if passed a string representing a valid 32bit
number in hexidecimal, otherwise it returns `false`. The `0x` prefix is
optional.

### bartificer.ip.is32BitBinaryString ###

	bartificer.ip.is32BitBinaryString('11000000101010000000000000000001'); // true
	
This function returns `true` if passed a string consisting of 32 `1`s or `0`s,
otherwise it returns `false`.