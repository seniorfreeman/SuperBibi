BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
BrowserPolicy.content.allowOriginForAll('*.youtube.com');
BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
BrowserPolicy.content.allowSameOriginForAll('*.graph.facebook.com');
BrowserPolicy.content.allowSameOriginForAll("img-src 'self' data:");
BrowserPolicy.content.allowEval('https://ajax.googleapis.com');
BrowserPolicy.content.allowImageOrigin("*");
