// Update toolbar button (HTML5 History API)
self.port.emit("page-update");

function $ (id) {
  try {
    return window.content.document.getElementById(id);
  }
  catch (e) {
    return null;
  }
}
function html (tag, atts, parent) {
  var elem = document.createElement(tag);
  for (var name in atts) {
    elem.setAttribute(name, atts[name]);
  }
  if (parent) {
    parent.appendChild(elem);
  }
  return elem;
}

function remove () {
  var button = $('formats-button-small');
  if (button && button.parentNode) button.parentNode.removeChild(button);
}

function init () {
  var parent = $('watch8-secondary-actions') || $('vo'),
      isFeather = $('vo') != null;

  if (!parent) return;
  // Remove old button
  remove();
  // Add new button
  var button = html("button", {
    "id": "formats-button-small",
    "title": "Detect all possible download links",
    "class": "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon yt-uix-tooltip"
  }, parent);
  button.addEventListener("click", function () {
    this.blur();
    self.port.emit("formats");
  });

  var title = html("span", {
    "class": "yt-uix-button-content"
  });
  title.textContent = "Download";
  var imgContainer = html("span", {
    "class": "yt-uix-button-icon-wrapper"
  });
  var img = html("img", {
    "class": "yt-uix-button-icon yt-sprite",
    "src": "resource://feca4b87-3be4-43da-a1b1-137c24220968-at-jetpack/iaextractor/data/formats/injected-button.png"
  }, imgContainer);
  button.appendChild(imgContainer);
  button.appendChild(title);
}


if (window.top === window) {
  window.addEventListener('DOMContentLoaded', function () {
    var pagecontainer = document.getElementById('page-container');
    if (!pagecontainer) return;

    if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) init();

    var isAjax = /class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
    var content = document.getElementById('content');
    if (isAjax && content) { // Ajax UI
      var mo = window.MutationObserver;
      if (typeof mo !== 'undefined') {
        var observer = new mo(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.addedNodes !== null) {
              for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].id == 'watch7-container') {
                  init();
                  break;
                }
              }
            }
          });
        });
        observer.observe(content, {
          childList: true,
          subtree: true
        });
      }
    }
  }, false);
}

// Clean up
self.on("detach", function() {
  remove();
});
