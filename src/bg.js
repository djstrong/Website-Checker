var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34191277-4']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function Entry() {
  this.title = ""
  this.link = ""
  this.regexp = ""
  this.badge = ""
  this.icon = ""
  this.countMatch = true
}

function blink(i) {
  if (i%2==0)
    chrome.browserAction.setBadgeBackgroundColor({color:[0, 127, 255, 255]})
  else
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]})
  if (i>0)
    setTimeout(function() {blink(i-1)}, 500);
}

var ForumChecker = function() {
  var fc = {};
  fc.start = function() {
    chrome.browserAction.setBadgeText({text:"init"});
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});

    if (localStorage["interval"] == null) localStorage["interval"] = 60;
    if (localStorage["entries"] == null) localStorage["entries"] = JSON.stringify(Array());
    
    _gaq.push(['_trackEvent', 'Background', 'Start function', JSON.parse(localStorage["entries"]).length]);
  };

  fc.c = 0;
  fc.run = function() {
    var entries = JSON.parse(localStorage["entries"]);
    
    if (entries.length>0) {
      try {
	console.log(entries[fc.c].title+' '+new Date());
	var response = doCall(entries[fc.c].link);
	var m, show = false, ifBlink=false;
	
	if (entries[fc.c].countMatch) {
	  m = response.match(new RegExp(entries[fc.c].regexp, "g"));
	  if (m==null)
	    entries[fc.c].badge=0;
	  else {
	    if (entries[fc.c].badge != m.length) ifBlink = true
	    entries[fc.c].badge = m.length;
	    show = true;
	  }
	}
	else {
	  m = response.match(new RegExp(entries[fc.c].regexp));
	  console.log(m)
	  if (m==null)
	    badge=""
	  else if (m[1]=="0")
	    badge="0"
	  else {
	    badge=m[1]
	    if (entries[fc.c].badge != badge) ifBlink = true
	    show = true;
	  }
	  entries[fc.c].badge = badge;
	}
	
	if (show) {
	  chrome.browserAction.setIcon({path:"icon_fc.png"}); //for no favicons
	  if (entries[fc.c].icon=='')
	    chrome.browserAction.setIcon({path:getFavicon(entries[fc.c].link)});
	  else
	    chrome.browserAction.setIcon({path:entries[fc.c].icon});
	  chrome.browserAction.setBadgeBackgroundColor({color:[0, 127, 255, 255]});
	  chrome.browserAction.setBadgeText({text:entries[fc.c].badge+''});
	  if (ifBlink)
	    blink(6);
	}
	else {
	  empty = true
	  for(i=0; i<entries.length; ++i) {
	    if (entries[i].badge!=0 && entries[i].badge!=null && entries[i].badge!="" && entries[i].badge!="error") {
	      empty = false;
	      break;
	    }
	  }
	  if (empty) {
	    chrome.browserAction.setIcon({path:"icon_fc.png"});
	    chrome.browserAction.setBadgeText({text:""});
	  }
	}
      }
      catch (e) {
	//console.log('error '+new Date()+' '+e); 
	entries[fc.c].badge = "error";
      }
      localStorage["entries"] = JSON.stringify(entries);
      
      _gaq.push(['_trackEvent', 'Background', 'Run function', fc.c]);
      
      fc.c= (fc.c + 1) % entries.length;
      
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