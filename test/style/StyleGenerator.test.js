describe('Style', function () {

    describe('. StyleGenerator', function(){
      var cssSimpleAst  = new CSSParser().parse('.bar { border-radius: attr(data-test px, 10); }'),
          cssAdvancedAst= new CSSParser().parse('.bar { border-radius: attr(data-test px, 10) attr(data-test1 px, 10);}');

      var mockDocumentGenenerator = function(nodeGenFunc){
        return {
          querySelectorAll : function(selector){
            return nodeGenFunc();
          }
        };
      };

      describe('. resolveFuncList', function(){
        iit('should resolve the function and write it to "style"', function(){
          var styleGenerator = new StyleGenerator();

          var style = {};

          styleGenerator.resolveFuncList(document.createElement('div'), style, [{cssProp : 'borderRadius', func : function(n){ return '10px';}}]);

          expect(style).toEqual({borderRadius : '10px'});
        });

      });

      describe('. generate', function(){
        it('should parse one attr() function with correct 20px for border-radius', function(){
          var mockDocumentWithResultAndAttribute = mockDocumentGenenerator(function(){
            var node = document.createElement('div');
                node.setAttribute('data-test', 20);
            return [node];
          });

          var styleGenerator = new StyleGenerator(mockDocumentWithResultAndAttribute);
          var styleMap = styleGenerator.generate(cssSimpleAst);
              expect(styleMap instanceof Array).toBeTruthy();
              expect(styleMap.length).toBe(1);

              expect(styleMap[0].styles).toEqual({borderRadius:'20px'});
        });

        it('should parse one attr() function with fallback value 10px for border-radius', function(){
          var mockDocumentWithResult = mockDocumentGenenerator(function(){
            var node = document.createElement('div');
            return [node];
          });

          var styleGenerator = new StyleGenerator(mockDocumentWithResult);
          var styleMap = styleGenerator.generate(cssSimpleAst);
              expect(styleMap instanceof Array).toBeTruthy();
              expect(styleMap.length).toBe(1);

              expect(styleMap[0].styles).toEqual({borderRadius:'10px'});
        });


        it('should parse one attr() function with empty styleMap', function(){
          var mockDocument = mockDocumentGenenerator(function(){
            return [];
          });

          var styleGenerator = new StyleGenerator(mockDocument);
          var styleMap = styleGenerator.generate(cssSimpleAst);
              expect(styleMap instanceof Array).toBeTruthy();
              expect(styleMap.length).toBe(0);
        });


        it('should parse two attr() function with correct result', function(){
          var mockDocumentTwoAttr = mockDocumentGenenerator(function(){
            var node = document.createElement('div');
                node.setAttribute('data-test', 20);
                node.setAttribute('data-test1', 40);
            return [node];
          });

          var styleGenerator = new StyleGenerator(mockDocumentTwoAttr);

          var styleMap = styleGenerator.generate(cssAdvancedAst);
              expect(styleMap instanceof Array).toBeTruthy();

              expect(styleMap.length).toBe(1);

              expect(styleMap[0].styles).toEqual({borderRadius:'20px 40px'});
        });
      });

      describe('.apply', function(){
        it('should apply the stylings to the node', function(){
          var node = document.createElement('div');
              node.setAttribute('data-test', 20);

          var mockDocumentWithResultAndAttribute = mockDocumentGenenerator(function(){
            return [node];
          });

          var styleGenerator = new StyleGenerator(mockDocumentWithResultAndAttribute);


          styleApplyer.apply(styleGenerator.generate(cssSimpleAst));

          expect(node.style.borderRadius).toBe('20px');
        });

        it('should apply the fallback styling to the node', function(){
          var node = document.createElement('div');

          var mockDocumentWithResultAndAttribute = mockDocumentGenenerator(function(){
            return [node];
          });

          var styleGenerator = new StyleGenerator(mockDocumentWithResultAndAttribute);

          styleApplyer.apply(styleGenerator.generate(cssSimpleAst));

          expect(node.style.borderRadius).toBe('10px');
        });
      });
    });
});