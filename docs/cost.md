# hobby2hobby Operating Cost

As of 2026-03-29, this document tracks the real monthly infrastructure cost for running the current MVP, not every possible future service.

## What Is Included

- frontend hosting
- Docker host for the API services
- primary production PostgreSQL
- server backups
- authentication provider

## What Is Not Included

- founder time or contractor cost
- ads, customer support, legal, or moderation labor
- optional infrastructure we are not using yet, such as Redis, RabbitMQ, or object storage
- Stripe processing fees, because they are variable and only apply once paid plans are live
- domain registration, because registrar pricing varies

## Recommended MVP Production Stack

This is the production setup I would actually use for the current state of the product:

- `Next.js` frontend on `Vercel Pro`
- all Dockerized API services on one `DigitalOcean Basic Droplet`
- `DigitalOcean Managed PostgreSQL` for the primary database
- weekly Droplet backups enabled
- `Clerk Hobby` for auth, including Google sign-in

## Monthly Burn Rate

| Item | Choice | Monthly Cost | Why |
| --- | --- | ---: | --- |
| Frontend hosting | Vercel Pro | $20.00 | Clean Next.js deployment, custom domains, usage credit included |
| API host | DigitalOcean Basic Droplet, 4 GB RAM / 2 vCPU | $24.00 | Credible single-host starting point for the gateway plus current microservices |
| API host backups | DigitalOcean weekly backups | $4.80 | 20% of the Droplet monthly cost |
| Database | DigitalOcean Managed PostgreSQL, 1 GiB / 1 vCPU | $15.00 | Cheap managed starting point with fewer operational risks than self-hosting Postgres |
| Auth | Clerk Hobby | $0.00 | Free up to 50,000 MRUs per app, with up to 3 social connections including Google |
| **Total fixed monthly burn** |  | **$63.80** | Before tax and domain registration |

## Leanest Public Launch

If you want the lowest credible public burn rate and are willing to run the API on a smaller box:

| Item | Choice | Monthly Cost |
| --- | --- | ---: |
| Frontend hosting | Vercel Hobby | $0.00 |
| API host | DigitalOcean Basic Droplet, 2 GB RAM / 2 vCPU | $18.00 |
| API host backups | DigitalOcean weekly backups | $3.60 |
| Database | DigitalOcean Managed PostgreSQL, 1 GiB / 1 vCPU | $15.00 |
| Auth | Clerk Hobby | $0.00 |
| **Total fixed monthly burn** |  | **$36.60** |

I would treat this as a launch experiment budget, not the default production recommendation.

## When Burn Rate Increases

These are the first likely step-ups:

- `Clerk Pro`: add `$20/month` if you want MFA, remove Clerk branding, or custom session lifetime
- larger API host: move from `$24` to `$48/month` if the single Docker host starts getting tight
- larger database: move from `$15.15` to about `$30.45/month` when the 1 GiB cluster is no longer enough

## Current Recommendation

For hobby2hobby today, the clean number to use is:

- recommended monthly burn rate: `about $64/month`
- absolute lean public launch: `about $37/month`

## Pricing Sources

- Vercel pricing: https://vercel.com/pricing
- Vercel Pro plan details: https://vercel.com/docs/plans/pro
- DigitalOcean Droplet pricing: https://www.digitalocean.com/pricing/droplets
- DigitalOcean Droplet docs: https://docs.digitalocean.com/products/droplets/details/pricing/
- DigitalOcean backup pricing: https://docs.digitalocean.com/products/backups/details/pricing/
- DigitalOcean managed PostgreSQL pricing: https://www.digitalocean.com/pricing/managed-databases
- DigitalOcean PostgreSQL docs: https://docs.digitalocean.com/products/databases/postgresql/details/pricing/
- Clerk pricing: https://clerk.com/pricing
- Clerk social connections overview: https://clerk.com/docs/authentication/social-connections/overview
- Clerk Google social login: https://clerk.com/docs/authentication/social-connections/google
- Clerk session token verification: https://clerk.com/docs/guides/sessions/manual-jwt-verification
