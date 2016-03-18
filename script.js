(function () {
    function Slider(settings) {
      this.__main = document.querySelector(settings.element);
      this.__pagination = document.querySelector(settings.pagination);
      this.__controlButtons = document.querySelector(settings.controlButtons);
      this.__itemsAmount = this.__main.children.length;
      this.__slides = this.__main.children;
      this.__currentShift = settings.start * settings.shift;
      this.__currentSlide = settings.start || 0;
      this.__direction = settings.direction || 'left';
      this.__shiftTime = settings.shiftTime;

      this.init(settings.shift);
    }

  Slider.prototype.init = function (shift) {
    this.__slides[this.__currentSlide].classList.add('active');

    this.__main.addEventListener('click', this.onMainClick.bind(this, [shift]), false);  //click on the slide

    if(this.__pagination !== null) {
      for (var i = 0; i < this.__pagination.children.length; i++) { //click on each of the pagination buttons
        this.__pagination.children[i].addEventListener('click', this.onPaginationClick.bind(this, [this.__pagination.children[i].dataset.slider__item, shift]), false); //here we give index of clicked button and shift value
      }
    }
    if(this.__controlButtons !== null) {
      for (var i = 0; i < this.__controlButtons.children.length; i++) { //click on Prev/Next buttons
        this.__controlButtons.children[i].addEventListener('click', this.onControlButtonClick.bind(this, [this.__controlButtons.children[i].getAttribute('id'), shift]), false);
      }
    }

    if(this.__direction == 'vertical') {
      this.__main.style.whiteSpace = 'normal';
      this.__direction = 'top';
    }
    else if(this.__direction == 'horizontal') {
      this.__main.style.whiteSpace = 'nowrap';
      this.__direction = 'left';
    }

    for(var i = 0; i < this.__itemsAmount; i++) { //set to all items time for shifting
      this.__slides[i].style.transitionDuration = this.__shiftTime / 1000 + 's';
    }

    this.render();
  }

  Slider.prototype.render = function () {
    var length = this.__itemsAmount;
    length--;

    for(var i = 0; i < this.__itemsAmount; i++) {
      this.__slides[i].style[this.__direction] = this.__currentShift + 'px';
    }
    if(this.__controlButtons !== null && this.__currentSlide == length) { //if settings for controlButtons were set, we can enable or disable it
      this.__controlButtons.children[1].setAttribute('disabled', 'true');
    }
    else if (this.__controlButtons !== null && this.__currentSlide !== length) {
      this.__controlButtons.children[1].removeAttribute('disabled');
    }

    if(this.__controlButtons !== null && this.__currentSlide == 0) {
      this.__controlButtons.children[0].setAttribute('disabled', 'true');
    }
    else if(this.__controlButtons !== null && this.__currentSlide !== 0) {
      this.__controlButtons.children[0].removeAttribute('disabled');
    }

    for(var i = 0; i < this.__pagination.children.length; i++) {
      this.__pagination.children[i].style.removeProperty('background');
    }
    this.__pagination.children[this.__currentSlide].style.background = 'red';
  }

  Slider.prototype.onMainClick = function (shft) {
    var shift = shft[0];
    var length = this.__itemsAmount;
    length--;

    if (length == this.__currentSlide) {
      this.__slides[this.__currentSlide].classList.remove('active');
      this.__currentShift = 0;
      this.__currentSlide = 0;
      this.__slides[this.__currentSlide].classList.add('active');
    }
    else {
      this.__currentShift += shift;
      this.__currentSlide++;
      for (var i = 0; i < this.__itemsAmount; i++) { //prob. stupid solution for removing all active classes but it works
        this.__slides[i].classList.remove('active');
      }

      this.__slides[this.__currentSlide].classList.add('active');
    }

    this.render();
  }

  Slider.prototype.onPaginationClick = function () {
    var args = arguments[0];
    var index = args[0];
    var shift = args[1];

    index--;

    for(var i = 0; i < this.__itemsAmount; i++) {
      this.__slides[i].classList.remove('active');
    }

    this.__currentShift = shift * index;
    this.__currentSlide = index;
    this.__slides[index].classList.add('active');
    this.render();
  };

  Slider.prototype.onControlButtonClick = function () {
    var args = arguments[0];
    var type = args[0];
    var shift = args[1];
    var length = this.__itemsAmount;
    var prevSlide = this.__currentSlide;
    var nextSlide = this.__currentSlide;
    length--;

    if(type == 'control-button__prev') {
      if(this.__currentSlide != 0) {
        this.__currentSlide--;
        this.__currentShift -= shift;
        this.__slides[this.__currentSlide].classList.add('active');
        this.__slides[prevSlide].classList.remove('active');
      }
    }
    else if(type == 'control-button__next') {
      if(this.__currentSlide != length) {
        this.__currentSlide++;
        this.__currentShift += shift;
        this.__slides[this.__currentSlide].classList.add('active');
        this.__slides[nextSlide].classList.remove('active');
      }
    }
    this.render();
  }

  window.Slider = Slider;
})();