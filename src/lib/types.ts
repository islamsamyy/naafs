export interface Talent {
  id: string;
  name: string;
  role: string;
  price: string;
  rating: string;
  reviews: string;
  projects: string;
  tags: string[];
  avatar: string;
  verified: boolean;
  rotate?: string;
  bio?: string;
  hourly_rate?: number;
  location?: string;
  years_experience?: number;
}
