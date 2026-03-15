import { PROXY_API_KEY, PROXY_URL } from './config.js';

export async function proxyFetch(endpoint, method = 'GET', body = null) {
  if (!PROXY_API_KEY) {
    console.warn("WARNING: PROXY_API_KEY environment variable is missing.");
  }
  const url = `${PROXY_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${PROXY_API_KEY}`,
      'Content-Type': 'application/json',
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => null);
    return { status: response.status, data };
  } catch (error) {
    console.error(`Fetch error to ${url}:`, error.message);
    return { status: 500, data: { error: error.message } };
  }
}

export async function listMessages(email, maxResults = 10, q = '') {
    return proxyFetch(`/gmail/v1/users/${email}/messages?maxResults=${maxResults}&q=${encodeURIComponent(q)}`);
}

export async function getMessage(email, messageId) {
    return proxyFetch(`/gmail/v1/users/${email}/messages/${messageId}`);
}

export async function sendEmail(email, to, subject, bodyText) {
    const raw = Buffer.from(`To: ${to}\r\nSubject: ${subject}\r\n\r\n${bodyText}`).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return proxyFetch(`/gmail/v1/users/${email}/messages/send`, 'POST', { raw });
}

export async function trashMessage(email, messageId) {
    return proxyFetch(`/gmail/v1/users/${email}/messages/${messageId}/trash`, 'POST');
}
