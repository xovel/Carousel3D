/**!
 * Carousel3D
 * Just a 3D carousel plugin.
 * author: xovel
 * version: 0.0.2
 * repo: https://github.com/xovel/Carousel3D
 * license: MIT
 * Last update: Fri Aug 12 2016 14:13:09 GMT+0800
 */

+function(window, document, undefined){

// -------
// Helpers

// extend on object
var _extend = function( dest, source ){
  for( var name in source ){
    dest[name] = source[name];
  }
  return dest;
}

// css selector using querySelector/querySelectorAll
var _$ = function(selector, all){
  if( typeof selector !== 'string' ){
    return selector;
  }
  return !all ?
    document.querySelector(selector) :
    document.querySelectorAll(selector);
}

// EventListener
var _on = function( elem, type, fun ){
  elem.addEventListener(type, fun, false);
}

// set styles for an element
var _css = function(elem, styles){
  for(var style in styles){
    elem.style[style] = styles[style];
  }
}

// traversal for an array or an object
var _each = function(obj, fn){
  
  var value, i = 0, length = obj.length;
  
  if( length === undefined ){
    for( i in obj ){
      if( false === fn.call( obj[ i ], i, obj[ i ] ) ) break;
    }
  } else {
    for ( ; i < length; i++ ) {
      if( false === fn.call( obj[ i ], i, obj[ i ] ) ) break;
    }
  }
  
  return obj;
}

// var _hasClass = function(elem, className){
//   return elem.classList.contains(className);
// }

var _hasClass = function(elem, className){
  if('classList' in elem){
    return elem.classList.contains(className);
  }else{
    var _className = elem.className;
    if(!!_className){
      _className = ' ' + _className + ' ';
      if( _className.indexOf(' ' + className + ' ')!==-1 ){
        return true;
      }
    }
  }
  return false;
}

// var _addClass = function(elem, className){
//   elem.classList.add(className);
// }

var _addClass = function(elem, className){
  if('classList' in elem){
    elem.classList.add(className);
  }else{
    var _className = elem.className;
    if(!_className){
      elem.className = className;
    }else{
      elem.className += ' ' + className;
    }
  }
}

// var _removeClass = function(elem, className){
//   elem.classList.remove(className);
// }

var _removeClass = function(elem, className){
  if('classList' in elem){
    elem.classList.remove(className);
  }else{
    var _className = elem.className;
    if( !_className ){
      return;
    }

    var _kls = _className.split(/\s+/);
    var ret = [];
    for(var i = 0, j = _kls.length; i < j; i++ ){
      if( _kls[i] !== className ){
        ret.push(_kls[i]);
      }
    }

    elem.className = ret.join(' ');
  }
}

var _error = function(msg){
  throw new Error(msg);
}

// Helpers End
// -----------

var Carousel3D = function(options){
  options = _extend({
    carousel: '',
    items: '',
    reflect: false,
    reflectValue: 'below -5px -webkit-gradient(linear, left top,left bottom, from(rgba(0,0,0,0.25)), to(rgba(255,255,255,0.05)))',
    percent: .5,
    ratio: .3,
    depth: 2,
    currentClass: 'on',
    float: 'left', // abandoned
    opacity: .1,
    grayscale: 1,
    sepia: 1,
    blur: 5,
    animate: 300,
    fps: 60,
    auto: 8000,
    click: true,
    keydown: false,
    wheel: false,
    resize: true,
    swipe: false,
    next: null,
    prev: null,
    callback: null
  }, options || {});

  var carousel = _$( options.carousel );
  var items = _$( options.items, 1 );

  if( !items || !items.length ){
    _error('No items...');
  }

  // 
  var _tmr = null;
  var _itv = null;

  var params = {};
  params.len = items.length;
  params.step = 360 / params.len;
  params.speed = options.animate / options.fps;
  params.div = options.animate / params.speed;
  params.curr = 0;
  params.from = 0;
  params.to = 0;

  var _init = function(){

    clearTimeout(_tmr);

    var carouselWidth = carousel.offsetWidth;
    var carouselHeight = carouselWidth * options.ratio;

    _css(carousel,{'height':carouselHeight + 'px', 'position': 'relative'});

    var initWidth = items[0].offsetWidth;
    var initHeight = items[0].offsetHeight;
    var initRatio = initWidth / initHeight;
    var itemWidth = carouselWidth * options.percent;

    params.width = carouselWidth / 2;
    params.height = carouselHeight / 2;
    params.degree = [];

    _each(items, function(index, item){
      
      // params.degree.push(options.float === 'left' ? 360 - Math.floor( index * params.step ) : Math.floor( index * params.step ));
      params.degree.push(360 - Math.floor( index * params.step ));
      
      _css(item, {
        'position': 'absolute',
        'width': itemWidth + 'px',
        'height': 'auto',
        'margin': '-' + (itemWidth * initRatio / 2) + 'px auto auto -' + (itemWidth / 2) + 'px'
      });

      if( options.reflect ){
        _css(item, {
          '-webkit-box-reflect': options.reflectValue
        });
      }
    });

    _set(0);
    _auto();
    _callback();
  }

  var _set = function(deg){

    var pi = Math.PI;

    params.deg = [];
    _each(params.degree, function(index, value){
      params.deg[index] = value + deg + 90;
    });

    _each(items, function(index, item){
      var r = params.deg[index] * pi / 180;
      var rr = ((params.degree[index] + deg) % 360) * pi / 180;
      var p = rr < pi ? rr / pi : (pi * 2 - rr) / pi;
      var s = rr > pi ? 1 - (pi * 2 - rr) / (pi * options.depth) : 1 - (rr / (pi * options.depth));
      var x = params.width * (1 + Math.cos(r));
      var y = params.height * (1 + Math.sin(r));
      var _z = (params.degree[index] + deg + 180) % 360;
      var z = Math.ceil(_z > 180 ? (360 - _z) / params.step : _z / params.step);

      _css(item, {
        'left': x + 'px',
        'top': y + 'px',
        'z-index': z,
        'opacity': options.opacity < 1 ? 1 - ((1 - options.opacity) * p) : 1,
        'transform': 'scale(' + s + ',' + s + ')',
        '-webkit-filter': 'grayscale(' + (options.grayscale ? options.grayscale * p : 0) + ') ' + 
                          'sepia('+ (options.sepia ? options.sepia * p : 0) + ') ' +
                          'blur('+ (options.blur ? options.blur * p : 0) + 'px)'
      });

      if(z >= params.len / 2){
        _addClass(item, options.currentClass);
        params.index = index;
      }else{
        _removeClass(item, options.currentClass);
      }
    });
  }

  var _run = function(deg){
    if( options.animate ){
      params.super = deg > params.curr;
      params.from = params.curr;
      params.curr = deg;
      params.by = ( params.curr - params.from ) / params.div;

      _animate();
    }else{
      _set(deg);
      _callback();
    }
  }

  var _animate = function(){
     _tmr = setTimeout(function(){
      // console.log(params)
      params.super ? 
        params.from >= params.curr ? (clearTimeout(_tmr), _callback()) : ( _animating(), _animate() )
        : params.from <= params.curr ? (clearTimeout(_tmr), _callback()) : ( _animating(), _animate() );
     }, params.speed);
  }

  var _animating = function(){
    params.from += params.by;
    params.to = params.from < 0 ? 360 - ( -params.from % 360 ) : params.from;
    _set(params.to);   
  }

  var _cur = function(){
    return params.index;
  }

  var _next = function(v){
    v = v || 1;
    v = Math.floor(v);
    var deg = params.curr + params.step * v;
    _run(deg);
    _auto();
  }

  var _prev = function(v){
    v = v || 1;
    v = Math.floor(v);
    var deg = params.curr - params.step * v;
    _run(deg);
    _auto();
  }

  var _to = function(v){
    var deg = params.step * v;
    _run(deg);
    _auto();
  }

  // auto
  var _autoplay = function(){
    _next();
  }

  var _auto = function(){
    clearInterval(_itv);
    if( options.auto ){
      _itv = setInterval( _autoplay, options.auto );
    }
  }

  // click
  if( options.click ){
    _each(items, function(index, item){
      _on(item, 'click', function(){
        _to(index);
      });
    });
  }

  // wheel
  if( options.wheel ){
    _on(carousel.parentNode, 'wheel', function(e){
      var dir = e.wheelDeltaY < 0;
      !!dir ? _prev() : _next();
    });
  }

  // keydown
  if( options.keydown ){
    _on(window, 'keydown', function(e){
      if( e.keyCode === 37 ){
        _prev();
      }
      if( e.keyCode === 39 ){
        _next();
      }
    });
  }

  // callback
  var _callback = function(){
    if( typeof options.callback === 'function' ){
      options.callback.call(items,_cur());
    }
  }

  // prev
  if( options.prev ){
    _on(_$(options.prev), 'click', function(){
      _prev();
    });
  }

  // next
  if( options.next ){
    _on(_$(options.next), 'click', function(){
      _next();
    });
  }

  _init();
  // window resize
  if( options.resize ){
    _on(window, 'resize', function(){
      _init();
    });
  }

  // API
  return {
    // run: _run,
    cur: _cur,
    prev: _prev,
    next: _next,
    to: _to,
    reset: _init,
    stop: function(){ clearInterval(_itv); options.auto = 0; },
    auto: function(v){ options.auto = v; _auto(); }
  }
}

// expose
Carousel3D.util = {
  $: _$,
  each: _each,
  hasClass: _hasClass,
  addClass: _addClass,
  removeClass: _removeClass,
  extend: _extend,
  on: _on
}

window.Carousel3D = Carousel3D;

// AMD
if(typeof define === "function" && define.amd){
  define("Carousel3D", [], function(){
    return Carousel3D;
  });
}

}(window, document);

