# E2E Test Infra: muryen-front

## Test Philosophy
- Opaque-box, requirement-driven testing.
- Verify application load, clean rendering without bottom-corner error overlays, correct layout rendering (AppShell, Navigation, Header, Footer), theme switching, authentication flows, and page route rendering.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Interaction + Real-World Scenario Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Clean Layout & No Error Overlays | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | Navigation & Bottom-Left Anchor | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 3 | Theme Switching & Context Provider | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 4 | Authentication & Session Handling | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 5 | Dynamic Routes & Page Rendering | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |

## Test Architecture
- **Framework**: Jest with React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`).
- **Runner**: `npm test -- --ci` and targeted test suites in `__tests__/`.
- **Pass/Fail Semantics**: All test suites must pass with exit code 0 and zero unhandled errors/warnings.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Application Load & Route Navigation | F1, F2, F5 | Medium |
| 2 | Dark/Light Theme Toggle & Persistence | F1, F3 | Low |
| 3 | Login & Auth Session State Handling | F4, F5 | Medium |
| 4 | Navigation Expansion & Responsive Layout | F1, F2 | Medium |
| 5 | Interactive Features (Equipment, Sparring, Record Graph) | F3, F5 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total ≥ 25)
- Tier 2: ≥5 boundary & edge cases per feature (Total ≥ 25)
- Tier 3: Pairwise combinations of layout, theme, auth, and routing
- Tier 4: Realistic end-to-end user workflows
