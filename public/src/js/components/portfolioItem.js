PortfolioItem = function($link) {
  this.$link       = $link;
  this.color       = this.$link.data('color');
  this.$item       = this.$link.data('portfolio-item') ? $( '#' + this.$link.data('portfolio-item') ) : null;
  this.$slideShow  = this.$item ? this.$item.find('.portfolio-item__slideshow') : null;

  this._hasSlideShow    = false;
  this.slideShowInterval = null;
  this.slideShowDuration = 2000;

  if(this.$slideShow && this.$slideShow.find('img').length){
    this._hasSlideShow = true;
    this._initializeSlideshow();
  }
};

PortfolioItem.prototype._initializeSlideshow = function(){
  if(!this._hasSlideShow){
    return;
  }
  if(!this.getActiveSlide().length){
    this.$slideShow.find('img').first().addClass('is-active');
  }
};

PortfolioItem.prototype.getSlideCount = function(){
  return this._hasSlideShow ? this.$slideShow.find('img').length : 0;
};

PortfolioItem.prototype.goToSlide = function(i){
  var $slides = this.$slideShow.find('img');
  if(this._hasSlideShow && i >= 0 && i < this.getSlideCount()){
    $slides.removeClass('is-active');
    $slides.eq( i ).addClass('is-active');
  }
};

PortfolioItem.prototype.nextSlide = function(){
  var $slides = this.$slideShow.find('img');
  var i = 0;
  var activeIndex;

  if(this.getActiveSlide().length){
    activeIndex = this.getActiveSlide().index();
    i = (activeIndex === ($slides.length - 1) ? 0 : activeIndex+1);
  }

  this.goToSlide(i);
};

PortfolioItem.prototype.getActiveSlide = function(){
  return this._hasSlideShow && this.$slideShow.find('img.is-active').first();
};

PortfolioItem.prototype.stopSlideShow = function(){
  clearInterval(this.slideShowInterval);
};

PortfolioItem.prototype.startSlideShow = function(){
  if(this._hasSlideShow){
    this.slideShowInterval = setInterval(this.nextSlide.bind(this), this.slideShowDuration);
  }
};

// Allow lazy loading of images by using <img data-src="..." />
PortfolioItem.prototype.ensureImagesLoaded = function(){
  var $lazyImgs = this.$item.find('img[data-src]');
  if($lazyImgs.length){
    $lazyImgs.each(function(i, img) {
      var $this = $(this);
      var src = $this.data('src');
      $this.attr('src', src);
      $this.removeAttr('data-src');
    });
  }
};

PortfolioItem.prototype.activate = function(){
  this.$link.addClass('is-active');
  if(this.$item){
    this.ensureImagesLoaded();
    this.$item.addClass('is-active');
    this.startSlideShow();
  }
};

PortfolioItem.prototype.deactivate = function(){
  this.$link.removeClass('is-active');
  if(this.$item){
    this.$item.removeClass('is-active');
    this.stopSlideShow();
  }
};

module.exports = PortfolioItem;