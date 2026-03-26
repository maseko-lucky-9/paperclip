# Risk Register Template

Create one risk register per project at kickoff. Update at each sprint planning session. Archive resolved risks — never delete them.

---

## Project Details

| Field | Value |
|-------|-------|
| Project | [Client name — Project name] |
| Engagement type | [ ] Fixed-price  [ ] Retainer  [ ] Hourly  [ ] Government tender |
| Register created | [Date] |
| Last reviewed | [Date] |
| Reviewed by | Thulani Maseko |

---

## Scoring Key

**Likelihood**

| Score | Label | Definition |
|-------|-------|------------|
| H | High | Likely to occur on most projects of this type. Has occurred before |
| M | Medium | Could occur. Situational — depends on client, tech, or environment |
| L | Low | Unlikely. Would require unusual circumstances |

**Impact**

| Score | Label | Definition |
|-------|-------|------------|
| VH | Very High | Project-threatening: loss of client, legal exposure, major financial loss (>R50k) |
| H | High | Milestone missed by >1 week, significant rework, or billing dispute |
| M | Medium | Sprint delayed, partial rework, or minor client dissatisfaction |
| L | Low | Minor disruption. Absorbed within sprint buffer |

**Status**

| Status | Meaning |
|--------|---------|
| Open | Risk is active and being managed |
| Mitigated | Mitigation in place and effective; monitoring continues |
| Escalated | Raised to CEO agent or client — awaiting action |
| Closed | Risk no longer applicable (threat passed or scope removed) |

---

## Standing Risks (pre-populated for all SA projects)

These risks apply to every Prudentia Digital engagement. Review and adjust likelihood/impact for this specific project.

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner | Status |
|----|------|-----------|--------|-------|------------|-------|--------|
| R-001 | Eskom load shedding Stage 2+ disrupts delivery schedule | H | M | H×M | UPS in place. Reduce capacity plan by 2 hrs/week. Shift dev to Eskom off-peak hours. Force majeure clause in SOW | Thulani | Open |
| R-002 | Eskom load shedding Stage 4+ causes major disruption | M | H | M×H | Extend sprint by 2–3 days. Defer non-critical tasks. Issue formal written notice to client with revised dates | Thulani | Open |
| R-003 | Government client payment delayed >60 days | H | H | H×H | Require 30% upfront deposit. Invoice immediately on milestone acceptance. Maintain 3-month cash buffer | Thulani | Open |
| R-004 | Scope creep from client change requests | H | M | H×M | Log all out-of-scope requests in Paperclip immediately. Issue change order and get written approval before starting | Thulani | Open |
| R-005 | Client unavailable for review / sign-off delays milestone | M | M | M×M | Build 3-business-day sign-off buffer before milestone deadline. Escalate via phone if >48h no response | Thulani | Open |
| R-006 | Contractor no-show or quality below standard | M | H | M×H | Never give contractor a single-point-of-failure role. Maintain 2–3 pre-vetted contractors per skill type | Thulani | Open |
| R-007 | POPIA data breach involving client personal data | L | VH | L×VH | Encrypt all personal data at rest and in transit. Access control per engagement. 72h notification requirement | Thulani | Open |
| R-008 | Key dependency (3rd-party API / service) unavailable | M | H | M×H | Test integration in sprint 1. Maintain fallback path. Do not build critical path on unverified 3rd-party service | Thulani | Open |
| R-009 | Skills shortage — contractor with required specialisation unavailable | M | H | M×H | Identify contractors before sprint start. 2-week lead time for contractor onboarding. Allow extra sprint if needed | Thulani | Open |
| R-010 | Government fiscal year end creates artificial March deadline | H | H | H×H | Identify billing milestones by 28 Feb. Submit invoices before 15 March for same-year payment. Confirm SOW contains fiscal-year clause | Thulani | Open |

---

## Project-Specific Risks

Add risks unique to this project here. Assign sequential IDs continuing from the standing risks above.

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner | Status |
|----|------|-----------|--------|-------|------------|-------|--------|
| R-011 | | | | | | | Open |
| R-012 | | | | | | | Open |
| R-013 | | | | | | | Open |
| R-014 | | | | | | | Open |

---

## Escalation Log

Record every risk that was escalated to the CEO agent or client. This is the audit trail for contractual disputes.

| Date | Risk ID | Escalated to | Escalation reason | Action taken | Resolved date |
|------|---------|-------------|-------------------|--------------|---------------|
| | | | | | |

---

## Risk Review History

Record each sprint review of the risk register here.

| Sprint | Review date | Risks added | Risks closed | Risks escalated | Reviewer |
|--------|-------------|-------------|--------------|-----------------|----------|
| Sprint 1 | | | | | Thulani Maseko |
| Sprint 2 | | | | | Thulani Maseko |
| Sprint 3 | | | | | Thulani Maseko |
| Sprint 4 | | | | | Thulani Maseko |
| Sprint 5 | | | | | Thulani Maseko |

---

## Closed Risks Archive

Move risks here when they are resolved. Do not delete.

| ID | Risk | Original likelihood | Original impact | Closed date | Resolution notes |
|----|------|--------------------|-----------------|-----------|--------------------|
| | | | | | |
