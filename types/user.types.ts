export type UserRole = 
  | "developer" 
  | "designer" 
  | "manager"
  | "product_manager"
  | "data_analyst"
  | "qa_engineer"
  | "devops"
  | "marketing"
  | "sales"
  | "hr"
  | "finance"

export type TeamType = 
  | "engineering"
  | "design"
  | "product"
  | "data"
  | "qa"
  | "operations"
  | "marketing"
  | "sales"
  | "hr"
  | "finance"
  | "customer_success"

export interface UserProfileUpdate {
  full_name: string;
  primary_role: UserRole;
  team: TeamType;
  timezone: string;
  work_start: string;
  work_end: string;
  working_days: string[];
}

export interface UserProfileType extends UserProfileUpdate {
  id: string;
  user_id: string;
  auth_id: string;
  email: string;
  created_at: string;
  updated_at: string;
} 