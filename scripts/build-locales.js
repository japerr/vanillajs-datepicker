const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(__dirname);
const srcDir = `${rootDir}/js/i18n/locales`;
const distDir = `${rootDir}/dist/js/locales`;

const reConvert = /export default (\{\s+)([\w'-]+):([\s\S]+\})\n\};/m;
const rePropNameFix = /\.('\w+-\w+')/;

if (fs.existsSync(distDir)) {
  // empty dist dir
  fs.readdirSync(distDir).forEach((file) => {
    fs.unlinkSync(`${distDir}/${file}`);
  });
} else {
  fs.mkdirSync(distDir, {recursive: true});
}
var i= true;
// copy locales to dist
fs.readdirSync(srcDir).forEach((file) => {
  const src = fs.readFileSync(`${srcDir}/${file}`, 'utf8');
  if(i) {
    console.log(src)
    console.log(src.match(/export\s+default\s+(\{\s+)([\w'-]+):([\s]+\})\n\};/m))
  }

  const output = src
    .replace(reConvert, '(function () $1Datepicker.locales.$2 =$3;\n}());')
    //.replace(rePropNameFix, '[$1]');

    if(i) {
        console.log(output)
        i = false
    }
  fs.writeFileSync(`${distDir}/${file}`, output);
});
