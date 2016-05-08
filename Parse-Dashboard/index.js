/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
// Command line tool for npm start
"use strict"
const path = require('path');
const express = require('express');
const parseDashboard = require('./app');

const program = require('commander');
program.option('--host [host]', 'the host to run parse-dashboard');
program.option('--port [port]', 'the port to run parse-dashboard');
program.option('--mountPath [mountPath]', 'the mount path to run parse-dashboard');
program.option('--allowInsecureHTTP [allowInsecureHTTP]', 'set this flag when you are running the dashboard behind an HTTPS load balancer or proxy with early SSL termination.');

program.parse(process.argv);

const host = program.host || process.env.HOST || '0.0.0.0';
const port = program.port || process.env.PORT || 4040;
const mountPath = program.mountPath || process.env.MOUNT_PATH || '/';
const allowInsecureHTTP = program.allowInsecureHTTP || process.env.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP;

const app = express();

app.use(mountPath, parseDashboard(allowInsecureHTTP));
// Start the server.
const server = app.listen(port, host, function () {
  console.log(`The dashboard is now available at http://${server.address().address}:${server.address().port}${mountPath}`);
  });

