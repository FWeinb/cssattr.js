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