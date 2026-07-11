"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, requireAuth } from "@/lib/auth";
import {
  isLeadStatus,
  isRole,
  isTaskStatus,
  PRODUCT_OPTIONS,
  type LeadStatus,
  type Role,
  type TaskStatus,
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

function getOptionalId(formData: FormData, key: string): number | null {
  const value = getString(formData, key);
  if (!value) return null;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function revalidateCrm() {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/pipeline");
  revalidatePath("/admin/companies");
  revalidatePath("/admin/contacts");
  revalidatePath("/admin/tasks");
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

  redirect("/admin");
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
  revalidateCrm();

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

  revalidateCrm();
  revalidatePath(`/admin/leads/${id}`);

  return { success: "Holat yangilandi." };
}

export async function updateLead(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const id = getOptionalId(formData, "id");
  if (!id) {
    return { error: "Noto'g'ri ariza identifikatori." };
  }

  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const product = getString(formData, "product");
  const notes = getString(formData, "notes");
  const status = getString(formData, "status");
  const companyId = getOptionalId(formData, "companyId");
  const contactId = getOptionalId(formData, "contactId");
  const assignedToId = getOptionalId(formData, "assignedToId");

  if (!name || name.length < 2) {
    return { error: "Ism kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  if (!phone || phone.length < 7) {
    return { error: "To'g'ri telefon raqamini kiriting." };
  }

  if (!product) {
    return { error: "Mahsulot maydonini to'ldiring." };
  }

  if (!isLeadStatus(status)) {
    return { error: "Noto'g'ri holat tanlandi." };
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return { error: "Ariza topilmadi." };
  }

  await prisma.lead.update({
    where: { id },
    data: {
      name,
      phone,
      product,
      notes: notes || null,
      status,
      companyId,
      contactId,
      assignedToId,
    },
  });

  revalidateCrm();
  revalidatePath(`/admin/leads/${id}`);

  return { success: "Ariza yangilandi." };
}

export async function deleteLead(id: number): Promise<ActionState> {
  await requireAuth();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri ariza identifikatori." };
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return { error: "Ariza topilmadi." };
  }

  await prisma.lead.delete({ where: { id } });

  revalidateCrm();
  redirect("/admin/leads");
}

export async function addLeadNote(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAuth();

  const leadId = getOptionalId(formData, "leadId");
  const content = getString(formData, "content");

  if (!leadId) {
    return { error: "Noto'g'ri ariza identifikatori." };
  }

  if (!content || content.length < 2) {
    return { error: "Izoh kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) {
    return { error: "Ariza topilmadi." };
  }

  await prisma.leadNote.create({
    data: {
      content,
      leadId,
      authorId: session.userId,
    },
  });

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");

  return { success: "Izoh qo'shildi." };
}

export async function createCompany(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const address = getString(formData, "address");
  const city = getString(formData, "city");
  const notes = getString(formData, "notes");

  if (!name || name.length < 2) {
    return { error: "Kompaniya nomi kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  await prisma.company.create({
    data: {
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      city: city || null,
      notes: notes || null,
    },
  });

  revalidateCrm();

  return { success: "Kompaniya qo'shildi." };
}

export async function updateCompany(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const id = getOptionalId(formData, "id");
  if (!id) {
    return { error: "Noto'g'ri kompaniya identifikatori." };
  }

  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const address = getString(formData, "address");
  const city = getString(formData, "city");
  const notes = getString(formData, "notes");

  if (!name || name.length < 2) {
    return { error: "Kompaniya nomi kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    return { error: "Kompaniya topilmadi." };
  }

  await prisma.company.update({
    where: { id },
    data: {
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      city: city || null,
      notes: notes || null,
    },
  });

  revalidateCrm();
  revalidatePath(`/admin/companies/${id}`);

  return { success: "Kompaniya yangilandi." };
}

export async function deleteCompany(id: number): Promise<ActionState> {
  await requireAuth();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri kompaniya identifikatori." };
  }

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    return { error: "Kompaniya topilmadi." };
  }

  await prisma.company.delete({ where: { id } });

  revalidateCrm();

  return { success: "Kompaniya o'chirildi." };
}

export async function createContact(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const position = getString(formData, "position");
  const notes = getString(formData, "notes");
  const companyId = getOptionalId(formData, "companyId");

  if (!name || name.length < 2) {
    return { error: "Ism kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  if (!phone || phone.length < 7) {
    return { error: "To'g'ri telefon raqamini kiriting." };
  }

  await prisma.contact.create({
    data: {
      name,
      phone,
      email: email || null,
      position: position || null,
      notes: notes || null,
      companyId,
    },
  });

  revalidateCrm();

  return { success: "Kontakt qo'shildi." };
}

export async function updateContact(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const id = getOptionalId(formData, "id");
  if (!id) {
    return { error: "Noto'g'ri kontakt identifikatori." };
  }

  const name = getString(formData, "name");
  const phone = getString(formData, "phone");
  const email = getString(formData, "email");
  const position = getString(formData, "position");
  const notes = getString(formData, "notes");
  const companyId = getOptionalId(formData, "companyId");

  if (!name || name.length < 2) {
    return { error: "Ism kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  if (!phone || phone.length < 7) {
    return { error: "To'g'ri telefon raqamini kiriting." };
  }

  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) {
    return { error: "Kontakt topilmadi." };
  }

  await prisma.contact.update({
    where: { id },
    data: {
      name,
      phone,
      email: email || null,
      position: position || null,
      notes: notes || null,
      companyId,
    },
  });

  revalidateCrm();
  revalidatePath(`/admin/contacts/${id}`);

  return { success: "Kontakt yangilandi." };
}

export async function deleteContact(id: number): Promise<ActionState> {
  await requireAuth();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri kontakt identifikatori." };
  }

  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) {
    return { error: "Kontakt topilmadi." };
  }

  await prisma.contact.delete({ where: { id } });

  revalidateCrm();

  return { success: "Kontakt o'chirildi." };
}

export async function createTask(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAuth();

  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const dueDateRaw = getString(formData, "dueDate");
  const leadId = getOptionalId(formData, "leadId");
  const assignedToId = getOptionalId(formData, "assignedToId") ?? session.userId;

  if (!title || title.length < 2) {
    return { error: "Vazifa nomi kamida 2 ta belgidan iborat bo'lishi kerak." };
  }

  const assignee = await prisma.user.findUnique({ where: { id: assignedToId } });
  if (!assignee) {
    return { error: "Mas'ul xodim topilmadi." };
  }

  if (leadId) {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) {
      return { error: "Ariza topilmadi." };
    }
  }

  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;
  if (dueDateRaw && Number.isNaN(dueDate?.getTime())) {
    return { error: "Noto'g'ri muddat." };
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      dueDate,
      leadId,
      assignedToId,
      status: "Open",
    },
  });

  revalidateCrm();
  if (leadId) {
    revalidatePath(`/admin/leads/${leadId}`);
  }

  return { success: "Vazifa yaratildi." };
}

export async function updateTaskStatus(
  id: number,
  status: TaskStatus,
): Promise<ActionState> {
  await requireAuth();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri vazifa identifikatori." };
  }

  if (!isTaskStatus(status)) {
    return { error: "Noto'g'ri holat." };
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return { error: "Vazifa topilmadi." };
  }

  await prisma.task.update({
    where: { id },
    data: {
      status,
      completedAt: status === "Done" ? new Date() : null,
    },
  });

  revalidateCrm();
  if (task.leadId) {
    revalidatePath(`/admin/leads/${task.leadId}`);
  }

  return { success: "Vazifa holati yangilandi." };
}

export async function deleteTask(id: number): Promise<ActionState> {
  await requireAuth();

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "Noto'g'ri vazifa identifikatori." };
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return { error: "Vazifa topilmadi." };
  }

  await prisma.task.delete({ where: { id } });

  revalidateCrm();
  if (task.leadId) {
    revalidatePath(`/admin/leads/${task.leadId}`);
  }

  return { success: "Vazifa o'chirildi." };
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
