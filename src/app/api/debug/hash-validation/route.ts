import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const storePasswd = process.env.SSLCZ_STORE_PASSWD;
    
    if (!storePasswd) {
      return NextResponse.json({
        error: "SSLCZ_STORE_PASSWD not configured",
        configured: false
      });
    }

    // Test hash validation with sample data
    const testData = {
      val_id: "test_val_id",
      tran_id: "test_tran_id", 
      amount: "100.00",
      currency: "BDT",
      status: "VALID"
    };

    const hashString = `${storePasswd}${testData.val_id}${testData.tran_id}${testData.amount}${testData.currency}${testData.status}`;
    const calculatedHash = crypto
      .createHash('sha256')
      .update(hashString)
      .digest('hex');

    return NextResponse.json({
      configured: true,
      testData,
      hashString: `${storePasswd.substring(0, 4)}***${testData.val_id}${testData.tran_id}${testData.amount}${testData.currency}${testData.status}`,
      calculatedHash,
      storePasswdLength: storePasswd.length
    });
  } catch (error) {
    return NextResponse.json({
      error: "Hash validation test failed",
      details: String(error)
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { val_id, tran_id, amount, currency, status, verify_sign } = body;
    
    const storePasswd = process.env.SSLCZ_STORE_PASSWD;
    
    if (!storePasswd) {
      return NextResponse.json({
        error: "SSLCZ_STORE_PASSWD not configured"
      }, { status: 400 });
    }

    const hashString = `${storePasswd}${val_id}${tran_id}${amount}${currency}${status}`;
    const calculatedHash = crypto
      .createHash('sha256')
      .update(hashString)
      .digest('hex');

    const isValid = calculatedHash === verify_sign;

    return NextResponse.json({
      isValid,
      receivedHash: verify_sign,
      calculatedHash,
      hashString: `${storePasswd.substring(0, 4)}***${val_id}${tran_id}${amount}${currency}${status}`,
      parameters: { val_id, tran_id, amount, currency, status }
    });
  } catch (error) {
    return NextResponse.json({
      error: "Hash validation failed",
      details: String(error)
    }, { status: 400 });
  }
}
