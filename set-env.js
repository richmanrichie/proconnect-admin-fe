const fs = require('fs');
const path = require('path');

const apiBaseUrl = process.env.API_BASE_URL || 'https://proconnect-lingering-rain-3381.fly.dev/api/v1';
const merchantCode = process.env.MERCHANT_CODE || 'MX007';
const payItemId = process.env.PAY_ITEM_ID || '101007';
const paymentMode = process.env.PAYMENT_MODE || 'TEST';
const paymentScriptUrl = process.env.PAYMENT_SCRIPT_URL || 'https://newwebpay.qa.interswitchng.com/inline-checkout.js';

const content = `export const environment = {
  production: true,
  apiBaseUrl: '${apiBaseUrl}',
  merchantCode: '${merchantCode}',
  payItemId: '${payItemId}',
  payment: {
    scriptUrl: '${paymentScriptUrl}',
    currency: 566,
    mode: '${paymentMode}'
  }
};
`;

const filePath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(filePath, content);
console.log('environment.prod.ts generated with runtime values.');
