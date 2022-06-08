const fs = require('fs');
const path = require('path');

const fm = require('front-matter');
const glob = require('glob');
const handlebars = require('handlebars');
const marked = require('marked');
const sass = require('sass');

const ROOT = `${__dirname}/public`;
const CONTENT = ['posts'];


// Set parsing options for `.md` files.
marked.setOptions({
  headerIds: false,
  langPrefix: ''
});

// Parse a template located at `file`.
function parseTemplate(file) {
  const data = fs.readFileSync(file, 'utf-8');
  const { attributes, body } = fm(data);
  const page = {
    ...attributes,
    _path: file
  }

  switch (path.parse(file).ext) {
    case '.md':
      page.content = marked.parse(body);
      break;
    case '.hbs':
    default:
      page.content = body;
      break;
  }
  return page;
}

// Load/register templates/partials.
function loadTemplates(templatesDir) {
  // register partials directory
  glob
    .sync(`${templatesDir}/partials/**/*.hbs`)
    .forEach(file => {
      handlebars.registerPartial(
        path.parse(file).name,
        fs.readFileSync(file, 'utf-8')
      );
    });

  // load templates
  return glob
    .sync(`**/*.hbs`, { ignore: `partials/*` })
    .reduce((templates, file) => {
      const rel = path.parse(path.relative(templatesDir, file));
      const name = path.join(rel.dir, rel.name);

      // TODO: handle missing attributes

      return {
        ...templates,
        [name]: fs.readFileSync(file, 'utf-8')
      };
    }, {});
}

// Parse page content, handle missing attributes (optional).
function parseContent(contentDir, attrHelpers) {

  return glob.sync(`${contentDir}/**/*.{html,md}`)
    .map(parseTemplate);
  

  // helpers = helpers || {};

  // handle missing attributes
  // return Object.entries(helpers) .reduce((prev, [attr, cb]) => (
  //   { ...prev, [attr]: prev[attr] || cb(prev) }
  // ), page);
}

// render content using a given template.
// async function renderContent(contentDir, template) {
//   const files = glob.sync(`${contentDir}/**/*.{html,md}`);
//   return files.map(async file => {
//     const rel = path.parse(path.relative(contentDir, file));
//     const noext = path.join(rel.dir, rel.name);

//     const content = await fs.readFile(file, 'utf-8');
//     const data = rel.ext === '.md' ? marked.parse(content) : content;

//     // await fs.writeFile(
//     //   path.join(rootDir, noext),
//     //   handlebars.compile(template)(data)
//     // );
//     return path.join(rootDir, noext);
//   });
// }

// glob.sync(`${__dirname}/styles/**/_*.scss`);  // includes
// glob.sync(`${__dirname}/styles/**/*.scss`);  // mains

// // layout
// const attrHelpers = {
//   title: (file, page) => {

//   },
//   date: (file, page) => {

//   }
// };

function render() {
  const TEMPLATES = `${__dirname}/templates`;
  const POSTS = `${__dirname}/posts`
  
  const ROOT = `${__dirname}/public`

  // load templates
  const templates = loadTemplates(TEMPLATES);
  // console.log(templates);

  // load content
  const content = parseContent(POSTS, {
    title: page => path.parse(page._path).name,
    link: page => {
      const parsedPath = path.parse(page._path);
      return path.join(parsedPath.dir, parsedPath.name);
    },
    template: _ => 'post'
  });
  console.log(content);

  // const css = sass.compile(`${__dirname}/styles/main.scss`).css;

  // handlebars.compile()
}

render()
