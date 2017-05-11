# universal-url [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]

[![Greenkeeper badge](https://badges.greenkeeper.io/stevenvachon/universal-url.svg)](https://greenkeeper.io/)
> WHATWG [`URL`](https://developer.mozilla.org/en/docs/Web/API/URL) for Node & Browser.


* For Node.js versions `>= 8` and *some* `^7`, the native implementation will be used.
* For Node.js versions `< 8` and *some* `^7`, a [shim](https://npmjs.com/whatwg-url) will be used.
* For web browsers without a native implementation, the same shim will be used.


## Installation

[Node.js](http://nodejs.org/) `>= 4` is required. To install, type this at the command line:
```shell
npm install universal-url
```


## Usage

```js
const {URL, URLSearchParams} = require('universal-url');

const url = new URL('http://domain/');
const params = new URLSearchParams('?param=value');
```

Global shim:
```js
require('universal-url').shim();

const url = new URL('http://domain/');
const params = new URLSearchParams('?param=value');
```


## Shim

`URLSearchParams` is **not currently supported**. Be sure to feature check that it's available before performing such operations:

```js
const url = new URL('http://domain?param=value');

if (url.searchParams !== undefined) {
	// Complete implementation
} else {
	// Incomplete implementation
}

if (URLSearchParams !== undefined) {
	// Complete implementation
} else {
	// Incomplete implementation
}
```


## Browserify/etc

The bundled file size of this library can be large for a web browser. If this is a problem, try using [universal-url-lite](https://npmjs.com/universal-url-lite) in your build as an alias for this module.



[npm-image]: https://img.shields.io/npm/v/universal-url.svg
[npm-url]: https://npmjs.org/package/universal-url
[travis-image]: https://img.shields.io/travis/stevenvachon/universal-url.svg
[travis-url]: https://travis-ci.org/stevenvachon/universal-url
[david-image]: https://img.shields.io/david/stevenvachon/universal-url.svg
[david-url]: https://david-dm.org/stevenvachon/universal-url
