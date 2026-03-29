# hobby2hobby Cost Guide

## Purpose

This document summarizes low-cost database and infrastructure options for hobby2hobby as of 2026-03-28. It is focused on practical early-stage deployment choices, especially for PostgreSQL.

## Short Answer

For hobby2hobby, use `PostgreSQL 16 + PostGIS` from the start.

If the goal is lowest cost while building:

- use a free managed PostgreSQL provider for development
- use a low-cost managed PostgreSQL or small self-hosted PostgreSQL for early production
- do not optimize for AWS too early unless AWS alignment is already a hard requirement

## Recommendation by Stage

### 1. Free Development

Best options:

- `Neon`
- `Aiven`

Why:

- both offer free PostgreSQL
- both remove database operations burden
- both are good enough for development and very early testing

Current notes from official sources:

- Neon Free: `$0`, no credit card required, `0.5 GB` storage per project, usage limits apply
  - Source: https://neon.com/pricing
- Aiven Free PostgreSQL: free with no time limit, `1 GB` disk, `1 CPU`, `1 GB RAM`, limitations apply
  - Source: https://aiven.io/docs/platform/concepts/free-plan

Recommendation:

- choose `Neon` for easiest dev/prototype path
- choose `Aiven` if you want a more traditional managed Postgres shape with backups included in the free tier

### 2. Cheapest Early Production

Best options:

- small self-hosted PostgreSQL on a VPS
- low-cost usage-based PostgreSQL provider

Tradeoff:

- self-hosting is cheaper
- managed database is safer operationally

Practical view:

- cheapest raw cost is usually a tiny VPS running Postgres yourself
- cheapest low-ops option is usually a small managed Postgres plan

Useful reference points from official pricing:

- Railway Hobby plan: `$5/month` base subscription, usage-based resources on top
  - RAM: `$10 / GB / month`
  - CPU: `$20 / vCPU / month`
  - storage: `$0.15 / GB / month`
  - Source: https://docs.railway.com/pricing
- Fly.io unmanaged Fly Postgres: docs say about `$2/month` for a small single-node dev setup, but it is explicitly marked unsupported
  - Source: https://fly.io/docs/about/pricing/

Recommendation:

- if you are willing to manage backups, failover, and upgrades yourself, self-hosting can be the lowest cost
- if you want the cheapest option that is still reasonably practical, use a small managed PostgreSQL instance instead of self-hosting

### 3. Recommended Early Production

Best balance of cost and risk:

- managed PostgreSQL
- keep compute small
- keep one primary database cluster initially

Good fit:

- `Neon` paid usage-based plan
- `Aiven` paid PostgreSQL plan
- `AWS RDS for PostgreSQL` if AWS alignment matters more than lowest cost

Current notes from official sources:

- Neon Launch: usage-based, typical spend shown as `$15/month`
  - Source: https://neon.com/pricing
- Aiven: paid plans billed hourly by service plan; free tier can be upgraded later
  - Source: https://aiven.io/docs/platform/concepts/free-plan
- Supabase paid projects effectively start around `$10/month` compute plus platform plan costs, but Supabase is less aligned with the chosen microservices-first backend approach
  - Sources:
    - https://supabase.com/docs/guides/platform/billing-faq
    - https://supabase.com/docs/guides/platform/org-based-billing

Recommendation:

- for hobby2hobby, a small managed PostgreSQL deployment is the best early production choice
- choose based on ops preference:
  - lowest friction: `Neon`
  - more classic managed-service shape: `Aiven`
  - AWS-native path: `RDS for PostgreSQL`

### 4. AWS-Native Production

Best option:

- `Amazon RDS for PostgreSQL`

Important clarification:

- AWS does support PostgreSQL directly through RDS
- AWS does not offer a simple permanent free PostgreSQL option
- after `July 15, 2025`, AWS moved new free-tier accounts toward credits instead of the older simple one-year free pattern

Current notes from official source:

- RDS is pay-as-you-go
- older accounts may still have the legacy 12-month free-tier terms
- newer accounts get `$100` in credits and possibly up to an additional `$100` in credits for activating foundational services
  - Source: https://aws.amazon.com/rds/pricing/

Recommendation:

- use RDS only if one of these is true:
  - you already want AWS for the rest of the stack
  - compliance and managed operations matter more than absolute lowest cost
  - you want the cleanest path into a larger AWS deployment later

## What Not To Use

- `SQL Server` for this app

Why:

- hobby2hobby benefits more from the PostgreSQL ecosystem
- `PostGIS` is a strong fit for local marketplace geography features
- PostgreSQL is the more natural choice for this product and stack

## Cost Ladder

### Lowest Cost Possible

- self-host PostgreSQL on a tiny VPS
- cheapest, but highest operational burden

### Lowest Cost With Low Ops

- `Neon` free or small paid plan
- `Aiven` free or small paid plan

### Best Early Production Balance

- small managed `PostgreSQL + PostGIS`

### Best AWS-Native Choice

- `Amazon RDS for PostgreSQL`

## Recommendation for hobby2hobby

Use this progression:

1. Development: free PostgreSQL
2. Early private alpha: small managed PostgreSQL plan
3. Public production: managed `PostgreSQL + PostGIS`
4. AWS migration later only if the rest of the infrastructure standardizes on AWS

If you want the simplest practical answer:

- start with free `PostgreSQL`
- stay on `PostgreSQL`
- do not pick `SQL Server`
- do not force AWS unless you already know you want AWS

## Sources

- Neon pricing: https://neon.com/pricing
- Aiven free plan: https://aiven.io/docs/platform/concepts/free-plan
- AWS RDS pricing: https://aws.amazon.com/rds/pricing/
- Railway pricing: https://docs.railway.com/pricing
- Fly.io pricing: https://fly.io/docs/about/pricing/
- Supabase billing and pricing docs:
  - https://supabase.com/docs/guides/platform/org-based-billing
  - https://supabase.com/docs/guides/platform/billing-faq
