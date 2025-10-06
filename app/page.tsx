import MainPage from "./(mainPage)";

export default async function Home() {
  // All users (authenticated and non-authenticated) see the main page
  // Instructors can navigate to their dashboard via the navbar
  // Students can browse courses and enroll directly from the main page

  return (
    <div>
      <MainPage />
    </div>
  );
}
