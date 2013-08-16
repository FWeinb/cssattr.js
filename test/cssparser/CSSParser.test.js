describe('CSSParser', function () {

    describe('. parse', function(){
      var cssParser;

      beforeEach(function() {
        cssParser = new CSSParser();
      });


      it('should parse', function(){
        var cssAst = cssParser.parse(".bar { border-radius: attr(data-radius px, 50); }");

        var selector = cssAst['.bar'];

          expect(selector).toNotBe(undefined);
          expect(selector).toNotBe(null);

          expect(typeof(selector)).toBe('object');

        var selectorFilter = selector.filter;

          expect(selectorFilter).toNotBe(undefined);
          expect(selectorFilter).toNotBe(null);

          expect(selectorFilter instanceof Array).toBeTruthy();

          expect(selectorFilter).toEqual(['data-radius']);

          expect(selectorFilter.length).toBe(1);
      });

      it('should fail', function(){
        expect(cssParser.parse()).toEqual({});
        expect(cssParser.parse('')).toEqual({});
        expect(cssParser.parse('.bar{}')).toEqual({});
        expect(cssParser.parse('.bar{ width:10px; }')).toEqual({});
      });

    });
});