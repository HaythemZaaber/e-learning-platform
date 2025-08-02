"use client";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

export function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken({ template: "expiration" });
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    const httpLink = new HttpLink({
      uri: "http://localhost:3001/graphql",
      credentials: "include",
    });

    // Success Link - Handle successful operations
    const successLink = setContext((operation, { headers }) => {
      // You can add success handling logic here if needed
      return { headers };
    });

    // Enhanced Error Link - Handle GraphQL and network errors with better user feedback
    const errorLink = onError(
      ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            console.error(
              `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}, Extensions: ${JSON.stringify(extensions)}`
            );

            // Show user-friendly error notification
            let errorMessage = message;
            let errorDescription = "";

            // Build detailed description for user
            const details: string[] = [];
            
            if (path && path.length > 0) {
              details.push(`Field: ${path.join('.')}`);
            }
            
            if (extensions?.code) {
              details.push(`Code: ${extensions.code}`);
            }

            // Add operation context
            if (operation.operationName) {
              details.unshift(`Operation: ${operation.operationName}`);
            }
            
            if (details.length > 0) {
              errorDescription = details.join(' • ');
            }

            // Show different messages based on error type
            if (extensions?.code === 'VALIDATION_ERROR') {
              errorMessage = "Validation Error";
              errorDescription = "Please check your input and try again.";
            } else if (extensions?.code === 'UNAUTHENTICATED') {
              errorMessage = "Authentication Required";
              errorDescription = "Please sign in again to continue.";
            } else if (extensions?.code === 'FORBIDDEN') {
              errorMessage = "Access Denied";
              errorDescription = "You don't have permission to perform this action.";
            } else if (extensions?.code === 'NOT_FOUND') {
              errorMessage = "Resource Not Found";
              errorDescription = "The requested resource could not be found.";
            }

            // Handle specific operations with custom messages
            if (operation.operationName === 'SubmitCourse') {
              errorMessage = "Failed to create course";
              errorDescription = "Please check your course details and try again.";
            }

            toast.error(errorMessage, {
              description: errorDescription,
              duration: 8000,
              action: {
                label: "Dismiss",
                onClick: () => {},
              },
            });
          });
        }

        if (networkError) {
          console.error(`Network error: ${networkError}`);

          let errorMessage = "Network Error";
          let errorDescription = "Please check your connection and try again.";

          // Handle specific network error status codes
          if ("statusCode" in networkError) {
            const statusCode = networkError.statusCode;
            
            if (statusCode === 400) {
              errorMessage = "Invalid Request";
              errorDescription = "Please check your input and try again.";
            } else if (statusCode === 401) {
              errorMessage = "Authentication Required";
              errorDescription = "Please sign in again to continue.";
              // Redirect to sign-in after a short delay
              setTimeout(() => {
                window.location.href = "/sign-in";
              }, 2000);
            } else if (statusCode === 403) {
              errorMessage = "Access Denied";
              errorDescription = "You don't have permission to perform this action.";
            } else if (statusCode === 404) {
              errorMessage = "Resource Not Found";
              errorDescription = "The requested resource could not be found.";
            } else if (statusCode === 500) {
              errorMessage = "Server Error";
              errorDescription = "Something went wrong on our end. Please try again later.";
            } else if (statusCode >= 500) {
              errorMessage = "Server Error";
              errorDescription = "Our servers are experiencing issues. Please try again later.";
            }
          }

          // Custom messages for specific operations
          if (operation.operationName === 'SubmitCourse') {
            errorMessage = "Failed to create course";
            errorDescription = "Network error occurred. Please try again.";
          }

          toast.error(errorMessage, {
            description: errorDescription,
            duration: 8000,
            action: {
              label: "Dismiss",
              onClick: () => {},
            },
          });
        }
      }
    );

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              me: {
                merge(existing, incoming) {
                  return incoming;
                },
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-first",
          errorPolicy: "all", // Changed to "all" to show errors but still return data
        },
        query: {
          fetchPolicy: "cache-first",
          errorPolicy: "all",
        },
        mutate: {
          errorPolicy: "all", // Added mutation error policy
        },
      },
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}