#!/usr/bin/env node
const fse = require('fs-extra');
const path = require('path');
const homeDir = require('homedir');

fse.readJson(path.join(__dirname, '..', 'templates', 'configTemplate.json'), (err, data) => {
  if (err) {
    console.log(err);
  }

  fse.writeJson(`${homeDir()}/.tamm.json`, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
});
