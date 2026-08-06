import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
};

export function PasswordInput({ className = "", wrapperClassName = "", ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`w-full rounded-xl border-2 border-ink bg-background py-2.5 pl-3 pr-10 text-xs font-mono outline-none focus:ring-2 focus:ring-ring ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
