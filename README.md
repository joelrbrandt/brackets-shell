## Overview

This is the new CEF3-based application shell for [Brackets](https://github.com/adobe/brackets). 
This replaces the old [brackets-app](https://github.com/adobe/brackets-app) shell.

Please read the main [README in the brackets repo](https://github.com/adobe/brackets/blob/master/README.md) 
for general information about Brackets.

If you are interested in contributing to this shell, let us know on the 
[brackets-dev Google Group](http://groups.google.com/group/brackets-dev), 
or on the [#brackets channel on freenode](http://webchat.freenode.net/?channels=brackets).

If you run into any issues with this new shell, please file a bug in the 
[brackets issue tracker](https://github.com/adobe/brackets/issues).

## Running

NOTE: There are no downloads for the brackets-shell. You either need to 
build from source, or grab the [latest Brackets installer](https://github.com/adobe/brackets/downloads) 
and run the shell from that.

When the app is launched, it first looks for an index.html file in the following locations:
* Mac - Brackets.app/Contents/dev/src/index.html, Brackets.app/Contents/www/index.html
* Win - dev/src/index.html, www/index.html (these folders must be in the same folder as Brackets.exe)

If the index.html can't be found, you'll be prompted to find the brackets index.html file. 
Make sure you select the brackets/src/index.html file, and *not* some other file. 

The preferences are stored in `{USER}/Library/Application Support/Brackets/cef_data` on the mac and `{USER}\AppData\Roaming\Brackets\cef_data` on Windows.

## Building

Information on building the app shell can be found on the [brackets-shell wiki](https://github.com/adobe/brackets-shell/wiki/Building-brackets-shell).

### Additional notes on building with Node

NOTE: This should be moved in to the wiki after this is in master.

#### Mac

##### Setup and Building

1. [Download](https://github.com/joelrbrandt/node/downloads) binary distribution of libnode for 32-bit mac. v0.8.8 is the current supported version.
2. Extract to `/deps/node`. (So, there should be a `/deps/node/library` directory, etc.) NOTE: There are symlinks in the tarball, so make sure you handle them properly. (For example, don't use `cp -pr`. Instead, use `mv` or `rsync -av`.)
3. Build as before
4. The port that the node server listens on (both http and ws) is configurable in `appshell/config.h`
