import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import type { User } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  // Path to the new mock data file
  const filePath = path.join(process.cwd(), 'src/data/clients_mock.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  let users: User[] = JSON.parse(fileContents);

  // Filtering logic
  const organization = searchParams.get('organization') || '';
  const username = searchParams.get('username') || '';
  const email = searchParams.get('email') || '';
  const date = searchParams.get('date') || '';
  const phoneNumber = searchParams.get('phoneNumber') || '';
  const status = searchParams.get('status') || '';

  users = users.filter((user: User) => {
    if (organization && !user.organization.toLowerCase().includes(organization.toLowerCase())) return false;
    if (username && !user.username.toLowerCase().includes(username.toLowerCase())) return false;
    if (email && !user.email.toLowerCase().includes(email.toLowerCase())) return false;
    if (date && !user.dateJoined.startsWith(date)) return false;
    if (phoneNumber && !user.phoneNumber.includes(phoneNumber)) return false;
    if (status && user.status.toLowerCase() !== status.toLowerCase()) return false;
    return true;
  });

  const total = users.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedUsers = users.slice(start, end);

  return NextResponse.json({
    users: paginatedUsers,
    total,
    page,
    pageSize
  });
} 