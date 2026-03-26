# Sprint Planning Template

Use this template at the start of every sprint. Complete all sections before opening the first issue for development.

---

## Sprint Header

| Field | Value |
|-------|-------|
| Project | [Client name — Project name] |
| Sprint number | Sprint [N] |
| Sprint dates | [Start date] to [End date] |
| Sprint length | [ ] 1 week  [ ] 2 weeks |
| Sprint goal | [One sentence: "By end of sprint, [outcome the client can see or test]"] |
| Planned by | Thulani Maseko |
| Date planned | [Date] |

---

## Capacity Check

Complete this before committing any issues to the sprint.

### This Sprint's Available Capacity

| Day | Available? | Billable Hours Available | Notes |
|-----|------------|--------------------------|-------|
| Monday | [ ] Yes / [ ] No | | |
| Tuesday | [ ] Yes / [ ] No | | |
| Wednesday | [ ] Yes / [ ] No | | |
| Thursday | [ ] Yes / [ ] No | | |
| Friday | [ ] Yes / [ ] No | | |
| **Total** | | **[sum]** | |

**Load shedding adjustment**: If Stage 2+ is active or forecast, subtract 2 hours from total.

Adjusted capacity: **[X hours]**

Sprint allocation for this project: **[Y hours]** (from multi-project allocation)

---

## Multi-Project Capacity Allocation (fill once per week, share across projects)

| Project | Type | Weekly Commitment | Priority |
|---------|------|-------------------|----------|
| [Project A] | Fixed-price | [hrs/week] | 1 |
| [Project B] | Retainer | [hrs/week min] | 2 |
| [Project C] | Hourly | [hrs/week] | 3 |
| [Project D] | Fixed-price | [hrs/week] | 4 |
| **Total committed** | | **[sum]** | |
| **Available capacity** | | **[from above]** | |
| **Remaining (buffer)** | | **[available - committed]** | Must be ≥ 0 |

**Rule**: If total committed exceeds available capacity, apply the priority framework in SKILL.md before proceeding.

---

## Sprint Backlog

List all issues committed to this sprint. Pull from Paperclip — do not plan work without a Paperclip issue.

| # | Issue ID | Title | Estimate (hrs) | Assignee | Priority | Carry-over? |
|---|----------|-------|----------------|----------|----------|-------------|
| 1 | | | | | P1 | [ ] |
| 2 | | | | | P2 | [ ] |
| 3 | | | | | P2 | [ ] |
| 4 | | | | | P3 | [ ] |
| 5 | | | | | P3 | [ ] |
| 6 | | | | | P3 | [ ] |
| | | **Sprint total** | **[sum]** | | | |

**Sprint total must not exceed sprint allocation for this project.**

### Carry-over Notes

For any issue marked carry-over, document why it was not completed last sprint and re-confirm the estimate is still valid:

| Issue ID | Reason not completed | Original estimate | Revised estimate | Root cause (for retrospective) |
|----------|---------------------|-------------------|------------------|-------------------------------|
| | | | | |

---

## Sprint Risks

Identify the top 2–3 risks specific to this sprint. Reference the project risk register for context.

| # | Risk Description | Likelihood | Impact | Mitigation for this sprint |
|---|-----------------|-----------|--------|---------------------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Dependencies and Blockers

List anything that must happen outside Thulani's control for this sprint to succeed.

| # | Dependency | Owner (client / contractor / external) | Needed by | Status |
|---|-----------|----------------------------------------|-----------|--------|
| 1 | | | | Pending / Confirmed |
| 2 | | | | Pending / Confirmed |

**Rule**: If a dependency is unconfirmed and is on the critical path for a P1 issue, escalate before the sprint starts — do not assume it will resolve itself.

---

## Billing Triggers This Sprint

Note any issues whose completion triggers an invoice or milestone billing event.

| Issue ID | Milestone / billing trigger | Invoice value (ZAR) | Invoice to be issued by |
|----------|-----------------------------|---------------------|------------------------|
| | | R | |

Trigger the financial-management skill when a billing milestone is reached.

---

## Sprint Review Scheduled

| Field | Value |
|-------|-------|
| Review date | [Date — last day of sprint or day after] |
| Format | [ ] Client call (30 min)  [ ] Async video  [ ] Email summary |
| Demo environment | [URL or "local only"] |
| Attendees | Thulani + [client contact] |
| Agenda | Sprint goal status, demo of completed work, next sprint preview |

---

## Post-Sprint Completion Checklist

Complete at sprint end before closing the sprint in Paperclip.

- [ ] All committed issues are `done` or explicitly deferred (with documented reason)
- [ ] Sprint velocity calculated and logged (done hours / planned hours)
- [ ] Client weekly status report sent
- [ ] Billing triggers actioned (financial-management skill notified)
- [ ] Carry-over issues added to next sprint backlog with updated estimates
- [ ] Retrospective notes captured (15 min internal review)
- [ ] Next sprint planning session scheduled
