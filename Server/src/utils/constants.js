export const UserRolesEnum = {
  ADMIN: "admin",
  STUDENT: "student",
  TEACHER: "teacher", 
  ACCOUNTANT: "accountant",
};

export const FeeStatusEnum = {
  PENDING: "pending",
  PAID: "paid",
  PARTIAL: "partial",  
  OVERDUE: "overdue",   
  REFUNDED: "refunded", 
};

export const CourseStatusEnum = {
  ACTIVE: "active",       
  COMPLETED: "completed",  
  EXPIRED: "expired",      
  UPCOMING: "upcoming",    
  CANCELLED: "cancelled",  
};

export const PaymentMethodEnum = {
  CASH: "cash",
  UPI: "upi",
};

export const VerificationMethodEnum = {
  EMAIL: "email",
  PHONE: "phone",
};
