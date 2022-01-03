const cp = require('child_process');
const processes = [];
let currentLoad = 0;
let defaultLoad = 10;
const config = require('./config.js');

module.exports = {
  defaultLoad,

  reInit() {
    this.shutDown();
    currentLoad = 0;
  },

  stress_cpu_with_load(requested_load = defaultLoad) {
    let load = +requested_load || defaultLoad;

    if (currentLoad != config.max && currentLoad + load > config.max) {
      load = config.max - currentLoad;
    }

    if (currentLoad + load <= config.max) {
      currentLoad += load;
      const message = `Eating another ${load}% cpu. Yum yum yum. Current load is avg ${currentLoad}% of max ${config.max}%.`;
      processes.push(cp.spawn('/usr/bin/stress-ng', [
        '--cpu', 1,
        '--cpu-load', load,
        '--cpu-load-slice', -10,
      ], { detached: true }));
      return { status: 202, message };
    } else {
      const message = `Im full. Current load is avg ${currentLoad}% of max ${config.max}%.`;
      return { status: 406, message };
    }
  },

  shutDown() {
    let p
    do {
      p = processes.pop();
      p && p.kill('SIGHUP');
    } while (p);
  },
}
