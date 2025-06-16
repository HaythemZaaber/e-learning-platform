import { StudentStats } from "@/features/users/components/instructor/StudentsStats";



export default function Home() {
  return (

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, Jessica!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your courses today.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <StudentStats />

        {/* <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Courses</h2>
            <InstructorCourseGrid limit={4} showCreateButton />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <SessionCalendar view="upcoming" limit={5} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
            <EarningsChart period="month" />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            <RecentMessages limit={5} />
          </div>
        </div> */}
      </div>
  
  );
}
