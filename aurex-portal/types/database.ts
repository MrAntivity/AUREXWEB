export type UserRole = "super_admin" | "department_admin" | "requester" | "finance_viewer";
export type OrderStatus = "draft" | "submitted" | "pending_dept" | "pending_super" | "approved" | "rejected" | "ordered" | "delivered";
export type ApprovalAction = "approved" | "rejected" | "delegated";

export type Institution = {
  id: string;
  name: string;
  slug: string;
  type: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  created_at: string;
  updated_at: string;
};

export type Department = {
  id: string;
  institution_id: string;
  name: string;
  code: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  clerk_user_id: string;
  institution_id: string | null;
  department_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Budget = {
  id: string;
  institution_id: string;
  department_id: string | null;
  fiscal_year: number;
  period_start: string;
  period_end: string;
  total_amount: number;
  spent_amount: number;
  committed_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  institution_id: string | null;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  unit: string;
  unit_price: number;
  currency: string;
  supplier: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PurchaseRequest = {
  id: string;
  request_number: string;
  institution_id: string;
  department_id: string;
  requester_id: string;
  status: OrderStatus;
  title: string;
  notes: string | null;
  total_amount: number;
  currency: string;
  stripe_invoice_id: string | null;
  needed_by: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PurchaseRequestItem = {
  id: string;
  purchase_request_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  created_at: string;
};

export type Approval = {
  id: string;
  purchase_request_id: string;
  approver_id: string;
  role_required: UserRole;
  action: ApprovalAction | null;
  notes: string | null;
  acted_at: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      institutions: {
        Row: Institution;
        Insert: Omit<Institution, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Institution, "id" | "created_at">>;
        Relationships: [];
      };
      departments: {
        Row: Department;
        Insert: Omit<Department, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Department, "id" | "created_at">>;
        Relationships: [];
      };
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id" | "created_at">>;
        Relationships: [];
      };
      budgets: {
        Row: Budget;
        Insert: Omit<Budget, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Budget, "id" | "created_at">>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Product, "id" | "created_at">>;
        Relationships: [];
      };
      purchase_requests: {
        Row: PurchaseRequest;
        Insert: Omit<PurchaseRequest, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PurchaseRequest, "id" | "created_at">>;
        Relationships: [];
      };
      purchase_request_items: {
        Row: PurchaseRequestItem;
        Insert: Omit<PurchaseRequestItem, "id" | "created_at">;
        Update: Partial<Omit<PurchaseRequestItem, "id" | "created_at">>;
        Relationships: [];
      };
      approvals: {
        Row: Approval;
        Insert: Omit<Approval, "id" | "created_at">;
        Update: Partial<Omit<Approval, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      approval_action: ApprovalAction;
    };
  };
};
