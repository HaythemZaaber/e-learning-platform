import { StaticImageData } from "next/image";

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  rating: number;
  image: StaticImageData;
  bio: string;
  achievements?: string[];
  availability?: string;
  featured?: boolean;
}
