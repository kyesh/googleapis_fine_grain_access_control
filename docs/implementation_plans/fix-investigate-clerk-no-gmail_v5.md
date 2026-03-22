# Handling Waitlist Invites Pending Google OAuth (v5)

## Goal Description
When waitlist users log in or when users sign in iteratively, they may completely bypass the Google OAuth consent screens, leaving them without the required Gmail scopes (specifically `gmail.modify`). Taking the user to the Clerk Account Settings modal via `clerk.openUserProfile()` is confusing since they have to manually navigate to "Connected accounts" and click "Connect". 
We want a prominent, clear "Sign in with Google" button on the dashboard that directly programmatically triggers the `oauth_google` flow using the Clerk SDK. 

## Proposed Changes

### 1. Identify Existing Scopes

#### [MODIFY] src/app/dashboard/page.tsx
- In the React Server Component, check the `user.externalAccounts` array for the `oauth_google` account and its `approvedScopes`.
- Check for `https://www.googleapis.com/auth/gmail.modify` to set `hasCompleteGoogleAccess`.
- If false, render `<ConnectGoogleWarning />`.

### 2. Update Dashboard UI to Enforce Direct OAuth Connection

#### [MODIFY] src/app/dashboard/ConnectGoogleWarning.tsx
- Use the `useUser()` hook from Clerk.
- Create a `handleConnect` function that invokes `user.createExternalAccount({ strategy: "oauth_google", redirectUrl: "/dashboard" })`.
- If `response.verification?.externalVerificationRedirectURL` exists, set `window.location.href` to it.
- Display a clear "Sign in with Google" button instead of jumping into account settings.

#### [MODIFY] src/app/dashboard/KeyControls.tsx
- Add `hasCompleteGoogleAccess?: boolean` to the `AccessibleEmail` interface.
- Disable the checkbox for their own email if `hasCompleteGoogleAccess` is false, avoiding the word "proxy" in the tooltip (e.g., "Google Account not securely linked. Please connect it.").

## Verification Plan
See `docs/QA_Acceptance_Test/08_missing_google_scopes.md`.
