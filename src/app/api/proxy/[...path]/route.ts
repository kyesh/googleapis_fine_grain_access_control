import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, accessRules } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(request, await params);
}

async function handleProxyRequest(request: NextRequest, params: { path: string[] }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const proxyKey = authHeader.split(' ')[1];
    const fullPath = params.path.join('/');
    
    // 1. Authenticate Proxy Key
    const dbUser = await db.select().from(users).where(eq(users.proxyKey, proxyKey)).limit(1).then(res => res[0]);
    if (!dbUser) {
       return NextResponse.json({ error: 'Invalid Proxy Key' }, { status: 401 });
    }

    // 2. Fetch User Rules
    const userRules = await db.select().from(accessRules).where(eq(accessRules.userId, dbUser.id));

    // 3. Evaluate Send / Outbound Rules
    if (request.method === 'POST' && fullPath.includes('messages/send')) {
      const body = await request.clone().json().catch(() => ({}));
      
      let toAddress = null;
      if (body.raw) {
         try {
           const decoded = Buffer.from(body.raw, 'base64url').toString('utf8');
           const toMatch = decoded.match(/^To:\s*(.+)$/im);
           if (toMatch) {
             toAddress = toMatch[1].trim();
           }
         } catch {
           // Ignore decode errors
         }
      }

      if (toAddress) {
        const sendRules = userRules.filter(r => r.service === 'gmail' && r.actionType === 'send_whitelist');
        
        if (sendRules.length > 0) {
           let isWhitelisted = false;
           for (const rule of sendRules) {
             const regexStr = rule.regexPattern.replace(/\*/g, '.*');
             const regex = new RegExp(regexStr, 'i');
             if (regex.test(toAddress)) {
                isWhitelisted = true;
                break;
             }
           }
           if (!isWhitelisted) {
             return NextResponse.json({ 
               error: `Unauthorized email address. Please ask your user to add '${toAddress}' to the sending whitelist.` 
             }, { status: 403 });
           }
        } else {
           return NextResponse.json({ 
             error: `Unauthorized email address. Please ask your user to add '${toAddress}' to the sending whitelist. Default access is DENIED.` 
           }, { status: 403 });
        }
      }
    }

    // 4. Evaluate Deletion Rules
    if (request.method === 'DELETE') {
      if (fullPath.includes('messages/trash') || fullPath.includes('emptyTrash')) {
        return NextResponse.json({ 
          error: "Action Denied: Global safeguard prevents permanent deletion of all emails." 
        }, { status: 403 });
      }
    }

    // Phase 3: Fetch real Google access token from Clerk
    // Resolving clerkClient in Clerk v6
    const client = await clerkClient();
    
    const tokenResponse = await client.users.getUserOauthAccessToken(dbUser.clerkUserId, 'oauth_google');
    const realGoogleToken = tokenResponse.data[0]?.token;

    if (!realGoogleToken) {
       return NextResponse.json({ error: 'User has not linked a Google Account OR the token is expired.' }, { status: 403 });
    }

    // Forward the request to Google
    const googleUrl = `https://www.googleapis.com/${fullPath}${request.nextUrl.search}`;
    const headers = new Headers(request.headers);
    headers.set('Authorization', `Bearer ${realGoogleToken}`);
    headers.delete('host');
    
    let requestBody: ArrayBuffer | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      requestBody = await request.clone().arrayBuffer();
    }

    const googleResponse = await fetch(googleUrl, {
      method: request.method,
      headers,
      body: requestBody,
    });

    const returnBody = await googleResponse.text();
    const isJson = googleResponse.headers.get('content-type')?.includes('application/json');

    // 5. Evaluate Read / Inbound Rules
    if (request.method === 'GET' && fullPath.includes('messages') && isJson) {
      const readBlacklistRules = userRules.filter(r => r.service === 'gmail' && r.actionType === 'read_blacklist');
      
      if (readBlacklistRules.length > 0) {
        for (const rule of readBlacklistRules) {
           const regexStr = rule.regexPattern.replace(/\*/g, '.*');
           const regex = new RegExp(regexStr, 'i');
           if (regex.test(returnBody)) {
              return NextResponse.json({ 
                error: `Access restricted: Email content blocked by rule '${rule.ruleName}'.` 
              }, { status: 403 });
           }
        }
      }
    }

    const responseHeaders = new Headers(googleResponse.headers);
    responseHeaders.delete('content-encoding');

    return new NextResponse(returnBody, {
      status: googleResponse.status,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
