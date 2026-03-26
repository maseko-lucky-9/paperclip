---
name: infrastructure-runbook
description: >
  When the user wants to create operational runbooks, deployment procedures, incident response
  plans, or infrastructure documentation. Use when the user mentions "runbook," "deployment
  procedure," "incident response," "disaster recovery," "DR plan," "rollback procedure,"
  "on-call," "monitoring setup," "alerting," "SLA," "uptime," "how to deploy," "production
  checklist," or "operations documentation." For architecture decisions, see solution-design.
  For QA review, see delivery-review.
tags: [engineering]
metadata:
  version: 1.0.0
---

# Skill: Infrastructure Runbook

**Role**: Solutions Architect — Prudentia Digital
**Context**: Solo SA operator. Engagements span SME, enterprise, and government. Stack: MicroK8s / Kubernetes, GitOps / ArgoCD, Prometheus / Grafana / Loki / Alloy (PLG), cloud-agnostic with ZAR cost sensitivity. Load shedding is a real ops constraint.

---

## 1. Runbook Standards

### What Is a Runbook

A runbook is a documented, repeatable procedure for a specific operational task or failure scenario. It is written so that a competent engineer who is unfamiliar with the system can execute the procedure under pressure, at 02:00, with incomplete context.

### When to Create a Runbook

Create a runbook for any procedure that meets at least one of these criteria:

- You have done it more than once.
- Failure during the procedure would cause service disruption.
- It involves more than 5 sequential steps.
- It crosses a system boundary (e.g., involves both application and infrastructure).
- It is a client-facing operation (deployment, DR test, SLA report).

Do NOT write a runbook for trivial single-command tasks — link to tool documentation instead.

### Runbook Format

Every runbook follows this structure (see `references/runbook-template.md`):

| Section | Purpose |
|---|---|
| Metadata | Name, version, owner, last tested, SLA impact |
| Overview | What this runbook does and when to use it |
| Prerequisites | Access, tools, credentials, context required |
| Procedure | Numbered steps with commands and expected output |
| Verification | How to confirm success |
| Rollback | How to undo if something goes wrong |
| Escalation | Who to call and when if the procedure fails |

### Runbook Maintenance

- Review runbooks after every incident where one was used.
- Mark runbooks as "UNTESTED" if they have not been executed in 6 months.
- Run a DR test at least quarterly — update the runbook with actual observed behaviour.

---

## 2. Deployment Procedure

### Pre-Deploy Checklist

Complete all items before any production deployment. This is not optional.

**Code and configuration:**
- [ ] PR reviewed and merged to main / release branch.
- [ ] All CI checks passing (lint, tests, security scan).
- [ ] Container image tagged with semantic version (not `latest`).
- [ ] Image pushed to registry and digest confirmed.
- [ ] ArgoCD application diff reviewed — expected changes only.
- [ ] ConfigMaps / Secrets verified correct for the target environment.
- [ ] Database migrations reviewed; rollback script prepared if schema changes.

**Environment:**
- [ ] Load shedding schedule checked — do not deploy during scheduled load shedding window.
- [ ] Monitoring dashboards open and showing baseline (Grafana).
- [ ] Alerting confirmed active (Prometheus Alertmanager / ntfy / PagerDuty).
- [ ] Maintenance window communicated to client if SLA requires notification.
- [ ] Backup of persistent data confirmed (for stateful workloads).

**Access:**
- [ ] kubectl context pointed at correct cluster.
- [ ] Sufficient RBAC permissions confirmed.
- [ ] Rollback procedure reviewed and understood.

### GitOps Deployment Steps (ArgoCD)

```
1. Merge feature branch → main (triggers CI).
2. CI pipeline builds image, pushes to registry, updates image tag in Helm values / kustomize overlay.
3. ArgoCD detects config drift; sync triggered (auto or manual depending on environment).
4. Monitor ArgoCD sync status: argocd app get <app-name> --refresh
5. Watch rollout: kubectl rollout status deployment/<name> -n <namespace>
6. Run smoke tests (see Verification below).
7. Update deployment log (date, version, operator, outcome).
```

For manual sync:
```bash
argocd app sync <app-name> --prune
```

### Smoke Tests

Run immediately after deployment. Fail fast — do not wait for monitoring to surface a problem.

- **HTTP health check**: `curl -sf https://<service-url>/health | jq .`
- **Pod readiness**: `kubectl get pods -n <namespace> -l app=<name>` — all pods Ready.
- **Error rate**: Check Grafana dashboard. Error rate should be at or near pre-deploy baseline.
- **Latency**: P95 response time within 20% of pre-deploy baseline.
- **Logs**: `kubectl logs -n <namespace> -l app=<name> --since=5m` — no unexpected errors.

### Rollback Procedure

**ArgoCD rollback** (preferred — declarative, auditable):
```bash
argocd app history <app-name>                          # identify previous revision
argocd app rollback <app-name> <revision-id>
kubectl rollout status deployment/<name> -n <namespace>
```

**Kubernetes native rollback** (fallback):
```bash
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
```

**Database rollback**: Execute prepared rollback script. Confirm row counts and schema match pre-deploy state before marking rollback complete.

After rollback: open an incident, document what failed and why, do not redeploy without root cause identified.

---

## 3. Incident Response

### Severity Levels

| Severity | Definition | Response Time | Communication |
|---|---|---|---|
| SEV-1 | Complete service outage; all users affected | 15 minutes | Immediate client notification; updates every 30 min |
| SEV-2 | Partial outage or major feature broken; significant user impact | 30 minutes | Client notification within 1 hour; updates every 60 min |
| SEV-3 | Degraded performance or non-critical feature broken; workaround exists | 4 hours | Client notification within 4 hours if SLA-relevant |
| SEV-4 | Minor issue; no user impact; cosmetic or logging only | Next business day | Internal tracking only |

**Solo operator note**: For SEV-1 and SEV-2, establish the issue first, then communicate. Do not go dark for more than 15 minutes without an update.

### Incident Response Steps

```
1. DETECT     — Alert fires or client reports issue. Confirm it is real.
2. CLASSIFY   — Assign severity (SEV-1 through SEV-4).
3. COMMUNICATE — Notify client per severity table above.
4. INVESTIGATE — Check dashboards, logs, recent changes. Form a hypothesis.
5. MITIGATE   — Apply fastest available fix (rollback, traffic reroute, restart).
6. RESOLVE    — Root cause addressed; service confirmed restored.
7. COMMUNICATE — Notify client of resolution. Confirm they can verify.
8. POST-MORTEM — Written within 48 hours of resolution (SEV-1 and SEV-2).
```

### Client Communication Template

**Initial notification (SEV-1):**
> Subject: [INCIDENT] Service Disruption — [Service Name]
>
> We are currently investigating a service disruption affecting [service/feature]. Impact: [describe]. We are actively working on a resolution and will provide an update within 30 minutes.
>
> Time detected: [HH:MM SAST] | Reference: INC-[YYYYMMDD-NNN]

**Resolution notification:**
> Subject: [RESOLVED] Service Disruption — [Service Name]
>
> The service disruption has been resolved as of [HH:MM SAST]. Root cause: [brief description]. Preventative action: [what we will do to stop recurrence]. A full post-mortem will follow within 48 hours.

### Post-Mortem Format (Solo Operator — Lightweight)

| Field | Content |
|---|---|
| Incident ID | INC-YYYYMMDD-NNN |
| Severity | SEV-1 / SEV-2 |
| Duration | [Start] → [End] SAST |
| Impact | Users affected; revenue impact if known |
| Timeline | Bullet list: detect → mitigate → resolve |
| Root Cause | 1–3 sentences. No blame. |
| Contributing Factors | What conditions made this possible |
| Action Items | Numbered; each has an owner (Thulani) and a due date |
| SLA Status | Was SLA breached? If yes, credit calculation. |

---

## 4. Monitoring and Alerting Baseline

### Stack

- **Metrics**: Prometheus (scrape interval: 15s for production).
- **Dashboards**: Grafana (standard dashboards: Node Exporter, Kubernetes cluster, application RED metrics).
- **Logs**: Loki + Alloy (log aggregation, journal forwarding).
- **Alerting**: Prometheus Alertmanager → ntfy (mobile push) and/or PagerDuty for SEV-1.

### Alert Thresholds — Baseline

| Metric | Warning | Critical | Notes |
|---|---|---|---|
| CPU utilisation (node) | > 70% for 5 min | > 85% for 5 min | Scale or investigate |
| Memory utilisation (node) | > 75% for 5 min | > 90% for 5 min | OOM kill risk at 90%+ |
| Pod restart count | > 3 in 15 min | > 10 in 15 min | CrashLoopBackOff indicator |
| HTTP error rate (5xx) | > 1% for 5 min | > 5% for 5 min | Application-level |
| HTTP P95 latency | > 500ms for 5 min | > 2s for 5 min | Adjust per SLA |
| Disk utilisation | > 70% | > 85% | ZFS: set quota alerts |
| Certificate expiry | 30 days | 7 days | cert-manager should auto-renew |
| Alertmanager silence | — | > 24 hours | Dead man's switch |

### Notification Channels

| Severity | Channel | Escalation |
|---|---|---|
| SEV-1 | ntfy push (immediate) + client SMS/email | Phone call if no ack in 15 min |
| SEV-2 | ntfy push | Email to client within 1 hour |
| SEV-3 | ntfy push (business hours) | Reviewed next business day |
| SEV-4 | Grafana annotation / log only | Weekly review |

### Dead Man's Switch

Configure an Alertmanager "watchdog" alert that fires continuously. Route it to a healthcheck service (e.g., Healthchecks.io). If Alertmanager stops sending, the healthcheck triggers an external notification. This catches the failure mode where monitoring itself goes down.

---

## 5. SA Infrastructure Considerations

### Load Shedding

Load shedding is a first-class operational constraint. Address it in every client infrastructure design.

| Risk | Mitigation |
|---|---|
| Server downtime during outage | UPS sized for minimum 2-hour runtime per server; ATS for auto-switchover |
| Network loss (ISP CPE loses power) | Dual ISP with independent power paths; LTE/5G failover with separate UPS |
| Scheduled outage during deployment | Check EskomSePush API or schedule before any production change window |
| UPS battery failure (undiscovered) | Monthly UPS self-test; alert on UPS battery health via SNMP or NUT |
| Cloud provider local AZ impact | Use multi-region or multi-AZ for SEV-1-capable workloads |

**Deployment rule**: Never deploy to production during a scheduled load shedding window or within 30 minutes of one. Stages 4–8 increase failure probability significantly.

### ISP Failover

- Primary: fibre (symmetric, stable latency).
- Secondary: LTE/5G (higher latency, lower cost — acceptable for failover only).
- Failover detection: BGP preferred for enterprise; policy routing on pfSense/OPNsense for SME.
- DNS TTL: Set to 60 seconds for services that may require rapid failover.
- Test failover monthly — do not assume it works.

### POPIA Data Residency

- Personal information of SA data subjects should be processed and stored within South Africa where feasible.
- Cloud providers with SA regions: AWS (af-south-1, Cape Town), Azure (South Africa North, Johannesburg), GCP (africa-south1, Johannesburg).
- Where cross-border transfer is unavoidable: document the transfer, apply appropriate safeguards (adequacy determination, binding corporate rules, or Information Regulator approval).
- For government clients: data residency within SA is typically a hard contractual requirement — confirm before architecture decisions.

### UPS and Power Requirements

| Environment | Minimum UPS Runtime | Recommended |
|---|---|---|
| Home lab / dev | 30 minutes | 2 hours |
| SME server room | 2 hours | 4 hours + generator |
| Production colocation | ATS + generator | Tier III / IV facility with N+1 power |

Always spec UPS based on actual load (measure with a clamp meter), not nameplate wattage. Factor in battery degradation — spec at 80% of rated capacity.

---

## 6. SLA Templates

### Uptime Tiers

| Tier | Target Uptime | Allowed Downtime / Month | Annual Downtime |
|---|---|---|---|
| Standard | 99.5% | 3h 39m | 43h 49m |
| Professional | 99.9% | 43m 48s | 8h 45m |
| Premium | 99.95% | 21m 54s | 4h 22m |

**Uptime measurement**: Calculated as percentage of minutes in the calendar month where the service is available. Excludes scheduled maintenance windows (with 48-hour notice).

**Exclusions from SLA calculation** (standard):
- Scheduled maintenance (with 48-hour notice).
- Force majeure events.
- Client-caused outages (misconfiguration, bad deployment initiated by client).
- Third-party service failures outside Prudentia Digital's control (ISP, cloud provider, DNS).
- Load shedding beyond Stage 4 lasting more than 4 hours (document this explicitly for SA clients).

### Penalty Structure (ZAR)

| Tier | Uptime Achieved | Credit |
|---|---|---|
| Standard (99.5%) | 99.0%–99.49% | 10% of monthly fee |
| Standard (99.5%) | < 99.0% | 25% of monthly fee |
| Professional (99.9%) | 99.5%–99.89% | 10% of monthly fee |
| Professional (99.9%) | 99.0%–99.49% | 25% of monthly fee |
| Professional (99.9%) | < 99.0% | 50% of monthly fee |
| Premium (99.95%) | 99.9%–99.94% | 10% of monthly fee |
| Premium (99.95%) | 99.5%–99.89% | 25% of monthly fee |
| Premium (99.95%) | < 99.5% | 50% of monthly fee |

**Credit cap**: Credits are capped at 50% of the monthly fee. Credits are applied to the next invoice — no cash refunds.
**Claim process**: Client must submit an SLA claim within 10 business days of the incident. Prudentia Digital will respond within 5 business days with a determination.

### Response Time SLAs (Support)

| Severity | Standard | Professional | Premium |
|---|---|---|---|
| SEV-1 | 4 hours (business hours) | 1 hour (24/7) | 15 minutes (24/7) |
| SEV-2 | Next business day | 4 hours (business hours) | 1 hour (business hours) |
| SEV-3 | 3 business days | 2 business days | 1 business day |
| SEV-4 | Best effort | 5 business days | 3 business days |

**Business hours**: 08:00–18:00 SAST, Monday–Friday, excluding SA public holidays.

---

## 7. Related Skills

- `solution-design` — architecture decisions that determine what runbooks need to exist.
- `delivery-review` — post-project review that should capture operational lessons into runbooks.
- `project-delivery` — deployment gates and go-live checklists reference runbook procedures.

---

## References

- `references/runbook-template.md` — blank runbook template for new procedures.
