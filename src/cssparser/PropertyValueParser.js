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
