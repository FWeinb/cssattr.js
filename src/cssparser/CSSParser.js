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
