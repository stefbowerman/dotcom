// Favicon.js library modified to work with node
// https://github.com/dlom/favicon.js

var Favicon = function(){

  // Private
  var head = document.getElementsByTagName("head")[0];
  var loopTimeout = null;
  var defaultPause = 2000;

  var changeFavicon = function(iconURL) {
    var newLink = document.createElement("link");
        newLink.type = "image";
        newLink.rel = "icon";
        newLink.href = iconURL;
    removeExistingFavicons();
    head.appendChild(newLink);
  };
  
  var removeExistingFavicons = function() {
    var links = head.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
      if (/\bicon\b/i.test(links[i].getAttribute("rel"))) {
        head.removeChild(links[i]);
      }
    }
  };

  // Public
  this.change = function(iconURL, optionalDocTitle) {
    clearTimeout(loopTimeout);
    if (optionalDocTitle) {
      document.title = optionalDocTitle;
    }
    if (iconURL !== "") {
      changeFavicon(iconURL);
    }
  };

  this.animate = function(icons, optionalDelay) {
    
    var iconIndex = 0;
    clearTimeout(loopTimeout);

    // preload icons
    icons.forEach(function(icon) {
        (new Image()).src = icon;
    });
    optionalDelay = optionalDelay || defaultPause;
    changeFavicon(icons[iconIndex]);
    loopTimeout = setTimeout(function animateFunc() {
        iconIndex = (iconIndex + 1) % icons.length;
        changeFavicon(icons[iconIndex]);
        loopTimeout = setTimeout(animateFunc, optionalDelay);
    }, optionalDelay);
  };

  this.stopAnimate = function() {
    clearTimeout(loopTimeout);
  };
};

module.exports = new Favicon();