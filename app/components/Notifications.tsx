"use client";

import { useState, useEffect } from "react";
import { X, Bell, CheckCircle, AlertCircle, Info } from "lucide-react";

export interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function Notifications({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} color="#2ec972" />;
      case "warning":
        return <AlertCircle size={20} color="#ff9f1c" />;
      case "info":
        return <Info size={20} color="#3498db" />;
      default:
        return <Bell size={20} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "rgba(46, 201, 114, 0.1)";
      case "warning":
        return "rgba(255, 159, 28, 0.1)";
      case "info":
        return "rgba(52, 152, 219, 0.1)";
      default:
        return "rgba(0, 0, 0, 0.02)";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 998,
        }}
      />

      {/* Notification Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 420,
          maxWidth: "100%",
          height: "100vh",
          background: "#fff",
          boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
          animation: "slideIn 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}>
                {unreadCount} unread
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666",
              padding: 4,
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Notifications List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: notifications.length > 0 ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          {notifications.map((notif, idx) => (
            <div
              key={notif.id}
              onClick={() => onMarkAsRead(notif.id)}
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border)",
                background: notif.read ? "#fff" : getBackgroundColor(notif.type),
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation: `fadeInUp 0.4s ease ${idx * 0.05}s backwards`,
                borderLeft: `4px solid ${notif.type === "success" ? "#2ec972" : notif.type === "warning" ? "#ff9f1c" : "#3498db"}`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = getBackgroundColor(notif.type);
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(-4px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = notif.read
                  ? "#fff"
                  : getBackgroundColor(notif.type);
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ marginTop: 2, transition: "transform 0.3s ease" }}>{getIcon(notif.type)}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: notif.read ? 500 : 600,
                      fontSize: 14,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    {notif.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#666",
                      lineHeight: 1.4,
                      marginBottom: 6,
                    }}
                  >
                    {notif.message}
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    {formatTime(notif.timestamp)}
                  </div>
                </div>
                {!notif.read && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--orange)",
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            <Bell size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ margin: 0, textAlign: "center" }}>
              No notifications yet
            </p>
            <p style={{ margin: "8px 0 0 0", fontSize: 12, opacity: 0.7 }}>
              You'll see updates here when you have new messages
            </p>
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: "12px 24px",
              borderTop: "1px solid var(--border)",
              background: "var(--bg)",
            }}
          >
            <button
              onClick={onClearAll}
              style={{
                width: "100%",
                padding: "10px 16px",
                border: "1px solid var(--border)",
                background: "#fff",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                color: "#666",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `,
      }} />
    </>
  );
}
