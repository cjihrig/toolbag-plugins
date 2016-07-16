# toolbag-plugins

A collection of [toolbag](https://github.com/continuationlabs/toolbag) plugins. This repository is intended to be temporary. Each of these plugins will eventually be published as a standalone module on npm. The following plugins have already been split out:

* [`toolbag-plugin-stats-collector`](https://github.com/continuationlabs/toolbag-plugin-stats-collector) - Collects runtime data for things like CPU, memory, the event loop, handles, requests, and more.
* [`toolbag-plugin-udp-reporter`](https://github.com/continuationlabs/toolbag-plugin-udp-reporter) - Implements the reporter interface over UDP.
* [`toolbag-plugin-policy`](https://github.com/continuationlabs/toolbag-plugin-policy) - Allows for the blacklisting of specific modules, methods, and bindings.
* [`toolbag-plugin-reporter-error-policy`](https://github.com/continuationlabs/toolbag-plugin-reporter-error-policy) - Allows the reporting interface to be used for error handling.
* [`toolbag-plugin-nsp-check`](https://github.com/continuationlabs/toolbag-plugin-nsp-check) - Checks an application's dependencies against the Node Security Project's known vulnerabilities database.


To use one or more of the plugins in this module, add `toolbag-plugins` to `package.json`. In `.toolbagrc.js`:

```javascript
'use strict';

const ToolbagPlugins = require('toolbag-plugins');
const Policy = require('toolbag-plugin-policy');
const StatsCollector = require('toolbag-plugin-stats-collector');
const UdpReporter = require('toolbag-plugin-udp-reporter');

module.exports = function config (defaults, callback) {
  callback(null, {
    errors: {
      policy: 'log'
    },
    plugins: [
      {
        plugin: ToolbagPlugins.BorlandCommander,
        options: {
          host: 'http://localhost:5000'
        }
      },
      {
        plugin: ToolbagPlugins.HttpReporter,
        options: {
          id: 'http reporter',
          method: 'POST',
          url: 'http://localhost:5000/report',
          options: {}
        }
      },
      {
        plugin: UdpReporter,
        options: {
          id: 'udp reporter',
          socketType: 'udp4',
          port: 5001,
          host: 'localhost'
        }
      },
      {
        plugin: ToolbagPlugins.Getfile,
        options: defaults.data
      },
      {
        plugin: ToolbagPlugins.Heapdump,
        options: defaults.data
      },
      {
        plugin: ToolbagPlugins.Profiler,
        options: defaults.data
      },
      { plugin: ToolbagPlugins.Signal },
      {
        plugin: StatsCollector,
        options: {
          enabled: true,
          period: 1000,
          eventLoopLimit: 30,
          features: {
            process: true,
            system: true,
            cpu: true,
            memory: true,
            gc: true,
            handles: true,
            requests: true,
            eventLoop: true,
            meta: {
              tags: ['api']
            }
          }
        }
      },
      {
        plugin: Policy,
        options: {
          blacklist: {
            modules: {
              fs: 'log'
            },
            bindings: {
              natives: 'log-verbose'
            }
          }
        }
      }
    ]
  });
};
```

## Available Plugins

**Documentation improvements are welcome**

* `BorlandCommander` - Implements the command interface over [nes](https://github.com/hapijs/nes)-based WebSockets. Communicates with a server running [borland](https://github.com/continuationlabs/borland).
* `Getfile` - Transfers a file as a JSON string. Uses `Buffer.prototype.toJSON()` to encode data as JSON.
* `Heapdump` - Creates a heap snapshot.
* `HttpReporter` - Implements the reporter interface over HTTP.
* `IpcCommander` - Implements the command interface over IPC using `process.send()`.
* `NewRelic` - Sets up New Relic monitoring without modifying your application.
* `ProcessReporter` - Implements the reporter interface over IPC using `process.send()`.
* `Profiler` - Used to collect CPU profiles of a running application.
* `SharedSymbol` - Registers a global symbol that exposes `toolbag` to application code.
* `Signal` - Sends signals to the running process.
