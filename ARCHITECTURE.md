# Unbound Platform Architecture

## Overview

Unbound is an employee benefits platform with two apps in one shell:
- **Company Workspace** - For CEO, CFO, HR, and Ops teams
- **Employee Wallet** - For all employees

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **State**: React Context with useReducer
- **Icons**: react-icons/fi (Feather)

---

## Global Objects (Entities)

All entities are versioned and interconnected via backlinks.

| Object | Description | Key Relations |
|--------|-------------|---------------|
| `Company` | Organization profile | Has Audits, Plans, Certificates, Employees |
| `AuditReport` | Baseline assessment | Links to Plan, generates Gaps |
| `PlanVersion` | Benefit design iteration | Based on Audit, produces Certificate |
| `CertificateVersion` | Equivalence proof | Maps Plan to requirements |
| `PolicyDocument` | Uploaded/generated docs | Attached to any object |
| `ProviderPolicy` | External provider terms | Referenced by Certificate rows |
| `Employee` | Individual worker | Has Enrollments, Tickets |
| `Enrollment` | Employee benefit signup | Links Employee to Plan |
| `Task` | Operational work item | Spawned by gaps, quotes, etc. |
| `Ticket` | Support request | Links to Employee, modules |

---

## URL Patterns

### Company Workspace Routes
```
/company/[companyId]/home                    # Dashboard
/company/[companyId]/onboarding              # Company setup wizard
/company/[companyId]/audit/[auditId]         # Audit intake & results
/company/[companyId]/plan/[planId]           # Plan builder
/company/[companyId]/certificate/[certId]    # Certificate mapping
/company/[companyId]/employees               # Employee directory
/company/[companyId]/employees/[employeeId]  # Employee detail
/company/[companyId]/monitoring              # Compliance monitoring
/company/[companyId]/integrations            # Integration status
/company/[companyId]/settings                # Company settings
/company/[companyId]/billing                 # Pricing & invoices
```

### Employee Wallet Routes
```
/employee/[employeeId]/security              # My Security page
/employee/[employeeId]/choices               # My Choices page
```

### Shared Routes
```
/ops/tasks                                   # Task queue
/ops/tasks/[taskId]                          # Task detail
/support/tickets                             # Ticket list
/support/tickets/[ticketId]                  # Ticket detail
/docs                                        # Document library
/docs/[docId]                                # Document view
```

---

## Global Navigation

### Company Workspace Sidebar
1. **Home** - `/company/[id]/home`
2. **Audit** - `/company/[id]/audit`
3. **Plan** - `/company/[id]/plan`
4. **Certificate** - `/company/[id]/certificate`
5. **Employees** - `/company/[id]/employees`
6. **Operations** - `/ops/tasks`
7. **Support** - `/support/tickets`
8. **Documents** - `/docs`
9. **Monitoring** - `/company/[id]/monitoring`
10. **Integrations** - `/company/[id]/integrations`
11. **Settings** - `/company/[id]/settings`

### Employee Wallet Sidebar
1. **My Security** - `/employee/[id]/security`
2. **My Choices** - `/employee/[id]/choices`
3. **Support** - `/support/tickets` (filtered to employee)
4. **Documents** - `/docs` (filtered to employee)

---

## Backlink System

Every page displays "Related" chips that link to connected objects.

### Implementation
```typescript
interface BacklinkChip {
  type: GlobalObjectType;
  id: string;
  label: string;
  href: string;
}

// Component renders chips for each related object
<RelatedChips links={[
  { type: 'audit', id: 'a1', label: 'Audit v1', href: '/company/x/audit/a1' },
  { type: 'plan', id: 'p2', label: 'Plan v3', href: '/company/x/plan/p2' },
]} />
```

### Rules
- Every object page shows Related chips
- Every action creates an object (e.g., "Request quote" → Task)
- Version everything: Audit v1, Plan v3, Certificate v2
- Every claim has evidence (Certificate row → Provider Policy)

---

## Page Architecture

### Page 0: Home
**Purpose**: One click to value

| Block | Content |
|-------|---------|
| Status at a glance | Current state badge, Next best action button |
| Savings and risk | Annual savings range, Risk hotspots, Employee upside |
| Open loops | Missing data, Tasks due, Open tickets |

**Backlinks**: Latest Audit, Current Plan, Latest Certificate

---

### Page 1: Company Onboarding
**Purpose**: Create context once

| Step | Fields |
|------|--------|
| Company Profile | Legal name, org number, sector, headcount, union status, payroll |
| Stakeholders | Invite CFO/HR/CEO, roles & permissions |
| Data Sources | CSV upload, payroll connect, pension provider connect |

**Backlinks**: Company, Settings

---

### Page 2: Audit Intake
**Purpose**: Get enough input to compute baseline

| Section | Content |
|---------|---------|
| A. Workforce | Employee list upload, fields validation, completeness bar |
| B. Current Benefits | Pension, insurances, top-ups |
| C. Constraints | Must-haves, red lines |
| D. Evidence | Policy PDFs, invoices, union docs |

**Output**: Live baseline estimate, Confidence score

**Backlinks**: Uploaded documents, Workforce dataset

---

### Page 3: Audit Results
**Purpose**: The wedge - sharp and skimmable

| Tab | Content |
|-----|---------|
| Executive | 3 key numbers, Top 5 moves, Board export |
| Cost Anatomy | Pension vs fees, Insurance split, Admin costs |
| Flexibility Score | Termination friction, Policy agility, Hiring friction |
| Employee Upside | Retirement projection, Clarity score, Optionality |
| Gaps | Why it matters, Risk, Fix suggestion → Plan Builder |

**Backlinks**: Baseline inputs, Generated actions, Tasks

---

### Page 4: Plan Builder
**Purpose**: Design Unbound plan matching/exceeding baseline

| Module | Configuration |
|--------|---------------|
| Pension | Base %, salary exchange, fund selection, fees |
| Insurance | Life, disability, injury coverage levels |
| Top-ups | Parental, sickness, notice/severance |
| Benefits Wallet | Budget, categories, tax rules |
| Compliance | LAS handling, documentation, monitoring |

**Preview Panel**: Cost comparison, Equivalence status, Employee delta

**Backlinks**: Audit Report, Plan versions, Provider tasks

---

### Page 5: Certificate
**Purpose**: Create trust - looks like regulation

| Section | Content |
|---------|---------|
| Header | Plan name, version, signatories |
| Requirements Table | Rows per requirement, columns for baseline/Unbound/status |
| Attachments | Policy PDFs, plan summary, FAQ |

**Actions**: Export PDF, Truth sheet, Union pack

**Backlinks**: Plan Version, Audit Report, Documents

---

### Page 6: Employee Directory
**Purpose**: Drive adoption, reduce fear

| View | Content |
|------|---------|
| List | Name, role group, status (invited/activated/enrolled) |
| Detail Tabs | Overview, Contributions, Coverages, Wallet, Signatures |
| Timeline | Enrollment step-by-step record |
| Documents | Policy pack, FAQ, Addendums |
| Support | Related tickets |

**Backlinks**: Enrollments, Documents, Tickets

---

### Page 7: My Security (Employee)
**Purpose**: Trust through clarity - 2 minute comprehension

| Section | Content |
|---------|---------|
| Today | Pension balance, contributions, active insurances |
| If Something Happens | Scenarios with what/where/link |
| Projection | Retirement chart, extra contribution slider |
| Proof | Certificate card, Ask question button |

**Backlinks**: Enrollment, Policies, Certificate

---

### Page 8: My Choices (Employee)
**Purpose**: Let employees feel upside

| Section | Content |
|---------|---------|
| Salary Exchange | Toggle, amount, impact preview |
| Benefits Wallet | Category allocation drag |
| Fund Choice | Risk levels (if allowed) |
| Documents | Download pack |
| Vendors | Nomination form |

**Backlinks**: Plan rules, Employee requests

---

### Page 9: Operations / Tasks
**Purpose**: Run business manually behind scenes

| View | Filter |
|------|--------|
| By Stage | Onboarding, provider, enrollment, certificate, monitoring |
| By SLA | Due today, overdue |
| By Owner | Assigned person |

**Task Detail**: What happened, next steps, templates, evidence

**Backlinks**: Spawning object (audit gap, employee, provider)

---

### Page 10: Support / Tickets
**Purpose**: Kill biggest complaint - slow support

| Field | Content |
|-------|---------|
| Severity | Priority level |
| Timer | Time to first response |
| Thread | Conversation history |
| Links | Employee, plan module, provider |
| Resolution | Code + post-mortem checkbox |

**Backlinks**: Affected employee, Module

---

### Page 11: Documents
**Purpose**: Every promise downloadable

| Folder | Contents |
|--------|----------|
| Board Pack | Board summary PDF |
| Employee Pack | Truth sheet, FAQ |
| Provider Pack | Policy documents |
| Legal Pack | Addendums, agreements |

**Links**: "Generated from" → Audit/Plan/Certificate

---

### Page 12: Monitoring
**Purpose**: Continuous compliance co-pilot

| Section | Content |
|---------|---------|
| Monthly Checklist | Contributions, policies, enrollments |
| Drift Detection | Missing coverage, contribution mismatch |
| Renewals | Upcoming dates |

**Actions**: Create remediation task

**Backlinks**: Provider policies, Affected employees

---

### Page 13: Integrations
**Purpose**: Show path to scale

| Card | Status |
|------|--------|
| Payroll | Visma, Fortnox, other - planned/beta/live |
| Pension | Provider connections |
| E-signing | Document signing |
| Accounting | Financial sync |

**Backlinks**: Blocked tasks

---

### Page 14: Billing
**Purpose**: Make it feel real

| Content | Details |
|---------|---------|
| Current Plan | Per employee per month |
| Add-ons | Audit, certificate, monitoring, wallet |
| Invoices | History |
| Seats | Employee count |

**Backlinks**: Company

---

## State Management

### AppContext Structure
```typescript
interface AppState {
  // Current user context
  currentUser: User | null;
  currentCompany: Company | null;

  // Core entities
  companies: Company[];
  auditReports: AuditReport[];
  planVersions: PlanVersion[];
  certificateVersions: CertificateVersion[];
  policyDocuments: PolicyDocument[];
  providerPolicies: ProviderPolicy[];
  employees: Employee[];
  enrollments: Enrollment[];
  tasks: Task[];
  tickets: Ticket[];

  // UI state
  isLoading: boolean;
  notifications: Notification[];
}
```

### Action Types
```typescript
type AppAction =
  // Company
  | { type: 'SET_CURRENT_COMPANY'; payload: Company }
  | { type: 'CREATE_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Company }

  // Audit
  | { type: 'CREATE_AUDIT'; payload: AuditReport }
  | { type: 'UPDATE_AUDIT'; payload: AuditReport }
  | { type: 'COMPLETE_AUDIT_SECTION'; payload: { auditId: string; section: string } }

  // Plan
  | { type: 'CREATE_PLAN'; payload: PlanVersion }
  | { type: 'UPDATE_PLAN_MODULE'; payload: { planId: string; module: PlanModule } }
  | { type: 'PUBLISH_PLAN'; payload: string }

  // Certificate
  | { type: 'CREATE_CERTIFICATE'; payload: CertificateVersion }
  | { type: 'UPDATE_CERTIFICATE_ROW'; payload: { certId: string; row: RequirementRow } }
  | { type: 'SIGN_CERTIFICATE'; payload: { certId: string; signatory: string } }

  // Employees
  | { type: 'ADD_EMPLOYEE'; payload: Employee }
  | { type: 'UPDATE_EMPLOYEE'; payload: Employee }
  | { type: 'INVITE_EMPLOYEE'; payload: string }

  // Enrollments
  | { type: 'CREATE_ENROLLMENT'; payload: Enrollment }
  | { type: 'UPDATE_ENROLLMENT'; payload: Enrollment }

  // Tasks
  | { type: 'CREATE_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'COMPLETE_TASK'; payload: string }

  // Tickets
  | { type: 'CREATE_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: Ticket }
  | { type: 'RESOLVE_TICKET'; payload: { ticketId: string; code: string } }

  // Documents
  | { type: 'GENERATE_DOCUMENT'; payload: PolicyDocument }
  | { type: 'UPLOAD_DOCUMENT'; payload: PolicyDocument }

  // UI
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
```

---

## Component Architecture

### Layout Components
```
/components/layout/
├── AppShell.tsx           # Main shell with sidebar
├── CompanyWorkspace.tsx   # Company workspace layout
├── EmployeeWallet.tsx     # Employee wallet layout
├── Sidebar.tsx            # Navigation sidebar
├── Header.tsx             # Top header bar
└── RelatedChips.tsx       # Backlink chips component
```

### UI Components
```
/components/ui/
├── Button.tsx
├── Card.tsx
├── Badge.tsx
├── StatCard.tsx
├── StatusBadge.tsx        # State badges (Baseline only, etc.)
├── ActionButton.tsx       # Next best action button
├── ProgressBar.tsx        # Completeness indicators
├── DataTable.tsx          # Requirements table
├── Timeline.tsx           # Enrollment timeline
├── VersionBadge.tsx       # v1, v2, v3 indicators
└── EvidenceLink.tsx       # Links to provider policies
```

### Feature Components
```
/components/features/
├── /audit/
│   ├── IntakeWizard.tsx
│   ├── WorkforceUpload.tsx
│   ├── BenefitsForm.tsx
│   ├── ConstraintsForm.tsx
│   ├── ResultsDashboard.tsx
│   └── GapCard.tsx
├── /plan/
│   ├── PlanBuilder.tsx
│   ├── ModuleList.tsx
│   ├── PensionModule.tsx
│   ├── InsuranceModule.tsx
│   ├── TopUpsModule.tsx
│   ├── WalletModule.tsx
│   └── PreviewPanel.tsx
├── /certificate/
│   ├── CertificateHeader.tsx
│   ├── RequirementsTable.tsx
│   └── AttachmentsList.tsx
├── /employees/
│   ├── EmployeeList.tsx
│   ├── EmployeeDetail.tsx
│   ├── EnrollmentTimeline.tsx
│   └── InviteModal.tsx
├── /wallet/
│   ├── SecurityOverview.tsx
│   ├── ScenarioCards.tsx
│   ├── ProjectionChart.tsx
│   └── ChoicesPanel.tsx
├── /operations/
│   ├── TaskQueue.tsx
│   ├── TaskDetail.tsx
│   └── TaskTemplates.tsx
└── /support/
    ├── TicketList.tsx
    ├── TicketDetail.tsx
    └── TicketThread.tsx
```

---

## Folder Structure

```
/home/user/projectx/
├── /app/
│   ├── layout.tsx                           # Root layout
│   ├── page.tsx                             # Landing/redirect
│   ├── /company/
│   │   └── /[companyId]/
│   │       ├── /home/
│   │       │   └── page.tsx
│   │       ├── /onboarding/
│   │       │   └── page.tsx
│   │       ├── /audit/
│   │       │   ├── page.tsx                 # Audit list
│   │       │   └── /[auditId]/
│   │       │       └── page.tsx             # Audit detail
│   │       ├── /plan/
│   │       │   ├── page.tsx
│   │       │   └── /[planId]/
│   │       │       └── page.tsx
│   │       ├── /certificate/
│   │       │   ├── page.tsx
│   │       │   └── /[certId]/
│   │       │       └── page.tsx
│   │       ├── /employees/
│   │       │   ├── page.tsx
│   │       │   └── /[employeeId]/
│   │       │       └── page.tsx
│   │       ├── /monitoring/
│   │       │   └── page.tsx
│   │       ├── /integrations/
│   │       │   └── page.tsx
│   │       ├── /settings/
│   │       │   └── page.tsx
│   │       └── /billing/
│   │           └── page.tsx
│   ├── /employee/
│   │   └── /[employeeId]/
│   │       ├── /security/
│   │       │   └── page.tsx
│   │       └── /choices/
│   │           └── page.tsx
│   ├── /ops/
│   │   └── /tasks/
│   │       ├── page.tsx
│   │       └── /[taskId]/
│   │           └── page.tsx
│   ├── /support/
│   │   └── /tickets/
│   │       ├── page.tsx
│   │       └── /[ticketId]/
│   │           └── page.tsx
│   └── /docs/
│       ├── page.tsx
│       └── /[docId]/
│           └── page.tsx
├── /components/
│   ├── /ui/
│   ├── /layout/
│   └── /features/
├── /contexts/
│   └── AppContext.tsx
├── /types/
│   └── index.ts
├── /lib/
│   ├── utils.ts
│   └── backlinks.ts                         # Backlink resolution
├── /data/
│   └── sampleData.ts
└── /hooks/
    ├── useBacklinks.ts                      # Get related objects
    └── useCurrentContext.ts                 # Company/Employee context
```

---

## Microcopy Guidelines

Use direct language. No fluff.

| Context | Example Copy |
|---------|--------------|
| Certificate trust | "This certificate is only as good as the evidence attached." |
| Monitoring alert | "If we miss a contribution, you see it here first." |
| Portability | "You can leave Unbound at any time. Your pension stays yours." |
| Gaps | "This gap costs you X SEK per year in hidden fees." |
| Baseline | "Your current setup. No judgment. Just numbers." |
| Actions | "Fix this" not "Consider addressing" |
| Status | "Missing" not "Not yet provided" |

---

## Hard Rules

1. **Every object page shows Related chips** linking to Audit, Plan, Certificate, Docs, Tasks, Tickets
2. **Every action creates an object** - "Request quote" → Task, "Share board pack" → Document
3. **Version everything** - Audit v1, Plan v3, Certificate v2. Show diffs.
4. **Every claim has evidence** - Certificate row must link to provider policy or document
5. **No orphan statements** - Everything traceable
