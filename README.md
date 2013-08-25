CSS attr() polyfill
------------------------

[![Build Status](https://travis-ci.org/FWeinb/cssattr.js.png?branch=master)](https://travis-ci.org/FWeinb/cssattr.js)


This polyfill makes it possible to use `attr()` like it is defined in the [spec](http://www.w3.org/TR/2013/CR-css3-values-20130730/#attr).

## Live Demo

[Demo](http://codepen.io/FWeinb/pen/Dsdkr)

## Usage

  ```
    // Get CSS for all styles
    var styleNode = document.querySelectorAll('style'),
        css = '';
    for (var i = 0; i < styleNode.length; i++) {
        css += styleNode[i].innerHTML;
    }
    //Parse the CSS, show it and observe for changes.
    cssattr.parse(css).show().observe();
  ```

## What is working

  * `attr()` function is parsed spec conform
  * styles are updated on attribute change (Using MutationObserver)

## Not working (Yet?)

  * Can't use attr() on :before, :after
  * It's not tested if the browser supports the `attr()` function according to spec (none as of writing)
  * Dosn't take @media into account
  * Not working in @keyframes

## Build/Testing/Developing
  Grunt is used for Building/Testing/Developing

  Build run:

    grunt build

  Test run:

    grunt test

  Devlopment run:

    grunt dev

## Project Structure

  ```
  cssattr.js
    |---|--dev   # a compiled version (just temp)
        |--dist  # release version
        |--src   # source files
        |--test  # place for test. Names like [*].test.js
  ```

