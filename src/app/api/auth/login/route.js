import supabase from "@/config/supabase-client";
import { NextResponse } from "next/server";
import { comparePassword } from "@/utils/auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request) {
  return NextResponse.json({ message: "Hello, world!" }, { status: 200 });
}

export async function POST(request) {
  const cookieStore = await cookies();
  const { email, password } = await request.json();
  const { error, data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  console.log(password, user.password);
  const isPasswordValid = await comparePassword(password, user.password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.NEXT_PUBLIC_JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  cookieStore.set("token", token, {
    secure: true,
    path: "/",
    // httpOnly: true,
    maxAge: 3600,
  });
  return NextResponse.json({ token }, { status: 200 });
}
