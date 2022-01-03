const cp = require('child_process');
const config = require('./config.js');
const processes = [];
let currentCPULoad = 0;
let currentMemoryLoad = config.baseMemory;
let defaultCPULoad = 10;
let defaultMemoryLoad = 32;

module.exports = {
  defaultCPULoad,
  defaultMemoryLoad,

  reInit() {
    this.shutDown();
    currentCPULoad = 0;
    currentMemoryLoad = config.baseMemory;
  },

  stress_cpu_with_load(requested_load = defaultCPULoad) {
    let load = +requested_load || defaultCPULoad;

    if (currentCPULoad != config.max && currentCPULoad + load > config.maxCPU) {
      load = config.maxCPU - currentCPULoad;
    }

    if (load > 0 && currentCPULoad + load <= config.maxCPU) {
      currentCPULoad += load;
      const message = `Eating another ${load}% cpu. Yum yum yum. Current load is avg ${currentCPULoad}% of max ${config.maxCPU}%.`;
      processes.push(cp.spawn('/usr/bin/stress-ng', [
        '--cpu', 1,
        '--cpu-load', load,
        '--cpu-load-slice', -10,
      ], { detached: true }));
      return { status: 202, message };
    } else {
      const message = `Im full. Current CPU load is avg ${currentCPULoad}% of max ${config.maxCPU}%.`;
      return { status: 406, message };
    }
  },

  stress_memory_with_load(requested_load = defaultMemoryLoad) {
    let load = +requested_load || defaultMemoryLoad;

    if (currentMemoryLoad != config.max && currentMemoryLoad + load > config.maxMemory) {
      load = config.maxMemory - currentMemoryLoad;
    }

    if (load > 0 && currentMemoryLoad + load <= config.maxMemory) {
      currentMemoryLoad += load;
      currentCPULoad += 30; // Measured
      const message = `Eating another ${load}MB memory (+30% cpu). Yum yum yum. Current load is avg ${currentMemoryLoad}MB of max ${config.maxMemory}MB.`;
      processes.push(cp.spawn('/usr/bin/stress-ng', [
        '--msync', 1,
        '--msync-bytes', `${load-config.memoryOffset}M`,
      ], { detached: true }));
      return { status: 202, message };
    } else {
      const message = `Im full. Current memory load is avg ${currentMemoryLoad}MB of max ${config.maxMemory}MB.`;
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
