
const shell = require('electron').shell

window.openExternal = function (url) {
  shell.openExternal(url)
}

const fs = require('fs');
window.writeFile = function(path, data, callback) {
  fs.writeFile(path, data, function (error) {
    if (error) {
      if(callback) callback(error);
      console.log('writeFile failed');
    } else {
      if(callback) callback(null);
      console.log('writeFile success');
    }
  })
}

const path = require('path');
window.path = path;