import SSLCommerzPayment from 'sslcommerz-lts';
import { env } from './env';
import fetch from 'node-fetch';

// Polyfill fetch for Node.js environment
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = fetch as any;
}

export interface SSLCommerzConfig {
  store_id: string;
  store_passwd: string;
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  ship_name: string;
  ship_add1: string;
  ship_city: string;
  ship_postcode: string;
  ship_country: string;
  multi_card_name: string;
  value_a: string;
  value_b: string;
  value_c: string;
  value_d: string;
}

export class SSLCommerzService {
  private sslcommerz: SSLCommerzPayment;

  constructor() {
    const storeId = process.env.SSLCZ_STORE_ID;
    const storePasswd = process.env.SSLCZ_STORE_PASSWD;
    const isSandbox = process.env.SSLCZ_IS_SANDBOX === "true";
    
    if (!storeId || !storePasswd) {
      throw new Error("SSLCommerz credentials not configured. Please set SSLCZ_STORE_ID and SSLCZ_STORE_PASSWD environment variables.");
    }
    
    this.sslcommerz = new SSLCommerzPayment(storeId, storePasswd, isSandbox);
  }

  async initiatePayment(config: Partial<SSLCommerzConfig>): Promise<{
    GatewayPageURL: string;
    status: string;
    failedreason?: string;
    sessionkey?: string;
    gw?: any;
  }> {
    try {
      const paymentData: SSLCommerzConfig = {
        store_id: process.env.SSLCZ_STORE_ID!,
        store_passwd: process.env.SSLCZ_STORE_PASSWD!,
        total_amount: config.total_amount || 0,
        currency: config.currency || 'BDT',
        tran_id: config.tran_id || '',
        success_url: config.success_url || '',
        fail_url: config.fail_url || '',
        cancel_url: config.cancel_url || '',
        ipn_url: config.ipn_url || '',
        cus_name: config.cus_name || '',
        cus_email: config.cus_email || '',
        cus_add1: config.cus_add1 || '',
        cus_city: config.cus_city || 'Dhaka',
        cus_postcode: config.cus_postcode || '1000',
        cus_country: config.cus_country || 'Bangladesh',
        cus_phone: config.cus_phone || '',
        ship_name: config.ship_name || config.cus_name || '',
        ship_add1: config.ship_add1 || config.cus_add1 || '',
        ship_city: config.ship_city || config.cus_city || 'Dhaka',
        ship_postcode: config.ship_postcode || config.cus_postcode || '1000',
        ship_country: config.ship_country || config.cus_country || 'Bangladesh',
        multi_card_name: 'mobilebank',
        value_a: config.value_a || '',
        value_b: config.value_b || '',
        value_c: config.value_c || '',
        value_d: config.value_d || '',
        ...config
      };

      const result = await this.sslcommerz.init(paymentData);
      return result;
    } catch (error) {
      console.error('SSLCommerz payment initiation error:', error);
      throw new Error('Failed to initiate payment');
    }
  }

  async validatePayment(tran_id: string, amount: number, currency: string): Promise<{
    status: string;
    tran_id: string;
    val_id: string;
    amount: number;
    store_amount: number;
    currency: string;
    bank_tran_id: string;
    card_type: string;
    card_no: string;
    card_issuer: string;
    card_brand: string;
    card_issuer_country: string;
    card_issuer_country_code: string;
    store_id: string;
    verify_sign: string;
    verify_key: string;
    risk_level: string;
    risk_title: string;
  }> {
    try {
      const result = await this.sslcommerz.validate({
        val_id: tran_id,
        store_id: process.env.SSLCZ_STORE_ID!,
        store_passwd: process.env.SSLCZ_STORE_PASSWD!,
        format: 'json'
      });
      return result;
    } catch (error) {
      console.error('SSLCommerz payment validation error:', error);
      throw new Error('Failed to validate payment');
    }
  }

  async refundPayment(refund_amount: number, refund_remarks: string, bank_tran_id: string, refe_id: string): Promise<{
    status: string;
    refund_ref_id: string;
    refund_amount: number;
    refund_remarks: string;
  }> {
    try {
      const result = await this.sslcommerz.initiateRefund({
        refund_amount,
        refund_remarks,
        bank_tran_id,
        refe_id,
        store_id: process.env.SSLCZ_STORE_ID!,
        store_passwd: process.env.SSLCZ_STORE_PASSWD!
      });
      return result;
    } catch (error) {
      console.error('SSLCommerz refund error:', error);
      throw new Error('Failed to process refund');
    }
  }
}

export const sslcommerzService = new SSLCommerzService();
