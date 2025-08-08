import { Injectable, SecurityContext } from '@angular/core';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { log } from 'console';

declare const window: any;
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly MERCHANT_CODE =  'MX19329';
  private readonly PAY_ITEM_ID = 'Default_Payable_MX19329';
  private readonly CURRENCY_CODE = 566; // NGN

  constructor(private sanitizer: DomSanitizer) {}

  async initiatePayment(params: {
    amount: number;
    reference: string;
    customerEmail: string;
    customerName: string;
    onComplete: (response: any) => void;
    onClose?: () => void;
  }) {
    try {
      // Sanitize the redirect URL
      const sanitizedRedirectUrl = this.sanitizer.sanitize(
        SecurityContext.URL,
        window.location.origin
      );

      if (!sanitizedRedirectUrl) {
        throw new Error('Invalid redirect URL');
      }

      const paymentRequest = {
        merchant_code: this.MERCHANT_CODE,
        pay_item_id: this.PAY_ITEM_ID,
        txn_ref: params.reference,
        amount: (params.amount * 100).toString(), // Convert to kobo
        currency: this.CURRENCY_CODE,
        customer_email: params.customerEmail,
        customer_name: params.customerName,
        site_redirect_url: sanitizedRedirectUrl,
        mode: environment.production ? 'LIVE' : 'TEST',
        onComplete: params.onComplete,
        onClose: params.onClose || (() => {})
      };

      console.log(paymentRequest);
      if (typeof window.webpayCheckout === 'function') {
        window.webpayCheckout(paymentRequest);
      } else {
        throw new Error('Payment script is not loaded. Ensure it is included in index.html');
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw error;
    }
  }

  private generateReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}