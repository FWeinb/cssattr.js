if (!!(window.MutationObserver ||  window.WebKitMutationObserver)){
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
    new NodeObserver([], window.MutationObserver ||  window.WebKitMutationObserver, new StyleGenerator(document), document) );
}