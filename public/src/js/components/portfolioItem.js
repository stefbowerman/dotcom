PortfolioItem = function($link) {
  this.$link       = $link;
  this.color       = this.$link.data('color');
  this.colorInvert = this.$link.data('color-invert') != undefined ? true : false;
  this.$item       = this.$link.data('portfolio-item') ? $( '#' + this.$link.data('portfolio-item') ) : null;
  this.$slideShow  = this.$item ? this.$item.find('.portfolio-item__slideshow') : null;
  this.$slides     = this.$slideShow.find('img');
  this.$slideCount = null;

  this._hasSlideShow     = false;
  this.slideShowInterval = null;
  this.slideShowDuration = 1500;

  if(this.$slideShow && this.$slides.length){
    this._hasSlideShow = true;
    this._initializeSlideshow();
  }

  if(this.colorInvert) {
    this.$item.addClass('portfolio-item--inverted');
  }

  if(this.$link.attr('href') == '#') {
    this.$link.on('click', function() { return false; });
  }
};

PortfolioItem.prototype = {
  _initializeSlideshow: function(){
    if(!this._hasSlideShow){
      return;
    }
  
    if(this.$slides.length > 1) {
      this.$slideCount = $(document.createElement('span')).addClass('portfolio-item__slide-count');
      this.$item.append( this.$slideCount );
    }
  
    if(!this.getActiveSlide().length){
      this.$slides.first().addClass('is-active');
    }
  
    this.updateSlideCount();
  },

  getSlideCount: function(){
    return this._hasSlideShow ? this.$slides.length : 0;
  },

  goToSlide: function(i){
    if(this._hasSlideShow && i >= 0 && i < this.getSlideCount()){
      this.$slides.removeClass('is-active');
      this.$slides.eq( i ).addClass('is-active');
      this.updateSlideCount();
    }
  },

  nextSlide: function(){
    var i = 0;
    var activeIndex;
  
    if(this.getActiveSlide().length){
      activeIndex = this.getActiveSlide().index();
      i = (activeIndex === (this.$slides.length - 1) ? 0 : activeIndex+1);
    }
  
    this.goToSlide(i);
  },

  getActiveSlide: function(){
    return this._hasSlideShow && this.$slides.filter('.is-active').first();
  },

  stopSlideShow: function(){
    clearInterval(this.slideShowInterval);
  },  

  startSlideShow: function(){
    if(this._hasSlideShow){
      this.slideShowInterval = setInterval(this.nextSlide.bind(this), this.slideShowDuration);
    }
  },

  updateSlideCount: function(){
    if(this.$slideCount && this.$slideCount.length && this.getActiveSlide().length) {
      this.$slideCount.text( (this.getActiveSlide().index() + 1) + ' / ' + this.getSlideCount() );  
    }
  },

  ensureImagesLoaded: function(){
    var $lazyImgs = this.$item.find('img[data-src]');
    if($lazyImgs.length){
      $lazyImgs.each(function(i, img) {
        var $this = $(this);
        var src = $this.data('src');
        $this.attr('src', src);
        $this.removeAttr('data-src');
      });
    }
  },

  activate: function(){
    this.$link.addClass('is-active');
    if(this.$item){
      this.ensureImagesLoaded();
      this.$item.addClass('is-active');
      this.startSlideShow();
    }
  },

  deactivate: function(){
    this.$link.removeClass('is-active');
    if(this.$item){
      this.$item.removeClass('is-active');
      this.stopSlideShow();
    }
  }
};

module.exports = PortfolioItem;