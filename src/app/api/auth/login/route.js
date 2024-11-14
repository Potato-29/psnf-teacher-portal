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
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const { error: teacherError, data: teacherProfile } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();

  const { error: classError, data: classInfo } = await supabase
    .from("classes")
    .select("*")
    .eq("id", teacherProfile.class)
    .single();

  if (!classInfo) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }
  if (!teacherProfile) {
    return NextResponse.json(
      { error: "Teacher profile not found" },
      { status: 404 }
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      user: {
        first_name: teacherProfile.first_name,
        last_name: teacherProfile.last_name,
        class: teacherProfile.class,
        className: classInfo.class_name,
        created_at: teacherProfile.created_at,
        updated_at: teacherProfile.updated_at,
      },
    },
    process.env.JWT_SECRET,
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
