import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Create default fisioterapeuta user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@jessica.pt' },
    update: {},
    create: {
      email: 'admin@jessica.pt',
      password: hashedPassword,
      name: 'Dr. João Silva',
      role: 'fisioterapeuta',
      phone: '+351 912 345 678',
    },
  })

  console.log('Created user:', user.name)

  // Create some sample clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+351 923 456 789',
      birthDate: new Date('1985-03-15'),
      address: 'Rua das Flores, 123, Lisboa',
      occupation: 'Professora',
      emergencyContact: 'António Santos',
      emergencyPhone: '+351 934 567 890',
      medicalHistory: 'Cirurgia ao joelho em 2020',
      notes: 'Paciente dedicada, faz os exercícios em casa',
      userId: user.id,
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '+351 945 678 901',
      birthDate: new Date('1990-07-22'),
      address: 'Av. da Liberdade, 456, Porto',
      occupation: 'Engenheiro',
      medicalHistory: 'Hérnia discal L4-L5',
      medications: 'Ibuprofeno quando necessário',
      userId: user.id,
    },
  })

  console.log('Created clients:', client1.name, client2.name)

  // Create some sample appointments
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  await prisma.appointment.create({
    data: {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      duration: 60,
      status: 'scheduled',
      type: 'consulta',
      notes: 'Avaliação inicial - dor lombar',
      clientId: client1.id,
      userId: user.id,
    },
  })

  await prisma.appointment.create({
    data: {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
      duration: 45,
      status: 'scheduled',
      type: 'sessao',
      notes: 'Sessão de reabilitação',
      clientId: client2.id,
      userId: user.id,
    },
  })

  await prisma.appointment.create({
    data: {
      date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
      duration: 60,
      status: 'scheduled',
      type: 'consulta',
      clientId: client1.id,
      userId: user.id,
    },
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
