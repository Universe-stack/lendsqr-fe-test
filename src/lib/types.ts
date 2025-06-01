export interface PersonalInfo {
  // Add fields as per Figma
}
export interface EducationEmployment {
  // Add fields as per Figma
}
export interface Socials {
  // Add fields as per Figma
}
export interface Guarantor {
  // Add fields as per Figma
}
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';
export interface User {
  userId: string;
  organization: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
  status: UserStatus;
  personalInfo: PersonalInfo;
  educationEmployment: EducationEmployment;
  socials: Socials;
  guarantor: Guarantor;
  // ...additional fields
} 