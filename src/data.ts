export const components = [
  {
    id: "web",
    name: "Experience portal",
    tech: "React · TypeScript",
    layer: "Presentation",
    purpose: "Accessible self-service requests and status tracking.",
    interfaces: "HTTPS / REST → API gateway",
    security:
      "CSP, output encoding, OIDC authorization code + PKCE. Never store service credentials in the browser.",
    tradeoff:
      "Static delivery reduces operations; authenticated APIs still require a separate backend.",
  },
  {
    id: "gateway",
    name: "API gateway",
    tech: "REST · OpenAPI",
    layer: "Integration",
    purpose:
      "Route requests, validate tokens, enforce quotas and version API contracts.",
    interfaces: "HTTPS → Java, Go and Python services",
    security:
      "Validate issuer, audience and expiry; apply rate limits and request size limits.",
    tradeoff:
      "Central policy enforcement simplifies clients but adds a shared availability dependency.",
  },
  {
    id: "iam",
    name: "Identity provider",
    tech: "OIDC · RBAC",
    layer: "Security",
    purpose: "Federated identity and role-based authorization.",
    interfaces: "OIDC discovery / JWKS → gateway",
    security: "MFA for privileged access; short-lived tokens and key rotation.",
    tradeoff:
      "Federation removes local passwords but requires a tested identity outage plan.",
  },
  {
    id: "java",
    name: "Request service",
    tech: "Java · Spring",
    layer: "Application",
    purpose:
      "Own request validation, workflow transitions and transactional records.",
    interfaces: "REST /requests → MySQL",
    security:
      "Service-level authorization, parameterized queries, scoped database identity.",
    tradeoff:
      "Strong transaction boundaries; workflow changes require coordinated schema migrations.",
  },
  {
    id: "go",
    name: "Integration service",
    tech: "Go · REST adapters",
    layer: "Application",
    purpose:
      "Isolate legacy interfaces and translate canonical service contracts.",
    interfaces: "REST /integrations → Oracle adapter",
    security:
      "mTLS, credential rotation, allowlisted egress and redacted logs.",
    tradeoff:
      "Adapters protect domain models but add mapping and operational overhead.",
  },
  {
    id: "python",
    name: "Document service",
    tech: "Python · FastAPI",
    layer: "Application",
    purpose:
      "Validate document metadata and support flexible submission schemas.",
    interfaces: "REST /documents → MongoDB",
    security:
      "Schema validation, tenant scoping and field-level data minimization.",
    tradeoff:
      "Flexible records accelerate new forms but require deliberate validation and retention.",
  },
  {
    id: "mysql",
    name: "Transactional store",
    tech: "MySQL",
    layer: "Data",
    purpose: "Persist normalized request records with referential integrity.",
    interfaces: "Private SQL endpoint; owned by request service",
    security:
      "TLS, encryption at rest, least-privilege roles, tested point-in-time recovery.",
    tradeoff:
      "Reliable ACID transactions; horizontal write scaling needs additional design.",
  },
  {
    id: "oracle",
    name: "Enterprise system",
    tech: "Oracle",
    layer: "Data",
    purpose:
      "Preserve the legacy system of record during incremental migration.",
    interfaces: "Private SQL via integration service",
    security:
      "Read-limited adapter accounts, audited access, restricted network routes.",
    tradeoff:
      "Avoids a risky cutover; licensing and legacy coupling remain until retirement.",
  },
  {
    id: "mongo",
    name: "Document store",
    tech: "MongoDB",
    layer: "Data",
    purpose: "Store evolving document metadata with explicit schema versions.",
    interfaces: "Private document API; owned by document service",
    security:
      "Collection permissions, encryption, retention policies and restore drills.",
    tradeoff:
      "Flexible data model; cross-document transactions and indexes require care.",
  },
  {
    id: "platform",
    name: "Cloud platform",
    tech: "Containers · Private network",
    layer: "Platform",
    purpose:
      "Run isolated workloads across availability zones with controlled ingress.",
    interfaces: "Load balancer → private compute → private data subnets",
    security:
      "Workload identities, secrets manager, network policies and signed images.",
    tradeoff:
      "Managed containers reduce host toil; orchestration complexity must be justified.",
  },
  {
    id: "delivery",
    name: "Delivery pipeline",
    tech: "GitHub Actions · SBOM",
    layer: "Platform",
    purpose:
      "Build, test, scan and promote immutable artifacts with change evidence.",
    interfaces: "Git → CI → artifact registry → deployment",
    security:
      "OIDC federation, protected environments, dependency inventory and vulnerability triage.",
    tradeoff:
      "Automated gates improve consistency but need maintained policies and rollback paths.",
  },
  {
    id: "observe",
    name: "Observability",
    tech: "OpenTelemetry · SLOs",
    layer: "Platform",
    purpose:
      "Correlate metrics, logs and traces with service-level objectives.",
    interfaces: "OTLP → telemetry collector; alerts → incident process",
    security:
      "Redact personal data; restrict log access and set retention limits.",
    tradeoff:
      "Better diagnosis comes with ingestion cost and telemetry governance.",
  },
];
export const adrs = [
  {
    id: "ADR-001",
    title: "Contract-first API integration",
    status: "Accepted",
    date: "2026-09-08",
    context:
      "Multiple channels need a stable interface while the legacy system is replaced.",
    drivers:
      "Independent releases, predictable failures and backward compatibility.",
    options:
      "Direct database sharing; synchronous REST gateway; asynchronous events.",
    decision:
      "Use versioned REST contracts behind a gateway. Reserve asynchronous events for eventual-consistency workflows.",
    positive:
      "Clear ownership and incremental migration without exposing legacy schemas.",
    negative:
      "Gateway availability becomes critical; synchronous calls need latency budgets.",
    operations:
      "Timeouts, bounded retries with jitter, idempotency keys and circuit breakers.",
    security:
      "Validate tokens at the gateway and authorize each operation in the service.",
    systems: "API gateway · Integration service",
  },
  {
    id: "ADR-002",
    title: "Choose storage by consistency needs",
    status: "Accepted",
    date: "2026-09-15",
    context:
      "Requests require transactional integrity while document metadata evolves independently.",
    drivers: "Data ownership, auditability, schema evolution and recovery.",
    options:
      "One relational store; one document store; bounded-context persistence.",
    decision:
      "Use MySQL for requests, MongoDB for document metadata, and retain Oracle behind an adapter during migration.",
    positive: "Storage semantics match each domain and ownership is explicit.",
    negative:
      "Multiple engines increase backup, monitoring and skill requirements.",
    operations:
      "Test independent restores and reconciliation; avoid distributed transactions.",
    security:
      "Private endpoints, separate identities, encryption and retention schedules.",
    systems: "MySQL · MongoDB · Oracle",
  },
  {
    id: "ADR-003",
    title: "Standardize delivery and telemetry",
    status: "Proposed",
    date: "2026-10-02",
    context:
      "Inconsistent release practices and disconnected logs make incidents difficult to diagnose.",
    drivers: "Repeatability, traceability, recovery and operational ownership.",
    options:
      "Manual deployment; shared CI templates; fully managed application platform.",
    decision:
      "Adopt reusable CI gates and OpenTelemetry instrumentation; evaluate managed containers before Kubernetes.",
    positive: "Consistent evidence and correlated traces across services.",
    negative: "Initial instrumentation work and ongoing telemetry costs.",
    operations:
      "Define SLOs, rollback runbooks and on-call ownership before promotion.",
    security:
      "Generate SBOMs, scan dependencies, use short-lived workload identity.",
    systems: "Cloud platform · Delivery pipeline · Observability",
  },
];
export const initiatives = [
  {
    name: "Map capabilities & dependencies",
    phase: "Assess",
    priority: "High",
    domain: "Application",
    value: "Connect service demand to system ownership.",
    complexity: "Low",
    risk: "Incomplete inventory",
    dependencies: "Business stakeholder interviews",
    measure: "Every critical capability has an owner and mapped system",
  },
  {
    name: "Baseline security & lifecycle",
    phase: "Assess",
    priority: "High",
    domain: "Security",
    value: "Expose unsupported dependencies and sensitive data.",
    complexity: "Medium",
    risk: "Unknown data flows",
    dependencies: "Application inventory",
    measure:
      "All critical applications have lifecycle and data classifications",
  },
  {
    name: "Introduce the API boundary",
    phase: "Modernize",
    priority: "High",
    domain: "Integration",
    value: "Decouple channels from legacy implementation.",
    complexity: "High",
    risk: "Breaking consumer contracts",
    dependencies: "Capability map and ADR-001",
    measure: "Contract tests pass for all supported consumer versions",
  },
  {
    name: "Automate release assurance",
    phase: "Modernize",
    priority: "Medium",
    domain: "Platform",
    value: "Make releases repeatable and auditable.",
    complexity: "Medium",
    risk: "Pipeline permission creep",
    dependencies: "Baseline standards and ADR-003",
    measure: "Every release has tests, SBOM and a rollback artifact",
  },
  {
    name: "Exercise resilience & recovery",
    phase: "Optimize",
    priority: "High",
    domain: "Platform",
    value: "Validate service continuity under failure.",
    complexity: "High",
    risk: "Untested recovery assumptions",
    dependencies: "Telemetry and data ownership",
    measure: "Demonstrate proposed RTO ≤ 4h and RPO ≤ 1h in a restore drill",
  },
  {
    name: "Retire redundant integrations",
    phase: "Optimize",
    priority: "Medium",
    domain: "Integration",
    value: "Reduce duplicate maintenance and technical debt.",
    complexity: "Medium",
    risk: "Hidden downstream consumers",
    dependencies: "API migration and consumer sign-off",
    measure: "No traffic for 30 days before approved decommission",
  },
];
export const controls = [
  "Business alignment & requirements traceability",
  "Reference architecture & standards",
  "Security & privacy assessment",
  "Integration contracts & failure handling",
  "Availability, scalability & performance",
  "Data ownership, retention & recovery",
  "Operational readiness & IT service management",
  "Technical debt & lifecycle risks",
  "Accessibility & usability",
  "Dependency inventory & SBOM",
  "Logging, monitoring & auditability",
  "Architecture documentation & decisions",
];
export const technologies = [
  [
    "Languages",
    "Java",
    "Transactional domain services",
    "Mature ecosystem and strong typing",
    "Runtime footprint and framework complexity",
  ],
  [
    "Languages",
    "Go",
    "Concurrent integration adapters",
    "Small deployable binaries",
    "Less expressive domain abstractions",
  ],
  [
    "Languages",
    "Python",
    "Document processing and automation",
    "Fast iteration and rich libraries",
    "Runtime typing and CPU-bound concurrency",
  ],
  [
    "Frontend",
    "React / TypeScript",
    "Typed component-driven interfaces",
    "Reusable accessible components",
    "Client bundle and state complexity",
  ],
  [
    "Frontend",
    "JavaScript / HTML / CSS",
    "Browser behavior and semantic presentation",
    "Native web interoperability",
    "Browser compatibility and accessibility discipline",
  ],
  [
    "Data",
    "MySQL",
    "Relational request transactions",
    "ACID and relational integrity",
    "Schema migration and write scaling",
  ],
  [
    "Data",
    "MongoDB",
    "Variable document metadata",
    "Flexible document models",
    "Index and schema governance",
  ],
  [
    "Data",
    "Oracle",
    "Existing enterprise system of record",
    "Mature enterprise features",
    "Licensing and specialist operations",
  ],
  [
    "Modeling",
    "UML / ArchiMate",
    "Sequence, deployment and capability models",
    "Shared stakeholder vocabulary",
    "Model maintenance effort",
  ],
  [
    "Platform",
    "Cloud / networking / containers",
    "Isolated compute, storage and network zones",
    "Elastic capacity and repeatability",
    "Cost, shared responsibility and lock-in",
  ],
  [
    "Integration",
    "REST / messaging",
    "Synchronous contracts and asynchronous events",
    "Decoupled service boundaries",
    "Retries, ordering and duplicate processing",
  ],
  [
    "Security",
    "IAM / encryption / secrets",
    "Protect identities and sensitive data",
    "Central policy and short-lived credentials",
    "Rotation and policy complexity",
  ],
  [
    "Delivery",
    "Git / GitHub Actions / testing",
    "Versioned delivery and quality gates",
    "Auditable repeatable builds",
    "Pipeline trust and maintenance",
  ],
  [
    "Governance",
    "ITIL / review / SBOM",
    "Service ownership and lifecycle assurance",
    "Evidence-based change and dependency tracking",
    "Process overhead without clear owners",
  ],
];
export const cases = [
  {
    title: "A better path from legacy to service",
    tag: "APPLICATION MODERNIZATION",
    challenge:
      "A tightly coupled request portal depends directly on an enterprise database.",
    solution:
      "Introduce an API boundary, route one capability at a time to a Java service, and preserve Oracle through a Go adapter.",
    tradeoff:
      "Temporary dual operations cost more, but avoid a single high-risk migration.",
    outcome:
      "Proposed validation: contract tests, reconciled records and rollback rehearsals before each migration wave.",
  },
  {
    title: "One contract. Many connected systems.",
    tag: "ENTERPRISE INTEGRATION",
    challenge:
      "Partner interfaces use inconsistent schemas and retry behavior.",
    solution:
      "Publish versioned OpenAPI contracts, canonical mappings, idempotency keys and bounded retries.",
    tradeoff:
      "A shared gateway creates operational dependency; adapters still need domain owners.",
    outcome:
      "Proposed validation: consumer compatibility tests and simulated downstream failures within a defined latency budget.",
  },
  {
    title: "Data that stays useful—and governed",
    tag: "DATA PLATFORM",
    challenge:
      "Transactional records and changing document metadata have different consistency and retention needs.",
    solution:
      "Separate domain-owned MySQL and MongoDB persistence; establish classification, retention and restore runbooks.",
    tradeoff:
      "Fit-for-purpose storage introduces multiple operating models and reconciliation work.",
    outcome:
      "Proposed validation: restore drills, retention deletion tests and data lineage reviews.",
  },
];
