export function CourseRequirements() {
  const requirements = [
    "Become an advanced, confident, and modern Python programmer",
    "Be able to use Python for data science and machine learning",
    "Learn to use Python professionally",
    "Master Python features by building 100 projects",
  ]

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Requirements</h2>
      <ul className="space-y-2">
        {requirements.map((req, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-gray-500">•</span>
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
