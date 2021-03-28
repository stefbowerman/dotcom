(function(window, $, undefined){

  require('cssuseragent');

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }  

  // Portfolio stuff
  var PortfolioItem    = require('./components/portfolioItem.js');
  var PortfolioManager = require('./components/portfolioManager.js');

  var GifChanger       = require('./components/gifChanger.js');
  
  // DOM ready note
  var followEl = document.getElementsByClassName('follow')[0]
  var now = new Date()
  var nowString = [now.toDateString(), now.toTimeString()].join(' ')
  var typeString = ''

  var typeInterval
  var typeLetter = function() {
    if (typeString.length >= nowString.length) {
      followEl.innerText = typeString
      clearInterval(typeInterval)
    }
    else {
      var numToType = Math.random() < 0.5 ? 2 : (Math.random() < 0.5 ? 1 : 3)
      typeString = nowString.substring(0, typeString.length + numToType) // go two at a time
      var split = typeString.split('')
      shuffleArray(split)
      followEl.innerText = split.join('')
    }
  }
  
  var $container = $('.portfolio-content');
  var $shield    = $('.site-shield');

  $(function(){
    var portfolioManager = new PortfolioManager( $container, $shield );

    $container.find('a').each(function(index, el) {
      portfolioManager.registerItem(new PortfolioItem($(el)));
    });

    var gifChanger = new GifChanger( $('.gif') );

    setTimeout(function() {
      typeInterval = setInterval(typeLetter, 50)
    }, 1000)
  });

})(window, jQuery);
