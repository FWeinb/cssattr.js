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
