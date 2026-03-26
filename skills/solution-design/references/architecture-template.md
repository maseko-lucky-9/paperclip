# Architecture Document Template

Use this template for client-facing solution design documents — proposals, tenders, and internal architecture records. Adjust depth based on audience (see guidance per section).

---

# [Project Name] — Solution Architecture

**Client**: [Client name]
**Prepared by**: Thulani Masondo, Solutions Architect — Prudentia Digital
**Date**: [YYYY-MM-DD]
**Version**: [1.0]
**Classification**: [Confidential / Client Restricted / Internal]

---

## 1. Executive Summary

> **Audience**: Non-technical stakeholders, executives, procurement committee.
> **Length**: Half a page maximum. No jargon.

[2–3 sentences describing the business problem.]

[2–3 sentences describing the proposed solution in plain language.]

**Key outcomes this solution delivers**:
- [Outcome 1 — business language, e.g., "Reduces manual processing time by ~70%"]
- [Outcome 2]
- [Outcome 3]

**Indicative total investment**: R[amount] (see Section 8 for breakdown)
**Estimated delivery**: [X weeks / months] from project kick-off

---

## 2. Problem Statement & Objectives

> **Audience**: All audiences.

### Current State

[Describe the current situation: what exists, what is painful, what is missing. Include metrics where available — error rates, manual hours, cost of current approach.]

### Desired Future State

[Describe what success looks like. Be specific: what can the client do after this project that they cannot do today?]

### Success Criteria

| Criterion | Current | Target |
|-----------|---------|--------|
| [Metric 1, e.g., API response time P95] | [Current value] | [Target value] |
| [Metric 2, e.g., manual processing hours/week] | [X hours] | [Y hours] |
| [Metric 3, e.g., deployment frequency] | [X/month] | [X/week] |

### Out of Scope

[Explicitly list what this project does NOT cover. This prevents scope creep.]

- [Item 1]
- [Item 2]

---

## 3. Solution Overview

> **Audience**: All audiences. Use the L1 context diagram here.

### L1: System Context Diagram

```
[Paste Mermaid diagram here — or reference draw.io export]

Example Mermaid:
graph TD
    User[End User / Browser] --> |HTTPS| System[Proposed System]
    System --> |API calls| ThirdParty[Third-party API]
    System --> |Reads/writes| DB[(PostgreSQL)]
    Admin[Administrator] --> |Manages| System
```

### Approach Summary

This solution uses [approach name — e.g., "a three-tier web application on Kubernetes"] to [what it achieves]. The system is [key characteristic — e.g., "stateless, horizontally scalable, and deployed via GitOps"].

**Core design principles applied**:
- [Principle 1, e.g., "Infrastructure as Code — all configuration is version-controlled"]
- [Principle 2, e.g., "Separation of concerns — frontend, API, and data layers are independently deployable"]
- [Principle 3, e.g., "Zero-trust — no service trusts any other by default; all calls are authenticated"]

---

## 4. Technical Architecture

> **Audience**: Technical stakeholders, CTO, senior developers.

### L2: Container Diagram

```
[Paste Mermaid or draw.io L2 diagram here]

Example Mermaid:
graph TD
    subgraph Client["Client Browser"]
        FE[Next.js Frontend]
    end
    subgraph K8s["MicroK8s Cluster"]
        API[NestJS API :3000]
        Worker[BullMQ Worker]
        Cache[(Redis :6379)]
    end
    subgraph Data["Data Layer"]
        DB[(PostgreSQL :5432)]
        Store[(MinIO Object Storage)]
    end
    FE --> |HTTPS / REST| API
    API --> Cache
    API --> DB
    API --> Store
    Worker --> DB
    Worker --> Cache
```

### Component Descriptions

| Component | Technology | Responsibility |
|-----------|-----------|---------------|
| Frontend | Next.js [version] | Server-side rendered UI; auth session management |
| API | NestJS [version] | Business logic, validation, REST/GraphQL endpoints |
| Background worker | BullMQ + Redis | Async processing: [list job types] |
| Database | PostgreSQL [version] | Primary data store; transactional data |
| Cache | Redis [version] | Session store, queue backend, API response cache |
| Object storage | MinIO / S3 | File uploads, exports, static assets |
| Ingress | Nginx Ingress Controller | TLS termination, routing, rate limiting |
| Secrets | External Secrets + Vault | Secret injection at pod startup |
| CI/CD | GitHub Actions → ArgoCD | Build, test, push, deploy via GitOps |
| Observability | Prometheus + Loki + Grafana | Metrics, logs, dashboards, alerting |

### Key Data Flows

#### [Flow 1: e.g., User Authentication]

```
1. User submits credentials → Frontend
2. Frontend → POST /auth/login → API
3. API validates credentials → PostgreSQL (users table)
4. API issues JWT → stored in httpOnly cookie
5. Subsequent requests: API validates JWT from cookie
6. Session data cached in Redis (TTL: [X minutes])
```

#### [Flow 2: e.g., Primary Business Transaction]

```
[Describe the main happy-path flow step by step]
```

---

## 5. Technology Choices

> **Audience**: Technical stakeholders. Link to decision rationale.

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Frontend | Next.js | 14.x | SSR, file-based routing, SA developer availability |
| Backend | NestJS | 10.x | TypeScript, DI, modular architecture |
| Database | PostgreSQL | 16.x | ACID, jsonb, PostGIS, CloudNativePG operator |
| Cache / Queue | Redis | 7.x | BullMQ compatibility, session store |
| Orchestration | MicroK8s | 1.30.x | On-prem, full K8s API, snap-based updates |
| IaC | Terraform | 1.8.x | Declarative, SA cloud provider support |
| GitOps | ArgoCD | 2.11.x | Pull-based deployment, audit trail |
| CI | GitHub Actions | — | Hosted runners, ecosystem integrations |
| Observability | PLG stack | — | Self-hosted, cost-effective, Grafana dashboards |

**ADRs raised**:
- [ADR-001: title] — [one-line summary of decision]
- [ADR-002: title] — [one-line summary]

---

## 6. Non-Functional Requirements

> **Audience**: Technical and procurement stakeholders.

| NFR | Requirement | Target | How achieved |
|-----|-------------|--------|-------------|
| Availability | Uptime | 99.5% | Multi-replica deployments, PodDisruptionBudgets |
| Performance | API response time P95 | <500ms | Redis caching, connection pooling (PgBouncer) |
| Performance | Page load time | <3s on 4G | Next.js SSR, image optimisation, CDN |
| Recovery | RTO (Recovery Time Objective) | <2 hours | ArgoCD re-deploy from Git, DB restore from backup |
| Recovery | RPO (Recovery Point Objective) | <1 hour | Hourly PostgreSQL WAL backups to off-site |
| Security | Authentication | MFA supported | NextAuth.js + TOTP |
| Security | Data encryption | TLS 1.2+ in transit | Cert-Manager + Let's Encrypt |
| Security | Data encryption | AES-256 at rest | Disk-level encryption on PVs |
| Compliance | POPIA | Full compliance | PII classified, consent logged, breach process defined |
| Load shedding | Graceful degradation | Stage 6 survivable | UPS documented, terminationGracePeriodSeconds set |
| Observability | Alert response | <15 minutes | ntfy push alerts to mobile |

---

## 7. Risks & Mitigations

> **Audience**: All audiences.

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk 1, e.g., Scope creep from undocumented client requirements] | High | High | Discovery workshop before development; change control process defined |
| [Risk 2, e.g., Load shedding disrupts deployment windows] | High | Medium | Maintenance windows scheduled for Stage 0–2 periods; ArgoCD retry on failure |
| [Risk 3, e.g., Third-party API rate limits or downtime] | Medium | High | Circuit breaker pattern; Redis cache of last-good response; degraded-mode UI |
| [Risk 4, e.g., PostgreSQL data volume growth exceeds initial sizing] | Low | Medium | Monthly volume review; PV expansion policy documented |
| [Risk 5, e.g., Client team cannot maintain Kubernetes post-handover] | Medium | High | Training included in delivery; runbook produced; 3-month support retainer offered |

---

## 8. Delivery Approach

> **Audience**: All audiences.

### Phases

| Phase | Scope | Deliverables | Duration | ZAR |
|-------|-------|-------------|----------|-----|
| Phase 1: Foundation | Infrastructure, CI/CD, base app skeleton | Terraform, MicroK8s cluster, ArgoCD, skeleton app | [X weeks] | R[amount] |
| Phase 2: Core Features | [Features 1–N] | Deployed, tested features; integration docs | [X weeks] | R[amount] |
| Phase 3: Hardening | NFRs, observability, security review | PLG stack, runbook, penetration test report | [X weeks] | R[amount] |
| Phase 4: Handover | Training, documentation, UAT support | Runbook, architecture doc, training session | [X weeks] | R[amount] |
| **Total** | | | **[X months]** | **R[total]** |

### Milestone Payment Schedule

| Milestone | Trigger | ZAR |
|-----------|---------|-----|
| Project kick-off | Signed SOW and 50% deposit | R[amount] |
| Phase 1 complete | Infrastructure live, verified | R[amount] |
| Phase 2 complete | Core features in staging, UAT ready | R[amount] |
| Final handover | Go-live sign-off | R[amount] |

### Assumptions

- Client provides access to existing systems within 5 business days of project start.
- Client UAT feedback turnaround is 5 business days per review cycle.
- Infrastructure hosting environment (VMs, cloud accounts) is provisioned before Phase 1.
- No more than [X] revision cycles per phase are included; additional revisions billed at R950/hr.

---

## 9. Operational Considerations

> **Audience**: Technical stakeholders, IT team.

### Infrastructure Requirements

| Resource | Specification | Notes |
|----------|-------------|-------|
| MicroK8s node(s) | [X] vCPU, [X]GB RAM, [X]GB SSD | [Single node / HA 3-node] |
| PostgreSQL storage | [X]GB initial, [X]% annual growth | Thin-provisioned PV |
| UPS capacity | [X] minutes runtime at full load | Required for load shedding |
| Backup destination | Off-site S3 or MinIO | Daily snapshots, 30-day retention |

### Access & Handover

- GitHub repository: client-owned organisation, Prudentia as collaborator
- ArgoCD: client admin account provisioned at Phase 4
- Grafana: client read/admin accounts provisioned at Phase 4
- Secrets in Vault: client root token transferred via secure handoff at go-live

### Post-Delivery Support Options

| Option | Scope | Rate |
|--------|-------|------|
| Break-fix only | Critical incidents | R950/hr, billed monthly |
| Monthly retainer — 8 hours | Monitoring, patches, minor enhancements | R6,800/month |
| Monthly retainer — 20 hours | Full managed service | R16,000/month |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| ADR | Architecture Decision Record — a document capturing a significant technical decision and its rationale |
| ArgoCD | GitOps continuous delivery tool for Kubernetes |
| GitOps | Operational model where Git is the single source of truth for infrastructure and app config |
| MicroK8s | Lightweight Kubernetes distribution by Canonical, suited for on-prem and edge deployments |
| PLG | Prometheus + Loki + Grafana — Prudentia's default observability stack |
| POPIA | Protection of Personal Information Act — South Africa's primary data privacy legislation |
| RTO | Recovery Time Objective — maximum acceptable downtime after a failure |
| RPO | Recovery Point Objective — maximum acceptable data loss measured in time |

---

## Appendix B: References

- [Architecture Decision Records](./adrs/) — all ADRs for this project
- [Tech Stack Decision Matrix](../references/tech-stack-decision-matrix.md) — criteria used for technology selection
- [Prudentia Digital — Company Profile](../../company-profile.md) — for inclusion in tender packages
