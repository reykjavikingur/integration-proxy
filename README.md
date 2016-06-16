# Integration Proxy

An integration proxy is a reverse proxy that transforms responses (headers and bodies) to emulate an integrated environment in a local [Express](http://expressjs.com/) server.

As a front-end web developer, you want to build and test your static assets in a context that mostly closely matches the environment to which they will eventually be deployed.

Traditional solutions to this problem typically involve cloning the integrated environment.
Then, either you run it locally and edit files internally to the system, or you run it in a sandbox to which you transfer files via Samba or FTP.
Unfortunately, cloning environments is often complicated, and running locally may require special infrastructure or proprietary tools.
Even with a sandbox, transferring files adds load to a network and sometimes involves extra steps that impede development productivity.

By running an integration proxy as part of your Node-based development stack, you can edit files locally in a lightweight stack as long as necessary and transfer files only for deployments.

## Usage

```
var express = require('express');
var integrationProxy = require('integration-proxy');

var app = express();

app.use('/', integrationProxy({
	target: 'http://example.com',
	transform: function(url) {
		return url.replace('http://example.com', 'http://localhost');
	}
});
```

## API

`integrationProxy(options)` --> `express.Router`

### `options.target` (String) required

The target option is the URL of the remote server.

### `options.transform` (Function) optional

The transform option is a function that takes a string and returns a string. It should be defined so as to fix origins in URL's that occur in headers and HTML bodies from the remote target server.

The reason it is a function rather than a simple replacement string is because you may want to run multiple proxies in parallel that transform content interlinking several different origins. You may want to use a more general pattern to replace subdomains or non-SSL versus SSL.

## Features

In addition to relaying requests and responses between local and remote hosts (as with a basic `http-proxy` configuration), `integration-proxy` also:

* removes `content-length` headers, if any, to prevent truncation in case HTML changes result in different lengths
* modifies `set-cookie` headers by removing "Domain" and "Secure" restrictions, to allow clients to accept cookies in spite of differences between local and remote origins
* applies transform to:
	* `origin` header
	* `location` headers
	* `A@HREF` attributes
	* `FORM@ACTION` attributes

## Caveats

NOTE: To ensure proper system security when running any reverse proxy, always ensure that access to the proxy is _at least as secure as_ its target, if not more. This module is intended as a development tool and should only ever need to be run inside an organizationally restricted network for a development team.

## Example: Static Injection

To emulate a remote host but serve static assets from a local directory:

```
var express = require('express');
var integrationProxy = require('integration-proxy');

var app = express();

// serve static assets from local file system
app.use('/assets', express.static('pub/assets'));

// serve all other requests via proxy
app.use('/', integrationProxy({
	target: 'http://example.com',
	transform: function(url) {
		return url.replace('http://example.com', 'http://localhost');
	}
});

app.listen(80);
```

## Example: Service Injection

To run a local host but proxy a remote API:

```
var express = require('express');
var integrationProxy = require('integration-proxy');

var app = express();

app.use('/api', integrationProxy({
	target: 'http://example.com/api'
});

// ...

app.listen(80);
```

## Example: Context Alias

To change the context of certain requests:

```
var express = require('express');
var integrationProxy = require('integration-proxy');

var app = express();

app.use('/account', integrationProxy({
	target: 'http://example.com/test-account',
	transform: function(url) {
		return url.replace('http://example.com', 'http://localhost');
	}
});

app.listen(80);
```
