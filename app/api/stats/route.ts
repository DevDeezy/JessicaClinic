import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const now = new Date()

    const [totalClients, todayAppointments, weekAppointments, monthAppointments] = await Promise.all([
      prisma.client.count({
        where: { userId }
      }),
      prisma.appointment.count({
        where: {
          userId,
          date: {
            gte: startOfDay(now),
            lte: endOfDay(now)
          }
        }
      }),
      prisma.appointment.count({
        where: {
          userId,
          date: {
            gte: startOfWeek(now, { weekStartsOn: 1 }),
            lte: endOfWeek(now, { weekStartsOn: 1 })
          }
        }
      }),
      prisma.appointment.count({
        where: {
          userId,
          date: {
            gte: startOfMonth(now),
            lte: endOfMonth(now)
          }
        }
      })
    ])

    return NextResponse.json({
      totalClients,
      todayAppointments,
      weekAppointments,
      monthAppointments
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

