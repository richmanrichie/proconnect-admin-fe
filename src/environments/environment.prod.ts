export const environment = {
  production: true,
  apiBaseUrl: 'https://proconnect-lingering-rain-3381.fly.dev/api/v1',
  merchantCode: 'MX007', // Replace with production merchant code
  payItemId: '101007', // Replace with production pay item ID
  payment: {
    scriptUrl: 'https://newwebpay.interswitchng.com/inline-checkout.js',
    currency: 566, // NGN
    mode: 'LIVE'
  }
};
