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
curl localhost:3000

# Add 20% cpu load
curl localhost:3000/20

# Add 30% cpu load
curl localhost:3000/30
```

Environment variables
---------------------

- `PORT` - Which port to use
  - `default: 3000`
- `MAX_CPU` - What cpu percantage is max
  - `default: 80`
