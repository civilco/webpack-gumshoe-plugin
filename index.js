var fetch = require('node-fetch');
var path = require('path');
var qs = require('qs');

function GumshoePlugin(options) {
  this.options = options || {};
}

GumshoePlugin.prototype.apply = function(compiler) {
  var fingerprint = this.options.fingerprint;
  var env = this.options.env;
  var apiKey = this.options.apiKey;
  var name = this.options.name;
  var files = {};

  compiler.plugin('emit', function(compilation, callback) {
    Object.keys(compilation.assets).forEach(function(filename) {
      var file = compilation.assets[filename];

      if (fingerprint) {
        var parts = path.parse(filename);
        var newname = parts.name.replace(fingerprint, '');
        filename = path.join(parts.dir, newname + parts.ext);
      }

      files[filename] = file.size();
    });

    fetch('https://api.gumshoebot.com/v1/files?'+qs.stringify({
      env: env || process.env['NODE_ENV'] || 'development',
      name: name,
    }), {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
      },
      body: JSON.stringify(files),
    })
    .then(() => callback())
    .catch((err) => {
      console.log('error connecting to the server', err);
      callback(err);
    });
  });
};

module.exports = GumshoePlugin;
