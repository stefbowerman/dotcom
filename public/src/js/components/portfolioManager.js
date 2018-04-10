var PortfolioItem = require('./portfolioItem.js');
var breakpoints   = require('./bps.js');

PortfolioManager = function($container, $shield) {

  this.$container        = $container;
  this.$shield           = $shield;
  this.$shieldColor      = this.$shield.find('.site-shield__color');
  this.items             = [];
  this.currentItem       = null;
  this.mouseLeaveTimeout = null;
  this.mouseLeaveTimeoutDuration = 300;

  // Initialize
  this.$container.on('mouseleave', function(){    
    $(this).removeClass('has-active-child');
  });

};

PortfolioManager.prototype.activateItem = function(item){
  this.currentItem = item;
  this.$container.addClass('has-active-child');
  item.activate();
  this.$shieldColor.css('background-color', item.color || '');
  this.$shield.addClass('is-open');
};

PortfolioManager.prototype.deactivateItem = function(item){
  this.currentItem = null;
  item.deactivate();
  this.$shield.removeClass('is-open');
};

PortfolioManager.prototype.onItemMouseenter = function(item){
  if($(window).width() < breakpoints.md) {
    return;
  }

  clearTimeout(this.mouseLeaveTimeout);

  if(this.currentItem){
    this.currentItem.deactivate();
  }

  this.activateItem(item);

};

PortfolioManager.prototype.onItemMouseleave = function(item){
  this.mouseLeaveTimeout = setTimeout(this.deactivateItem.bind(this, item), this.mouseLeaveTimeoutDuration);
};

PortfolioManager.prototype.registerItem = function(item) {
  if( !(item instanceof PortfolioItem) ){
    console.warn('[PortfolioManager] - instance of PortfolioItem required when calling registerItem()')
    return;
  }
  
  item.$link.on('mouseenter', this.onItemMouseenter.bind(this, item));
  item.$link.on('mouseleave', this.onItemMouseleave.bind(this, item));

  this.items.push(item);
}

module.exports = PortfolioManager;