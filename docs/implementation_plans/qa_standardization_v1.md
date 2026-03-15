# QA Acceptance Test Standardization & Automation Plan

## Goal Description
Reorganize and standardize the QA tests in `docs/QA_Acceptance_Test/`. Create a private email mapping file in `.gitignore` to prevent leaking private email addresses (`user_b@example.com` and `user_a@example.com`) in public files, replacing them with generics. Build reusable test scripts for the simulated agent to run test scenarios dynamically. Finally, run the QA suite to validate.

## Proposed Changes

### Configuration & Security
#### [NEW] .qa_test_emails.json
Private config loaded by scripts. Contains actual email mapping:
```json
{
  "USER_A_EMAIL": "user_a@example.com",
  "USER_B_EMAIL": "user_b@example.com"
}
```

#### [MODIFY] .gitignore
Add `.qa_test_emails.json` to ignore list.

### Documentation Standardization
Clean up and ensure consistent formatting for all tests in:
#### [MODIFY] docs/QA_Acceptance_Test/01_signup_and_credential_workflow.md
#### [MODIFY] docs/QA_Acceptance_Test/02_gmail_fine_grain_control.md
#### [MODIFY] docs/QA_Acceptance_Test/03_multi_email_multi_key.md
#### [MODIFY] docs/QA_Acceptance_Test/04_email_delegation.md
#### [MODIFY] docs/QA_Acceptance_Test/05_gmail_label_based_access.md

We will also update `docs/user_guide.md` and old implementation plans that accidentally leaked the emails, replacing them with generic `owner@example.com` / `delegate@example.com` or `user-a@example.com`.

### Reusable QA Agent Scripts
Create automated/reusable agent scripts in `scripts/qa/` (or `scripts/qa_agent/`):
#### [NEW] scripts/qa_agent/config.js
Loads `.qa_test_emails.json` (or falls back to generics if not found) and environment variables (`PROXY_API_KEY`, etc.).

#### [NEW] scripts/qa_agent/gmail_api.js
A wrapper around native `fetch` to simulate hitting the proxy standard endpoints with the stored `PROXY_API_KEY`. It provides functions like `listMessages(email)`, `getMessage(email, id)`, `trashMessage(email, id)`.

#### [NEW] scripts/qa_agent/run_scenario.js
Provides CLI commands or functions to quickly run a specific scenario (e.g. `node scripts/qa_agent/run_scenario.js --scenario=02_blacklist --email=USER_B_EMAIL`).

## Verification Plan

### Automated/Script Tests
We'll execute the newly written `qa_agent` scripts against the live dev env (after manual UI configuration as per tests) to verify they receive the expected proxy interventions (HTTP 403s on blocks, 200s on allowed). 

### Manual Verification
1. Open the local/test web app via UI (using browser subagent or instructing the user).
2. Follow steps in `01_signup_and_credential_workflow.md` to setup credentials.
3. Validate each step of `02` to `05` manually alongside the agent scripts.
