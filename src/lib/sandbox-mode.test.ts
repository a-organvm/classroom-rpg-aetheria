/**
 * Tests for Sandbox Mode utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  isSandboxMode,
  enableSandboxMode,
  disableSandboxMode,
  toggleSandboxMode,
  getSandboxKey,
  resetSandboxData,
  getDemoRealms,
  getDemoQuests,
  getDemoProfile,
  getDemoSubmissions,
  getDemoCrystals,
  initializeSandboxData,
  needsSandboxInitialization,
  SANDBOX_MODE_KEY
} from './sandbox-mode'

// Create a mock localStorage
const createMockLocalStorage = () => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] || null
  }
}

describe('Sandbox Mode', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>

  beforeEach(() => {
    // Create fresh mock localStorage for each test
    mockLocalStorage = createMockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    })

    // Clear URL parameters (mock)
    delete (window as any).location
    ;(window as any).location = { search: '' }
  })

  afterEach(() => {
    mockLocalStorage.clear()
  })

  describe('isSandboxMode', () => {
    it('should return false by default', () => {
      expect(isSandboxMode()).toBe(false)
    })

    it('should return true when localStorage flag is set', () => {
      localStorage.setItem(SANDBOX_MODE_KEY, 'true')
      expect(isSandboxMode()).toBe(true)
    })

    it('should return true when URL parameter sandbox=true', () => {
      ;(window as any).location = { search: '?sandbox=true' }
      expect(isSandboxMode()).toBe(true)
    })

    it('should return true when URL parameter demo=true', () => {
      ;(window as any).location = { search: '?demo=true' }
      expect(isSandboxMode()).toBe(true)
    })
  })

  describe('enableSandboxMode', () => {
    it('should set the sandbox mode flag', () => {
      enableSandboxMode()
      expect(localStorage.getItem(SANDBOX_MODE_KEY)).toBe('true')
      expect(isSandboxMode()).toBe(true)
    })
  })

  describe('disableSandboxMode', () => {
    it('should remove the sandbox mode flag', () => {
      localStorage.setItem(SANDBOX_MODE_KEY, 'true')
      disableSandboxMode()
      expect(localStorage.getItem(SANDBOX_MODE_KEY)).toBeNull()
      expect(isSandboxMode()).toBe(false)
    })
  })

  describe('toggleSandboxMode', () => {
    it('should enable sandbox mode when disabled', () => {
      const result = toggleSandboxMode()
      expect(result).toBe(true)
      expect(isSandboxMode()).toBe(true)
    })

    it('should disable sandbox mode when enabled', () => {
      enableSandboxMode()
      const result = toggleSandboxMode()
      expect(result).toBe(false)
      expect(isSandboxMode()).toBe(false)
    })
  })

  describe('getSandboxKey', () => {
    it('should return the original key when not in sandbox mode', () => {
      expect(getSandboxKey('test-key')).toBe('test-key')
    })

    it('should prepend "sandbox-" when in sandbox mode', () => {
      enableSandboxMode()
      expect(getSandboxKey('test-key')).toBe('sandbox-test-key')
    })
  })

  describe('resetSandboxData', () => {
    it('should not reset data when not in sandbox mode', () => {
      localStorage.setItem('normal-key', 'value')
      resetSandboxData()
      expect(localStorage.getItem('normal-key')).toBe('value')
    })

    it('should clear sandbox keys when in sandbox mode', () => {
      enableSandboxMode()
      localStorage.setItem('sandbox-key1', 'value1')
      localStorage.setItem('sandbox-key2', 'value2')
      localStorage.setItem('normal-key', 'value')
      
      resetSandboxData()
      
      expect(localStorage.getItem('sandbox-key1')).toBeNull()
      expect(localStorage.getItem('sandbox-key2')).toBeNull()
      expect(localStorage.getItem('normal-key')).toBe('value')
    })
  })

  describe('getDemoRealms', () => {
    it('should return an array of demo realms', () => {
      const realms = getDemoRealms()
      expect(Array.isArray(realms)).toBe(true)
      expect(realms.length).toBeGreaterThan(0)
      expect(realms[0]).toHaveProperty('id')
      expect(realms[0]).toHaveProperty('name')
      expect(realms[0]).toHaveProperty('description')
    })

    it('should have valid realm properties', () => {
      const realms = getDemoRealms()
      realms.forEach(realm => {
        expect(realm.id).toMatch(/^realm-demo-/)
        expect(realm.name).toBeTruthy()
        expect(realm.difficulty).toMatch(/^(beginner|intermediate|advanced)$/)
        expect(realm.xpReward).toBeGreaterThan(0)
      })
    })
  })

  describe('getDemoQuests', () => {
    it('should return an array of demo quests', () => {
      const quests = getDemoQuests()
      expect(Array.isArray(quests)).toBe(true)
      expect(quests.length).toBeGreaterThan(0)
      expect(quests[0]).toHaveProperty('id')
      expect(quests[0]).toHaveProperty('title')
      expect(quests[0]).toHaveProperty('realmId')
    })

    it('should have valid quest properties', () => {
      const quests = getDemoQuests()
      quests.forEach(quest => {
        expect(quest.id).toMatch(/^quest-demo-/)
        expect(quest.realmId).toMatch(/^realm-demo-/)
        expect(quest.title).toBeTruthy()
        expect(quest.xpReward).toBeGreaterThan(0)
        expect(Array.isArray(quest.objectives)).toBe(true)
      })
    })
  })

  describe('getDemoProfile', () => {
    it('should return a valid demo profile', () => {
      const profile = getDemoProfile()
      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('name')
      expect(profile).toHaveProperty('role')
      expect(profile).toHaveProperty('xp')
      expect(profile).toHaveProperty('level')
      expect(profile).toHaveProperty('artifacts')
    })

    it('should have demo user ID', () => {
      const profile = getDemoProfile()
      expect(profile.id).toMatch(/^demo-user-/)
    })
  })

  describe('getDemoSubmissions', () => {
    it('should return an array of demo submissions', () => {
      const submissions = getDemoSubmissions()
      expect(Array.isArray(submissions)).toBe(true)
      expect(submissions[0]).toHaveProperty('id')
      expect(submissions[0]).toHaveProperty('questId')
      expect(submissions[0]).toHaveProperty('studentId')
    })
  })

  describe('getDemoCrystals', () => {
    it('should return an array of demo crystals', () => {
      const crystals = getDemoCrystals()
      expect(Array.isArray(crystals)).toBe(true)
      expect(crystals[0]).toHaveProperty('id')
      expect(crystals[0]).toHaveProperty('title')
      expect(crystals[0]).toHaveProperty('content')
    })
  })

  describe('initializeSandboxData', () => {
    it('should throw error when not in sandbox mode', () => {
      expect(() => initializeSandboxData()).toThrow()
    })

    it('should return all demo data when in sandbox mode', () => {
      enableSandboxMode()
      const data = initializeSandboxData()
      
      expect(data).toHaveProperty('realms')
      expect(data).toHaveProperty('quests')
      expect(data).toHaveProperty('profile')
      expect(data).toHaveProperty('submissions')
      expect(data).toHaveProperty('crystals')
      
      expect(Array.isArray(data.realms)).toBe(true)
      expect(Array.isArray(data.quests)).toBe(true)
      expect(Array.isArray(data.submissions)).toBe(true)
      expect(Array.isArray(data.crystals)).toBe(true)
    })
  })

  describe('needsSandboxInitialization', () => {
    it('should return false when not in sandbox mode', () => {
      expect(needsSandboxInitialization()).toBe(false)
    })

    it('should return true when in sandbox mode with no data', () => {
      enableSandboxMode()
      expect(needsSandboxInitialization()).toBe(true)
    })

    it('should return false when sandbox data exists', () => {
      enableSandboxMode()
      localStorage.setItem('sandbox-aetheria-realms', '[]')
      localStorage.setItem('sandbox-aetheria-quests', '[]')
      expect(needsSandboxInitialization()).toBe(false)
    })
  })
})
