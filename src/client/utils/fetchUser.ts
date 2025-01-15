// src/lib/auth.ts
import { useAuth } from "@/context/auth";
import { customers } from "@prisma/client";
export function GetCurrentCustomerId(): customers["customer_id"] {
  const { user } = useAuth();

  if (user) {
    return user.customer_id;
  }
  return "";
}
