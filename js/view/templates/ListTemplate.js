define(['handlebars'], function(Handlebars) {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['ListTemplate.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section id='listView' role='region' class='view inactive hidden' data-type='card'>\n  <header>\n    <a href='#/menu'><span class='icon icon-back'>Show sidebar</span></a>\n    <menu type='toolbar'>\n      <a href='#/create'><span class='icon icon-add'>add</span></a>\n    </menu>\n    <h1 data-l10n-id='levels'></h1>\n  </header>\n  <article class=\"scrollable\">\n    <section data-type=\"list\">\n      <ul>\n      </ul>\n    </section>\n  </article>\n</section>";
  });
});