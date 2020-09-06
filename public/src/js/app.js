(function(window, $, undefined){

  require('cssuseragent');

  // Portfolio stuff
  var PortfolioItem    = require('./components/portfolioItem.js');
  var PortfolioManager = require('./components/portfolioManager.js');

  var GifChanger       = require('./components/gifChanger.js');
  
  // DOM ready note
  document.getElementsByClassName('follow')[0].appendChild(document.createTextNode(new Date()));

  $(function(){
    var $container = $('.portfolio-content');
    var $shield    = $('.site-shield');

    var portfolioManager = new PortfolioManager( $container, $shield );

    $container.find('a').each(function(index, el) {
      var item = new PortfolioItem( $(el) );
      portfolioManager.registerItem( item );
    });

    var gifChanger = new GifChanger( $('.gif') );
  });

})(window, jQuery);
