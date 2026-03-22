# Surfacing Google OAuth for Waitlist Users

## Goal Description
When waitlist users log in, they completely bypass the "Sign up with Google" flow. Even if they later sign in with Google, Google may skip the consent screen if it remembers them, leaving them without the required Gmail scopes. We need a seamless way to surface the Google OAuth consent screen directly from the dashboard for users who have not linked their accounts or granted scopes.

## Proposed Changes

### 1. Identify Scopes vs. Connection

#### [MODIFY] src/app/dashboard/page.tsx
- Check the `user.externalAccounts` array to see if an `oauth_google` account exists.
- Specifically verify if `approvedScopes` contains the required scopes (e.g., `https://www.googleapis.com/auth/gmail.send`).
```tsx
  const googleAccount = user.externalAccounts.find(acc => acc.provider === 'oauth_google');
  // Need to verify standard required scopes. For example:
  const requiredScopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify'
  ];
  
  const hasRequiredScopes = googleAccount?.approvedScopes && 
    requiredScopes.every(scope => googleAccount.approvedScopes.includes(scope));
```

### 2. Connect Google Button (Client Component)

#### [NEW] src/app/dashboard/ConnectGoogleButton.tsx
- Create a client component that leverages the Clerk `useUser` hook.
- When clicked, it calls `user.createExternalAccount({ strategy: 'oauth_google', redirectUrl: '/dashboard' })`.
- This forcefully redirects the user to Google's consent screen, requesting the scopes configured in your Clerk Dashboard, and then returns them to the FGAC dashboard securely linked.

### 3. Update Dashboard Dashboard UI

#### [MODIFY] src/app/dashboard/page.tsx
- If `!googleAccount` or `!hasRequiredScopes`, we display an Amber/Yellow warning banner.
  - "⚠️ Action Required: You have not granted FGAC proxy access to your Gmail."
- We embed the new `<ConnectGoogleButton />` directly in that banner.
- Update the `AccessibleEmails` list logic to format the `ownEmail` as disabled/amber, passing `hasGoogleAccess: false` to `KeyControls` so they cannot mistakenly select their own email for API keys until it is linked.

#### [MODIFY] src/app/dashboard/KeyControls.tsx
- Add `hasGoogleAccess?: boolean` to the `AccessibleEmail` interface.
- Disable the checkbox for their own email if they lack Google access, adding a tooltip to explain why.

## Verification Plan
1. Log in using an email/password waitlist-style account.
2. Verify the Dashboard banner prompts to Connect Google.
3. Click "Connect Google". 
4. Complete the Google OAuth consent screen (observing that it explicitly asks for the scopes).
5. Verify redirection back to the Dashboard successfully removes the banner and enables the `ownEmail` checkbox.
