// components/ui/PasswordInput.tsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FormInput, FormInputProps } from "./FormInput";

export const PasswordInput = (props: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative ">
      <FormInput
        {...props}
        type={showPassword ? "text" : "password"}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3  bottom-[10px] transform text-gray-500"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
