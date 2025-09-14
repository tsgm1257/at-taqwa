import fetch from "node-fetch";

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
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  value_a: string;
  value_b: string;
  value_c: string;
  value_d: string;
}

export class SSLCommerzDirectService {
  private storeId: string;
  private storePasswd: string;
  private isSandbox: boolean;
  private baseUrl: string;

  constructor() {
    this.storeId = process.env.SSLCZ_STORE_ID!;
    this.storePasswd = process.env.SSLCZ_STORE_PASSWD!;
    this.isSandbox = process.env.SSLCZ_IS_SANDBOX === "true";

    if (!this.storeId || !this.storePasswd) {
      throw new Error(
        "SSLCommerz credentials not configured. Please set SSLCZ_STORE_ID and SSLCZ_STORE_PASSWD environment variables."
      );
    }

    this.baseUrl = this.isSandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
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
        store_id: this.storeId,
        store_passwd: this.storePasswd,
        total_amount: config.total_amount || 0,
        currency: config.currency || "BDT",
        tran_id: config.tran_id || "",
        success_url: config.success_url || "",
        fail_url: config.fail_url || "",
        cancel_url: config.cancel_url || "",
        ipn_url: config.ipn_url || "",
        cus_name: config.cus_name || "",
        cus_email: config.cus_email || "",
        cus_add1: config.cus_add1 || "",
        cus_city: config.cus_city || "Dhaka",
        cus_postcode: config.cus_postcode || "1000",
        cus_country: config.cus_country || "Bangladesh",
        cus_phone: config.cus_phone || "",
        ship_name: config.ship_name || config.cus_name || "",
        ship_add1: config.ship_add1 || config.cus_add1 || "",
        ship_city: config.ship_city || config.cus_city || "Dhaka",
        ship_postcode: config.ship_postcode || config.cus_postcode || "1000",
        ship_country: config.ship_country || config.cus_country || "Bangladesh",
        multi_card_name: "mobilebank",
        shipping_method: config.shipping_method || "NO",
        product_name: "Donation",
        product_category: "Charity",
        product_profile: "general",
        value_a: config.value_a || "",
        value_b: config.value_b || "",
        value_c: config.value_c || "",
        value_d: config.value_d || "",
        ...config,
      };

      console.log("Making direct SSLCommerz API call to:", this.baseUrl);
      console.log("Payment data:", {
        store_id: paymentData.store_id.substring(0, 4) + "***",
        total_amount: paymentData.total_amount,
        currency: paymentData.currency,
        tran_id: paymentData.tran_id,
      });

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(paymentData as any).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("SSLCommerz API response:", result);

      return result;
    } catch (error) {
      console.error("SSLCommerz direct payment initiation error:", error);
      throw new Error("Failed to initiate payment");
    }
  }

  async validatePayment(
    val_id: string,
    amount: number,
    currency: string
  ): Promise<{
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
      const validationUrl = this.isSandbox
        ? "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
        : "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

      const validationData = {
        val_id: val_id,
        store_id: this.storeId,
        store_passwd: this.storePasswd,
        format: "json",
        v: "1",
        emi_option: "0",
      };

      // Use GET method instead of POST as recommended in SSLCommerz docs
      const qs = new URLSearchParams(validationData as any).toString();
      const response = await fetch(`${validationUrl}?${qs}`, {
        method: "GET",
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `Validator ${response.status}. Body: ${text.slice(0, 500)}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("SSLCommerz direct payment validation error:", error);
      throw new Error("Failed to validate payment");
    }
  }
}

// Initialize service only if credentials are available
let sslcommerzDirectService: SSLCommerzDirectService | null = null;

try {
  if (
    process.env.SSLCZ_STORE_ID &&
    process.env.SSLCZ_STORE_PASSWD &&
    process.env.SSLCZ_STORE_ID !== "your_store_id_here"
  ) {
    sslcommerzDirectService = new SSLCommerzDirectService();
  }
} catch (error) {
  console.warn("SSLCommerz service not initialized:", error);
}

export { sslcommerzDirectService };
