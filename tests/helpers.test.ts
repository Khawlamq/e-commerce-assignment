import { describe, it, expect, vi } from 'vitest'
import { setTimeForMsg } from '../src/assets/js/helpers.ts'

describe('Helper Functions', () => {
  it('should set and clear message after timeout', async () => {
    const mockStore = { message: '' }
    vi.useFakeTimers()
    
    setTimeForMsg(mockStore, 'Test message', 1000)
    
    expect(mockStore.message).toBe('Test message')
    
    vi.advanceTimersByTime(1000)
    expect(mockStore.message).toBe('')
    
    vi.useRealTimers()
  })
})