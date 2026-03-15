import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');
const configPath = path.join(rootDir, '.qa_test_emails.json');

let emails = {
  USER_A_EMAIL: "user_a@example.com",
  USER_B_EMAIL: "user_b@example.com"
};

if (fs.existsSync(configPath)) {
  const fileContent = fs.readFileSync(configPath, 'utf8');
  emails = { ...emails, ...JSON.parse(fileContent) };
}

export const USER_A_EMAIL = emails.USER_A_EMAIL;
export const USER_B_EMAIL = emails.USER_B_EMAIL;
export const PROXY_API_KEY = process.env.PROXY_API_KEY || '';
export const PROXY_URL = process.env.PROXY_URL || 'http://localhost:3000/api/proxy';
