// TODO - Maybe use a bunch of elements and just swap z-index on mouseenter?  will prevent the flickering from happening

var breakpoints   = require('./bps.js');

GifChanger = function($el) {
  var self = this;

  this.$el       = $el;
  this.sources   = this.$el.find('data').map(function(i, el) { return $(el).val(); });

  if($(window).width() < breakpoints.lg) return;  

  var startingIndex  = Math.floor(Math.random() * this.sources.length);
  var startingSource = this.sources[startingIndex];

  this.index = startingIndex;

  var $img = $('<img />');

  function imageLoaded() {
    self.setBg.call(self, startingSource);
    self.$el.addClass('is-loaded');

    for (var i = self.sources.length - 1; i >= 0; i--) {
      if(i !== startingIndex) {
        (new Image()).src = self.sources[i];
      }
    }
  }

  $img.one('load', imageLoaded);
  $img.attr('src', startingSource);

  this.$el.on('mouseenter', this.goNext.bind(this));
};

GifChanger.prototype.setBg = function(src){
  this.$el.css('background-image', 'url(' + src + ')');
  return this;
};

GifChanger.prototype.goNext = function(){
  this.index = (this.index + 1 == this.sources.length ? 0 : this.index + 1);
  this.setBg( this.sources[this.index] );
  return this;
};

module.exports = GifChanger;