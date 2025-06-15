// features/dashboard/hooks/useNavigation.ts

import { useMemo } from "react";
import { UserRole } from "../types/dashboard.types";
import { ROLE_NAVIGATION, ROLE_INFO } from "../constants/navigation.constants";

export const useNavigation = (userRole: UserRole) => {
  const navigation = useMemo(() => {
    return ROLE_NAVIGATION[userRole] || ROLE_NAVIGATION.admin;
  }, [userRole]);

  const roleInfo = useMemo(() => {
    return ROLE_INFO[userRole] || ROLE_INFO.admin;
  }, [userRole]);

  return {
    navigation,
    roleInfo,
  };
};
