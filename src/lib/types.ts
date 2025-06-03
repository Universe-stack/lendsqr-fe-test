export interface PersonalInfo {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  typeOfResidence: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
}

export interface EducationAndEmployment {
  levelOfEducation: string;
  employmentStatus: string;
  sector: string;
  duration: string;
  officeEmail: string;
  monthlyIncome: string[];
  loanRepayment: string;
}

export interface Socials {
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface Guarantor {
  fullName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
}

export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Blacklisted';

export interface User {
  userId: string;
  fullName: string;
  organization: string;
  status: string;
  username: string;
  email: string;
  phoneNumber: string;
  bvn: string;
  gender: string;
  maritalStatus: string;
  children: string;
  residenceType: string;
  tier: string;
  accountBalance: string;
  dateJoined: string;
  bankDetails: BankDetails;
  educationAndEmployment: EducationAndEmployment;
  socials: Socials;
  guarantors: Guarantor[];
} 