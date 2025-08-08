import { gql } from "@apollo/client";

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($clerkId: String!, $role: UserRole!) {
    updateUserRole(clerkId: $clerkId, role: $role) {
      id
      clerkId
      email
      firstName
      lastName
      profileImage
      role
    }
  }
`;
