import { useEffect, useState } from "react";

export function useUserEmail() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(localStorage.getItem("user_email"));
    }
  }, []);
  return email;
}
