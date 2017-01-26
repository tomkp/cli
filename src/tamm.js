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

const stylesheetTemplate = (name) => {
    return `.${name} {\n\t\n\n}`;
};


program
    .arguments('<name>')
    .option('-t, --test', 'Log the generated components without any changes to the file system')
    .option('-s, --stateless', 'Create stateless React component')
    .option('-n --nameless', 'Create js with index filename and css with style filename')
    .option('-v, --verbose')
    .option('--suffix <suffix>', 'The stylesheet suffix (css, scss, less etc...)')
    .action(function (name) {
        console.log(`Create component '${name}'`);

        const stylesheetSuffix = program.suffix || 'css';

        const jsFileName = program.nameless ? 'index' : name;
        const stylesheetName = program.nameless ? 'style' : i.dasherize(i.underscore(name));

        const stylesheet = i.dasherize(i.underscore(name));
        const jsFileContents = program.stateless
          ? statelessTemplate(name, stylesheetName, stylesheetSuffix)
          : statefulTemplate(name, stylesheetName, stylesheetSuffix);

        const stylesheetFileContents = stylesheetTemplate(name);

        const jsFile = `${stylesheet}/${jsFileName}.js`;
        const stylesheetFile = `${stylesheet}/${stylesheetName}.${stylesheetSuffix}`;

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
