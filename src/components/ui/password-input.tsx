"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

/**
 * Uncontrolled password input with show/hide toggle.
 * Works with React Server Actions (FormData-based forms).
 */
export function PasswordInput({
  id,
  name,
  placeholder = "Masukkan password",
  disabled,
  required,
  autoComplete,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete ?? (name === "password" ? "current-password" : "new-password")}
        className="input-field !pr-12"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark transition-colors"
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        tabIndex={-1}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
