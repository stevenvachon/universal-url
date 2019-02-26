"use strict";
var output = {};
var g, hasNative;



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
	var url = new g.URL("http://domain.com");
	var params = new g.URLSearchParams("?param=value")

	hasNative = "searchParams" in url && params.get("param") === "value";
}
catch (error)
{
	hasNative = false;
}



if (hasNative)
{
	output.URL = g.URL;
	output.URLSearchParams = g.URLSearchParams;
}
else
{
	var lib = require("whatwg-url");

	output.URL = lib.URL;
	output.URLSearchParams = lib.URLSearchParams;
}



output.shim = function()
{
	g.URL = output.URL;
	g.URLSearchParams = output.URLSearchParams;
};



module.exports = output;
