# Architecture and role competency mapping

## Implemented website

Browser → static GitHub Pages assets → React application. Hash navigation retains section links across reloads. Local typed records feed the diagram and explorers. Only governance reviews persist, under the versioned `studio-review-v1` localStorage key. Reads validate known control names and statuses; malformed storage falls back safely. Exports are generated locally with Blob URLs. There are no API keys, remote databases or analytics.

## Illustrative enterprise blueprint

A web experience reaches an API gateway through HTTPS. The gateway validates identity-provider tokens; each service remains responsible for operation-level authorization. Java owns transactional requests, Go isolates Oracle integrations, and Python owns document metadata. MySQL and MongoDB have explicit domain ownership. The deployment-oriented view adds private cloud compute, automated delivery and telemetry.

Boundary assumptions: the portal and edge are externally reachable; services and data reside on private networks. Gateway-to-service and service-to-store traffic is encrypted. OIDC arrows show identity dependencies, not a complete authorization sequence. Shared platform arrows are representative, not exhaustive. No infrastructure is provisioned by this project.

## Business capability traceability

| Capability / requirement | Design response | Evidence / proposed validation |
| --- | --- | --- |
| Self-service requests | Accessible React portal and request service | Semantic forms, browser checks and contract tests before real integration |
| Incremental modernization | Gateway and isolated Oracle adapter | ADR-001, consumer compatibility and rollback rehearsal |
| Reliable request data | MySQL transaction ownership | ADR-002, reconciliation and restore exercises |
| Evolving submissions | Versioned document metadata | Schema validation and retention deletion tests |
| Governed change | CI gates and decision register | ADR-003, tests, build and generated dependency inventory |
| Service continuity | Telemetry, SLO ownership and recovery roadmap | Proposed RTO ≤ 4h and RPO ≤ 1h, validated by drills |

## Supplied role competencies demonstrated

- Architecture and communication: logical/deployment-oriented diagrams, component responsibilities and documented trade-offs.
- Technology evaluation: language, database, platform and modeling alternatives in the technology explorer.
- Governance: decisions, review states, standards, security and dependency inventory.
- Lifecycle management: inventory, debt prioritization, modernization, measurement and retirement criteria.
- Operational thinking: incident ownership, timeout budgets, recovery testing and observability.

## Design decisions for this website

Use local data instead of a backend because the portfolio must run without paid services or secrets. Use hash navigation to support GitHub Pages deep links. Use React Flow for accessible interactive modeling; provide a separate component list so diagram navigation is not the only route to information. Use native details/select controls for progressive disclosure and filtering. Keep governance records browser-local and explicitly label their scope.

## Assurance before a real deployment

The sample controls are a review aid, not automated checks. Production adoption would require stakeholder-approved data classification, threat modeling, service contracts, measurable SLOs, cost estimates, actual infrastructure boundaries, accessibility audit and evidence for each review status.
