jest.mock('child_process');

const cp = require('child_process');
const config = require('./config.js');
const stress = require('./stress');

describe('Stress', () => {
  describe('- stress.stress_cpu_with_load', () => {
    beforeEach(() => {
      config.maxCPU = 90;
      stress.clearLoad();
    });

    it('should spawn stress-ng', () => {
      stress.stress_cpu_with_load();
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(cp.spawn.mock.calls[0][0]).toBe('/usr/bin/stress-ng');
      expect(cp.spawn.mock.calls[0][1][2]).toBe('--cpu-load');
    });

    it('should be able to set load percent', () => {
      const load = 20;
      stress.stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(load);
    });

    it('should not be possible to set load higher than max', () => {
      config.maxCPU = 10;
      const load = 20;
      stress.stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(config.maxCPU);
    });

    it('should not be possible to set load higher than max with repeated calls', () => {
      config.maxCPU = 30;
      const load = 20;
      stress.stress_cpu_with_load(load);
      stress.stress_cpu_with_load(load);
      stress.stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(2);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(20);
      expect(cp.spawn.mock.calls[1][1][3]).toBe(10);
    });

    it('should use work with number as string', () => {
      const load = '20';
      stress.stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(20);
    });

    it('should use default on junk input', () => {
      const load = 'derp';
      stress.stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(stress.defaultCPULoad);
    });

    it('should set status code 202 for when spawning stress-ng', () => {
      const load = 20;
      const result = stress.stress_cpu_with_load(load);
      expect(result.status).toBe(202);
    });

    it('should set status code 406 when "full"', () => {
      config.maxCPU = 10;
      const load = 20;
      stress.stress_cpu_with_load(load);
      const result = stress.stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(result.status).toBe(406);
    });

    it('should handle config as strings', () => {
      config.maxCPU = '90';
      stress.clearLoad();
      const result = stress.stress_cpu_with_load();
      expect(result.status).toBe(202);
    });
  });


  describe('- stress.stress_memory_with_load', () => {
    beforeEach(() => {
      config.maxCPU = 90;
      config.maxMemory = 64;
      config.baseMemory = 0;
      config.memoryOffset = 0;
      stress.clearLoad();
    });

    it('should spawn stress-ng', () => {
      stress.stress_memory_with_load();
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(cp.spawn.mock.calls[0][0]).toBe('/usr/bin/stress-ng');
      expect(cp.spawn.mock.calls[0][1][2]).toBe('--msync-bytes');
    });

    it('should be able to set load percent', () => {
      const load = 20;
      stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(`${load}M`);
    });

    it('should not be possible to set load higher than max', () => {
      config.maxMemory = 10;
      const load = 20;
      stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(`${config.maxMemory}M`);
    });

    it('should not be possible to set load higher than max with repeated calls', () => {
      config.maxMemory = 30;
      const load = 20;
      stress.stress_memory_with_load(load);
      stress.stress_memory_with_load(load);
      stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(2);
      expect(cp.spawn.mock.calls[0][1][3]).toBe('20M');
      expect(cp.spawn.mock.calls[1][1][3]).toBe('10M');
    });

    it('should use work with number as string', () => {
      const load = '20';
      stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe('20M');
    });

    it('should use default on junk input', () => {
      const load = 'derp';
      stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(`${stress.defaultMemoryLoad}M`);
    });

    it('should set status code 202 for when spawning stress-ng', () => {
      const load = 20;
      const result = stress.stress_memory_with_load(load);
      expect(result.status).toBe(202);
    });

    it('should set status code 406 when "full"', () => {
      config.maxMemory = 10;
      const load = 20;
      stress.stress_memory_with_load(load);
      const result = stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(result.status).toBe(406);
    });

    it('should set status code 406 when passing max cpu limit', () => {
      config.maxMemory = 100;
      const load = 10;
      stress.stress_memory_with_load(load);
      stress.stress_memory_with_load(load);
      stress.stress_memory_with_load(load);
      const result = stress.stress_memory_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(3);
      expect(result.status).toBe(406);
    });

    it('should handle memory offset', () => {
      config.memoryOffset = 2;
      stress.clearLoad();
      const result = stress.stress_memory_with_load(12);
      expect(cp.spawn.mock.calls[0][1][3]).toBe('10M');
      expect(result.status).toBe(202);
    });

    it('should handle config as strings', () => {
      config.maxMemory = '256';
      config.baseMemory = '20';
      stress.clearLoad();
      stress.stress_memory_with_load();
      expect(cp.spawn.mock.calls[0][1][3]).toBe('32M');
      const result = stress.stress_memory_with_load('10');
      expect(cp.spawn.mock.calls[1][1][3]).toBe('10M');
      expect(result.status).toBe(202);
    });
  });

  describe('- clearLoad', () => {
    beforeEach(() => {
      config.maxCPU = 90;
      config.maxMemory = 64;
      stress.clearLoad();
    });

    it('should kill all cpu processes', () => {
      const load = 20;
      const kill = jest.fn();
      cp.spawn.mockReturnValue({ kill })
      stress.stress_cpu_with_load(load);
      stress.stress_cpu_with_load(load);
      stress.stress_cpu_with_load(load);
      stress.clearLoad();
      expect(kill.mock.calls.length).toBe(3);
    });

    it('should kill all memory processes', () => {
      const load = 20;
      const kill = jest.fn();
      cp.spawn.mockReturnValue({ kill })
      stress.stress_memory_with_load(load);
      stress.stress_memory_with_load(load);
      stress.stress_memory_with_load(load);
      stress.clearLoad();
      expect(kill.mock.calls.length).toBe(3);
    });
  });
});
