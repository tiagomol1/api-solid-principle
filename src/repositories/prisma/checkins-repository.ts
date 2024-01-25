import { prisma } from '@/lib/prisma'
import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository{

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>{
    const user = await prisma.checkIn.create({
      data
    })

    return user
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    return null
  }

}
