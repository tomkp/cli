#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const i = require('i')();

const hocTemplateSimple = name => `import React from 'react';\nimport './${i.dasherize(i.underscore(name))}.scss';\n\nexport default ({ children }) => <div className="${name}">{ children }</div>;`;

const hocTemplateDeepChildren = (program, name) => {
  const scss = i.dasherize(i.underscore(name));
  const contents =
    `import React from 'react';\n` +
    `import './${scss}.scss';\n\n` +
    `const ${name} = ({ children }) => { \n` +
    `\treturn (\n` +
    `\t\t<div className="${name}">\n` +
    `\t\t\t{ children }\n` +
    `\t\t</div>\n` +
    `\t);\n` +
    `};\n\n` +
    `${name}.propTypes = {\n` +
    `};\n\n` +
    `export default ${name};`;
  return contents;
};

const scssTemplate = (scss, name) => {
  return `.${name} {\n\t\n\n}`;
};


program
  .arguments('<name>')
  .option('-t, --trial')
  .option('-c, --colors')
  // .option('-p, --password <password>', 'The user\'s password')
  .action(function (name) {
    console.log(`Create higher order component '${name}'`);

    const scss = i.dasherize(i.underscore(name));
    const hocFileContents = hocTemplateDeepChildren(program, name);
    const scssFileContents = scssTemplate(scss, name);

    const jsFile = `${scss}/${name}.js`;
    const scssFile = `${scss}/${scss}.scss`;

    console.log(`${'-'.repeat(50)}\n${jsFile}:\n${hocFileContents}\n`);
    console.log(`${'-'.repeat(50)}\n${scssFile}:\n${scssFileContents}\n`);

    if (!program.trial) {
      fse.outputFile(`./${jsFile}`, hocFileContents, function (err) {
        if (err) console.log(err);
      });
      fse.outputFile(`./${scssFile}`, scssFileContents, function (err) {
        if (err) console.log(err);
      })
    }

  })
  .parse(process.argv);


