function getFavicon(url) {
  var a = document.createElement('a');
  a.href = url;
  return "http://"+a.hostname+"/favicon.ico";
}

function present() {
  var titles = JSON.parse(localStorage["titles"]);
  var links = JSON.parse(localStorage["links"]);
  var regexps = JSON.parse(localStorage["regexps"]);
  var counts = JSON.parse(localStorage["counts"]);

  document.getElementById("content").innerHTML = "";

  for(i=0;i<titles.length;++i) {
    
    div = document.createElement("div");
    
    a = document.createElement("a");
    a.target = "_blank";
    a.href = links[i];
  
    img = document.createElement("img");
    img.className = "icon";
    img.src = getFavicon(links[i]);
    img.height = 32;
    a.appendChild(img);
    
    span = document.createElement("span");
    span.innerHTML = " " + titles[i] + ": " + counts[i];
    a.appendChild(span);
    
    div.appendChild(a);
    
    document.getElementById("content").appendChild(div);
    
  }
  
  if (titles.length==0) {
    div = document.createElement("div");
    div.innerHTML = "You have to add some websites. Right click on the icon and click <i>Options</i>.";
    document.getElementById("content").appendChild(div);
  }
  
  setTimeout(present, 10000);
}

document.addEventListener('DOMContentLoaded', function () {
  present();
}, false);