# toolbag-plugins

A collection of [toolbag](https://github.com/continuationlabs/toolbag) plugins. This repository is intended to be temporary. Each of these plugins will eventually be published as a standalone module on npm.

To use one or more of the plugins in this module, add `toolbag-plugins` to `package.json`. In `.toolbagrc.js`:

```javascript
'use strict';

const ToolbagPlugins = require('toolbag-plugins');

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
        plugin: ToolbagPlugins.UdpReporter,
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
        plugin: ToolbagPlugins.StatsCollector,
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
        plugin: ToolbagPlugins.Policy,
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
* `Policy` - Allows for the blacklisting of specific modules and bindings.
* `ProcessReporter` - Implements the reporter interface over IPC using `process.send()`.
* `Profiler` - Used to collect CPU profiles of a running application.
* `SharedSymbol` - Registers a global symbol that exposes `toolbag` to application code.
* `Signal` - Sends signals to the running process.
* `StatsCollector` - Collects runtime data for things like CPU, memory, the event loop, handles, requests, and more.
* `UdpReporter` - Implements the reporter interface over UDP.
