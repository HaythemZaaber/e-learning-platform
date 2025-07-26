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

    // Error Link - Handle GraphQL and network errors
    const errorLink = onError(
      ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
              `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
          });
        }

        if (networkError) {
          console.error(`Network error: ${networkError}`);

          // Handle 401 Unauthorized
          if ("statusCode" in networkError && networkError.statusCode === 401) {
            // Redirect to sign-in or refresh token
            window.location.href = "/sign-in";
          }
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
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "cache-first",
          errorPolicy: "all",
        },
      },
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
