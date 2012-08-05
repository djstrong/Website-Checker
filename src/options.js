function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function fixLink(link) {
  if (link=='') return link;
  
  if (!strStartsWith(link, 'http://')) link = 'http://' + link;
  var a = document.createElement('a');
  a.href = link;
  return a.href;
}

function saveOptions() {
  localStorage["interval"] = document.getElementById("interval").value;

  var titles = document.form.elements["titles[]"];
  var links = document.form.elements["links[]"];
  var regexps = document.form.elements["regexps[]"];
  var icons = document.form.elements["icons[]"];
  var countMatches = document.form.elements["countMatches[]"];
  
  var title, link, regexp, icon, countMatch;
  var ts = Array();
  var ls = Array();
  var rs = Array();
  var is = Array();
  var cs = Array();
  console.log('save'+titles.length);
  for(i=0;i<titles.length;++i) {
    title = titles[i].value;
    link = links[i].value;
    regexp = regexps[i].value;
    icon = icons[i].value;
    countMatch = countMatches[i].checked;
    
    if (link!='' && regexp!='') {
      try {
	new RegExp(regexp);
      } catch (e) {
	regexps[i].select();
	alert('Regular expression is invalid.');
      }
      ts.push(title)
      ls.push(fixLink(link))
      rs.push(regexp)
      is.push(fixLink(icon));
      cs.push(countMatch);
    }
  }

  localStorage["titles"] = JSON.stringify(ts);
  localStorage["links"] = JSON.stringify(ls);
  localStorage["regexps"] = JSON.stringify(rs);
  localStorage["icons"] = JSON.stringify(is);
  localStorage["countMatches"] = JSON.stringify(cs);
}

function restoreOptions() {
  var interval = localStorage["interval"];
  document.getElementById("interval").value = interval

  var titles = JSON.parse(localStorage["titles"]);
  var links = JSON.parse(localStorage["links"]);
  var regexps = JSON.parse(localStorage["regexps"]);
  var icons = JSON.parse(localStorage["icons"]);
  var countMatches = JSON.parse(localStorage["countMatches"]);
  
  for(i=0;i<titles.length;++i) {
    addNewLink(titles[i], links[i], regexps[i], icons[i], countMatches[i]);
  }

  addNewLink('', '', 'topictitle', '', true);
  addNewLink('', '', 'topictitle', '', true);
}

function addNewLink(title, link, regexp, icon, countMatch){
  var div = document.createElement('div');
  
  var img = document.createElement("h3");
  img.innerHTML = "Website";
  div.appendChild(img);
  
  //title
  var div2 = document.createElement('div');
  div2.className = "field";
  div.appendChild(div2);
  
  var label = document.createElement('label');
  label.innerHTML = "Ttile:";
  div2.appendChild(label);
  
  var input = document.createElement('input');
  input.type = "text";
  input.name = "titles[]";
  input.value = title;
  div2.appendChild(input);
  
  //link
  div2 = document.createElement('div');
  div2.className = "field";
  div.appendChild(div2);
  
  label = document.createElement('label');
  label.innerHTML = "Link:";
  div2.appendChild(label);
  
  input = document.createElement('input');
  input.type = "text";
  input.name = "links[]";
  input.value = link;
  div2.appendChild(input);
  
  var p = document.createElement('p');
  p.className = "hint";
  p.innerHTML = "Format: http://www.google.com/ (prefix http:// and ending with slash is needed)";
  div2.appendChild(p);
  
  //regexp
  div2 = document.createElement('div');
  div2.className = "field";
  div.appendChild(div2);
  
  label = document.createElement('label');
  label.innerHTML = "RegExp:";
  div2.appendChild(label);
  
  input = document.createElement('input');
  input.type = "text";
  input.name = "regexps[]";
  input.value = regexp;
  div2.appendChild(input);
  
  var p = document.createElement('p');
  p.className = "hint";
  p.innerHTML = "Regular expression";
  div2.appendChild(p);

  //icons
  div2 = document.createElement('div');
  div2.className = "field";
  div.appendChild(div2);
  
  label = document.createElement('label');
  label.innerHTML = "Icon:";
  div2.appendChild(label);
  
  input = document.createElement('input');
  input.type = "text";
  input.name = "icons[]";
  input.value = icon;
  div2.appendChild(input);
  
  var p = document.createElement('p');
  p.className = "hint";
  p.innerHTML = "Url to icon. Optional, leave empty to use standard favicon.";
  div2.appendChild(p);
  
  //counts
  div2 = document.createElement('div');
  div2.className = "field";
  div.appendChild(div2);
  
  label = document.createElement('label');
  label.innerHTML = "Counts:";
  div2.appendChild(label);
  
  input = document.createElement('input');
  input.type = "checkbox";
  input.checked = countMatch;
  input.name = "countMatches[]";
  div2.appendChild(input);
  
  var p = document.createElement('p');
  p.className = "hint";
  p.innerHTML = "Unselect to simply show match (group 1), otherwise count matches.";
  div2.appendChild(p);
  
  document.getElementById("forms").appendChild(div);
}

function clickAddHandler(e) {
  addNewLink('', '', 'topictitle', '', true);
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





