//TODO: blinking icon or colors
var ForumChecker = function() {
  var fc = {};
  fc.start = function() {
    chrome.browserAction.setBadgeText({text:"init"});
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
    if (localStorage["titles"] == null) localStorage["titles"] = JSON.stringify(Array());
    if (localStorage["links"] == null) localStorage["links"] = JSON.stringify(Array());
    if (localStorage["regexps"] == null) localStorage["regexps"] = JSON.stringify(Array());
    if (localStorage["counts"] == null) localStorage["counts"] = JSON.stringify(Array());
    if (localStorage["icons"] == null) localStorage["icons"] = JSON.stringify(Array());
    if (localStorage["countMatches"] == null) localStorage["countMatches"] = JSON.stringify(Array());
    if (localStorage["interval"] == null) localStorage["interval"] = 60;
  };

  fc.c = 0;
  fc.run = function() {
    var titles = JSON.parse(localStorage["titles"]);
    var links = JSON.parse(localStorage["links"]);
    var regexps = JSON.parse(localStorage["regexps"]);
    var counts = JSON.parse(localStorage["counts"]);
    var icons = JSON.parse(localStorage["icons"]);
    var countMatches = JSON.parse(localStorage["countMatches"]);    
    
    if (titles.length>0) {
      try {
	console.log(titles[fc.c]+' '+new Date());
	var response = doCall(links[fc.c]);
	var m, show = false;
	
	if (countMatches[fc.c]) {
	  m = response.match(new RegExp(regexps[fc.c], "g"));
	  if (m==null)
	    counts[fc.c]=0;
	  else {
	    counts[fc.c] = m.length;
	    show = true;
	  }
	}
	else {
	  m = response.match(new RegExp(regexps[fc.c]));
	  counts[fc.c] = m[1];
	  show = true;
	}
	
	if (show) {
	  chrome.browserAction.setIcon({path:"icon_fc.png"}); //for no favicons
	  if (icons[fc.c]=='')
	    chrome.browserAction.setIcon({path:getFavicon(links[fc.c])});
	  else
	    chrome.browserAction.setIcon({path:icons[fc.c]});
	  chrome.browserAction.setBadgeBackgroundColor({color:[0, 127, 255, 255]});
	  chrome.browserAction.setBadgeText({text:counts[fc.c]+''});
	}
      }
      catch (e) {
	console.log('error '+new Date()+' '+e); 
	counts[fc.c] = "error";
      }
      localStorage["counts"] = JSON.stringify(counts);
      
      fc.c= (fc.c + 1) % titles.length;
    
      setTimeout(fc.run, localStorage["interval"]*1000);
    }
    else {
      setTimeout(fc.run, 2000);
    }
    
  };

  var http = new XMLHttpRequest();
  
  //TODO: timeout not working, make asynchronous?
  function doCall(link) {
    http.open("GET", link, false );
    http.timeout = 3000;
    http.send( null );
    return http.responseText;
  }

  function getFavicon(url) {
    var a = document.createElement('a');
    a.href = url;
    return "http://"+a.hostname+"/favicon.ico";
  }
  
  setTimeout(fc.run, 1000);
  return fc;
}();
ForumChecker.start()