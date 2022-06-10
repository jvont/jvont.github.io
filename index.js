import { parse } from 'path';

import makesite from 'makesite';


// const helpers = [
//   title: page => page.title || parse(page._path).name,
//   template: page => page.template || 'post'
// ];

async function build() {
  const tpl = makesite.parseTemplate(`tulips-at-queens.md`, { cwd: 'posts', helpers: helpers });
  
  console.log(await tpl);
}

build()
