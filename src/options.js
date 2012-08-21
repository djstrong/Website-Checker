//TODO: add testing entry in options
function Entry() {
  this.title = ""
  this.link = ""
  this.regexp = ""
  this.badge = ""
  this.icon = ""
  this.countMatch = true
}

function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function fixLink(link) {
  if (link=='') return link;
  
  if (!strStartsWith(link, 'http://') && !strStartsWith(link, 'https://')) link = 'http://' + link;
  var a = document.createElement('a');
  a.href = link;
  return a.href;
}

function saveOptions() {
  localStorage["interval"] = document.getElementById("interval").value;
}

var entryIndex = 0;
var predefinedEntries = Array();

function showPredefined() {
  entry = new Entry()
  entry.title = "none"
  entry.link = ""
  entry.regexp = ""
  entry.icon = ""
  entry.countMatch = false
  predefinedEntries.push(entry)

  
  entry = new Entry()
  entry.title = "Facebook notifications"
  entry.link = "https://www.facebook.com/desktop_notifications/counts.php?latest=0&latest_read=0"
  entry.regexp = "\"num_unread\":([0-9]+)"
  entry.icon = ""
  entry.countMatch = false
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Gmail unread mails"
  entry.link = "https://mail.google.com/mail/u/0/x/"
  entry.regexp = "Inbox &nbsp;\\(([0-9]+)\\)"
  entry.icon = ""
  entry.countMatch = false
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Unread posts: forum on phpBB3 engine"
  entry.link = "http://ADDRESS_TO_FORUM/search.php?search_id=unreadposts"
  entry.regexp = "view=unread"
  entry.icon = ""
  entry.countMatch = true
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Unread posts: forum on SMF engine"
  entry.link = "http://ADDRESS_TO_FORUM/index.php?action=unread"
  entry.regexp = "topicseen#new"
  entry.icon = ""
  entry.countMatch = true
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Unread posts: forum on phpBB by Przemo engine"
  entry.link = "http://ADDRESS_TO_FORUM/index.php"
  entry.regexp = "Zobacz posty nieprzeczytane \\[([0-9]+)\\]"
  entry.icon = ""
  entry.countMatch = false
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Unread posts: forum on phpBB2 engine (in Polish)"
  entry.link = ""
  entry.regexp = "alt=\"Nowe posty\" title=\"Nowe posty\""
  entry.icon = ""
  entry.countMatch = true
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Today views: blog on WordPress.com"
  entry.link = "http://wordpress.com/wp-admin/admin-ajax.php?day&action=wpcom_load_template&template=my-stats.php"
  entry.regexp = "Pageviews:</strong> ([0-9]+)</h4>"
  entry.icon = ""
  entry.countMatch = false
  predefinedEntries.push(entry)
  
  entry = new Entry()
  entry.title = "Gmail unread mails (Polish)"
  entry.link = "https://mail.google.com/mail/u/0/x/"
  entry.regexp = "Odebrane &nbsp;\\(([0-9]+)\\)"
  entry.icon = ""
  entry.countMatch = false
  predefinedEntries.push(entry)
  
  var predefined = document.getElementById('predefined');
  for (i=0; i<predefinedEntries.length; ++i) {
    var option = document.createElement('option');
    option.text = predefinedEntries[i].title;
    option.value = i;
    predefined.add(option)
  }
}

function restoreOptions() {
  document.getElementById("interval").value = localStorage["interval"];
  showActualEntry();
  showPredefined();
}

function showActualEntry() {
  var entries = JSON.parse(localStorage["entries"]);
  if (entries.length>0)
    showEntry(entries[entryIndex])
}

function showEntry(entry) {
  document.getElementById("index").innerHTML = entryIndex+1;
  
  document.getElementById("title").value = entry.title;
  document.getElementById("link").value = entry.link;
  document.getElementById("regexp").value = entry.regexp;
  document.getElementById("icon").value = entry.icon;
  document.getElementById("countMatch").checked = entry.countMatch;
}

function removeActual() {
  var entries = JSON.parse(localStorage["entries"]);
  if (entryIndex<entries.length) {
    entries.splice(entryIndex, 1)
    localStorage["entries"] = JSON.stringify(entries)
    prev()
  }
}

function prev() {
  if (entryIndex>0)
    --entryIndex
  showActualEntry()
}

function next() {
  var entries = JSON.parse(localStorage["entries"]);
  if (entryIndex<entries.length-1) {
    ++entryIndex
    showEntry(entries[entryIndex])
  }
  else if (entryIndex==entries.length-1) {
    ++entryIndex
    showEntry(new Entry())
  }
}

function saveEntry() {
  var title = document.getElementById("title").value
  var link = document.getElementById("link").value
  var regexp = document.getElementById("regexp").value
  var icon = document.getElementById("icon").value
  var countMatch = document.getElementById("countMatch").checked
  
  if (link!='' && regexp!='') {
    try {
      new RegExp(regexp);
    } catch (e) {
      document.getElementById("regexp").select();
      alert('Regular expression is invalid.');
    }
    
    var entries = JSON.parse(localStorage["entries"]);
    
    entry = new Entry()
    entry.title = title
    entry.link = fixLink(link)
    entry.regexp = regexp
    entry.icon = fixLink(icon)
    entry.countMatch = countMatch
    entries[entryIndex] = entry;
    
    localStorage["entries"] = JSON.stringify(entries);
    showActualEntry();
  }
}

function clickSave2Handler(e) {
  saveOptions();
}

function clickLoadHandler(e) {
  restoreOptions();
}

function clickPrevHandler(e) {
  prev();
}

function clickNextHandler(e) {
  next();
}

function clickSaveHandler(e) {
  saveEntry();
}

function clickRemoveHandler(e) {
  removeActual();
  chrome.browserAction.setIcon({path:"icon_fc.png"})
  chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]})
  chrome.browserAction.setBadgeText({text:"init"})
}

function changePredefined(e) {
  index = document.getElementById("predefined").selectedIndex
  if (index>0)
    showEntry(predefinedEntries[index]);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('save2').addEventListener('click', clickSave2Handler);
  window.addEventListener('load', clickLoadHandler, false);
  
  document.getElementById('prev').addEventListener('click', clickPrevHandler);
  document.getElementById('next').addEventListener('click', clickNextHandler);
  document.getElementById('save').addEventListener('click', clickSaveHandler);
  document.getElementById('remove').addEventListener('click', clickRemoveHandler);
  
  document.getElementById('predefined').addEventListener('change', changePredefined);
});