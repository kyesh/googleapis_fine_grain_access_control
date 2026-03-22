# Handling Clerk Accounts without Linked Gmail

## Goal Description
The issue occurs because Clerk allows users to sign up via Email/Password (or other OAuth providers) instead of exclusively through Google OAuth. When this happens, the user's Clerk profile lacks an `oauth_google` external account, meaning we cannot retrieve a Google OAuth token for them to proxy requests to their own Gmail inbox. Currently, if they try to proxy requests to their own email, it fails with a 403 error, but the dashboard functions as normal, leading to confusion.

## Proposed Changes

### Dashboard Component

#### [MODIFY] src/app/dashboard/page.tsx
- Check if the current user has a linked Google account: `const hasGoogleAccount = user.externalAccounts.some(acc => acc.provider === 'oauth_google' || acc.provider === 'google');`
- If `!hasGoogleAccount`, display a prominent warning banner at the top of the dashboard.
- The banner should inform the user: "Action Required: You have not linked a Google Account. Please click your profile picture in the top right, select 'Manage account', and connect your Google account to enable proxying for your own email."
- We will conditionally render the own email section in `Accessible Gmail Accounts` to highlight that it is pending Google connection or we will just rely on the banner.

### Code Adjustments

#### [MODIFY] src/app/dashboard/page.tsx
- Add a banner at the top of the `<main>` content area showing the warning.

## Verification Plan

### Manual Verification
1. I will ask you (the user) to deploy this branch or run it locally.
2. Open an incognito window and sign up for a new account using Email/Password instead of Google OAuth.
3. Log into the dashboard.
4. Verify that the "Action Required" banner is displayed prominently.
5. Click the User Profile button in the top right, go to "Manage account", and connect a Google account.
6. Refresh the dashboard and verify the warning disappears.
7. Verify that creating keys and proxying works after linking the account.
