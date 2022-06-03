const fs = require('fs/promises');
const path = require('path');
const Handlebars = require('handlebars');
const sass = require('sass');

const ROOT = `${__dirname}/public`;

const POSTS = `${__dirname}/posts`;
const STYLES = `${__dirname}/styles`;
const TEMPLATES = `${__dirname}/templates`;


// Register partial templates at `partialsDir` for compilation.
async function registerPartials(partialsDir) {
  const filenames = await fs.readdir(partialsDir);

  for await (const filename of filenames) {
    const parsedPath = path.parse(filename);

    if (parsedPath.ext === '.hbs') {
      const filepath = path.join(partialsDir, filename);
      const template = await fs.readFile(filepath, 'utf-8');

      Handlebars.registerPartial(parsedPath.name, template);
    }
  }
}

// Parse posts content (html/markdown).
async function parsePosts(postsDir) {

}

// function compileHtml(resume) {
//   const css = sass.compile(`${__dirname}/styles/main.scss`).css;
//   const tpl = fs.readFileSync(`${__dirname}/templates/index.hbs`, 'utf-8');
//   const partialsDir = `${__dirname}/templates/partials`;
  
//   return Handlebars.compile(tpl)({
//     css,
//     resume
//   });
// }

async function build() {
  // registerPartials(`${TEMPLATES}/partials`);
}

build()
