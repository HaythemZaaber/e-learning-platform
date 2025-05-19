import { Teacher } from "../types/teacher";
import course from "@/public/images/courses/course.jpg";

export const teachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Sarah Malik",
    subject: "Mathematics",
    rating: 4.8,
    image: course,
    bio: "Ph.D. in Applied Math with 10+ years of teaching experience. Specializes in calculus and algebra.",
    achievements: ["Excellence in Teaching Award", "Published Researcher"],
    availability: "Mon, Wed, Fri",
    featured: true,
  },
  {
    id: 2,
    name: "Mohamed Ben Ali",
    subject: "Physics",
    rating: 4.7,
    image: course,
    bio: "Experienced high school teacher and Olympiad trainer with a passion for making complex concepts simple.",
    achievements: ["National Science Fair Judge", "10+ Years Experience"],
    availability: "Tue, Thu, Sat",
  },
  {
    id: 3,
    name: "Laura Nguyen",
    subject: "English Literature",
    rating: 4.9,
    image: course,
    bio: "Specialist in English classics and language training. Former editor and published author.",
    achievements: ["Published Author", "Master's in Literature"],
    availability: "Mon, Tue, Thu",
    featured: true,
  },
];
