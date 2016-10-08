#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const i = require('i')();

const hocTemplateSimple = name => `import React from 'react';\nimport './${i.dasherize(i.underscore(name))}.scss';\n\nexport default ({ children }) => <div className="${name}">{ children }</div>;`;

const hocTemplateDeepChildren = name => {
  const scss = i.dasherize(i.underscore(name));
  return `import React from 'react';\nimport './${scss}.scss';\n\nconst ${name} = ({ children }) => { \n\treturn (\n\t\t<div className="${name}">\n\t\t\t{ children }\n\t\t</div>\n\t);\n};\nexport default ${name};`;
};

const scssTemplate = (scss, name) => {
  return `.${name} {\n\t\n\n}`;
};


program
  .arguments('<name>')
  .option('-t, --trial')
  // .option('-p, --password <password>', 'The user\'s password')
  .action(function (name) {
    console.log(`Create higher order component '${name}'`);

    const scss = i.dasherize(i.underscore(name));
    const hocFileContents = hocTemplateDeepChildren(name);
    const scssFileContents = scssTemplate(scss, name);

    console.log(`${hocFileContents}`);
    console.log(`${scssFileContents}`);

    if (!program.trial) {
      fse.outputFile(`./${scss}/${name}.js`, hocFileContents, function (err) {
        if (err) console.log(err);
      });
      fse.outputFile(`./${scss}/${scss}.scss`, scssFileContents, function (err) {
        if (err) console.log(err);
      })
    }

  })
  .parse(process.argv);


//const x = `import React from 'react';import './${i.tableize(name)}.scss';export default ({ children }) => <div className = "${name}" > { children } < / div >;`;