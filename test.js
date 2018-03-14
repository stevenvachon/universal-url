"use strict";
const {after, afterEach, before, beforeEach, describe, it} = require("mocha");
const {expect} = require("chai");
const puppeteer = require("puppeteer");

let browser, page;



const openBrowser = () =>
{
	return puppeteer.launch({ args: ["--no-sandbox"] })
	.then(puppeteerInstance =>
	{
		browser = puppeteerInstance;
		return puppeteerInstance.newPage();
	})
	.then(pageInstance =>
	{
		page = pageInstance;
	});
};



const it_browser_URL = ({checkHost, useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, () =>
	{
		return page.evaluate(useGlobal =>
		{
			let URL;

			if (useGlobal)
			{
				UniversalURL.shim();
				URL = window.URL;
			}
			else
			{
				URL = UniversalURL.URL;
			}

			const url = new URL("http://ᄯᄯᄯ.ExAmPlE/?param=value#hash");

			// Cannot return a native instance
			return {
				hostname: url.hostname,
				search: url.search,
				param: url.searchParams.get("param")
			};
		}, useGlobal)
		.then(result =>
		{
			if (checkHost)
			{
				expect(result.hostname).to.equal("xn--brdaa.example");
			}

			expect(result.search).to.equal("?param=value");
			expect(result.param).to.equal("value");
		});
	});
};



const it_browser_URLSearchParams = ({useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, () =>
	{
		return page.evaluate(useGlobal =>
		{
			let URLSearchParams;

			if (useGlobal)
			{
				UniversalURL.shim();
				URLSearchParams = window.URLSearchParams;
			}
			else
			{
				URLSearchParams = UniversalURL.URLSearchParams
			}

			const params = new URLSearchParams("?p1=v&p2=&p2=v&p2");

			// Cannot return a native instance
			return {
				params: params,
				p1: params.get("p1"),
				p2: params.get("p2"),
				p2all: params.getAll("p2")
			};
		}, useGlobal)
		.then(result =>
		{
			expect(result.params).to.not.be.undefined;
			expect(result.p1).to.equal("v");
			expect(result.p2).to.equal("");
			expect(result.p2all).to.deep.equal(["", "v", ""]);
		});
	});;
};



const it_node_URL = ({lib, useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, () =>
	{
		let URL;

		if (useGlobal)
		{
			lib.shim();
			URL = global.URL;
		}
		else
		{
			URL = lib.URL;
		}

		const url = new URL("http://ᄯᄯᄯ.ExAmPlE/?param=value#hash");

		expect( url.hostname ).to.equal("xn--brdaa.example");
		expect( url.search ).to.equal("?param=value");
		expect( url.searchParams ).to.not.be.undefined;
		expect( url.searchParams.get("param") ).to.equal("value");
	});
};



const it_node_URLSearchParams = ({lib, useGlobal}) =>
{
	it(`works${useGlobal ? " globally" : ""}`, () =>
	{
		let URLSearchParams;

		if (useGlobal)
		{
			lib.shim();
			URLSearchParams = global.URLSearchParams;
		}
		else
		{
			URLSearchParams = lib.URLSearchParams;
		}

		const params = new URLSearchParams("?p1=v&p2=&p2=v&p2");

		expect( params ).to.not.be.undefined;
		expect( params.get("p1") ).to.equal("v");
		expect( params.get("p2") ).to.equal("");
		expect( params.getAll("p2") ).to.deep.equal(["", "v", ""]);
	});
};



describe("Node.js", () =>
{
	const lib = require("./");
	let originalURL, originalURLSearchParams;



	before(() =>
	{
		originalURL = global.URL;
		originalURLSearchParams = global.URLSearchParams;
	});

	afterEach(() =>
	{
		global.URL = originalURL;
		global.URLSearchParams = originalURLSearchParams;
	});



	describe("URL", () =>
	{
		it_node_URL({ lib, useGlobal:false });
		it_node_URL({ lib, useGlobal:true });
	});



	describe("URLSearchParams", () =>
	{
		it_node_URLSearchParams({ lib, useGlobal:false });
		it_node_URLSearchParams({ lib, useGlobal:true });
	});
});



describe("Web Browser (without native)", () =>
{
	before(() => openBrowser());

	beforeEach(() =>
	{
		return page.reload()
		.then(() => page.evaluate(() =>
		{
			window.URL = undefined;
			window.URLSearchParams = undefined;
		}))
		.then(() => page.addScriptTag({ path: "browser-built.js" }));
	});

	after(() => browser.close());



	describe("URL", () =>
	{
		it_browser_URL({ checkHost:true, useGlobal:false });
		it_browser_URL({ checkHost:true, useGlobal:true });
	});



	describe("URLSearchParams", () =>
	{
		it_browser_URLSearchParams({ useGlobal:false });
		it_browser_URLSearchParams({ useGlobal:true });
	});
});



describe("Web Browser (with native)", () =>
{
	before(() => openBrowser());

	beforeEach(() =>
	{
		return page.reload()
		.then(() => page.addScriptTag({ path: "browser-built.js" }));
	});

	after(() => browser.close());



	describe("URL", () =>
	{
		// TODO :: `checkHost:true` when Chrome correctly converts from Unicode to ASCII
		it_browser_URL({ checkHost:false, useGlobal:false });
		it_browser_URL({ checkHost:false, useGlobal:true });
	});



	describe("URLSearchParams", () =>
	{
		it_browser_URLSearchParams({ useGlobal:false });
		it_browser_URLSearchParams({ useGlobal:true });
	});
});
