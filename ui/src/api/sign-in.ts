import { api } from "@/lib/axios";

export interface SignIn {
  email: string;
}

export async function signIn({ email }: SignIn) {
  await api.post("/authenticate", { email });
}
