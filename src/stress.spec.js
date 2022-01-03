jest.mock('child_process');

const cp = require('child_process');
const config = require('./config.js');
const stress = require('./stress');
const { stress_cpu_with_load, shutDown } = require('./stress');

describe('Stress', () => {
  describe('- stress_cpu_with_load', () => {
    beforeEach(() => {
      config.max = 80;
      stress.reInit();
    });

    it('should spawn stress-ng', () => {
      stress_cpu_with_load();
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(cp.spawn.mock.calls[0][0]).toBe('/usr/bin/stress-ng');
    });

    it('should be able to set load percent', () => {
      const load = 20;
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(load);
    });

    it('should not be possible to set load higher than max', () => {
      config.max = 10;
      const load = 20;
      stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls[0][1][3]).toBe(config.max);
    });

    it('should not be possible to set load higher than max with repeated calls', () => {
      config.max = 30;
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
      expect(cp.spawn.mock.calls[0][1][3]).toBe(stress.defaultLoad);
    });

    if('should set status code 202 for when spawning stress-ng', () => {
      const load = 20;
      const result = stress_cpu_with_load(load);
      expect(result.status).toBe(406);
    });

    if('should set status code 406 when "full"', () => {
      config.max = 10;
      const load = 20;
      stress_cpu_with_load(load);
      const result = stress_cpu_with_load(load);
      expect(cp.spawn.mock.calls.length).toBe(1);
      expect(result.status).toBe(406);
    });
  });

  describe('- shutDown', () => {
    it('should kill all processes', () => {
      const load = 20;
      const kill = jest.fn();
      cp.spawn.mockReturnValue({ kill })
      stress_cpu_with_load(load);
      stress_cpu_with_load(load);
      stress_cpu_with_load(load);
      shutDown();
      expect(kill.mock.calls.length).toBe(3);
    });
  });
});
