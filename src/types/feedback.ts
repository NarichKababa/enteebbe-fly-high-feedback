export interface Feedback {
  id: string;
  passenger_name: string;
  passenger_email: string;
  flight_number?: string;
  departure_date?: string;
  category: FeedbackCategory;
  rating: number;
  title: string;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export type FeedbackCategory = 
  | 'check_in'
  | 'security'
  | 'immigration'
  | 'baggage'
  | 'facilities'
  | 'dining'
  | 'shopping'
  | 'cleanliness'
  | 'staff_service'
  | 'overall_experience';

export const FEEDBACK_CATEGORIES: Record<FeedbackCategory, string> = {
  check_in: 'Check-in Process',
  security: 'Security Screening',
  immigration: 'Immigration & Customs',
  baggage: 'Baggage Handling',
  facilities: 'Airport Facilities',
  dining: 'Dining & Food Service',
  shopping: 'Shopping Experience',
  cleanliness: 'Cleanliness',
  staff_service: 'Staff Service',
  overall_experience: 'Overall Experience'
};