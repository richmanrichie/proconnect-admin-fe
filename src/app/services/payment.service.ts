import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly MERCHANT_CODE = environment.merchantCode || 'MX007';
  private readonly PAY_ITEM_ID = environment.payItemId || '101007';
  private readonly CURRENCY_CODE = 566; // NGN
  private scriptLoaded = false;

  constructor() {}

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = environment.production 
        ? 'https://newwebpay.interswitchng.com/inline-checkout.js' 
        : 'https://newwebpay.qa.interswitchng.com/inline-checkout.js';
      
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      
      script.onerror = (error) => {
        reject('Failed to load payment script');
      };

      document.body.appendChild(script);
    });
  }

  async initiatePayment(params: {
    amount: number;
    reference: string;
    customerEmail: string;
    customerName: string;
    onComplete: (response: any) => void;
    onClose?: () => void;
  }) {
    try {
      await this.loadScript();

      const paymentRequest = {
        merchant_code: this.MERCHANT_CODE,
        pay_item_id: this.PAY_ITEM_ID,
        txn_ref: params.reference,
        amount: params.amount * 100, // Convert to kobo
        currency: this.CURRENCY_CODE,
        customer_email: params.customerEmail,
        customer_name: params.customerName,
        site_redirect_url: window.location.origin,
        mode: environment.production ? 'LIVE' : 'TEST',
        onComplete: (response: any) => {
          params.onComplete(response);
        },
        onClose: params.onClose || (() => {})
      };

      if (window.webpayCheckout) {
        window.webpayCheckout(paymentRequest);
      } else {
        console.error('Payment script not loaded');
        throw new Error('Payment service is not available');
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  }
}
