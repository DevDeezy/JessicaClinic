import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const upcoming = searchParams.get('upcoming') === 'true'
    const date = searchParams.get('date')
    const clientId = searchParams.get('clientId')

    const where: any = {
      userId: session.user.id
    }

    if (upcoming) {
      where.date = { gte: new Date() }
      where.status = 'scheduled'
    }

    if (date) {
      const targetDate = new Date(date)
      where.date = {
        gte: startOfDay(targetDate),
        lte: endOfDay(targetDate)
      }
    }

    if (clientId) {
      where.clientId = clientId
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        comments: true,
        files: true
      },
      orderBy: { date: 'asc' },
      take: limit
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { clientId, date, duration, type, notes } = body

    if (!clientId || !date) {
      return NextResponse.json({ error: 'Client and date are required' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId,
        userId: session.user.id,
        date: new Date(date),
        duration: duration || 60,
        type: type || 'consulta',
        notes,
        status: 'scheduled'
      },
      include: {
        client: true
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

