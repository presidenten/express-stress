jest.mock('child_process');

const cp = require('child_process');
const config = require('./config.js');
const stress = require('./stress');
const { stress_cpu_with_load, stress_memory_with_load, shutDown } = require('./stress');

describe('Stress', () => {
  describe('- stress_cpu_with_load', () => {
    beforeEach(() => {
      config.maxCPU = 80;
      stress.reInit();
    });

    it('should spawn stress-ng', () => {
      stress_cpu_with_load();
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(cp.spawn.mock.calls[0][0]).toBe('/usr/bin/stress-ng');
      expect(cp.spawn.mock.calls[0][1][2]).toBe('--cpu-load');
    });

    it('should be able to set load percent', () => {
      const load = 20;
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(load);
    });

    it('should not be possible to set load higher than max', () => {
      config.maxCPU = 10;
      const load = 20;
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(config.maxCPU);
    });

    it('should not be possible to set load higher than max with repeated calls', () => {
      config.maxCPU = 30;
      const load = 20;
      stress_cpu_with_load(load);
      stress_cpu_with_load(load);
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(2);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(20);
      expect(cp.spawn.mock.calls[1][1][3]).toBe(10);
    });

    it('should use work with number as string', () => {
      const load = '20';
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(20);
    });

    it('should use default on junk input', () => {
      const load = 'derp';
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(stress.defaultCPULoad);
    });

    it('should set status code 202 for when spawning stress-ng', () => {
      const load = 20;
      const result = stress_cpu_with_load(load);
      expect(result.status).toBe(202);
    });

    it('should set status code 406 when "full"', () => {
      config.maxCPU = 10;
      const load = 20;
      stress_cpu_with_load(load);
      const result = stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(result.status).toBe(406);
    });
  });


  describe('- stress_memory_with_load', () => {
    beforeEach(() => {
      config.maxMemory = 64;
      config.baseMemory = 0;
      config.memoryOffset = 0;
      stress.reInit();
    });

    it('should spawn stress-ng', () => {
      stress_memory_with_load();
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(cp.spawn.mock.calls[0][0]).toBe('/usr/bin/stress-ng');
      expect(cp.spawn.mock.calls[0][1][2]).toBe('--msync-bytes');
    });

    it('should be able to set load percent', () => {
      const load = 20;
      stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(`${load}M`);
    });

    it('should not be possible to set load higher than max', () => {
      config.maxMemory = 10;
      const load = 20;
      stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(`${config.maxMemory}M`);
    });

    it('should not be possible to set load higher than max with repeated calls', () => {
      config.maxMemory = 30;
      const load = 20;
      stress_memory_with_load(load);
      stress_memory_with_load(load);
      stress_memory_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(2);
      expect(cp.spawn.mock.calls[0][1][3]).toBe('20M');
      expect(cp.spawn.mock.calls[1][1][3]).toBe('10M');
    });

    it('should use work with number as string', () => {
      const load = '20';
      stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe('20M');
    });

    it('should use default on junk input', () => {
      const load = 'derp';
      stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(`${stress.defaultMemoryLoad}M`);
    });

    it('should set status code 202 for when spawning stress-ng', () => {
      const load = 20;
      const result = stress_memory_with_load(load);
      expect(result.status).toBe(202);
    });

    it('should set status code 406 when "full"', () => {
      config.maxMemory = 10;
      const load = 20;
      stress_memory_with_load(load);
      const result = stress_memory_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(result.status).toBe(406);
    });

    it('should set status code 406 when passing max cpu limit', () => {
      config.maxMemory = 100;
      const load = 10;
      stress_memory_with_load(load);
      stress_memory_with_load(load);
      stress_memory_with_load(load);
      const result = stress_memory_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(3);
      expect(result.status).toBe(406);
    });
  });

  describe('- shutDown', () => {
    beforeEach(() => {
      config.maxCPU = 80;
      config.maxMemory = 64;
      stress.reInit();
    });

    it('should kill all cpu processes', () => {
      const load = 20;
      const kill = jest.fn();
      cp.spawn.mockReturnValue({ kill })
      stress_cpu_with_load(load);
      stress_cpu_with_load(load);
      stress_cpu_with_load(load);
      shutDown();
      expect(kill.mock.calls.length).toBe(3);
    });

    it('should kill all memory processes', () => {
      const load = 20;
      const kill = jest.fn();
      cp.spawn.mockReturnValue({ kill })
      stress_memory_with_load(load);
      stress_memory_with_load(load);
      stress_memory_with_load(load);
      shutDown();
      expect(kill.mock.calls.length).toBe(3);
    });
  });
});
