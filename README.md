Express stress
==============

Small webserver that hogs some % of cpu with each call

Usage
-----

Start the server
```bash
yarn
yarn start
```

or
```bash
docker run -d --rm -p 3000:3000 presidenten/express-stress
```

Test
```bash
# Add 10% cpu load
curl localhost:3000/cpu

# Add 20% cpu load
curl localhost:3000/cpu/20

# Add 30% cpu load
curl localhost:3000/cpu/30


# Add 32MB memory load (and 30% cpu)
curl localhost:3000/memory

# Add 128MB cpu load (and 30% cpu)
curl localhost:3000/memory/128

# Add 256MB memory load (and 30% cpu)
curl localhost:3000/memory/256

# Note that memory allocation is a bit slow
```

Heads up!
---------
Adding memory also eats some cpu. `msync` was selected as memory method since it requires the least amount of CPU. It increases memory usage slowly though, which can both be good or bad depending on what you want.

Also fixed size in MB was selected instead of `%` since `stress-ng` seemed to look at max memory on the docker host instead of the available memory on the container in my tests.

Environment variables
---------------------

- `PORT` - Which port to use
  - `default: 3000`
- `MAX_CPU` - What cpu percentage is max
  - `default: 90`
- `MAX_Memory` - What is max memory in MB
  - `default: 8192`
- `BASE_MEMORY` - How much memory in MB is the application already using
  - `default: 11`
- `MEMORY_OFFSET` - Offset memory allocation by this amount
  - `default: 4`
