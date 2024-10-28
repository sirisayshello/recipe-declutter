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
  if (req.method === "POST") {
    const userData: UserData = await req.json();

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
        },
      });
      return NextResponse.json({ message: "User created", user });
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ message: "User not created", error });
    }
  } else {
    return NextResponse.json({ message: "Method Not Allowed", status: 405 });
  }
}
