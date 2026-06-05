// Vapi Voice Assistant Configuration

export const vapiConfig = {
  publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "",
  assistantId: "a0f8c5d8-c5c6-4d5f-9f5f-5c5d5f5f5f5f", // Default assistant ID, can be customized per page
};

export interface VapiCallOptions {
  assistantId?: string;
  customContext?: Record<string, any>;
}
