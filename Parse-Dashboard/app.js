'use strict';
const express = require('express');
const basicAuth = require('basic-auth');
const path = require('path');
const packageJson = require('package-json');

const currentVersionFeatures = require('../package.json').parseDashboardFeatures;

var newFeaturesInLatestVersion = [];
packageJson('parse-dashboard', 'latest').then(latestPackage => {
  if (latestPackage.parseDashboardFeatures instanceof Array) {
    newFeaturesInLatestVersion = latestPackage.parseDashboardFeatures.filter(feature => {
      return currentVersionFeatures.indexOf(feature) === -1;
    });
  }
});

function getMount(req) {
  let url = req.url;
  let originalUrl = req.originalUrl;
  var mountPathLength = req.originalUrl.length - req.url.length;
  var mountPath = req.originalUrl.slice(0, mountPathLength);
  if (!mountPath.endsWith('/')) {
    mountPath += '/';
  }
  return mountPath;
}

module.exports = function(allowInsecureHTTP) {
  var app = express();
  // Serve public files.
  app.use(express.static(path.join(__dirname,'public')));

  // For every other request, go to index.html. Let client-side handle the rest.
  app.get('/*', function(req, res) {
    let mountPath = getMount(req);
    res.send(`<!DOCTYPE html>
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="${mountPath}favicon.ico" />
        <base href="${mountPath}"/>
        <script>
          PARSE_DASHBOARD_PATH = "${mountPath}";
        </script>
      </head>
      <html>
        <title>Parse Dashboard</title>
        <body>
          <div id="browser_mount"></div>
          <script src="${mountPath}bundles/dashboard.bundle.js"></script>
        </body>
      </html>
    `);
  });

  return app;
}
