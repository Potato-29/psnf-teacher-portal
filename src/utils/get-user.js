import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getUserFromRequest(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token").value;
  if (!token) return null;

  try {
    const user = jwtDecode(token);
    return user;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
