"use strict";
const hasURL = require("hasurl");



const lib = require( hasURL(true) ? "url" : "whatwg-url" );



function shim()
{
	global.URL = lib.URL;
	global.URLSearchParams = lib.URLSearchParams;
}



module.exports = 
{
	shim: shim, 
	URL: lib.URL,
	URLSearchParams: lib.URLSearchParams,

	// Undocumented (for tests)
	supportsSearchParams: hasURL(true)
};
