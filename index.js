const fs = require('fs');
const path = require('path');

const fm = require('front-matter');
const glob = require('glob');
const handlebars = require('handlebars');
const marked = require('marked');
const sass = require('sass');
const { parse } = require('path');

const ROOT = `${__dirname}/public`;
const CONTENT = ['posts'];


// Strip the file extension from `filepath`.
function stripext(filepath) {
  const parsedpath = path.parse(filepath);
  return path.join(parsedpath.dir, parsedpath.name);
}

// Set parsing options for `.md` files.
marked.setOptions({
  headerIds: false,
  langPrefix: ''
});

// Load template data from `src` and convert it to html.
function loadTemplate(src) {
  const data = fs.readFileSync(src, 'utf-8')
  const { attributes, body } = fm(data);

  switch (path.parse(src).ext) {
    case '.md':
      attributes.content = marked.parse(body);
      break;
    case '.hbs':
    default:
      attributes.content = body;
      break;
  }
  return attributes;
}

// Parse content from `root` dir, matching glob `pattern`, with the 
// given attribute `helpers` (object of attribute-helper pairs).
function parseContent(root, pattern, helpers) {
  // defaults are directory file matches + link creation helper
  pattern = pattern || '*.*';
  helpers = { link: page => stripext(page._path), ...helpers };

  return glob.sync(pattern, { cwd: root })
    .map(src => {
      // parse template and add relative path
      return {
        ...loadTemplate(path.join(root, src)),
        _path: src
      };
    })
    .map(page => {
      // handle missing attributes using helpers
      return Object.entries(helpers).reduce((prev, [attr, helper]) => {
        return { ...prev, [attr]: prev[attr] || helper(prev) };
      }, page);
    });
}

// Register template partials matching `pattern` by their base name.
function registerPartials(pattern) {
  glob.sync(pattern).forEach(src => {
    handlebars.registerPartial(
      path.parse(src).name,
      fs.readFileSync(src, 'utf-8')
    );
  });
}

// Recursively compile template `content`.
function compileContent(content) {

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

function render() {
  const TEMPLATES = `${__dirname}/templates`;
  const ROOT = `${__dirname}/public`;

  // create site's root directory
  fs.existsSync(ROOT) || fs.mkdirSync(ROOT);

  // register partials
  registerPartials(`${TEMPLATES}/partials/*.hbs`);

  // load templates
  const templates = parseContent(TEMPLATES, '*.hbs');

  // load posts
  const posts = parseContent(`${__dirname}/posts`, '**/*.{html,hbs,md}', {
    title: page => path.parse(page._path).name,
    template: _ => 'post'
  });

  // copy images
  const IMAGES = `${__dirname}/images`;
  const IMGROOT = `${ROOT}/images`;

  fs.existsSync(IMGROOT) || fs.mkdirSync(IMGROOT);

  glob.sync(`${IMAGES}/*`).forEach(src => {
    const dest = path.join(IMGROOT, path.basename(src));
    fs.copyFileSync(src, dest);
  });

  // compile scss
  // glob.sync(`${__dirname}/styles/**/_*.scss`);  // includes
  // glob.sync(`${__dirname}/styles/**/*.scss`);  // mains
  // const css = sass.compile(`${__dirname}/styles/main.scss`).css;

  // handlebars.compile()


}

render()
