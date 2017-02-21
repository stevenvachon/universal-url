"use strict";
let g,hasNative;
let output = {};



if (typeof window !== "undefined")
{
    g = window;
}
else if (typeof global !== "undefined")
{
    g = global;
}
else if (typeof self !== "undefined")
{
    g = self;
}
else
{
    g = this;
}



try
{
	const url = new g.URL("http://domain.com");

	hasNative = "searchParams" in url && "href" in url;

	// TODO :: test `URLSearchParams` ?
}
catch (error)
{
	hasNative = false;
}



if (hasNative === true)
{
	output.URL = g.URL;
	output.URLSearchParams = g.URLSearchParams;
}
else
{
	const lib = require("whatwg-url");

	output.URL = lib.URL;
	output.URLSearchParams = lib.URLSearchParams;
}



output.shim = function()
{
	g.URL = output.URL;
	g.URLSearchParams = output.URLSearchParams;
};



module.exports = output;
