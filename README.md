# gumshoe
A Webpack plugin to watch your asset sizes.

## Install
`npm install webpack-gumshoe-plugin --save-dev`

In your Webpack Config:
```javascript
const GumshoePlugin = require('webpack-gumshoe-plugin');

...

plugins: [
  new GumshoePlugin({
    apiKey: 'API_KEY'
  })
],
```

## Asset fingerprinting (hashing)
If you append a fingerprint/hash to your assets, you can tell
Gumshoe it ignore it when comparing files. It takes a Regex
that will get removed from the file name. For example if your
fingerprint is 10 characters, starting with a `-`, you can use
`/-\w{10,10}$/i`. So a file like: `filename-be17123604.js` will
be reported as `filename.js`.

```javascript
new GumshoePlugin({
  apiKey: 'API_KEY',
  fingerprint: /-\w{10,10}$/i
})
```

## Project name
You can use Gumshoe for more than one project, just pass
in a project name and it'll be shown in Slack.

```javascript
new GumshoePlugin({
  apiKey: 'abc123',
  name: 'Awesomesauce Project',
})
```


## Build environment
You can separate out development from production deploys.

```javascript
new GumshoePlugin({
  apiKey: 'abc123',
  env: process.env['NODE_ENV'] || 'development',
})
```
