define(['handlebars'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['AboutTemplate.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "checked";
  }

function program3(depth0,data) {
  
  
  return "class='hidden'";
  }

  buffer += "<section id='aboutView' role='region' class='view info inactive hidden' data-type='card'>\n  <header>\n    <a href='#/menu'><span class='icon icon-back'>Back</span></a>\n    <h1 data-l10n-id='information'></h1>\n  </header>\n  <article class=\"scrollable\">\n    <div role='main'>\n      <ul>\n        <li>\n          <small>Lukas Laag</small>\n          <span data-l10n-id='coding'></span>\n        </li>\n        <li>\n          <small data-l10n-id='graphics-value'></small>\n          <span data-l10n-id='graphics'></span>\n        </li>\n        <li>\n          <small>";
  if (stack1 = helpers.version) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.version; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</small>\n          <span data-l10n-id='version'></span>\n        </li>\n        <li>\n          <label>\n            <a href='#/releaseNotes' role='button' data-l10n-id='releaseNotes'></a>\n          </label>\n        </li>\n        <li>\n          <label>\n            <a href='#/legal' role='button' data-l10n-id='legal-info'></a>\n          </label>\n        </li>\n      </ul>\n      <section>\n        <header>\n          <h2 data-l10n-id='debugLogs'></h2>\n        </header>\n        <ul>\n          <li>\n            <label class=\"pack-switch\">\n              <input type=\"checkbox\" ";
  stack1 = helpers['if'].call(depth0, depth0.debugLogs, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n              <span></span>\n            </label>\n          </li>\n        </ul>\n      </section>\n      <section data-type='installation' ";
  stack1 = helpers.unless.call(depth0, depth0.install, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n        <header>\n          <h2 data-l10n-id='install'></h2>\n        </header>\n        <ul>\n          <li data-type='description' data-l10n-id='installTxt'></li>\n          <li>\n            <label>\n              <a href='#/install' role='button' data-l10n-id='installBtn'></a>\n            </label>\n          </li>\n          <li data-type='error'>";
  if (stack1 = helpers.error) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.error; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n        </ul>\n      </section>\n      <section data-type='upgrade' ";
  stack1 = helpers.unless.call(depth0, depth0.update, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n        <header>\n          <h2 data-l10n-id='update'></h2>\n        </header>\n        <ul>\n          <li>\n            <label>\n              <a href='#/update' role='button' data-l10n-id='updateBtn' data-l10n-args='{\"version\" : \"";
  if (stack1 = helpers.updateVersion) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.updateVersion; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"}'></a>\n            </label>\n          </li>\n          <li data-type='error'>";
  if (stack1 = helpers.error) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.error; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n        </ul>\n      </section>\n    </div>\n  </article>\n  <div id=\"arrow_box\" class=\"hidden ios\">\n    <h3 data-l10n-id='iosmsg1'></h3>\n    <p data-l10n-id='iosmsg2'></p>\n  </div>\n</section>";
  return buffer;
  });
});