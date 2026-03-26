# Tech Stack Decision Matrix

Use this matrix to justify or challenge technology choices during solution design. Each section states the decision criteria, options, and the Prudentia recommendation with rationale.

---

## Frontend Framework

**Decision driver**: Rendering model requirements, team familiarity, SEO needs.

| Criterion | Next.js | Nuxt.js | SvelteKit | Plain React/Vue |
|-----------|---------|---------|-----------|-----------------|
| SSR / SSG support | Excellent | Excellent | Good | Manual setup |
| SA developer availability | High | Medium | Low | High |
| SEO requirements | Excellent | Excellent | Good | Poor (CSR) |
| Bundle size | Medium | Medium | Small | Varies |
| Enterprise adoption | High | Medium | Low | High |
| Prudentia experience | Primary | Secondary | None | Avoid for new |

**Recommendation**: **Next.js** as default. Use Nuxt.js only when the client team is Vue-native.

---

## Backend Framework

**Decision driver**: Team skills, performance requirements, type safety, ecosystem maturity.

| Criterion | NestJS | Django | FastAPI | Express |
|-----------|--------|--------|---------|---------|
| Type safety | TypeScript native | Optional (mypy) | Python type hints | Optional |
| Structure / conventions | Opinionated (good) | Opinionated (good) | Minimal | Minimal |
| GraphQL support | First-class | Graphene (bolted on) | Strawberry | Apollo Server |
| Background jobs | BullMQ integration | Celery | Celery / ARQ | Manual |
| SA developer availability | Medium-high | High | Medium | High |
| Microservices transport | First-class (NATS, gRPC) | Manual | Manual | Manual |
| Prudentia experience | Primary | Secondary | Tertiary | Avoid for new |

**Recommendation**: **NestJS** for TypeScript shops and API platforms. **Django** when the team is Python-first or when rapid admin panel generation (django-admin) has high value.

---

## Database: Relational

**Decision driver**: Data model complexity, transaction requirements, client hosting.

| Criterion | PostgreSQL | MySQL/MariaDB | SQL Server | SQLite |
|-----------|-----------|---------------|------------|--------|
| JSON support | Excellent (jsonb) | Good | Good | Limited |
| Extensions | pgvector, PostGIS, etc. | Limited | Limited | None |
| Managed cloud options | AWS RDS, Supabase, Neon | AWS RDS | AWS RDS | N/A |
| Licence | Free | Free (GPL) | Paid | Free |
| MicroK8s operator | CloudNativePG | Operator available | Not recommended | N/A |
| Prudentia experience | Primary | Legacy support only | Legacy support only | Local dev only |

**Recommendation**: **PostgreSQL** universally. Use CloudNativePG operator on MicroK8s for HA.

---

## Container Orchestration

**Decision driver**: Client infrastructure, budget, operational maturity.

| Criterion | MicroK8s | EKS (AWS) | GKE (GCP) | AKS (Azure) | Docker Compose |
|-----------|----------|-----------|-----------|-------------|----------------|
| Cost (infra) | Low (VM only) | Medium-high | Medium-high | Medium | Minimal |
| SA hosting | On-prem / local VM | Cape Town region (af-south-1) | None in SA | None in SA | Any VM |
| Operational complexity | Medium | Low (managed) | Low (managed) | Low (managed) | Low |
| Load shedding resilience | Client-managed UPS | AWS-managed | GCP-managed | Azure-managed | Client-managed |
| GitOps (ArgoCD) | Excellent | Excellent | Excellent | Excellent | Not applicable |
| Min spec | 4 vCPU / 16GB RAM | t3.medium (2 nodes min) | e2-standard-2 | Standard_D2s_v3 | 2 vCPU / 4GB RAM |
| Prudentia experience | Primary | Secondary | Tertiary | Tertiary | Dev only |

**Recommendation**:
- **MicroK8s**: Client has on-prem or dedicated VM, budget <R8,000/month infra, or data sovereignty requirement.
- **EKS**: Client is AWS-native, managed control plane preferred, budget allows R15,000+/month.
- **Docker Compose**: Development and very small single-host deployments only. Not for production with HA requirement.

---

## CI/CD Pipeline

**Decision driver**: Source control platform, team workflow, automation requirements.

| Criterion | GitHub Actions | GitLab CI | Jenkins | Azure DevOps |
|-----------|---------------|-----------|---------|--------------|
| Hosted runners | Yes (free tier) | Yes (free tier) | Self-hosted | Yes |
| SA runner latency | GitHub US regions (acceptable) | GitLab EU regions | Self-hosted (local) | Azure EU regions |
| Ecosystem integrations | Excellent | Good | Manual | Good (Azure) |
| Cost (private repos) | Free 2,000 min/month | Free 400 min/month | Infrastructure cost | Free 1,800 min/month |
| Prudentia experience | Primary | Secondary | Avoid for new | Only if client mandates |

**Recommendation**: **GitHub Actions** as default. Use GitLab CI only when client's source control is already on GitLab.

---

## Secrets Management

**Decision driver**: Cluster type, compliance requirements, existing tools.

| Criterion | External Secrets Operator + Vault | AWS Secrets Manager | Kubernetes Secrets (base64) | Sealed Secrets |
|-----------|----------------------------------|--------------------|-----------------------------|----------------|
| Encryption at rest | Yes (Vault) | Yes (KMS) | No (base64 only) | Yes |
| Dynamic secrets | Yes | No | No | No |
| Cloud dependency | No | AWS only | No | No |
| GitOps compatibility | Excellent | Good | Poor | Good |
| Operational complexity | Medium-high | Low | Low | Low |
| Prudentia experience | Primary (MicroK8s) | Secondary (EKS) | Dev only | Alternative |

**Recommendation**:
- MicroK8s: **External Secrets Operator + HashiCorp Vault** (or Infisical as simpler alternative).
- EKS: **AWS Secrets Manager** via External Secrets Operator.
- Never commit raw Kubernetes Secrets to Git.

---

## Observability Stack

**Decision driver**: Hosting environment, budget, alerting requirements.

| Criterion | PLG (Prometheus + Loki + Grafana) | AWS CloudWatch | Datadog | New Relic |
|-----------|----------------------------------|----------------|---------|-----------|
| Cost | Free (self-hosted) | Pay per metric/log | R3,000–R15,000+/month | R2,000–R10,000+/month |
| MicroK8s native | Excellent | N/A | Agent required | Agent required |
| Log aggregation | Loki (excellent) | Good | Excellent | Good |
| Dashboarding | Grafana (excellent) | Basic | Excellent | Good |
| Alert routing | Alertmanager + ntfy/PagerDuty | SNS | Built-in | Built-in |
| Prudentia experience | Primary | Secondary (EKS) | Not standard | Not standard |

**Recommendation**: **PLG stack** for all MicroK8s deployments. **CloudWatch** for EKS-only as a minimum; add Grafana Cloud free tier for dashboarding.

---

## Message Queue / Event Bus

**Decision driver**: Message volume, delivery guarantees, complexity tolerance.

| Criterion | Redis (BullMQ) | NATS | RabbitMQ | Kafka | AWS SQS/SNS |
|-----------|---------------|------|----------|-------|-------------|
| Complexity | Low | Low | Medium | High | Low |
| Persistence | Optional (Redis Stream) | JetStream (optional) | Yes | Yes | Yes |
| SA dev availability | High | Low | Medium | Medium | Medium |
| Throughput | Medium | High | Medium | Very high | High |
| When to use | Background jobs, queues | Microservice transport | Complex routing | High-volume streaming | AWS-native |
| Prudentia experience | Primary | Secondary | Tertiary | Enterprise only | EKS projects |

**Recommendation**: **BullMQ + Redis** for background job processing. **NATS** for NestJS microservice transport. **Kafka** only when the client has streaming requirements >10,000 msg/sec or needs replay.

---

## Payment Gateway (SA-Specific)

| Gateway | ZAR support | EFT / Ozow | Card | Subscription billing | Integration complexity |
|---------|------------|-----------|------|---------------------|----------------------|
| Peach Payments | Native | Yes | Yes | Yes | Medium |
| PayFast | Native | Yes | Yes | Subscriptions module | Low |
| Stripe | Via conversion | No | Yes | Excellent | Low (well-documented) |
| Ozow | Native (EFT only) | Yes (primary) | No | No | Low |

**Recommendation**: **Peach Payments** for enterprise / government-adjacent projects. **PayFast** for SME e-commerce. **Stripe** only if the client transacts internationally or the team has existing Stripe experience.

---

## Hosting / Cloud Region (SA Context)

| Region | Provider | Latency to SA users | ZAR cost index | Load shedding relevance |
|--------|----------|--------------------|-----------------|-----------------------|
| af-south-1 (Cape Town) | AWS | ~15ms | High (limited AZs) | Cloud-managed |
| eu-west-1 (Ireland) | AWS | ~180ms | Medium | Cloud-managed |
| On-prem (Johannesburg DC) | Self / colocation | <5ms | Low (capex) | Client-managed UPS |
| Local VM (client premises) | Client | <1ms | Lowest | Client UPS critical |

**Recommendation**: For latency-sensitive SA user-facing apps, prefer **af-south-1** or on-prem. For background processing and batch workloads, eu-west-1 is acceptable and cost-effective.
