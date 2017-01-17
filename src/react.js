#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const i = require('i')();

const statelessTemplateSimple = (name, suffix) => `import React from 'react';\nimport './${i.dasherize(i.underscore(name))}.${suffix}';\n\nexport default ({ children }) => <div className="${name}">{ children }</div>;`;

const statefulTemplate = (name, suffix) => {
    return  `import React, { Component } from 'react';\n` +
            `import './${i.dasherize(i.underscore(name))}.${suffix}';\n\n` +
            `class ${name} extends Component {\n\n` +
            `\trender() {\n`+
            `\t\treturn (\n`+
            `\t\t\t<div className="${name}">\n\n` +
            `\t\t\t</div>\n` +
            `\t\t);\n`+
            `\t}\n`+
            `};\n\n` +
            `${name}.propTypes = {\n` +
            `};\n\n` +
            `export default ${name};`;
};

const statelessTemplateDeepChildren = (name, suffix) => {
    const stylesheetName = i.dasherize(i.underscore(name));
    const contents =
        `import React from 'react';\n` +
        `import './${stylesheetName}.${suffix}';\n\n` +
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

const stylesheetTemplate = (name) => {
    return `.${name} {\n\t\n\n}`;
};


program
    .arguments('<name>')
    .option('-t, --test', 'Log the generated components without any changes to the file system')
    .option('-v, --verbose')
    .option('--stateful', 'Component has state - will extend Component')
    .option('-n, --naked')
    .option('--suffix <suffix>', 'The stylesheet suffix (css, scss, less etc...)')
    //.option('-c, --colors')
    // .option('-p, --password <password>', 'The user\'s password')
    .action(function (name) {
        console.log(`Create component '${name}'`);

        const stylesheetSuffix = program.suffix || 'css';

        const stylesheet = i.dasherize(i.underscore(name));
        const jsFileContents = program.stateful?
            statefulTemplate(name, stylesheetSuffix):
            statelessTemplateDeepChildren(name, stylesheetSuffix);

        const stylesheetFileContents = stylesheetTemplate(name);

        const jsFile = `${stylesheet}/${name}.js`;
        const stylesheetFile = `${stylesheet}/${stylesheet}.${stylesheetSuffix}`;

        if (program.verbose || program.test) {
            console.log(`${'-'.repeat(50)}\n${jsFile}:\n${jsFileContents}\n`);
            console.log(`${'-'.repeat(50)}\n${stylesheetFile}:\n${stylesheetFileContents}\n`);
        }

        if (!program.test) {
            fse.outputFile(`./${jsFile}`, jsFileContents, function (err) {
                if (err) console.log(err);
            });
            fse.outputFile(`./${stylesheetFile}`, stylesheetFileContents, function (err) {
                if (err) console.log(err);
            })
        }

    })
    .parse(process.argv);


