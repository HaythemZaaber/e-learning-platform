import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { useCourseCreationStore } from "../../../stores/courseCreation.store";
import { CourseCreationService } from "../services/graphql/courseCreationService";

export function useCourseCreationWithGraphQL() {
  const client = useApolloClient();
  const store = useCourseCreationStore();
  const [isServiceInitialized, setIsServiceInitialized] = useState(false);

  // Initialize the service with Apollo Client
  useEffect(() => {
    console.log("useCourseCreationWithGraphQL: client available:", !!client);
    if (client) {
      try {
        console.log("Creating CourseCreationService...");
        const service = new CourseCreationService(client);
        console.log("CourseCreationService created, setting in store...");
        store.setService(service);
        setIsServiceInitialized(true);
        console.log("CourseCreationService initialized successfully");
      } catch (error) {
        console.error("Failed to initialize CourseCreationService:", error);
        store.addGlobalError(
          "Failed to initialize service. Please refresh the page."
        );
      }
    } else {
      console.log("Apollo client not available yet");
    }
  }, [client]);

  return {
    isServiceInitialized,
  };
}
