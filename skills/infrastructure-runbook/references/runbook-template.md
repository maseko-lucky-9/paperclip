# Runbook: [PROCEDURE NAME]

---

## Metadata

| Field | Value |
|---|---|
| Runbook ID | RB-[YYYYMMDD]-[NNN] |
| Name | [Descriptive name — e.g., "Production Deployment — API Service"] |
| Version | 1.0.0 |
| Owner | Thulani Maseko / Prudentia Digital |
| Client | [Client name or "Internal"] |
| System | [System or service name] |
| Last Tested | [YYYY-MM-DD] — [Outcome: Pass / Fail / Partial] |
| SLA Impact | [Yes — SEV-? / No] |
| Status | ACTIVE / DRAFT / UNTESTED / DEPRECATED |

---

## Overview

**Purpose**: [1–2 sentences. What does this runbook do and why does it exist?]

**Trigger**: [When should an operator reach for this runbook? E.g., "Use when deploying a new release to production," or "Use when the database primary fails."]

**Expected duration**: [e.g., 15–30 minutes]

**Risk level**: [Low / Medium / High] — [Brief justification. e.g., "High — involves schema migration; rollback is non-trivial."]

---

## Prerequisites

Complete all prerequisites before starting the procedure. Skipping prerequisites is the most common cause of runbook failures.

### Access Required

- [ ] `kubectl` configured with context `[cluster-name]` and sufficient RBAC.
- [ ] ArgoCD CLI authenticated (`argocd login <server>`).
- [ ] Access to Grafana dashboard: `[URL]`.
- [ ] SSH access to `[host]` (if applicable).
- [ ] Credentials for `[service/secret manager path]` (retrieve from Vault / 1Password before starting).

### Tools Required

- [ ] `kubectl` >= [version]
- [ ] `argocd` CLI >= [version]
- [ ] `helm` >= [version] (if applicable)
- [ ] `jq`, `curl` (standard)

### Context Required

- [ ] Recent deployment history reviewed (`argocd app history <app-name>`).
- [ ] Current error rate and latency baseline noted from Grafana.
- [ ] Load shedding schedule checked — no scheduled outage in next 2 hours.
- [ ] Client maintenance window confirmed (if required by SLA).

---

## Procedure

> Execute steps in order. Do not skip steps. If a step fails, stop and follow the Rollback procedure unless the step explicitly says to continue on failure.

### Step 1: [Step Name]

**What this does**: [One sentence explaining why this step exists.]

```bash
# Command(s) to run
<command here>
```

**Expected output**:
```
<paste expected terminal output or describe what success looks like>
```

**If this fails**: [What to do — e.g., "Stop. Check X. If X is correct, escalate."]

---

### Step 2: [Step Name]

**What this does**: [One sentence.]

```bash
<command here>
```

**Expected output**:
```
<expected output>
```

**If this fails**: [Action.]

---

### Step 3: [Step Name]

[Repeat for all steps. Keep each step atomic — one logical action per step.]

---

### Step N: Final Step

[Last substantive action before verification.]

---

## Verification

Run all verification checks before declaring the procedure complete.

### Check 1: [Name — e.g., Service Health]

```bash
curl -sf https://<service-url>/health | jq .
```

Expected: `{"status": "ok"}` (or equivalent healthy response).

---

### Check 2: [Name — e.g., Pod Readiness]

```bash
kubectl get pods -n <namespace> -l app=<name> -o wide
```

Expected: All pods in `Running` state with `READY` count matching `DESIRED`.

---

### Check 3: [Name — e.g., Error Rate]

Open Grafana dashboard: `[URL]`
Navigate to: `[Dashboard > Panel name]`
Confirm: Error rate is ≤ [threshold] and stable (not trending up).

---

### Check 4: [Name — e.g., Logs Clean]

```bash
kubectl logs -n <namespace> -l app=<name> --since=5m | grep -i error
```

Expected: No unexpected errors. [Define what errors are acceptable vs. not.]

---

## Rollback

Use rollback if verification fails or the procedure produces unexpected results. Rollback restores the system to the state prior to starting this runbook.

**Rollback decision**: If any verification check fails, initiate rollback unless you are confident the failure is unrelated to this procedure and will resolve within [time window].

### Rollback Step 1: [Name]

```bash
<rollback command>
```

---

### Rollback Step 2: [Name]

```bash
<rollback command>
```

---

### Rollback Verification

[List checks to confirm the system has been successfully restored to pre-procedure state.]

```bash
<verification command>
```

Expected: [Describe expected state after successful rollback.]

---

## Escalation

If the procedure fails and rollback does not restore service:

| Condition | Action |
|---|---|
| Service remains down after rollback | Declare SEV-1 incident; notify client immediately |
| Rollback fails | Contact [backup resource / on-call] immediately |
| Data loss suspected | Stop all operations; preserve logs; notify client; engage legal if required |

**Escalation contacts**:

| Role | Contact | Method |
|---|---|---|
| Primary operator | Thulani Maseko | [Phone / Signal] |
| Client technical contact | [Name] | [Phone / Email] |
| Cloud provider support | [Provider] | [Support portal URL / case number] |
| Managed service contact | [MSP name] | [Contact details] |

---

## Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0.0 | [YYYY-MM-DD] | Thulani Maseko | Initial version |
| | | | |

---

## Notes

[Any additional context, gotchas, known issues, or links to related runbooks.]

- Related runbook: `[RB-ID — Name]`
- Related incident: `[INC-ID]` (if this runbook was created in response to an incident)
- Documentation: `[Link to architecture doc, vendor docs, etc.]`
