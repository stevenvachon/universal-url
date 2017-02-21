"use strict";
const expect = require("chai").expect;
const Nightmare = require("nightmare");

const browser = new Nightmare({ nodeIntegration:false }).goto("about:blank");



function it_browser_URL(cfg)
{
	it(`works${cfg.useGlobal ? " globally" : ""}`, function()
	{
		return browser.evaluate( function(useGlobal)
		{
			var URL;

			if (useGlobal)
			{
				UniversalURL.shim();
				URL = window.URL;
			}
			else
			{
				URL = UniversalURL.URL;
			}

			var url = new URL("http://faß.ExAmPlE/?param=value");

			// Cannot return a native instance
			return {
				hostname: url.hostname,
				search: url.search,
				//param: url.searchParams.get("param")
			};
		}, cfg.useGlobal)
		.then( function(result)
		{
			if (cfg.checkHost)
			{
				expect(result.hostname).to.equal("xn--fa-hia.example");
			}

			expect(result.search).to.equal("?param=value");
			//expect(result.param).to.equal("value");
		});
	});
}



function it_browser_URLSearchParams(cfg)
{
	it(`works${cfg.useGlobal ? " globally" : ""}`, function()
	{
		return browser.evaluate( function(useGlobal)
		{
			var URLSearchParams;

			if (useGlobal)
			{
				UniversalURL.shim();
				URLSearchParams = window.URLSearchParams;
			}
			else
			{
				URLSearchParams = UniversalURL.URLSearchParams
			}
			
			var params = new URLSearchParams("?p1=v&p2=&p2=v&p2");

			// Cannot return a native instance
			return {
				params: params,
				p1: params.get("p1"),
				p2: params.get("p2"),
				p2all: params.getAll("p2")
			};
		}, cfg.useGlobal)
		.then( function(result)
		{
			expect(result.params).to.not.be.undefined;
			expect(result.p1).to.equal("v");
			expect(result.p2).to.equal("");
			expect(result.p2all).to.deep.equal(["", "v", ""]);
		});
	});;
}



function it_node_URL(cfg)
{
	it(`works${cfg.useGlobal ? " globally" : ""}`, function()
	{
		let URL;

		if (cfg.useGlobal)
		{
			cfg.lib.shim();
			URL = global.URL;
		}
		else
		{
			URL = cfg.lib.URL;
		}
		
		const url = new URL("http://faß.ExAmPlE/?param=value#hash");

		expect(url.hostname).to.equal("xn--fa-hia.example");
		expect(url.search).to.equal("?param=value");

		if (cfg.lib.supportsSearchParams)
		{
			expect( url.searchParams ).to.not.be.undefined;
			expect( url.searchParams.get("param") ).to.equal("value");
		}
		else
		{
			expect(url.searchParams).to.be.undefined;
		}
	});
}



function it_node_URLSearchParams(cfg)
{
	it(`works${cfg.useGlobal ? " globally" : ""}`, function()
	{
		let URLSearchParams;

		if (cfg.useGlobal)
		{
			cfg.lib.shim();
			URLSearchParams = global.URLSearchParams;
		}
		else
		{
			URLSearchParams = cfg.lib.URLSearchParams;
		}
		
		const params = new URLSearchParams("?p1=v&p2=&p2=v&p2");

		expect( params ).to.not.be.undefined;
		expect( params.get("p1") ).to.equal("v");
		expect( params.get("p2") ).to.equal("");
		expect( params.getAll("p2") ).to.deep.equal(["", "v", ""]);
	});
}



describe("Node.js", function()
{
	const lib = require("./");
	const describe_searchParamsOnly = lib.URLSearchParams ? describe : describe.skip;



	afterEach( function()
	{
		global.URL = null;
		global.URLSearchParams = null;
	});
	


	describe("URL", function()
	{
		it_node_URL({ lib:lib, useGlobal:false });
		it_node_URL({ lib:lib, useGlobal:true });
	});



	describe_searchParamsOnly("URLSearchParams", function()
	{
		it_node_URLSearchParams({ lib:lib, useGlobal:false });
		it_node_URLSearchParams({ lib:lib, useGlobal:true });
	});
});



describe("Web Browser (without native)", function()
{
	beforeEach(() => browser.refresh().evaluate( function()
	{
		window.URL = undefined;
		window.URLSearchParams = undefined;
	})
	.then(() => browser.inject("js", "browser-built.js")));



	describe("URL", function()
	{
		it_browser_URL({ checkHost:true, useGlobal:false });
		it_browser_URL({ checkHost:true, useGlobal:true });
	});



	describe.skip("URLSearchParams", function()
	{
		it_browser_URLSearchParams({ useGlobal:false });
		it_browser_URLSearchParams({ useGlobal:true });
	});
});



describe("Web Browser (with native)", function()
{
	beforeEach(() => browser.refresh().inject("js", "browser-built.js"));



	describe("URL", function()
	{
		// TODO :: `checkHost:true` when Chrome correctly converts from Unicode to ASCII
		it_browser_URL({ checkHost:false, useGlobal:false });
		it_browser_URL({ checkHost:false, useGlobal:true });
	});



	describe("URLSearchParams", function()
	{
		it_browser_URLSearchParams({ useGlobal:false });
		it_browser_URLSearchParams({ useGlobal:true });
	});
});
