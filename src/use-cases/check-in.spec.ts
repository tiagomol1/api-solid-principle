import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'

let CheckInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {

  beforeEach(() => {
    CheckInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(CheckInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
    })

    await expect(() => sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
    })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
    })

    vi.setSystemTime(new Date(2024, 0, 23, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

})
