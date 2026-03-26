# Invoice Template

Standard invoice format for Prudentia Digital.

## Template

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PRUDENTIA DIGITAL                                      │
│  Technology Consulting                                  │
│                                                         │
│  CIPC Registration: [registration number]               │
│  VAT Number: [if registered, else omit]                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  INVOICE                                                │
│                                                         │
│  Invoice Number:  INV-2026-001                          │
│  Invoice Date:    26 March 2026                         │
│  Due Date:        25 April 2026                         │
│  Payment Terms:   30 days from invoice date             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BILL TO:                                               │
│  [Client Company Name]                                  │
│  [Contact Person]                                       │
│  [Address Line 1]                                       │
│  [Address Line 2]                                       │
│  [City, Province, Postal Code]                          │
│                                                         │
├──────────────────────┬──────┬──────────┬────────────────┤
│  Description         │ Qty  │ Rate     │ Amount (ZAR)   │
├──────────────────────┼──────┼──────────┼────────────────┤
│  [Service line 1]    │ [X]  │ R[X]     │ R[total]       │
│  [Service line 2]    │ [X]  │ R[X]     │ R[total]       │
│  [Service line 3]    │ [X]  │ R[X]     │ R[total]       │
├──────────────────────┴──────┴──────────┼────────────────┤
│                             Subtotal   │ R[subtotal]    │
│                             VAT (15%)  │ R[vat]         │
│                             TOTAL DUE  │ R[total]       │
├────────────────────────────────────────┴────────────────┤
│                                                         │
│  BANKING DETAILS:                                       │
│  Account Name:  Prudentia Digital                       │
│  Bank:          [Bank Name]                             │
│  Account No:    [Account Number]                        │
│  Branch Code:   [Branch Code]                           │
│  Reference:     INV-2026-001                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  NOTES:                                                 │
│  - Payment due within 30 days of invoice date           │
│  - Please use the invoice number as payment reference   │
│  - Interest of 2% per month applies to overdue amounts  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Line Item Examples by Engagement Type

### Hourly

```
Software Development Services    │ 40 hrs │ R950/hr  │ R38,000
Architecture Review              │  8 hrs │ R1,200/hr│ R9,600
```

### Fixed-Price Milestone

```
Phase 2: API Development         │  1     │ R85,000  │ R85,000
  (per SOW dated 15 Feb 2026,
   Milestone 2 of 4)
```

### Monthly Retainer

```
DevOps Support Retainer          │  1 mo  │ R25,000  │ R25,000
  (March 2026, per agreement
   dated 1 Jan 2026)
```

### Government Tender Milestone

```
MTPA Portal: Phase 1 Deliverable │  1     │ R450,000 │ R450,000
  (per Contract [ref], approved
   by [dept] on [date])
```

## Credit Note Format

Use for corrections, refunds, or adjustments:

- Number: `CN-YYYY-NNN`
- Must reference the original invoice: "Credit against INV-2026-001"
- Same format as invoice but with negative amounts
- Reason for credit clearly stated in notes section
