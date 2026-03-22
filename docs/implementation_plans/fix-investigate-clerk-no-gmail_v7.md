# Ensuring Disconnected Accounts are Handled (v7)

## Goal Description
Currently, when a user manually disconnects their Google account via the native Clerk profile UI, the `ExternalAccountResource` remains in the `user.externalAccounts` array but with its `verification.status` set to "unverified". 
Because our dashboard code (`src/app/dashboard/page.tsx`) only checks whether the array contains an object with `provider === 'google'` and if it has the `gmail.modify` scope in its `approvedScopes`, it incorrectly evaluates to `true` (green state) even though the account is disconnected.

We need to update the server component to explicitly evaluate `verification?.status === 'verified'`.

## Proposed Changes

### 1. Dashboard State Validation
#### [MODIFY] src/app/dashboard/page.tsx
- Update the `.find` predicate for `googleAccount`:
```tsx
  const googleAccount = user.externalAccounts.find(acc => 
    (acc.provider === 'oauth_google' || acc.provider === 'google') &&
    acc.verification?.status === 'verified'
  );
```
- This ensures that if the user disconnects the account, `googleAccount` evaluates to `undefined`, correctly flipping the UI back to the yellow warning banner state.

## Verification Plan
See `docs/QA_Acceptance_Test/08_missing_google_scopes.md`.
Manual Test:
1. Log in. Connect Google with `gmail.modify`.
2. Dashboard is green.
3. Use Clerk UI to "Remove" the Google connection.
4. Refresh dashboard. It should show the yellow warning banner with the "Sign in with Google" button.
