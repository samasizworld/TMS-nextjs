import { NextResponse } from 'next/server';

export const GET = function (res: Response) {
  return NextResponse.json({ message: "Ok" }, { status: 200 })
}