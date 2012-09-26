/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

/*jslint sloppy: true, vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require, process, setInterval, setTimeout, clearTimeout, __dirname */

var port = process.argv[2]; // first arg is 'node', second arg is script name, third arg is port to use

var SETUP_TIMEOUT = 5000; // wait up to 5 seconds for http and ws server to start

function setupHttpAndWebSocketServers(callback, timeout) {
    var connect = require('connect');
    var timeoutTimer = null;
    var httpServer = null;
    var httpServerSocket = null;

    if (timeout) {
        timeoutTimer = setTimeout(function () { callback("ERR_TIMEOUT", null); }, timeout);
    }

    httpServer = connect()
        .use(connect.static(__dirname + "/public_html"))
        .use(function (req, res) {
            res.end('hello world\n');
        });

    console.log('starting http server');
    httpServerSocket = httpServer.listen(port, '127.0.0.1', function () {
        console.log('http server listening, starting wss');
        var WebSocketServer = require('ws').Server;
        var wsServer = null;
        if (httpServerSocket !== null) {
            wsServer = new WebSocketServer({server: httpServerSocket});
            wsServer.on('connection', function (ws) { console.log('got a ws connection'); });
            console.log('wss created');
            if (timeoutTimer) {
                clearTimeout(timeoutTimer);
            }
            callback(null, {httpServer : httpServer, wsServer : wsServer, port : httpServerSocket.address().port });
        } else { // httpServerSocket is null -- this shouldn't happen, because if we didn't get a socket we wouldn't have called this callback
            if (timeoutTimer) {
                clearTimeout(timeoutTimer);
            }
            callback("ERR_UNKNOWN");
        }
    });
}


function start() {
    setupHttpAndWebSocketServers(function (err, servers) {
        if (err) {
            console.error("Got error starting servers: " + err);
        } else {
            console.log("serving on port: " + servers.port);
        }
    }, SETUP_TIMEOUT);
}

// change console.log and console.info to print to stderr (like console.warn and console.error do)
// other things print to stdout, so we still need to be robust to this in our messaging protocol
// but this avoids lots of needless messages sent to the app shell
console.log = console.info = console.warn;
console.log('starting node in dir: ' + __dirname);
start();
