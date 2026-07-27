import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

type UserData = {
  email: string;
  name: string;
  password: string;
};

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method Not Allowed", status: 405 });
  }

  const userData: UserData = await req.json();

  userData.email = userData.email.toLowerCase();

  // Check if all fields are filled
  const requiredFields = [userData.email, userData.name, userData.password];
  if (requiredFields.some((field) => !field)) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  // Check if user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User with this email already exists" },
      { status: 409 }
    );
  }

  try {
    //Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { message: "User created", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "User not created" }, { status: 500 });
  }
}
