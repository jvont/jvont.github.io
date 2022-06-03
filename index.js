const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const sass = require('sass');

const SRC = `${__dirname}/src`;

const TEMPLATES = `${__dirname}/templates`;
const STYLES = `${__dirname}/styles`;

Handlebars.registerHelper('ifwith', function(context, options) {
  if (context && Object.keys(context).length) {
    return options.fn(context);
  }
});

Handlebars.registerHelper('fa-convert', function(string) {
  return string.replace(/\s/g, '-').toLowerCase()
});

function registerPartials(partialsDir) {
  const filenames = fs.readdirSync(partialsDir);

  filenames.forEach(filename => {
    const parsedPath = path.parse(filename);

    if (parsedPath.ext === '.hbs') {
      const filepath = path.join(partialsDir, filename);
      const template = fs.readFileSync(filepath, 'utf-8');

      Handlebars.registerPartial(parsedPath.name, template);
    }
  });
}

function compileHtml(resume) {
  const css = sass.compile(`${__dirname}/styles/main.scss`).css;
  const tpl = fs.readFileSync(`${__dirname}/templates/index.hbs`, 'utf-8');
  const partialsDir = `${__dirname}/templates/partials`;
  
  return Handlebars.compile(tpl)({
    css,
    resume
  });
}

function deploy() {
  fs.mkdir(`${__dirname}/dist`, _ => {});

  fs.copyFileSync(`${__dirname}/index.html`, `${__dirname}/dist/index.html`);

}

deploy()
