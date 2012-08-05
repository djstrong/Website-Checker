//TODO: checkbox if count matches or simply show match

function saveOptions() {
  localStorage["interval"] = document.getElementById("interval").value;

  var titles = document.form.elements["titles[]"];
  var links = document.form.elements["links[]"];
  var regexps = document.form.elements["regexps[]"];
  var icons = document.form.elements["icons[]"];
  
  var title, link, regexp, icon;
  var ts = Array();
  var ls = Array();
  var rs = Array();
  var is = Array();
  console.log('save'+titles.length);
  for(i=0;i<titles.length;++i) {
    title = titles[i].value;
    link = links[i].value;
    regexp = regexps[i].value;
    icon = icons[i].value;
    
    //TODO: check for errors, add prefix and sufix
    if (link!='' && regexp!='') {
      ts.push(title)
      ls.push(link)
      rs.push(regexp)
      is.push(icon);
    }
  }

  localStorage["titles"] = JSON.stringify(ts);
  localStorage["links"] = JSON.stringify(ls);
  localStorage["regexps"] = JSON.stringify(rs);
  localStorage["icons"] = JSON.stringify(is);
}

function restoreOptions() {
  var interval = localStorage["interval"];
  document.getElementById("interval").value = interval

  var titles = JSON.parse(localStorage["titles"]);
  var links = JSON.parse(localStorage["links"]);
  var regexps = JSON.parse(localStorage["regexps"]);
  var icons = JSON.parse(localStorage["icons"]);
  
  for(i=0;i<titles.length;++i) {
    addNewLink(titles[i], links[i], regexps[i], icons[i]);
  }

  addNewLink('', '', 'topictitle', '');
  addNewLink('', '', 'topictitle', '');
}

function addNewLink(title, link, regexp, icon){
  var newdiv = document.createElement('div');
  //newdiv.innerHTML = "Title: <input type=\"text\" name=\"titles[]\" value=\""+title+"\" /><br />Link: <input name=\"links[]\" type=\"text\" value=\""+link+"\" /><br />RegExp: <input name=\"regexps[]\" type=\"text\" value=\""+regexp+"\" /><br /><br />";
  newdiv.innerHTML = "<h3>Website</h3><div class=\"field\"><label>Title:</label><input type=\"text\" name=\"titles[]\" value=\""+title+"\" /></div><div class=\"field\"><label>Link:</label><input name=\"links[]\" type=\"text\" value=\""+link+"\" /><p class=\"hint\">Format: http://www.google.com/ (prefix http:// and ending with slash is needed)</p></div><div class=\"field\"><label>RegExp:</label><input name=\"regexps[]\" type=\"text\" value=\""+regexp+"\" /><p class=\"hint\">Regular expression</p></div><div class=\"field\"><label>Icon:</label><input name=\"icons[]\" type=\"text\" value=\""+icon+"\" /><p class=\"hint\">Url to icon. Leave empty to use standard favicon.</p></div><br />";
  document.getElementById("forms").appendChild(newdiv);
}

function clickAddHandler(e) {
  addNewLink('', '', 'topictitle', '');
}

function clickSaveHandler(e) {
  saveOptions();
}

function clickLoadHandler(e) {
  restoreOptions();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('save').addEventListener('click', clickSaveHandler);
  document.getElementById('add').addEventListener('click', clickAddHandler);
  window.addEventListener('load', clickLoadHandler, false);
});





