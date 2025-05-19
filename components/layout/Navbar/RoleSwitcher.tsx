// components/RoleSwitcher.tsx
"use client";

import { useAuthStore } from "@/store/auth.store";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "./ClientNavbar";

const RoleSwitcher = () => {
  const { role, switchRole } = useAuthStore();
  const roles: UserRole[] = ["visitor", "student", "teacher", "parent"];

  return (
    <div className="hidden sm:block">
      <Select
        onValueChange={(e) => switchRole(e as UserRole)}
        value={role}
        defaultValue={role}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Role</SelectLabel>
            {roles.map((roleOption) => (
              <SelectItem key={roleOption} value={roleOption}>
                {roleOption}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSwitcher;
