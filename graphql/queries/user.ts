import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
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

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
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
