Github repo: https://github.com/presidenten/express-stress

Express stress
==============

Set CPU and Memory stress levels with HTTP GET Requests


Usage
-----

Start the server
```bash
docker run -d --rm --name stress -p 3000:3000 --cpus=1 --memory=256M presidenten/express-stress
```

### Test ###
Test with two terminal windows.

In the first terminal:
```bash
docker stats stress
```

In the second terminal:
```bash
# Stress CPU

# Add default value of 10% cpu load
curl localhost:3000/cpu

# Add 20% cpu load
curl localhost:3000/cpu/20


# Stress Memory

# Add default value of 32MB memory load (and 30% cpu)
curl localhost:3000/memory

# Add 128MB cpu load (and 30% cpu)
curl localhost:3000/memory/128

# Note that memory allocation is a bit slow
```

Heads up!
---------
Adding memory also eats some cpu. `msync` was selected as memory method since it requires the least amount of CPU. It increases memory usage slowly though, which can both be good or bad depending on what you want.

Also fixed size in `MB` was selected instead of `%` since `stress-ng` seemed to look at max memory on the docker host instead of the available memory on the container in my tests.

Environment variables
---------------------

- `PORT` - Which port to use
  - `default: 3000`
- `MAX_CPU` - What cpu percentage is max
  - `default: 80`
- `MAX_Memory` - What is max memory in MB
  - `default: 8192`
- `BASE_MEMORY` - How much memory in MB is the application already using
  - `default: 11`
- `MEMORY_OFFSET` - Offset memory allocation by this amount
  - `default: 4`
