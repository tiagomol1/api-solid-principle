import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let CheckInRepository: InMemoryCheckInsRepository
let GymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {

  beforeEach(() => {
    CheckInRepository = new InMemoryCheckInsRepository()
    GymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(CheckInRepository, GymsRepository)

    GymsRepository.items.push({
      id: 'gym-1',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-26.2918719),
      longitude: new Decimal(-48.864752),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -26.2918719,
      userLongitude: -48.864752,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -26.2918719,
      userLongitude: -48.864752,
    })

    await expect(() => sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -26.2918719,
      userLongitude: -48.864752,
    })).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -26.2918719,
      userLongitude: -48.864752,
    })

    vi.setSystemTime(new Date(2024, 0, 23, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -26.2918719,
      userLongitude: -48.864752,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    GymsRepository.items.push({
      id: 'gym-2',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-26.0328807),
      longitude: new Decimal(-48.6957264)
    })

    await expect(() => sut.execute({
      gymId: 'gym-2',
      userId: 'user-1',
      userLatitude: -26.2918719,
      userLongitude: -48.864752,
    })).rejects.toBeInstanceOf(Error)
  })

})
