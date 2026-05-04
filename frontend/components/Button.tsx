import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variants = {
  primary: "bg-moss text-white hover:bg-ink disabled:bg-slate-300",
  secondary: "bg-mint text-ink hover:bg-[#c6e5d8] disabled:bg-slate-200",
  ghost: "bg-transparent text-ink hover:bg-mint disabled:text-slate-400",
  danger: "bg-coral text-white hover:bg-[#e95e52] disabled:bg-slate-300",
};

export function Button({ className = "", variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-moss focus:ring-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
