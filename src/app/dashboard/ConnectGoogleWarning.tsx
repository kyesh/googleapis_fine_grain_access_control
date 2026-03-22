"use client";

import { useClerk } from "@clerk/nextjs";

export function ConnectGoogleWarning() {
  const clerk = useClerk();

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Action Required: Connect Google Account</h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>You have not granted FGAC access to your Gmail or you are missing required permissions. Please open your Account Settings and connect your Google account to enable API access.</p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => clerk.openUserProfile()}
            type="button"
            className="inline-flex items-center rounded-md bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-colors"
          >
            Open Account Settings
          </button>
        </div>
      </div>
    </div>
  );
}
