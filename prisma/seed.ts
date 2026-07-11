import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      role: "Admin",
    },
  });

  const managerPassword = await bcrypt.hash("menejer123", 12);
  const manager = await prisma.user.upsert({
    where: { username: "menejer" },
    update: {},
    create: {
      username: "menejer",
      password: managerPassword,
      role: "Menejer",
    },
  });

  const existingCompanies = await prisma.company.count();
  if (existingCompanies === 0) {
    const companyA = await prisma.company.create({
      data: {
        name: "Samarqand Textile",
        phone: "+998 66 123 45 67",
        email: "info@samtex.uz",
        city: "Samarqand",
        address: "Registon ko'chasi 12",
        notes: "Ulgurji mato mijoz",
      },
    });

    const companyB = await prisma.company.create({
      data: {
        name: "Toshkent Fashion Hub",
        phone: "+998 71 200 30 40",
        email: "orders@tfh.uz",
        city: "Toshkent",
        address: "Chorsu savdo majmuasi",
      },
    });

    const contactA = await prisma.contact.create({
      data: {
        name: "Aziza Karimova",
        phone: "+998 90 123 45 67",
        email: "aziza@samtex.uz",
        position: "Xarid menejeri",
        companyId: companyA.id,
      },
    });

    const contactB = await prisma.contact.create({
      data: {
        name: "Jasur Toshmatov",
        phone: "+998 91 234 56 78",
        position: "Direktor",
        companyId: companyB.id,
      },
    });

    const existingLeads = await prisma.lead.count();
    if (existingLeads === 0) {
      const leadA = await prisma.lead.create({
        data: {
          name: "Aziza Karimova",
          phone: "+998 90 123 45 67",
          product: "Mato",
          status: "Yangi",
          companyId: companyA.id,
          contactId: contactA.id,
          assignedToId: manager.id,
          notes: "Birinchi partiya — 500 dona",
        },
      });

      await prisma.lead.create({
        data: {
          name: "Jasur Toshmatov",
          phone: "+998 91 234 56 78",
          product: "Triko",
          status: "Ko'rib chiqilmoqda",
          companyId: companyB.id,
          contactId: contactB.id,
          assignedToId: admin.id,
        },
      });

      await prisma.lead.create({
        data: {
          name: "Dilnoza Rahimova",
          phone: "+998 93 555 12 34",
          product: "Denim",
          status: "Bog'landi",
          assignedToId: manager.id,
        },
      });

      await prisma.leadNote.create({
        data: {
          content: "Mijoz narx ro'yxatini so'radi. Ertalab yuboriladi.",
          leadId: leadA.id,
          authorId: manager.id,
        },
      });

      await prisma.task.createMany({
        data: [
          {
            title: "Narx ro'yxatini yuborish",
            description: "Mato kategoriyasi uchun wholesale narxlar",
            status: "Open",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
            leadId: leadA.id,
            assignedToId: manager.id,
          },
          {
            title: "Haftalik follow-up qo'ng'iroq",
            status: "Open",
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            assignedToId: admin.id,
          },
        ],
      });
    }
  } else {
    const existingLeads = await prisma.lead.count();
    if (existingLeads === 0) {
      await prisma.lead.createMany({
        data: [
          {
            name: "Aziza Karimova",
            phone: "+998 90 123 45 67",
            product: "Mato",
            status: "Yangi",
          },
          {
            name: "Jasur Toshmatov",
            phone: "+998 91 234 56 78",
            product: "Triko",
            status: "Ko'rib chiqilmoqda",
          },
        ],
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
