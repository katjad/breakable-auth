// leaving this in as a documentation of my failure - when I access the page again that's another 
// http request and generates a new token. The token saved in localStorage is then a different one 
// from what it will be compared to on the server! Can never correctly authenticate
const req = new XMLHttpRequest();
req.open('GET', document.location);
req.send(null);
req.onload = function(e){
    const headers = req.getAllResponseHeaders().toLowerCase();
    const token = parseResponseHeaders(headers).token
    if(token){ localStorage.setItem('jwt',token) }
}

// https://gist.github.com/monsur/706839
/**
 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
 * headers according to the format described here:
 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
 * This method parses that string into a user-friendly key/value pair object.
 */
function parseResponseHeaders(headerStr) {
  var headers = {};
  if (!headerStr) {
    return headers;
  }
  var headerPairs = headerStr.split('\u000d\u000a');
  for (var i = 0; i < headerPairs.length; i++) {
    var headerPair = headerPairs[i];
    // Can't use split() here because it does the wrong thing
    // if the header value has the string ": " in it.
    var index = headerPair.indexOf('\u003a\u0020');
    if (index > 0) {
      var key = headerPair.substring(0, index);
      var val = headerPair.substring(index + 2);
      headers[key] = val;
    }
  }
  return headers;
}