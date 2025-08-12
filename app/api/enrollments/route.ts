// app/api/enrollments/route.ts
// This route has been removed - enrollments are now handled by the NestJS backend
// The frontend should make direct API calls to the NestJS backend

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved to the NestJS backend",
      message: "Please update your frontend to call the NestJS backend directly"
    },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved to the NestJS backend",
      message: "Please update your frontend to call the NestJS backend directly"
    },
    { status: 410 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { 
      error: "This endpoint has been moved to the NestJS backend",
      message: "Please update your frontend to call the NestJS backend directly"
    },
    { status: 410 }
  );
}
