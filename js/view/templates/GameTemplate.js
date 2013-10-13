define(['handlebars'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['GameTemplate.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<section id='gameView' role='region' class='view' data-type='card'>\n  <header>\n    <a href='#/menu'><span class='icon icon-menu'>Show sidebar</span></a>\n    <a href='#/play/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'><span class='icon icon-menu'>Hide sidebar</span></a>\n    <h1 data-l10n-id='title'></h1>\n  </header>\n  <div role='main' id='pushDiv'><svg></svg></div>\n  <div role='toolbar'>\n    <ul>\n      <li>\n        <a href='#/previous' role='button'><span class='action-icon browser-back'>Previous</span></a>\n      </li>\n    </ul>\n    <ul>\n      <li>\n        <a href='#/next' role='button'><span class='action-icon browser-forward'>Next</span></a>\n      </li>\n    </ul>\n  </div>\n</section>";
  return buffer;
  });
});