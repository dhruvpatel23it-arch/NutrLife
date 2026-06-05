"use client";
import { useEffect } from "react";

export default function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div className={`toast ${show ? "show" : ""}`}>
      ✅ <span>{msg}</span>
    </div>
  );
}
