'use strict';

var port = 8081;

var fs = require('fs');
var Proxy = require('http-mitm-proxy');
var proxy = Proxy();

// get JS that we will inject into the webpages
var libJS = fs.readFileSync('../index.js','utf8');
var testJS = fs.readFileSync('test.js','utf8');

// get and print domain whitelist
var domains = fs.readFileSync('domains', 'utf8').split('\n').map(function(x) { return x ? x.trim() : x; }).filter(Boolean);
console.log('domain whitelist:')
for (var i=0; i<domains.length; i++) {
  console.log(i, domains[i]);
}
console.log();

function shouldInjectDomain(host) {
  var i;
  for (i=0; i<domains.length; i++) {
    if (host.indexOf(domains[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function processBody(host, url, body) {
  console.log(host, url);

  if (!shouldInjectDomain(host)) {
    return;
  }

  var bodyStr = body.toString();
  var tag = '</body>';
  bodyStr = body.toString();

  console.log('trying to check for tag...');
  if (bodyStr.indexOf(tag) === -1) {
    console.log('could not inject JS because '+tag+' was missing from '+host+url);
    return;
  }

  console.log('trying to inject...');
  return bodyStr.replace(
    tag,
    '<script>' + libJS + '</script>' +
    '<script>' + testJS + '</script>' + tag
  );
}

proxy.onError(function(ctx, err, errorKind) {
  // ctx may be null
  var url = (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '';
  console.error(errorKind + ' on ' + url + ':', err);
});

proxy.use(Proxy.gunzip);

proxy.onRequest(function(ctx, callback) {
  var host = ctx.clientToProxyRequest.headers.host;
  var url = ctx.clientToProxyRequest.url;

  var chunks = [];
  ctx.onResponseData(function(ctx, chunk, callback) {
    chunks.push(chunk);
    return callback(null, null); // don't write chunks to client response
  });
  ctx.onResponseEnd(function(ctx, callback) {
    var body = Buffer.concat(chunks);
    var contentType = ctx.serverToProxyResponse.headers['content-type'];
    if (contentType && contentType.indexOf('text/html') === 0) {
      body = processBody(host, url, body) || body;
    }
    ctx.proxyToClientResponse.write(body);
    return callback();
  });
  callback();
});



proxy.listen({ port: port });
console.log('listening on ' + port);
