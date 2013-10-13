define(['handlebars'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['DifficultyTemplate.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return "aria-checked='true'";
  }

  buffer += "<form id='difficultyView' role='dialog' data-type='value-selector' class='view inactive3'>\n  <section class='scrollable'>\n  <h1 data-l10n-id='difficulty'></h1>\n  <ol role='listbox'>\n    <li ";
  stack1 = helpers['if'].call(depth0, depth0.easy, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><label><span data-l10n-id='easy'></span></label></li>\n    <li ";
  stack1 = helpers['if'].call(depth0, depth0.medium, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><label> <span data-l10n-id='medium'></span></label></li>\n    <li ";
  stack1 = helpers['if'].call(depth0, depth0.hard, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "><label> <span data-l10n-id='hard'></span></label></li>\n  </ol>\n  </section>\n  <menu>\n  <a href='#/edit/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' role='button' class='full' data-l10n-id='ok'></a>\n  </menu>\n</form>";
  return buffer;
  });
});