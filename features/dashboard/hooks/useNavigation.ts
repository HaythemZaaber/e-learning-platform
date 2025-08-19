// features/dashboard/hooks/useNavigation.ts

import { useMemo } from "react";
import { UserRole } from "../types/dashboard.types";
import { ROLE_NAVIGATION, ROLE_INFO } from "../constants/navigation.constants";
import { UserRole as AuthUserRole } from "@/stores/auth.store";

export const useNavigation = (userRole: UserRole) => {
  const navigation = useMemo(() => {
    return ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION[AuthUserRole.ADMIN];
  }, [userRole]);

  const roleInfo = useMemo(() => {
    return ROLE_INFO[userRole] || ROLE_INFO[AuthUserRole.ADMIN];
  }, [userRole]);

  return {
    navigation,
    roleInfo,
  };
};
