// Core Types for Unbound Employee Benefits Platform
// Two apps in one shell: Company Workspace + Employee Wallet

// =============================================================================
// USER & AUTHENTICATION
// =============================================================================

// User roles in Company Workspace
export type CompanyRole = 'ceo' | 'cfo' | 'hr' | 'ops' | 'board_observer';

// User roles in Employee Wallet
export type EmployeeRole = 'employee' | 'manager';

// Combined user type
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  companyId?: string;
  employeeId?: string;
  companyRoles: CompanyRole[];
  employeeRole?: EmployeeRole;
  createdAt: Date;
  lastLoginAt?: Date;
}

// =============================================================================
// GLOBAL OBJECTS (with backlinks)
// =============================================================================

// Object types for backlink system
export type GlobalObjectType =
  | 'company'
  | 'audit_report'
  | 'plan_version'
  | 'certificate_version'
  | 'policy_document'
  | 'provider_policy'
  | 'employee'
  | 'enrollment'
  | 'task'
  | 'ticket';

// Base interface for all versioned objects
export interface VersionedObject {
  id: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  previousVersionId?: string;
}

// Backlink reference
export interface BacklinkRef {
  type: GlobalObjectType;
  id: string;
  label: string;
}

// =============================================================================
// COMPANY
// =============================================================================

export type UnionStatus = 'no_agreement' | 'agreement' | 'agreement_like';
export type PayrollSystem = 'visma' | 'fortnox' | 'other';

export interface Company {
  id: string;
  legalName: string;
  orgNumber: string;
  sector: string;
  headcountNow: number;
  headcountTarget12Month: number;
  unionStatus: UnionStatus;
  payrollSystem: PayrollSystem;
  payrollSystemOther?: string;
  stakeholders: Stakeholder[];
  onboardingCompleted: boolean;
  onboardingStep: 'profile' | 'stakeholders' | 'data_sources' | 'complete';
  createdAt: Date;
  updatedAt: Date;
}

export interface Stakeholder {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: CompanyRole;
  invitedAt: Date;
  acceptedAt?: Date;
}

// =============================================================================
// AUDIT REPORT
// =============================================================================

export type AuditSection = 'workforce' | 'benefits' | 'constraints' | 'evidence';
export type ConstraintType = 'itp_like' | 'cost_neutral' | 'employee_outcomes';

export interface AuditReport extends VersionedObject {
  companyId: string;
  status: 'draft' | 'in_progress' | 'completed';
  completedSections: AuditSection[];
  currentSection: AuditSection;
  confidenceScore: number; // 0-100
  baselineCostEstimate?: number;

  // Section A: Workforce
  workforce: WorkforceData;

  // Section B: Current Benefits
  currentBenefits: CurrentBenefits;

  // Section C: Constraints
  constraints: AuditConstraints;

  // Section D: Evidence
  evidence: EvidenceUpload[];

  // Results (populated after completion)
  results?: AuditResults;

  // Backlinks
  documentIds: string[];
  planVersionIds: string[];
  taskIds: string[];
}

export interface WorkforceEmployee {
  id: string;
  name?: string;
  salary: number;
  ageBand: '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '65+';
  employmentType: 'full_time' | 'part_time' | 'contractor';
  startDate: Date;
  roleGroup: string;
}

export interface WorkforceData {
  employees: WorkforceEmployee[];
  uploadedFileId?: string;
  completeness: number; // 0-100
}

export interface CurrentBenefits {
  pension: {
    provider: string;
    contributionPercent: number;
    hasSalaryExchange: boolean;
    fundFees?: number;
  };
  insurances: Insurance[];
  topUps: {
    parental?: number;
    sickness?: number;
    notice?: number;
    severance?: number;
  };
}

export interface Insurance {
  id: string;
  type: 'life' | 'disability' | 'occupational_injury' | 'health' | 'other';
  provider: string;
  premium?: number;
  coverage?: string;
}

export interface AuditConstraints {
  primaryConstraint: ConstraintType;
  redLines: string[];
}

export interface EvidenceUpload {
  id: string;
  type: 'policy_pdf' | 'invoice' | 'broker_terms' | 'union_agreement' | 'other';
  fileName: string;
  documentId: string;
  uploadedAt: Date;
}

// Audit Results (computed after completion)
export interface AuditResults {
  // Executive summary
  totalAnnualOverhead: number;
  avoidableFeeDrag: number;
  complianceGapsCount: number;
  topMoves: AuditMove[];

  // Cost anatomy
  pensionCost: number;
  feeDrag: number;
  insuranceCost: number;
  adminCost: number;
  moneyLeaks: MoneyLeak[];

  // Flexibility score
  terminationFriction: 'low' | 'medium' | 'high';
  policyAgility: 'low' | 'medium' | 'high';
  hiringFriction: 'low' | 'medium' | 'high';

  // Employee upside
  medianRetirementCurrent: number;
  medianRetirementUnbound: number;
  benefitClarityScore: number;
  optionalityScore: number;

  // Gaps
  gaps: AuditGap[];
}

export interface AuditMove {
  id: string;
  title: string;
  description: string;
  savingsEstimate: number;
  effort: 'low' | 'medium' | 'high';
}

export interface MoneyLeak {
  id: string;
  source: 'broker' | 'fund_fees' | 'duplicate_cover' | 'admin' | 'other';
  description: string;
  amount: number;
}

export interface AuditGap {
  id: string;
  title: string;
  whyItMatters: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  fixSuggestion: string;
  planModuleId?: string; // Links to plan module that fixes it
}

// =============================================================================
// PLAN VERSION
// =============================================================================

export type PlanStatus = 'draft' | 'review' | 'published' | 'superseded';
export type FundSelectionMode = 'default_portfolio' | 'choose_from_list' | 'employee_picks';
export type EquivalenceStatus = 'green' | 'amber' | 'red';

export interface PlanVersion extends VersionedObject {
  companyId: string;
  auditReportId: string;
  name: string;
  status: PlanStatus;
  effectiveDate?: Date;

  // Modules
  pension: PensionModule;
  insurance: InsuranceModule;
  topUps: TopUpsModule;
  benefitsWallet: BenefitsWalletModule;
  compliance: ComplianceModule;

  // Preview/Summary
  costSummaryCurrent: number;
  costSummaryPlan: number;
  equivalenceStatus: EquivalenceStatus;
  employeeUpsideDelta: number;

  // Backlinks
  certificateVersionIds: string[];
  providerTaskIds: string[];
}

export interface PensionModule {
  baseContributionPercent: number;
  salaryExchangeEnabled: boolean;
  fundSelectionMode: FundSelectionMode;
  fundOptions?: FundOption[];
  feeModelSEK: number;
}

export interface FundOption {
  id: string;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  fee: number;
}

export interface InsuranceModule {
  life: {
    enabled: boolean;
    coverageLevel: string;
    provider?: string;
  };
  disability: {
    enabled: boolean;
    coverageLevel: string;
    provider?: string;
  };
  occupationalInjury: {
    enabled: boolean;
    coverageLevel: string;
    provider?: string;
  };
}

export interface TopUpsModule {
  parentalTopUp: {
    enabled: boolean;
    amount?: number;
    durationMonths?: number;
  };
  sicknessTopUp: {
    enabled: boolean;
    percent?: number;
    durationDays?: number;
  };
  noticePolicy: {
    standard: boolean;
    customMonths?: number;
  };
  severancePolicy: {
    enabled: boolean;
    monthsPerYear?: number;
  };
}

export interface BenefitsWalletModule {
  enabled: boolean;
  annualBudgetPerEmployee: number;
  categories: WalletCategory[];
}

export interface WalletCategory {
  id: string;
  name: 'wellness' | 'training' | 'equipment' | 'extra_pension' | 'other';
  budget: number;
  isTaxable: boolean;
}

export interface ComplianceModule {
  lasHandling: 'standard' | 'enhanced' | 'custom';
  documentationPackEnabled: boolean;
  monitoringFrequency: 'monthly' | 'quarterly' | 'annually';
}

// =============================================================================
// CERTIFICATE VERSION
// =============================================================================

export type RequirementStatus = 'meets' | 'exceeds' | 'missing';

export interface CertificateVersion extends VersionedObject {
  companyId: string;
  planVersionId: string;
  name: string;
  effectiveDate: Date;
  status: 'draft' | 'pending_review' | 'signed' | 'superseded';

  // Signatories
  companyApprover?: Signatory;
  unboundReviewer?: Signatory;
  externalCounsel?: Signatory;

  // Requirements mapping
  requirements: RequirementRow[];

  // Attachments
  attachmentIds: string[];

  // Backlinks
  auditReportId: string;
  documentIds: string[];
}

export interface Signatory {
  userId: string;
  name: string;
  title: string;
  signedAt?: Date;
  signature?: string;
}

export interface RequirementRow {
  id: string;
  requirement: string;
  baselineSource: 'cba' | 'internal_policy' | 'law';
  baselineLevel: string;
  unboundLevel: string;
  providerPolicyId?: string;
  status: RequirementStatus;
  evidenceLink?: string;
  planModuleRef?: string; // Links back to plan module
}

// =============================================================================
// POLICY DOCUMENT
// =============================================================================

export type DocumentType =
  | 'board_summary'
  | 'audit_report'
  | 'certificate'
  | 'employee_truth_sheet'
  | 'policy_addendum'
  | 'faq'
  | 'union_pack'
  | 'uploaded_evidence'
  | 'other';

export type DocumentFolder = 'board_pack' | 'employee_pack' | 'provider_pack' | 'legal_pack';

export interface PolicyDocument extends VersionedObject {
  companyId: string;
  type: DocumentType;
  folder: DocumentFolder;
  title: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;

  // Generation source (for generated docs)
  generatedFrom?: {
    auditReportId?: string;
    planVersionId?: string;
    certificateVersionId?: string;
  };

  // Backlinks
  relatedEmployeeIds: string[];
}

// =============================================================================
// PROVIDER POLICY
// =============================================================================

export type ProviderType = 'pension' | 'insurance' | 'payroll' | 'benefits' | 'other';

export interface ProviderPolicy {
  id: string;
  companyId: string;
  providerName: string;
  providerType: ProviderType;
  policyNumber?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  terms: string;
  documentIds: string[];
  createdAt: Date;
  updatedAt: Date;

  // Backlinks
  certificateRowIds: string[];
}

// =============================================================================
// EMPLOYEE
// =============================================================================

export type EmployeeStatus = 'invited' | 'activated' | 'enrolled' | 'opted_out';

export interface Employee {
  id: string;
  companyId: string;
  userId?: string; // Linked user account
  email: string;
  name: string;
  roleGroup: string;
  salary: number;
  startDate: Date;
  status: EmployeeStatus;
  invitedAt?: Date;
  activatedAt?: Date;
  enrolledAt?: Date;

  // Employee wallet data
  pensionBalance?: number;
  contributionsLastMonth?: number;
  walletAllocations?: WalletAllocation[];
  salaryExchangeEnabled?: boolean;
  salaryExchangeAmount?: number;
  selectedFundId?: string;

  // Backlinks
  enrollmentIds: string[];
  documentIds: string[];
  ticketIds: string[];
}

export interface WalletAllocation {
  categoryId: string;
  amount: number;
}

// =============================================================================
// ENROLLMENT
// =============================================================================

export type EnrollmentStep =
  | 'invited'
  | 'account_created'
  | 'info_reviewed'
  | 'choices_made'
  | 'documents_signed'
  | 'completed';

export interface Enrollment {
  id: string;
  employeeId: string;
  planVersionId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  currentStep: EnrollmentStep;
  timeline: EnrollmentEvent[];
  signedDocumentIds: string[];
  createdAt: Date;
  completedAt?: Date;

  // Backlinks
  taskIds: string[];
}

export interface EnrollmentEvent {
  id: string;
  step: EnrollmentStep;
  timestamp: Date;
  notes?: string;
}

// =============================================================================
// TASK
// =============================================================================

export type TaskStage = 'onboarding' | 'provider_setup' | 'enrollment' | 'certificate' | 'monitoring';
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'blocked' | 'completed';

export interface Task {
  id: string;
  companyId: string;
  title: string;
  description: string;
  stage: TaskStage;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  dueDate?: Date;

  // What happened / What to do
  history: TaskHistoryEntry[];
  nextSteps: string[];

  // Templates
  emailTemplate?: string;
  checklistTemplate?: string[];

  // Evidence
  evidenceDocumentIds: string[];

  // Spawned from
  spawnedFrom?: {
    type: 'audit_gap' | 'employee' | 'provider_policy' | 'certificate' | 'monitoring';
    id: string;
  };

  createdAt: Date;
  completedAt?: Date;
}

export interface TaskHistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  notes?: string;
}

// =============================================================================
// TICKET (Support)
// =============================================================================

export type TicketSeverity = 'low' | 'medium' | 'high' | 'critical';
export type TicketSource = 'company_workspace' | 'employee_wallet';
export type TicketResolutionCode = 'payroll' | 'pension' | 'insurance' | 'documentation' | 'other';

export interface Ticket {
  id: string;
  companyId: string;
  employeeId?: string;
  source: TicketSource;
  severity: TicketSeverity;
  title: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;

  // Thread
  messages: TicketMessage[];

  // Linked objects
  linkedEmployeeId?: string;
  linkedPlanModuleRef?: string;
  linkedProviderPolicyId?: string;

  // Resolution
  resolutionCode?: TicketResolutionCode;
  postMortemRequired?: boolean;
  postMortemNotes?: string;

  // SLA tracking
  createdAt: Date;
  firstResponseAt?: Date;
  resolvedAt?: Date;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  isInternal: boolean; // Internal notes vs customer-facing
}

// =============================================================================
// MONITORING
// =============================================================================

export interface MonitoringCheck {
  id: string;
  companyId: string;
  month: string; // YYYY-MM
  checks: {
    contributionsReceived: boolean;
    policiesActive: boolean;
    enrollmentsOk: boolean;
  };
  driftAlerts: DriftAlert[];
  upcomingRenewals: Renewal[];
  completedAt?: Date;
}

export interface DriftAlert {
  id: string;
  type: 'missing_coverage' | 'contribution_mismatch' | 'policy_expired';
  employeeId?: string;
  description: string;
  severity: 'warning' | 'error';
  createdAt: Date;
  resolvedAt?: Date;
  taskId?: string;
}

export interface Renewal {
  id: string;
  providerPolicyId: string;
  providerName: string;
  expiryDate: Date;
  daysUntilExpiry: number;
}

// =============================================================================
// INTEGRATIONS
// =============================================================================

export type IntegrationStatus = 'planned' | 'beta' | 'live' | 'deprecated';
export type IntegrationType = 'payroll' | 'pension' | 'e_signing' | 'accounting';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  status: IntegrationStatus;
  dataPulled: string[];
  dataPushed: string[];
  limitations: string[];
  companyConnections: IntegrationConnection[];
}

export interface IntegrationConnection {
  companyId: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt?: Date;
  lastSyncAt?: Date;
  errorMessage?: string;
}

// =============================================================================
// BILLING
// =============================================================================

export interface Billing {
  companyId: string;
  plan: 'starter' | 'professional' | 'enterprise';
  pricePerEmployeePerMonth: number;
  addOns: BillingAddOn[];
  seatCount: number;
  invoices: Invoice[];
}

export interface BillingAddOn {
  id: string;
  name: 'audit' | 'certificate' | 'monitoring' | 'benefits_wallet';
  enabled: boolean;
  price: number;
}

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  pdfUrl?: string;
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

// Company/Unbound notification types
export type NotificationType =
  | 'audit_complete'
  | 'plan_ready'
  | 'certificate_signed'
  | 'employee_enrolled'
  | 'task_assigned'
  | 'task_due'
  | 'ticket_created'
  | 'ticket_response'
  | 'drift_alert'
  | 'renewal_reminder'
  | 'contribution_received'
  // Rental system notification types
  | 'stay_requested'
  | 'stay_confirmed'
  | 'stay_reminder'
  | 'checklist_activated'
  | 'safety_issue'
  | 'new_issue'
  | 'supply_suggestion'
  | 'cleaning_required';

// Note: Notification interface is defined in the Rental House types section below

// =============================================================================
// RENTAL HOUSE OPERATING SYSTEM TYPES (Legacy)
// =============================================================================

// User roles for rental system
export type UserRole = 'owner' | 'cohost' | 'guest' | 'cleaner';

// Permissions for rental system
export type Permission =
  | 'manage_house'
  | 'manage_stays'
  | 'confirm_stays'
  | 'manage_members'
  | 'complete_checklists'
  | 'report_issues'
  | 'close_issues'
  | 'view_notes'
  | 'edit_notes'
  | 'manage_shopping'
  | 'suggest_shopping'
  | 'view_cleaning'
  | 'manage_cleaning';

// Role permissions mapping for rental system
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    'manage_house', 'manage_stays', 'confirm_stays', 'manage_members',
    'complete_checklists', 'report_issues', 'close_issues',
    'view_notes', 'edit_notes', 'manage_shopping', 'view_cleaning', 'manage_cleaning',
  ],
  cohost: [
    'manage_stays', 'confirm_stays', 'complete_checklists',
    'report_issues', 'close_issues', 'view_notes', 'edit_notes',
    'manage_shopping', 'view_cleaning', 'manage_cleaning',
  ],
  guest: [
    'complete_checklists', 'report_issues', 'suggest_shopping',
  ],
  cleaner: [
    'complete_checklists', 'report_issues', 'view_cleaning', 'manage_cleaning',
  ],
};

// Member in the rental system
export interface Member {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}

// Property/Family Group
export interface PropertyGroup {
  id: string;
  name: string;
  members: Member[];
  houses: string[];
  createdAt: Date;
  inviteCode?: string;
}

export type FamilyGroup = PropertyGroup;

// Room types
export type RoomType = 'bedroom' | 'guest_room' | 'living_room' | 'storage' | 'bathroom' | 'kitchen' | 'office' | 'other';

// Room in a house
export interface Room {
  id: string;
  houseId: string;
  name: string;
  type: RoomType;
  capacity: number;
  notes?: string;
}

// Emergency contact
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'emergency' | 'owner' | 'neighbor' | 'other';
}

// Safety info for a house
export interface SafetyInfo {
  emergencyContacts: EmergencyContact[];
  fireExtinguisherLocation: string;
  waterShutoff: string;
  electricMainSwitch: string;
  gasShutoff?: string;
  additionalInfo?: string;
}

// Checklist item
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  checkedBy?: string;
  checkedAt?: Date;
}

// Rules history entry
export interface RulesHistoryEntry {
  id: string;
  version: number;
  rules: string[];
  createdAt: Date;
  createdBy: string;
}

// House/Property
export interface House {
  id: string;
  familyGroupId: string;
  name: string;
  address?: string;
  nickname?: string;
  photos: string[];
  rules: string[];
  rulesVersion: number;
  rulesHistory?: RulesHistoryEntry[];
  rooms: Room[];
  defaultArrivalChecklist: ChecklistItem[];
  defaultDepartureChecklist: ChecklistItem[];
  defaultCleaningChecklist: ChecklistItem[];
  safetyInfo?: SafetyInfo;
  createdAt: Date;
}

// Stay status
export type StayStatus = 'requested' | 'planned' | 'confirmed' | 'active' | 'completed' | 'cancelled';

// Room assignment
export interface RoomAssignment {
  roomId: string;
  memberIds: string[];
  notes?: string;
}

// Rules acknowledgment
export interface RulesAcknowledgment {
  memberId: string;
  rulesVersion: number;
  acknowledgedAt: Date;
}

// Stay summary after completion
export interface StaySummary {
  completedArrivalTasks: number;
  totalArrivalTasks: number;
  completedDepartureTasks: number;
  totalDepartureTasks: number;
  issuesReported: string[];
  notes: string;
  generatedAt: Date;
}

// Stay at a property
export interface Stay {
  id: string;
  houseId: string;
  startDate: Date;
  endDate: Date;
  attendees: string[];
  guestEmail?: string;
  roomAssignments: RoomAssignment[];
  arrivalNotes?: string;
  arrivalChecklist: ChecklistItem[];
  departureChecklist: ChecklistItem[];
  arrivalChecklistActive: boolean;
  departureChecklistActive: boolean;
  status: StayStatus;
  rulesAcknowledgments: RulesAcknowledgment[];
  createdBy: string;
  createdAt: Date;
  confirmedBy?: string;
  confirmedAt?: Date;
  summary?: StaySummary;
  color?: string;
}

// Cleaning task status
export type CleaningTaskStatus = 'pending' | 'in_progress' | 'completed';

// Cleaning task
export interface CleaningTask {
  id: string;
  houseId: string;
  stayId?: string;
  assignedTo?: string;
  checklist: ChecklistItem[];
  status: CleaningTaskStatus;
  issuesFound: string[];
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

// Board post for internal notes
export interface BoardPost {
  id: string;
  houseId: string;
  authorId: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Shopping item priority
export type ItemPriority = 'urgent' | 'high' | 'normal' | 'low';

// Shopping item category
export type ItemCategory = 'toiletries' | 'cleaning' | 'food' | 'maintenance' | 'other';

// Shopping item status
export type ItemStatus = 'standard' | 'suggested' | 'approved' | 'rejected' | 'bought';

// Shopping item
export interface ShoppingItem {
  id: string;
  houseId: string;
  name: string;
  quantity: number;
  priority: ItemPriority;
  category: ItemCategory;
  addedBy: string;
  status: ItemStatus;
  isLowStock?: boolean;
  assignedTo?: string;
  createdAt: Date;
  boughtBy?: string;
  boughtAt?: Date;
}

// Issue type
export type IssueType = 'maintenance' | 'damage' | 'safety';

// Issue severity
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

// Issue status
export type IssueStatus = 'open' | 'planned' | 'in_progress' | 'fixed';

// Issue
export interface Issue {
  id: string;
  houseId: string;
  stayId?: string;
  roomId?: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  photos: string[];
  status: IssueStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Unified Notification interface (supports both systems)
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  houseId?: string;
  stayId?: string;
  issueId?: string;
  recipientRole?: UserRole;
  recipientUserId?: string;
  companyId?: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Guest onboarding state
export interface GuestOnboarding {
  id: string;
  stayId: string;
  step: 'welcome' | 'rules' | 'rooms' | 'safety' | 'checklist' | 'complete';
  rulesAcknowledged: boolean;
  safetyInfoViewed: boolean;
  checklistStarted: boolean;
  createdAt: Date;
  completedAt?: Date;
}

// =============================================================================
// APP STATE
// =============================================================================

// Current state for the app (baseline, plan drafted, certificate issued, live pilot)
export type CompanyState = 'baseline_only' | 'plan_drafted' | 'certificate_issued' | 'live_pilot';

export interface AppState {
  // Current context
  currentUser: User | null;
  currentCompanyId: string | null;
  currentEmployeeId: string | null; // For employee wallet view
  currentWorkspace: 'company' | 'employee';

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

  // Supporting entities
  monitoringChecks: MonitoringCheck[];
  integrations: Integration[];
  billing: Billing[];

  // UI state
  isLoading: boolean;
  notifications: Notification[];
}

// =============================================================================
// COMPANY PERMISSIONS (Unbound Platform)
// =============================================================================

export type CompanyPermission =
  // Company management
  | 'manage_company'
  | 'view_company'
  | 'invite_stakeholders'

  // Audit
  | 'create_audit'
  | 'edit_audit'
  | 'view_audit'
  | 'share_audit'

  // Plan
  | 'create_plan'
  | 'edit_plan'
  | 'view_plan'
  | 'publish_plan'

  // Certificate
  | 'create_certificate'
  | 'sign_certificate'
  | 'view_certificate'

  // Employees
  | 'manage_employees'
  | 'view_employees'
  | 'invite_employees'

  // Operations
  | 'manage_tasks'
  | 'view_tasks'

  // Support
  | 'manage_tickets'
  | 'view_tickets'

  // Documents
  | 'upload_documents'
  | 'view_documents'
  | 'generate_documents'

  // Settings
  | 'manage_settings'
  | 'manage_billing'
  | 'manage_integrations';

export const COMPANY_ROLE_PERMISSIONS: Record<CompanyRole, CompanyPermission[]> = {
  ceo: [
    'manage_company', 'view_company', 'invite_stakeholders',
    'create_audit', 'edit_audit', 'view_audit', 'share_audit',
    'create_plan', 'edit_plan', 'view_plan', 'publish_plan',
    'create_certificate', 'sign_certificate', 'view_certificate',
    'manage_employees', 'view_employees', 'invite_employees',
    'manage_tasks', 'view_tasks',
    'manage_tickets', 'view_tickets',
    'upload_documents', 'view_documents', 'generate_documents',
    'manage_settings', 'manage_billing', 'manage_integrations',
  ],
  cfo: [
    'view_company', 'invite_stakeholders',
    'create_audit', 'edit_audit', 'view_audit', 'share_audit',
    'create_plan', 'edit_plan', 'view_plan',
    'view_certificate', 'sign_certificate',
    'view_employees',
    'view_tasks',
    'view_tickets',
    'upload_documents', 'view_documents', 'generate_documents',
    'manage_billing',
  ],
  hr: [
    'view_company',
    'edit_audit', 'view_audit',
    'edit_plan', 'view_plan',
    'view_certificate',
    'manage_employees', 'view_employees', 'invite_employees',
    'manage_tasks', 'view_tasks',
    'manage_tickets', 'view_tickets',
    'upload_documents', 'view_documents',
  ],
  ops: [
    'view_company',
    'view_audit',
    'view_plan',
    'view_certificate',
    'view_employees',
    'manage_tasks', 'view_tasks',
    'manage_tickets', 'view_tickets',
    'view_documents',
    'manage_integrations',
  ],
  board_observer: [
    'view_company',
    'view_audit', 'share_audit',
    'view_plan',
    'view_certificate',
    'view_documents',
  ],
};

// =============================================================================
// BACKLINK UTILITIES
// =============================================================================

export interface RelatedChip {
  type: GlobalObjectType;
  id: string;
  label: string;
  href: string;
  version?: number;
}

// Helper to get display name for object type
export const OBJECT_TYPE_LABELS: Record<GlobalObjectType, string> = {
  company: 'Company',
  audit_report: 'Audit',
  plan_version: 'Plan',
  certificate_version: 'Certificate',
  policy_document: 'Document',
  provider_policy: 'Provider Policy',
  employee: 'Employee',
  enrollment: 'Enrollment',
  task: 'Task',
  ticket: 'Ticket',
};
