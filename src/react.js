#!/usr/bin/env node
const program = require('commander');
const fse = require('fs-extra');
const i = require('i')();
const dot = require('dot');

dot.templateSettings.strip = false;


const dots = dot.process({ path: "../templates"});


const statefulTemplate = (name, stylesheetSuffix) => dots.statefulTemplate({
    stylesheetName: i.dasherize(i.underscore(name)),
    stylesheetSuffix: stylesheetSuffix,
    name: name,
});

const stylesheetTemplate = (name) => {
    return `.${name} {\n\t\n\n}`;
};


program
    .arguments('<name>')
    .option('-t, --test', 'Log the generated components without any changes to the file system')
    .option('-v, --verbose')
    .option('--suffix <suffix>', 'The stylesheet suffix (css, scss, less etc...)')
    .action(function (name) {
        console.log(`Create component '${name}'`);

        const stylesheetSuffix = program.suffix || 'css';

        const stylesheet = i.dasherize(i.underscore(name));
        const jsFileContents = statefulTemplate(name, stylesheetSuffix);

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


