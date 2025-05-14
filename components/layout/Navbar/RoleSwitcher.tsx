// components/RoleSwitcher.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { switchRole } from "@/redux/slices/auth.slice";
import { UserRole } from "@/components/layout/Navbar/ClientNavbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoleSwitcher = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.auth.role);

  const roles: UserRole[] = ["visitor", "student", "teacher", "parent"];

  return (
    <div className="">
      <Select
        onValueChange={(e) => dispatch(switchRole(e as UserRole))}
        value={role}
        defaultValue={role}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
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
