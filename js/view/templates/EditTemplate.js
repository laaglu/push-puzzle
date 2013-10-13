define(['handlebars'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['EditTemplate.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "selected";
  }

  buffer += "<form id='editView' role='dialog' data-type='edit' class='view inactive'>\n  <header>\n    <a role='button' href='#/list'><span class='icon icon-close'>close</span></a>\n    <menu type='toolbar'>\n      <a role='button' href='#/commit'><span data-l10n-id='done'></span></a>\n    </menu>\n    <h1 data-l10n-id='editLevel'></h1>\n  </header>\n  <article class=\"scrollable\">\n    <ul class='compact'>\n      <li>\n        <label data-l10n-id='name'></label>\n        <input type='text' data-l10n-id='name' placeholder='' maxLength='50' value='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'/>\n      </li>\n      <li>\n        <label data-l10n-id='difficulty'></label>\n        <p class='fake-select'>\n          <a role='button' class='icon icon-dialog' href='#/difficulty'>";
  if (stack1 = helpers.difficultyValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.difficultyValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n          <select name='difficulty' data-value-type='integer'>\n            <option value='0' data-l10n-id='easy' ";
  stack1 = helpers['if'].call(depth0, depth0.easy, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></option>\n            <option value='1' data-l10n-id='medium' ";
  stack1 = helpers['if'].call(depth0, depth0.medium, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></option>\n            <option value='2' data-l10n-id='hard' ";
  stack1 = helpers['if'].call(depth0, depth0.hard, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></option>\n          </select>\n        </p>\n      </li>\n      <li>\n        <label data-l10n-id='creationDate'></label>\n        <input readonly type='text' maxLength='50' value='";
  if (stack1 = helpers.creationDate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.creationDate; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'/>\n      </li>\n      <li>\n        <label data-l10n-id='lastPlayed'></label>\n        <input readonly type='text' maxLength='50' value='";
  if (stack1 = helpers.lastPlayed) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.lastPlayed; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' data-l10n-id='lastPlayed'/>\n      </li>\n      <li>\n        <label data-l10n-id='image'></label>\n        <svg></svg>\n      </li>\n    </ul>\n  </article>\n  <menu>\n    <a class='danger full' data-l10n-id='erase' role='button' href='#/erase/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></a>\n  </menu>\n</form>";
  return buffer;
  });
});