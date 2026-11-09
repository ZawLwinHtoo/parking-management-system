# Parking Management System

Customer and admin React apps backed by two Spring Boot services and one shared database.

## Complete local demo

Install JDK 21, Node.js 22+ and Python 3.10+, then run from the repository root:

```sh
python run_demo.py
```

The launcher builds both Java services with their Maven wrappers, installs both frontends, starts a loopback H2 database, seeds a garage with 30 slots and rates, and runs both applications. Initial downloads require internet. Subsequent launches can use `python run_demo.py --no-build`.

- Customer: http://127.0.0.1:5173 — register your own local account.
- Admin: http://127.0.0.1:3001 — `admin` / `DemoAdmin123!`.
- API ports: 8080 (customer), 8081 (admin). Database: 9123.
- Ctrl+C stops only processes owned by the launcher. Database/logs persist in `.demo/`.

Register, log in, choose Demo Garage and a free slot, enter a plate such as AA-1234, and submit. Verify the generated slot key. Checkout calculates the fee, releases the slot and records history. The first hour is free. Payments and physical gate access are simulated; no funds move.

This is a local portfolio demo. Login credentials are hashed, but the legacy API uses client-supplied user IDs and a demo token rather than enforcing authenticated resource ownership. Keep it on loopback. Production deployment requires server-enforced authentication/authorization and real payment/gate integrations.

## Checks

```sh
python -m unittest discover -s tests -v
npm ci
npx playwright install chromium
npm run test:browser
```

Build before API checks (`python run_demo.py`, then Ctrl+C). The API check launches both real Java services with a disposable database and verifies registration, login, shared buildings/slots, parking, duplicate rejection, one-time key, checkout and history. Browser checks cover both login interfaces and customer registration. CI repeats these checks on Linux.

## Optional MySQL configuration

The original MySQL configuration remains available outside the `demo` profile through DATABASE_URL, DATABASE_USERNAME and DATABASE_PASSWORD. The verified recovery workflow uses the isolated H2 demo profile. Existing MySQL data needs a reviewed schema migration before use; the two historical backends used incompatible profile-image and rate mappings.
