"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X } from "lucide-react";
import Vapi from "@vapi-ai/web";

interface VoiceAssistantProps {
  assistantId?: string;
}

export default function VoiceAssistant({ assistantId: propAssistantId }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [assistantId, setAssistantId] = useState<string | null>(propAssistantId || null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const vapiRef = useRef<Vapi | null>(null);

  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";

  // Initialize assistant on mount
  useEffect(() => {
    // Check if browser context is secure or is localhost
    const isSecureCtx = typeof window !== "undefined" && (
      window.isSecureContext || 
      window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1"
    );
    const hasMicSupport = typeof navigator !== "undefined" && 
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    if (!isSecureCtx || !hasMicSupport) {
      setIsSecure(false);
      return;
    }

    const initializeAssistant = async () => {
      if (!assistantId && !propAssistantId) {
        try {
          const res = await fetch("/api/vapi/assistant");
          const result = await res.json();
          if (result.success) {
            setAssistantId(result.assistantId);
            setError("");
          } else {
            setError("Failed to initialize voice assistant");
            console.error("Assistant initialization error:", result.error);
          }
        } catch (err) {
          setError("Error initializing voice assistant");
          console.error("Init error:", err);
        }
      }
    };

    initializeAssistant();
  }, [propAssistantId]);

  // Initialize Vapi SDK
  useEffect(() => {
    if (publicKey && assistantId && !isInitialized) {
      try {
        // Create new Vapi instance if needed
        if (!vapiRef.current) {
          vapiRef.current = new Vapi(publicKey);
        }

        // Set up event listeners
        vapiRef.current.on("message", (message: any) => {
          console.log("Vapi message:", message);
          if (message.type === "transcript" && message.transcript) {
            setTranscript(message.transcript);
          }
        });

        vapiRef.current.on("error", (error: any) => {
          console.error("Vapi error:", error);
          const errMsg = error?.message || error?.msg || error?.error?.message || error?.error?.msg || (typeof error === "string" ? error : null) || "Voice assistant encountered an error";
          setError(errMsg);
          setIsListening(false);
          setIsSpeaking(false);
        });

        vapiRef.current.on("call-start", () => {
          console.log("Call started");
          setIsListening(true);
          setError("");
        });

        vapiRef.current.on("call-end", () => {
          console.log("Call ended");
          setIsListening(false);
          setIsSpeaking(false);
          setTranscript("");
        });

        vapiRef.current.on("speech-start", () => {
          console.log("Speech started");
          setIsSpeaking(true);
        });

        vapiRef.current.on("speech-end", () => {
          console.log("Speech ended");
          setIsSpeaking(false);
        });

        setIsInitialized(true);
        console.log("Vapi initialized successfully");
      } catch (err) {
        console.error("Error initializing Vapi:", err);
        setError("Failed to initialize Vapi SDK");
      }
    }

    return () => {
      // Don't cleanup on unmount to prevent re-initialization issues
    };
  }, [publicKey, assistantId, isInitialized]);

  const startCall = async () => {
    if (!assistantId) {
      setError("Voice assistant not ready. Please wait...");
      return;
    }

    if (!vapiRef.current) {
      setError("Vapi SDK not initialized");
      return;
    }

    try {
      setError("");
      console.log("Starting call with assistant:", assistantId);
      await vapiRef.current.start(assistantId);
    } catch (err: any) {
      console.error("Error starting call:", err);
      setError(err.message || "Failed to start voice call");
      setIsListening(false);
    }
  };

  const stopCall = () => {
    try {
      if (vapiRef.current) {
        vapiRef.current.stop();
        setIsListening(false);
        setIsSpeaking(false);
        setTranscript("");
        setError("");
      }
    } catch (error) {
      console.error("Error stopping call:", error);
    }
  };

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 60,
          height: 60,
          borderRadius: "30px",
          background: "linear-gradient(135deg, #ff9f1c, #ff6b35)",
          color: "#fff",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(255, 107, 53, 0.4)",
          border: "none",
          cursor: "pointer",
          zIndex: 100,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Voice Assistant"
      >
        <Volume2 size={28} />
      </button>

      {/* Voice Assistant Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 380,
            height: 500,
            maxHeight: "80vh",
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #ff9f1c, #ff6b35)",
              color: "#fff",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                <Volume2 size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  Voice Assistant
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>
                  {!assistantId
                    ? "Initializing..."
                    : isListening
                    ? "Listening..."
                    : "Ready to help"}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                stopCall();
                setIsOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                opacity: 0.8,
                padding: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
            }}
          >
            {/* Status/Transcript Area */}
            <div>
              <div
                style={{
                  background: !isSecure ? "rgba(231, 76, 60, 0.08)" : error ? "rgba(231, 76, 60, 0.1)" : "rgba(0,0,0,0.02)",
                  borderRadius: 12,
                  padding: 16,
                  minHeight: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: !isSecure || error ? "#e74c3c" : "#666",
                  border: !isSecure ? "1px dashed rgba(231, 76, 60, 0.3)" : "none",
                }}
              >
                {!isSecure ? (
                  <div style={{ textAlign: "left" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: 13, fontWeight: 700, color: "#e74c3c" }}>
                      🔒 Secure Context Required
                    </p>
                    <p style={{ margin: 0, fontSize: 11, lineHeight: 1.45, color: "#555" }}>
                      Microphone access is blocked on mobile devices unless using <strong>localhost</strong> or <strong>HTTPS</strong>.
                      <br /><br />
                      <strong>To fix:</strong> Forward the port using an HTTPS tunnel (e.g. <code>ngrok</code> or VS Code Port Forwarding) to get an <code>https://</code> URL.
                    </p>
                  </div>
                ) : error ? (
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                    ⚠️ {typeof error === "object" ? (error as any).msg || (error as any).message || JSON.stringify(error) : error}
                  </p>
                ) : !assistantId ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: "#ff9f1c",
                        animation: "pulse 1s infinite",
                      }}
                    />
                    <span>Setting up voice assistant...</span>
                  </div>
                ) : transcript ? (
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                    {transcript}
                  </p>
                ) : isListening ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: "#ff6b35",
                        animation: "pulse 1s infinite",
                      }}
                    />
                    <span>Listening...</span>
                  </div>
                ) : isSpeaking ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: "#ff9f1c",
                        animation: "pulse 1s infinite",
                      }}
                    />
                    <span>Speaking...</span>
                  </div>
                ) : (
                  "Click the microphone to start talking"
                )}
              </div>
            </div>

             {/* Controls */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button
                onClick={startCall}
                disabled={isListening || isSpeaking || !assistantId || !!error || !isSecure}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background:
                    isListening || isSpeaking || !assistantId || error || !isSecure
                      ? "#ddd"
                      : "#ff6b35",
                  color: "#fff",
                  border: "none",
                  cursor:
                    isListening || isSpeaking || !assistantId || error || !isSecure
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Mic size={18} />
                Start
              </button>
              <button
                onClick={stopCall}
                disabled={!isListening && !isSpeaking}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: !isListening && !isSpeaking ? "#ddd" : "#e74c3c",
                  color: "#fff",
                  border: "none",
                  cursor: !isListening && !isSpeaking ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MicOff size={18} />
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `,
      }} />
    </>
  );
}
