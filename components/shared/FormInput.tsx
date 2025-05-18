import { InputHTMLAttributes } from "react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = ({
  label,
  error,
  className = "",
  ...props
}: FormInputProps) => (
  <div className="space-y-2">
    <label
      htmlFor={props.id}
      className="block text-sm font-medium "
    >
      {label}
    </label>
    <input
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error
          ? "border-red-300 focus:ring-red-200"
          : "border-gray-300 focus:ring-primary/20"
      } ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);
