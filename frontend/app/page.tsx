// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Tự động chuyển hướng người dùng từ "/" sang "/login"
  redirect('/page/login');
}