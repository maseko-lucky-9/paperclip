# Delivery Review Checklist

Quick-reference checklist for all delivery review categories. Work through every section for each deliverable. Check off items as you confirm them. Leave unchecked items with a brief note explaining the gap.

**Deliverable**: ___________________________
**Date**: ___________________________
**Reviewer**: ___________________________
**SOW version**: ___________________________

---

## 1. Pre-Review Setup

- [ ] Branch targets correct base (not stale or feature branch)
- [ ] CI/CD pipeline green (or failures documented)
- [ ] PR description explains what changed, why, and how to test
- [ ] Staging/test environment accessible and seeded with representative data

---

## 2. Functionality

- [ ] Meets all acceptance criteria stated in SOW
- [ ] Edge cases handled: empty input, null, zero, max-length values
- [ ] Error states return meaningful messages (not stack traces)
- [ ] No console.log / print statements in production paths
- [ ] No dead code, commented-out blocks, or untracked TODOs
- [ ] Behaviour consistent across supported browsers / clients (if applicable)

**Notes**: ___________________________

---

## 3. Security (OWASP Top 10)

| Check | Status | Notes |
|-------|--------|-------|
| A01 Access Control — authN + authZ on every endpoint, no IDOR, server-side role checks | | |
| A02 Cryptographic Failures — no plaintext secrets, bcrypt/argon2 passwords, TLS enforced | | |
| A03 Injection — parameterised queries, no string concatenation in SQL, input validated | | |
| A04 Insecure Design — threat model considered, controls built in not bolted on | | |
| A05 Security Misconfiguration — no defaults, debug off, CORS restricted, no stack traces exposed | | |
| A06 Vulnerable Components — `npm audit` / `pip-audit` / `trivy` run, no critical CVEs | | |
| A07 Auth Failures — session rotation, JWT expiry set, refresh token rotation, brute-force protection | | |
| A08 Integrity Failures — pinned dependencies in CI, signed artifacts | | |
| A09 Logging Failures — auth/error/admin events logged; logs contain no PI or credentials | | |
| A10 SSRF — outbound HTTP validated against allowlist, no user-controlled URLs fetched | | |

**Notes**: ___________________________

---

## 4. Performance

- [ ] No N+1 queries — query plan checked for list endpoints
- [ ] No synchronous blocking operations in async paths
- [ ] Pagination on all list endpoints, max page size enforced
- [ ] Heavy operations in background jobs (not in request lifecycle)
- [ ] Load shedding resilience: graceful degradation when external services unavailable
- [ ] Retry logic with exponential backoff on critical external dependencies
- [ ] Circuit breaker pattern on non-idempotent external calls

**Notes**: ___________________________

---

## 5. Test Coverage

- [ ] Unit tests cover happy path and at least 2 failure modes per critical function
- [ ] Integration tests cover full request/response cycle for new endpoints
- [ ] Coverage delta is neutral or positive (no regression)
- [ ] All tests deterministic — no flaky tests, time-dependent logic mocked
- [ ] Test suite passes locally and in CI

**Notes**: ___________________________

---

## 6. Documentation

### README

- [ ] Project purpose (1 paragraph)
- [ ] Prerequisites (runtime versions, required tools and accounts)
- [ ] Environment variable reference (name, description, example — not actual values)
- [ ] Local dev setup (copy-paste commands verified to work)
- [ ] Running tests
- [ ] Deployment instructions or link to deployment guide

### API Reference (if applicable)

- [ ] All endpoints documented (path, method, auth requirement)
- [ ] Request body schemas with field descriptions and validation rules
- [ ] Response schemas for 200, 400, 401, 403, 404, 422, 500
- [ ] Example requests and responses
- [ ] Breaking vs. additive changes noted
- [ ] Available at `/api/docs` (or equivalent) in staging

### Architecture Diagram (if 3+ services)

- [ ] All services, databases, queues, and external integrations shown
- [ ] Data flow direction indicated
- [ ] Trust boundaries marked
- [ ] Stored as source file (Mermaid / draw.io XML / PlantUML)
- [ ] Matches actual deployed infrastructure

### Runbook (infrastructure / production deployments)

- [ ] Restart procedure per service
- [ ] Health check and log access instructions
- [ ] Common failure modes and remediation steps
- [ ] Escalation path and contacts
- [ ] Scheduled maintenance procedures

**Notes**: ___________________________

---

## 7. Infrastructure

### Secrets Management

- [ ] No secrets in source code, Dockerfiles, or Helm values files
- [ ] Secrets sourced from Vault, Sealed Secrets, External Secrets Operator, or cloud-native secret manager
- [ ] Secret rotation documented
- [ ] `.gitignore` confirmed to exclude `.env`, `*.tfvars`, `kubeconfig`, key files

### TLS & Network

- [ ] TLS on all public-facing services
- [ ] TLS 1.2 minimum, TLS 1.3 preferred
- [ ] Certificate expiry monitoring/alerting in place
- [ ] Network policies restrict pod-to-pod traffic (Kubernetes)
- [ ] Ingress restricted to known CIDR ranges where applicable

### Resource Limits & Reliability

- [ ] Resource requests and limits set on all containers
- [ ] Liveness and readiness probes configured
- [ ] HPA configured for stateless workloads
- [ ] PodDisruptionBudget set for critical services
- [ ] Health check returns degraded (not 500) when upstream services are down

### Monitoring & Alerting

- [ ] Metrics exported (Prometheus or equivalent)
- [ ] Dashboards covering error rate, latency (p50/p95/p99), throughput, saturation
- [ ] Alerts: error rate spike, latency breach, pod crash loop, disk saturation
- [ ] Log aggregation in place
- [ ] On-call channel confirmed with client

### Backup & Recovery

- [ ] Automated backups configured for all stateful services
- [ ] Backup retention policy documented and matches POPIA + contractual requirements
- [ ] Restore tested — date of last successful restore documented
- [ ] RPO and RTO agreed with client in SOW
- [ ] Cross-region or offsite copy for critical data

### Rollback

- [ ] Rollback procedure documented step-by-step
- [ ] Rollback tested in staging
- [ ] Database migrations reversible (or pre-migration snapshot taken)
- [ ] Feature flags in place for high-risk features

**Notes**: ___________________________

---

## 8. POPIA Compliance

### Data Flow Answers (complete before checklist)

| Question | Answer |
|----------|--------|
| What PI is collected? | |
| Where is it stored (DB, region, third-party)? | |
| Who has access (service accounts, admins, processors)? | |
| Cross-border transfers? (outside South Africa) | |
| Retention period and deletion trigger? | |
| Data subject request process? | |

### Checklist

- [ ] Data Processing Agreement signed with client
- [ ] Privacy notice / consent mechanism at all PI collection points
- [ ] Consent is specific, informed, freely given — no pre-ticked boxes
- [ ] PI used only for consented purpose
- [ ] Third-party processors documented and POPIA-compliant
- [ ] Cross-border transfers documented; adequate protection confirmed
- [ ] Retention policy implemented with automated deletion or anonymisation
- [ ] Data subject request process documented, SLA defined (target: 30 days)
- [ ] Security safeguards: encryption at rest, TLS in transit, access controls, audit logs
- [ ] Breach notification procedure documented (72-hour notification target)
- [ ] PI not in application logs or error traces
- [ ] PI not in analytics events or third-party telemetry
- [ ] PI not in URL query parameters
- [ ] No PI exposed during load shedding degraded-mode operation

**Notes**: ___________________________

---

## 9. Acceptance Criteria Validation

List each acceptance criterion from the SOW and record evidence:

| # | Criterion (from SOW) | Status | Evidence Reference |
|---|---------------------|--------|-------------------|
| 1 | | MET / PARTIAL / NOT MET | |
| 2 | | MET / PARTIAL / NOT MET | |
| 3 | | MET / PARTIAL / NOT MET | |
| 4 | | MET / PARTIAL / NOT MET | |
| 5 | | MET / PARTIAL / NOT MET | |

**Outstanding / deferred items**: ___________________________

---

## 10. Findings Summary

| ID | Severity | Category | Title | Status |
|----|----------|----------|-------|--------|
| DR-[date]-001 | Critical / High / Medium / Low | | | Open / Fixed / Accepted |

**Severity definitions:**

- **Critical** — Data breach, data loss, regulatory penalty risk. Deployment blocker.
- **High** — Material functionality gap or significant security weakness. Written remediation plan required before ship.
- **Medium** — Non-critical issue. Acceptable to ship with exception and fix timeline.
- **Low** — Style, minor doc gap, enhancement. Ship without restriction; track in backlog.

---

## 11. Overall Recommendation

**[ ] SHIP** — All critical and high findings resolved. Acceptance criteria met.

**[ ] FIX REQUIRED** — Open critical/high findings. Items to resolve before ship:
1. ___________________________
2. ___________________________

**[ ] REDESIGN REQUIRED** — Fundamental issue requiring significant rework. Escalate to PM and client with scope impact.

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Reviewer | | | |
| Client (optional) | | | |
