CSS attr() polyfill
------------------------

This polyfill makes it possible to use `attr()` like it is defined in the [spec](http://www.w3.org/TR/2013/CR-css3-values-20130730/#attr).

## Live Demo

[Demo](http://codepen.io/FWeinb/pen/Dsdkr)

## Usage

  ```

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
    |---|--dev   # a compiled version (Just Temp)
        |--dist  # release version
        |--src   # source files
        |--test  # place for test. Names like [*].test.js
  ```

