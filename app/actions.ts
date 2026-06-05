"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAuth } from "@/lib/auth";
import {
  isLeadStatus,
  isRole,
  PRODUCT_OPTIONS,
  type LeadStatus,
  type Role,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, setSessionCookie } from "@/lib/session";

export type ActionState = {
  error?: string;
  success?: string;
} | null;

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginUser(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (!username || !password) {
    return { error: "Foydalanuvchi nomi va parol talab qilinadi." };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Noto'g'ri foydalanuvchi nomi yoki parol." };
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    return { error: "Noto'g'ri foydalanuvchi nomi yoki parol." };
  }

  if (!isRole(user.role)) {
    return { error: "Foydalanuvchi roli noto'g'ri sozlangan." };
  }

  await setSessionCookie({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  redirect("/admin/leads");
}

export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}

export async function createLead(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const productCategory = getString(formData, "product");
  const productNote = getString(formData, "productNote");

  if (!name || name.length < 2) {
    return { error: "Ism kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  if (!phone || phone.length < 7) {
    return { error: "To'g'ri telefon raqamini kiriting." };
  }

  if (!productCategory) {
    return { error: "Mahsulot turini tanlang." };
  }

  if (!(PRODUCT_OPTIONS as readonly string[]).includes(productCategory)) {
    return { error: "Noto'g'ri mahsulot turi tanlandi." };
  }

  const product = productNote
    ? `${productCategory} — ${productNote}`
    : productCategory;

  await prisma.lead.create({
    data: {
      name,
      phone,
      product,
      status: "Yangi",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/leads");

  return { success: "Arizangiz qabul qilindi. Tez orada siz bilan bog'lanamiz." };
}

export async function updateLeadStatus(
  id: number,
  status: LeadStatus,
): Promise<ActionState> {
  await requireAuth();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri ariza identifikatori." };
  }

  if (!isLeadStatus(status)) {
    return { error: "Noto'g'ri holat tanlandi." };
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    return { error: "Ariza topilmadi." };
  }

  await prisma.lead.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/leads");

  return { success: "Holat yangilandi." };
}

export async function createUser(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const username = getString(formData, "username");
  const password = getString(formData, "password");
  const role = getString(formData, "role");

  if (!username || username.length < 3) {
    return { error: "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak." };
  }

  if (!password || password.length < 6) {
    return { error: "Parol kamida 6 ta belgidan iborat bo'lishi kerak." };
  }

  if (!isRole(role)) {
    return { error: "Noto'g'ri rol tanlandi." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return { error: "Bu foydalanuvchi nomi allaqachon mavjud." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: role as Role,
    },
  });

  revalidatePath("/admin/users");

  return { success: "Xodim muvaffaqiyatli qo'shildi." };
}

export async function deleteUser(id: number): Promise<ActionState> {
  const session = await requireAdmin();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri foydalanuvchi identifikatori." };
  }

  if (session.userId === id) {
    return { error: "O'z hisobingizni o'chira olmaysiz." };
  }

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return { error: "Foydalanuvchi topilmadi." };
  }

  if (user.role === "Admin") {
    const adminCount = await prisma.user.count({
      where: { role: "Admin" },
    });

    if (adminCount <= 1) {
      return { error: "Oxirgi adminni o'chirib bo'lmaydi." };
    }
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/admin/users");

  return { success: "Foydalanuvchi o'chirildi." };
}
