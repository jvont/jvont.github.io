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


// Set parsing options for `.md` files.
marked.setOptions({
  headerIds: false,
  langPrefix: ''
});

// Strip the file extension from `filepath`.
function stripext(filepath) {
  const parsedpath = path.parse(filepath);
  return path.join(parsedpath.dir, parsedpath.name);
}

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

// Parse pattern-matched content relative to a root directory using the
// given attribute helpers (object of attribute-helper pairs).
function parseContent(root, pattern, helpers) {
  // defaults are directory file matches + link creation helper
  pattern = pattern || '*.*';
  helpers = helpers || {};

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
      return Object.entries(helpers).reduce((acc, [attr, helper]) => {
        return { ...acc, [attr]: helper(acc) };
      }, page);
    });
}

// Register pattern-matched template partials by their base name.
function registerPartials(pattern) {
  glob.sync(pattern).forEach(src => {
    handlebars.registerPartial(
      path.parse(src).name,
      fs.readFileSync(src, 'utf-8')
    );
  });
}

// Recursively compile content using the given templates.
function compileContent(content, tmpts) {
  
  // await fs.writeFile(
  //   path.join(rootDir, noext),
  //   handlebars.compile(template)(data)
  // );
  // return path.join(rootDir, noext);
}

function render() {
  const TEMPLATES = `${__dirname}/templates`;
  const ROOT = `${__dirname}/public`;

  // create site's root directory
  fs.existsSync(ROOT) || fs.mkdirSync(ROOT);

  // register partials
  registerPartials(`${TEMPLATES}/partials/*.hbs`);

  // load templates, store by link
  const tmpts = parseContent(TEMPLATES, '*.hbs').reduce((acc, page) => {
    const link = stripext(page._path);
    return { ...acc, [link]: page };
  }, {});

  // load posts
  const posts = parseContent(`${__dirname}/posts`, '**/*.{html,hbs,md}', {
    title: page => page.title || path.parse(page._path).name,
    link: page => page.link ? path.normalize(page.link) : stripext(page._path),
    template: page => page.template || 'post'
  });

  // compile site content
  // const comp = compileContent(posts, tmpts);

  // TODO: create object with array of pages, etc.
  // recursively compile each object

  posts.forEach(page => {
    const tmpt = tmpts[page.template];
    
    const dest = path.join(ROOT, page.link);
    const dir = path.dirname(dest);
    fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });

    const cmp = handlebars.compile(tmpt.content)(page);

    fs.writeFileSync(dest, cmp, 'utf-8');
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
