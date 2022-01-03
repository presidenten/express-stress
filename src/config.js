module.exports = {
  port: process.env.PORT || 3000,
  maxCPU: process.env.MAX_CPU || 90,
  maxMemory: process.env.MAX_MEMORY || 8192,
  baseMemory: process.env.BASE_MEMORY || 11,
  memoryOffset: process.env.MEMORY_OFFSET || 4,
};
