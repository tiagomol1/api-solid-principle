import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface CheckInUseCaseRequest{
  userId: string
  gymId: string
}
interface CheckInUseCaseReply {
  checkIn: CheckIn
}

export class CheckInUseCase{

  constructor(private checkInRepository: CheckInsRepository){}

  async execute({
    userId,
    gymId
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseReply>{

    const checkInOnSameDate = await  this.checkInRepository.findByUserIdOnDate(userId, new Date())

    if(checkInOnSameDate){
      throw new Error()
    }

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id : userId,
    })

    return { checkIn }

  }

}
