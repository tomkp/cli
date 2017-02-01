#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const i = require('i')();
const dot = require('dot');
const path = require('path');

dot.templateSettings.strip = false;


const dots = dot.process({ path: path.join(__dirname, '..', 'templates') });


const statefulTemplate = (name, stylesheetName, stylesheetSuffix) => dots.statefulTemplate({
    stylesheetName: stylesheetName,
    stylesheetSuffix: stylesheetSuffix,
    name: name,
});

const statelessTemplate = (name, stylesheetName, stylesheetSuffix) => dots.statelessTemplate({
    stylesheetName: stylesheetName,
    stylesheetSuffix: stylesheetSuffix,
    name: name,
});

const specTemplate = (name, jsFileName) => dots.specTemplate({
    jsFileName: jsFileName,
    name: name,
});

const stylesheetTemplate = (name) => dots.stylesheetTemplate({ name: name });

program
    .arguments('<name>')
    .option('-e, --example', 'Log the generated components without any changes to the file system')
    .option('-s, --stateless', 'Create stateless React component')
    .option('-n, --nameless', 'Create js with index filename and css with style filename')
    .option('-v, --verbose')
    .option('--suffix <suffix>', 'The stylesheet suffix (css, scss, less etc...)')
    .action(function (name) {
        console.log(`Create component '${name}'`);

        const stylesheetSuffix = program.suffix || 'css';

        const jsFileName = program.nameless ? 'index' : name;
        const stylesheetName = program.nameless ? 'style' : i.dasherize(i.underscore(name));

        const directory = i.dasherize(i.underscore(name));
        const jsFileContents = program.stateless
          ? statelessTemplate(name, stylesheetName, stylesheetSuffix)
          : statefulTemplate(name, stylesheetName, stylesheetSuffix);

        const jsSpecContents = specTemplate(name, jsFileName);

        const stylesheetFileContents = stylesheetTemplate(name);

        const jsFile = `${directory}/${jsFileName}.js`;
        const jsSpecFile = `${directory}/${jsFileName}.spec.js`;
        const stylesheetFile = `${directory}/${stylesheetName}.${stylesheetSuffix}`;

        if (program.verbose || program.example) {
            console.log(`${'-'.repeat(50)}\n${jsFile}:\n${jsFileContents}\n`);
            console.log(`${'-'.repeat(50)}\n${stylesheetFile}:\n${stylesheetFileContents}\n`);
        }

        if (!program.example) {
            fse.outputFile(`./${jsFile}`, jsFileContents, function (err) {
                if (err) console.log(err);
            });
            fse.outputFile(`./${jsSpecFile}`, jsSpecContents, function (err) {
                if (err) console.log(err);
            })
            fse.outputFile(`./${stylesheetFile}`, stylesheetFileContents, function (err) {
                if (err) console.log(err);
            })
        }

    })
    .parse(process.argv);
