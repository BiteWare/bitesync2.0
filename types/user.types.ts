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

export type DatabaseUser = {
  id: string
  auth_id: string
  email: string
  full_name: string | null
  primary_role: string | null
  team: string | null
  timezone: string | null
  work_start: string | null
  work_end: string | null
  working_days?: string[]
  created_at: string
  updated_at: string
} 