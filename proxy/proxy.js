'use strict';

var port = 8081;

var fs = require('fs');
var colors = require('colors');
var Proxy = require('http-mitm-proxy');
var proxy = Proxy();

// get JS that we will inject into the webpages
var libJS = fs.readFileSync('../index.js','utf8');
var testJS = fs.readFileSync('test.js','utf8');

// get and print domain whitelist
var domains;

function getDomainWhiteList() {
  try {
    domains = fs.readFileSync('domains', 'utf8')
                .split('\n')
                .map(function(x) { return x ? x.trim() : x; })
                .filter(Boolean);
    if (domains.length === 0) {
      throw "domains file empty";
    }
    console.log('\nDomain Whitelist:')
    for (var i=0; i<domains.length; i++) {
      console.log(i, domains[i]);
    }
    console.log();
  }
  catch (e) {
    console.log(colors.red('\nERROR: ')+'Please create a whitelist "domains" file with at least one domain, one per line.');
    console.log('The listed domains will be the only ones we inject JS into.');
    process.exit(1);
  }
}

function isDomainWhiteListed(host) {
  var i;
  for (i=0; i<domains.length; i++) {
    if (host.indexOf(domains[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function log(msg) {
  console.info(colors.cyan('INJECT_LOG: ')+msg);
}

function injectJS(host, url, body) {
  log(host+url);

  if (!isDomainWhiteListed(host)) {
    log('Domain not in whitelist. Ignoring.');
    return;
  }
  log('Domain in whitelist. Proceeding...');

  var bodyStr = body.toString();
  var tag = '</body>';

  log('Checking for '+tag+' tag...');
  if (bodyStr.indexOf(tag) === -1) {
    log('Could not inject JS because '+tag+' was missing');
    return;
  }

  log('Found tag. Injecting JS...');
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
      body = injectJS(host, url, body) || body;
    }
    ctx.proxyToClientResponse.write(body);
    return callback();
  });
  callback();
});


function main() {
  getDomainWhiteList();
  proxy.listen({ port: port });
  console.log('listening on ' + port);
}

main();
