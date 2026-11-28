// Protects the SPA's HTML from post-build HTML rewriters.
//
// The site has the "AMP Server-Side Rendering" plugin installed from the
// Netlify UI. It rewrites every HTML file into AMP and strips the
// <script type="module"> that boots the React app, leaving a blank page.
// UI-installed plugins run before plugins declared in netlify.toml, so this
// plugin snapshots the HTML right after the build command (onBuild) and puts
// it back at the end of onPostBuild, after the AMP plugin has run.
import fs from 'node:fs/promises';
import path from 'node:path';

const snapshot = new Map();

async function findHtml(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await findHtml(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

export const onBuild = async ({ constants }) => {
  for (const file of await findHtml(constants.PUBLISH_DIR)) {
    snapshot.set(file, await fs.readFile(file));
  }
  console.log(`restore-html: saved ${snapshot.size} HTML file(s)`);
};

export const onPostBuild = async () => {
  for (const [file, contents] of snapshot) {
    await fs.writeFile(file, contents);
  }
  console.log(`restore-html: restored ${snapshot.size} HTML file(s)`);
};
