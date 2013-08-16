describe('CSSParser', function () {

    describe('. PropertyValueParser', function(){
      var propValueParser;

      beforeEach(function() {
        propValueParser = new PropertyValueParser();
      });


      describe('. hyphenToCamelCase', function(){

        it('should convert', function(){
          expect(propValueParser.hyphenToCamelCase('-webkit-transform')).toBe('webkitTransform');
          expect(propValueParser.hyphenToCamelCase('border-radius')).toBe('borderRadius');
          expect(propValueParser.hyphenToCamelCase('width')).toBe('width');
        });

      });

      describe('. parseParam', function(){

        it('should parse', function(){
          expect(propValueParser.parseParam('')).toEqual(['', '', '']);
          expect(propValueParser.parseParam('50')).toEqual(['50', '', '']);
          expect(propValueParser.parseParam('50 px')).toEqual(['50', 'px', '']);
          expect(propValueParser.parseParam('50 px, 10')).toEqual(['50', 'px', '10']);
        });

      });


      // Complete Parser Test
      describe('. parse', function(){

        it('should parse to', function () {
          var result         = propValueParser.parse("border-radius", "attr(data-width px, 50)");
          // return an object like { attr :  ['data-width'], func : function(){}, cssProp : 'borderRadius'}

          // Node with dafta-width attribute
          var nodeWithAttr   = document.createElement('div');
              nodeWithAttr.setAttribute("data-width", "20");

          // Node without data-width attribute
          var nodeWithoutAttr= document.createElement('div');


          expect(result.attr).toEqual(['data-width']);
          expect(result.cssProp).toBe('borderRadius');

          // Evaluate function with <div data-width="20">
          expect(result.func(nodeWithAttr)).toBe('20px');

          // Evaluate function with <div>, should use the fallback of 50
          expect(result.func(nodeWithoutAttr)).toBe('50px');
        });

        it('should be null', function(){
          expect(propValueParser.parse()).toBe(null);

          expect(propValueParser.parse(null, "attr(")).toBe(null);
          expect(propValueParser.parse(null, null)).toBe(null);
          expect(propValueParser.parse("data", "attr()")).toBe(null);

          expect(propValueParser.parse('width', '10px')).toBe(null);
          expect(propValueParser.parse('width', 'rotate()')).toBe(null);
        });
      });

    });
});