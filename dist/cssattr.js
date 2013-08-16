/*! CSS3 attr() Polyfill - v0.0.2 - 2013-08-16
 * 
 * Copyright (c) 2013 Fabrice Weinberg
 */
;(function (exports){

function PropertyValueParser(){ }

PropertyValueParser.prototype = {
  /**
   * This function will convert CSS Propertys like:
   * "border-raidus" to "borderRadius" or
   * "-webkit-transform" to "webkitTransform"
   */
  hyphenToCamelCase : function (property) {
      // Is there a hyphen?
      if (property.indexOf('-') === -1) return property;
      // Take care of the - for vendor prefixes
      if (property.charAt(0) === '-') property = property.substr(1);

      var spl = property.split('-'),
          result = '',
          length = spl.length;
      for (var i = 1; i < length; i++) {
          var w = spl[i];
          // First letter in uppercase rest in lowercase
          result += w[0].toUpperCase() + w.substr(1).toLowerCase();
      }
      return spl[0].toLowerCase()+result;
  },

  parseParam : function(params){
    var spaceStart = params.indexOf(' '),
        commaStart = params.indexOf(','),
        attrName   = '',
        unit       = '',
        fallback   = '';

    if (spaceStart !== -1) {
        attrName = params.substr(0, spaceStart).trim();
        if (commaStart !== -1) {
            unit = params.substr(spaceStart + 1, commaStart - (spaceStart + 1)).trim();
        } else {
            unit = params.substr(spaceStart + 1).trim();
        }
    }
    if (commaStart !== -1) {
        fallback = params.substr(commaStart + 1).trim();
    }
    // If attr is not yet set params must be the attrName;
    if (attrName === ''){
      attrName = params;
    }
    return [attrName, unit, fallback];
  },

  parse : function(property, value){
    if (!property  || !value) return null;

    var result = [],
        attr   = [],
        last   = 0,
        i      = 0,
        funcStart,
        funcEnd;

    // Simple check to see if there is a valid function statement.
    if ( value.indexOf('(') !== -1 && value.split("(").length === value.split(")").length) {
      // Search for the attr( function
      while ((i = value.indexOf("attr(", last)) !== -1) {

          funcStart = i + 5; // Add 5 for attr(
          funcEnd   = value.indexOf(")", funcStart);

          // Add letters between each attr() occurence
          if (i - last !== 0)
            result.push('"' + value.substr(last, i - last) + '"');

          // Parse attr() function for paramater
          var param = this.parseParam(value.substr(funcStart, funcEnd - funcStart));
          if (param[0] === '') return null; // Empty attr() function

          // Translate it to Javascript
          result.push('(n.hasAttribute("' + param[0] + '") ? (n.getAttribute("' + param[0] + '") + "' + param[1] + '") : "' + param[2] + '" + "' + param[1] + '")');
          // Add the Attribute to the attrCache
          attr.push(param[0]);

          last = ++funcEnd;
      }
      if (last > 0){
        // Add the remaining string after the last attr() function
        result.push('"' + value.substr(last) + '"');

        return {
            // Build new JavaScript Function
            func     : new Function('n', 'return ' + result.join('+')),
            attr     : attr,
            cssProp  : this.hyphenToCamelCase(property)
        };
      }
    }
    return null;
  }
};

var CSSParser = (function(propertyValueParser){
  var push     = [].push,
      cssRule  = /\s*(.*?)\s*{([^}]*)}/g,
      cssParse = /\s*(.*?)\s*:\s*([^;]*?);/g;

  function CSSParser() { }

  CSSParser.prototype = {

    parse : function (css) {
      if (css === undefined) return {};
      css = css.replace(/(?:\r|\n)/g, '').replace(/\/\*.+?\*\//g, '').toLowerCase();
      var ruleMatch, propMatch, cssExtendedFunction = {};
      while ((ruleMatch = cssRule.exec(css)) !== null) {
        var selector = ruleMatch[1],
            body     = ruleMatch[2];

        while ((propMatch = cssParse.exec(body)) !== null) {
          var parsedCssValue = propertyValueParser.parse(propMatch[1], propMatch[2]);
          // Ignore 'Content' css property.
          if (parsedCssValue !== null && parsedCssValue.cssProp !== 'content') {
            var selectorData = cssExtendedFunction[selector] || {
                                                                  attr: {},
                                                                  filter: []
                                                                };
            // Add dataAttr to filter
            push.apply(selectorData.filter, parsedCssValue.attr);
            // Add cssFunc to each dataAttr in selectorData;
            parsedCssValue.attr.forEach(function (i) {
              selectorData.attr[i] = (selectorData.attr[i] || []);
              selectorData.attr[i].push(parsedCssValue);
            });

            cssExtendedFunction[selector] = selectorData;
          }
        }
      }
      return cssExtendedFunction;
    }
  };

  return CSSParser;
})(new PropertyValueParser());

function StyleGenerator(doc){
  this.doc = doc;
}

StyleGenerator.prototype = {

  resolveFuncList : function (node, styles, cssPropValueList) {
    var result, attrFunc;
    for (var i = 0; i < cssPropValueList.length; i++) {
      var value = cssPropValueList[i];
      styles[value.cssProp] = value.func(node);
    }
  },

  generate : function (ast) {
    var styleMap = [];
    for (var selector in ast) {
      var nodeList     = this.doc.querySelectorAll(selector),
          selectorData = ast[selector];
      for (var i = 0; i < nodeList.length; i++) {
        var node    = nodeList[i],
            styles  = {},
            styleMapForNode = {
                node  : node,
                styles: styles
            };

        for (var dataAttr in selectorData.attr) {
            var cssPropValueList = selectorData.attr[dataAttr];
            this.resolveFuncList(node, styles, cssPropValueList);
        }

        styleMap.push(styleMapForNode);
      }
    }
    return styleMap;
  },

  apply : function (styleMap) {
      // Write styles to node.
      for (var i = 0; i < styleMap.length; i++) {
          var styleForNode = styleMap[i],
              node = styleForNode.node,
              styles = styleForNode.styles;

          for (var prop in styles) {
              node.style[prop] = styles[prop];
          }
      }
  }
};

function NodeObserver(observerList, mutationObserver, styleGenerator, doc){
  this.observerList     = observerList;
  this.mutationObserver = mutationObserver;
  this.styleGenerator   = styleGenerator;
  this.doc              = doc;
}

NodeObserver.prototype = {

  remove : function () {
      this.observerList.forEach(function (observer) {
          observer.disconnect();
      });
  },

  add : function (node, attr, filter) {
      var observer = new this.mutationObserver(function (mutationList) {
          var styles = {},
          styleMap = [{
              node: node,
              styles: styles
          }];
          for (var i = 0; i < mutationList.length; i++) {
              var mutation = mutationList[i],
                  attrName = mutation.attributeName;
              if (node.getAttribute(attrName) !== mutation.oldValue) {
                  resolveFuncList(node, styles, attr[attrName]);
              }
          }
          styleGenerator.apply(styleMap);
      });

      observer.observe(node, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: filter
      });

      return observer;
  },

  attach : function (ast) {
      for (var selector in ast) {
          var nodeList = this.doc.querySelectorAll(selector),
              selectorData = ast[selector];
          for (var i = 0; i < nodeList.length; i++) {
              var node = nodeList[i];
              this.observerList.push(this.add(node, selectorData.attr, selectorData.filter));
          }
      }
  }
};
exports.cssattr = (function(cssParser, styleGenerator, nodeObserver){
  return {
    parse: function (css) {
        this.cssAst = cssParser.parse(css);
        return this;
    },
    show: function () {
        styleGenerator.apply(styleGenerator.generate(this.cssAst));
        return this;
    },
    observe: function () {
        nodeObserver.attach(this.cssAst);
        return this;
    },
    unobserve: function () {
        nodeObserver.remove();
        return this;
    }
  };

})( new CSSParser(),
    new StyleGenerator(document),
    new NodeObserver([], MutationObserver ||  WebKitMutationObserver, new StyleGenerator(document), document) );
})(window);