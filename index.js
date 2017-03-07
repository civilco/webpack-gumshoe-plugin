var fetch = require('node-fetch');
var path = require('path');

function GumshoePlugin(options) {
  this.options = options || {};
}

GumshoePlugin.prototype.apply = function(compiler) {
  var fingerprint = this.options.fingerprint;
  var env = this.options.env;
  var apiKey = this.options.apiKey;
  var files = {};

  compiler.plugin('emit', function(compilation, callback) {
    Object.keys(compilation.assets).forEach(function(filename) {
      var file = compilation.assets[filename];

      if (fingerprint) {
        let parts = path.parse(filename);
        let newname = parts.name.replace(fingerprint, '');
        filename = path.join(parts.dir, newname + parts.ext);
      }

      files[filename] = file.size();
    });

    var env = env || process.env['NODE_ENV'] || 'development';
    fetch('https://api.gumshoebot.com/v1/files?env='+encodeURIComponent(env)+'&api_key='+encodeURIComponent(apiKey), {
      method: 'POST',
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
