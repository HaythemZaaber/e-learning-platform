import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { CourseCreationService } from "../services/courseCreationService";
import { useCourseCreationStore } from "../../../stores/courseCreation.store";

export function useCourseCreationWithGraphQL() {
  const client = useApolloClient();
  const [isServiceInitialized, setIsServiceInitialized] = useState(false);

  // Initialize the service with Apollo Client
  useEffect(() => {
    const initializeService = async () => {
     
      if (!client) {
        console.log("Apollo client not available yet");
        return;
      }

      console.log("Creating CourseCreationService...");
      
      try {
        const service = new CourseCreationService(client);
        console.log("CourseCreationService created successfully:", service);
        
        // Test the GraphQL endpoint
        try {
          const testQuery = await client.query({
            query: require("../services/graphql/queries").GET_COURSE_DRAFT,
            fetchPolicy: "network-only",
          });
          console.log("GraphQL endpoint test successful:", testQuery);
        } catch (graphqlError) {
          console.error("GraphQL endpoint test failed:", graphqlError);
          console.log("This might indicate the backend server is not running on http://localhost:3001/graphql");
        }
        
        // Set the service in the store
        const { setService } = useCourseCreationStore.getState();
        setService(service);
        
        // Verify the service was set
        const storeState = useCourseCreationStore.getState();
        console.log("Service in store after setting:", storeState.service);
        
        setIsServiceInitialized(true);
        console.log("CourseCreationService initialized successfully");
        
      } catch (error) {
        console.error("Failed to initialize CourseCreationService:", error);
        const { addGlobalError } = useCourseCreationStore.getState();
        addGlobalError("Failed to initialize service. Please refresh the page.");
      }
    };

    initializeService();
  }, [client]);

  console.log("useCourseCreationWithGraphQL render, isServiceInitialized:", isServiceInitialized);

  return {
    isServiceInitialized,
  };
}
