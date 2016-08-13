# Carousel3D
Just a 3D carousel plugin. No dependency.

------

## A THORNY problem

This cannot work properly in iPhone, eg `Safari`/`WeChat Browser`. The heart of the problem is the `timing`.

> Is there any tip or help?

------

## What is it?

As mentioned above, it is just a 3d carousel plugin. The author has been accustomed to writting plugin in [vanilla-js](http://vanilla-js.com/), so it was writtened by vanilla-js. In other words, this plugin is independent, no jQuery, no any other 
library or framework.

## Demo

[DEMO](http://xovel.cn/Carousel3D)

## Namespace

**Carousel3D**

## Example

```js
Carousel3D({
  carousel: '.carousel',
  items: '.carousel-item',
  reflect: false,
  wheel: true,
  keydown: true,
  percent: .6
});
```

## Options

### Default

```js
{
  carousel: '',
  items: '',
  reflect: false,
  reflectValue: 'below -5px -webkit-gradient(linear, left top,left bottom, from(rgba(0,0,0,0.25)), to(rgba(255,255,255,0.05)))',
  percent: .5,
  ratio: .3,
  depth: 2,
  currentClass: 'on',
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
}
```

### Notes

- `carousel`, **string**. Carousel main element.
- `items`, **string**. Carousel items.
- `reflect`, **boolean**. An experimental value. Set the carousel items a reflect effect and the value is determined by the value below.
- `reflectValue`, **string**. See `reflect`.
- `percent`, **number**. The percent of carousel item's width which is related to the main element.
- `ratio`, **number**. The ratio of carousel main element's height.
- `depth`, **integer**. *System reserved*. Determine the element's depth. If you don't know how to use it, just ignore it.
- `currentClass`, **string**. The className of carousel item which is currenttly actived.
- `opacity`, **number**. The minimal opacity of the carousel item.
- `grayscale`, **number**. The grayscale value of the carousel item.
- `sepia`, **number**. The sepia value of the carousel item.
- `blur`, **string**. eg: *3px*. The blur value of the carousel item.
- `animate`, **number**. The time from each effect duration. The unit is *millisecond*.
- `fps`, **integer**. How many times the animate effect excuted. Defaulted to `60`.
- `auto`, **number**, default value is `8000`. The flag of autoplay. Set a false-value like `0` or `false` to disable autoplay.
- `click`, **boolean**. Wether the item is clickable to switch.
- `keydown`, **boolean**. Wether to respond to keyboard events: `keyLeft` or `keyRight`.
- `wheel`, **boolean**. Wether to respond to wheel events.
- `resize`, **boolean**. Wether to respond to window resize events.
- `swipe`, **boolean**. Wether to respond to swipe events. **NOT implemented**
- `next`,  **string**. CSS-selector of prev element to switch to the prev carousel item.
- `prev`, **string**. CSS-selector of next element to switch to the next carousel item.
- `callback`, **function**. The callback function when the carousel item's switch-effect ends.

## API

### cur

Get the current active carousel item index.

### prev

Switch to the prev carousel item.

### next

Switch to the next carousel item.

### to 

Switch to the specified index.

### reset

Reset carousel to init state.

### stop

Stop autoplay.

### auto

Start autoplay with an interval duration.

## Util

```js
Carousel3D.util
```

### $

CSS selector.

### each

Traverse array or object.

### hasClass

Judge the element contains the class name.

### addClass

Add class name to the element.

### removeClass

Remove class name of the element.

### extend

Extend object.

### on

EventListener

## TODO

- [x] AMD
- [ ] swipe events
- [ ] Responsive

## Browser Support

- `-webkit-filter`
- `-webkit-box-reflect-` ~~if it is been enabled~~
- `classList`
- `addEventListener`
- `transform` 
- `querySelectorAll`

Test the feature in [Can I Use](http://caniuse.com/), and of course, it is up to you.

## Thanks to

- [depthdev/carousel3d](https://github.com/depthdev/carousel3d). **Inspiration of**
- `qslinz.js`, extend/each/className-polyfill

## Change Log

### 0.0.2

> 2016-08-12

- remove options `float`
- add API `reset`
- rename options `pest` to `ratio`
- add `callback` after initialization
- add options `currentClass`

### 0.0.1

> 2016-08-12

- project init.
- polyfill to `hasClass`/`addClass`/`removeClass`
- expose utils
