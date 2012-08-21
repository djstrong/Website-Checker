var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34191277-4']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function getFavicon(url) {
  var a = document.createElement('a');
  a.href = url;
  return "http://"+a.hostname+"/favicon.ico";
}

function present() {
  var entries = JSON.parse(localStorage["entries"]);
  _gaq.push(['_trackEvent', 'Popup', 'Number of entries', entries.length]);
  
  document.getElementById("content").innerHTML = "";

  for(i=0;i<entries.length;++i) {
    
    div = document.createElement("div");
    
    a = document.createElement("a");
    a.target = "_blank";
    a.href = entries[i].link;
  
    img = document.createElement("img");
    img.className = "icon";
    if (entries[i].icon=='')
      img.src = getFavicon(entries[i].link);
    else
      img.src = entries[i].icon;
    img.height = 32;
    a.appendChild(img);
    
    span = document.createElement("span");
    span.innerHTML = " " + entries[i].title + ": " + entries[i].badge;
    a.appendChild(span);
    
    div.appendChild(a);
    
    spacer = document.createElement("div");
    spacer.className = 'spacer';
    div.appendChild(spacer);
    
    document.getElementById("content").appendChild(div);
    
  }
  
  if (entries.length==0) {
    div = document.createElement("div");
    div.innerHTML = "You have to add some websites. Right click on the icon and click <i>Options</i>.";
    document.getElementById("content").appendChild(div);
  }
  
  setTimeout(present, localStorage["interval"]*500);
}

document.addEventListener('DOMContentLoaded', function () {
  present();
}, false);