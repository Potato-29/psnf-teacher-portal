import React from "react";
import { verifyToken } from "@/utils/auth";

export default async function SignUp({ searchParams }) {
  const { token } = searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Invalid invitation link</p>
      </div>
    );
  }

  try {
    const decodedToken = await verifyToken(token);

    if (Date.now() >= decodedToken.exp * 1000) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-500">Invitation link has expired</p>
        </div>
      );
    }

    return (
      <div>
        <h1>Create your account</h1>
        <p>Signing up with email: {decodedToken.email}</p>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Invalid invitation link</p>
      </div>
    );
  }
}
