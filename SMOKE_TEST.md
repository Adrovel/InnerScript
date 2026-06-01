# InnerScript Smoke Test Checklist

Purpose: verify a fresh local setup is basically working end-to-end. This is not a full test plan.

## Setup

- [ ] Run `npm install`.
- [ ] Copy `.env.example` to `.env.local`.
- [ ] Run `npm run db:up`.
- [ ] Run `npm run db:migrate`.

## App boot

- [ ] Run `npm run dev`.
- [ ] Open `http://localhost:3000`.
- [ ] Confirm the homepage loads.

## API health

- [ ] Run `curl http://localhost:3000/api/health`.
- [ ] Confirm it returns healthy JSON.

## Entries API

- [ ] Create an entry with `POST /api/entries`.
- [ ] List entries with `GET /api/entries`.
- [ ] Read one entry with `GET /api/entries/:id`.
- [ ] Update one entry with `PUT /api/entries/:id`.
- [ ] Delete one entry with `DELETE /api/entries/:id`.

## Automated checks

- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Run `npm run test:integration`.

## Teardown

- [ ] Run `npm run db:down` when finished.
