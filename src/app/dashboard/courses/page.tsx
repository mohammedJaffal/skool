export default function CoursesPage() {
  const courses = [
    { id: "1", title: "React Fundamentals", description: "Learn React from scratch", instructor: "John Doe", lessons: 12 },
    { id: "2", title: "Next.js 15 Deep Dive", description: "Master the App Router", instructor: "Jane Smith", lessons: 8 },
    { id: "3", title: "TypeScript Essentials", description: "Type-safe JavaScript", instructor: "Bob Johnson", lessons: 10 },
    { id: "4", title: "Tailwind CSS Mastery", description: "Build beautiful UIs fast", instructor: "Alice Brown", lessons: 6 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <a
            key={course.id}
            href={`/dashboard/courses/${course.id}`}
            className="block border rounded-xl p-5 hover:shadow-md transition bg-white"
          >
            <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
            <p className="text-gray-500 text-sm mb-3">{course.description}</p>
            <div className="text-sm text-gray-400">
              <span>👤 {course.instructor}</span>
              <span className="ml-4">📚 {course.lessons} lessons</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
