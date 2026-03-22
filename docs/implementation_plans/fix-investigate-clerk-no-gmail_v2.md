# Handling Waitlist Invites Pending Google OAuth

## Goal Description
When a user is invited from the waitlist, they can accept the invite and sign in (e.g., via magic link or password) without undergoing the Google OAuth flow. However, our dashboard eagerly assumes that their own email is always "accessible" and displays it with a green "You" label, even though we have not secured the necessary Google scopes (`gmail.readonly`, `gmail.send`, etc.) to actually proxy requests for it. 

We need to check if the user has a connected Google account and visually differentiate their own email's access status if they do not.

## Proposed Changes

### Dashboard Component (`src/app/dashboard/page.tsx`)

#### 1. Checking OAuth Status
- Update the server component to inspect `user.externalAccounts` to determine if `oauth_google` is connected:
  ```tsx
  const hasGoogleAccount = user.externalAccounts.some(acc => acc.provider === 'oauth_google');
  ```

#### 2. Accessible Emails Representation
- Modify the `accessibleEmails` array:
  - If `hasGoogleAccount` is false, we pass an additional flag `hasGoogleAccess: false` to the `ownEmail` entry.

#### 3. Update the UI rendering of their `ownEmail`
- Instead of showing it as a green, active element, if `hasGoogleAccount` is false, we will display it with a warning style (amber/yellow).
- We will add a banner or helpful text above or next to it: "⚠️ Action Required: You must link your Google account to enable API proxying for your email. Click your profile picture -> Manage account -> Connect Google."

#### 4. Key Creation Safeguard
- In `KeyControls.tsx`, prevent users from selecting their `ownEmail` if `hasGoogleAccount` is false. They must connect it first.

## Verification Plan
1. Create a user without a Google account linked (e.g., by simulating a waitlist invitation or signing up via Email/Password).
2. Log in and navigate to the dashboard.
3. Observe that their own email is flagged in amber/yellow indicating Google OAuth is missing.
4. Verify that trying to create a proxy key for their email is disabled or clearly warns them.
5. Click the user profile, connect the Google account, refresh, and observe the UI returns to the normal (green) state.
