import Cookies from 'js-cookie';
import {
  generateSessionId,
  getSessionId,
  assignVariant,
  getCurrentVariant,
  clearABTestData,
  isVariant
} from '@/lib/ab-testing';
import { ABTestConfig } from '@/types';

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn()
}));

const mockCookies = require('js-cookie');

describe('A/B Testing Integration Tests', () => {
  let cookieStore: Record<string, string> = {};

  beforeEach(() => {
    // Reset cookie store
    cookieStore = {};
    
    // Mock cookie operations to use our in-memory store
    mockCookies.get.mockImplementation((key: string) => cookieStore[key]);
    mockCookies.set.mockImplementation((key: string, value: string) => {
      cookieStore[key] = value;
      return undefined as any;
    });
    mockCookies.remove.mockImplementation((key: string) => {
      delete cookieStore[key];
      return undefined as any;
    });
    
    jest.clearAllMocks();
  });

  describe('Complete A/B Testing Flow', () => {
    it('should handle complete user journey with variant A assignment', () => {
      // Mock random to ensure variant A assignment
      jest.spyOn(Math, 'random').mockReturnValue(0.3); // 30% < 50%
      
      const config: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 50, B: 50 }
      };
      
      // Step 1: User visits site, gets assigned variant A
      const variant = assignVariant(config);
      expect(variant).toBe('A');
      expect(cookieStore['ab_test_variant']).toBe('A');
      
      // Step 2: Check current variant
      const currentVariant = getCurrentVariant();
      expect(currentVariant).toBe('A');
      
      // Step 3: Verify variant check
      expect(isVariant('A')).toBe(true);
      expect(isVariant('B')).toBe(false);
      
      // Step 4: Subsequent visits should return same variant
      const secondVisit = assignVariant(config);
      expect(secondVisit).toBe('A');
      
      (Math.random as jest.Mock).mockRestore();
    });

    it('should handle complete user journey with variant B assignment', () => {
      // Mock random to ensure variant B assignment
      jest.spyOn(Math, 'random').mockReturnValue(0.7); // 70% >= 50%
      
      const config: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 50, B: 50 }
      };
      
      // Step 1: User visits site, gets assigned variant B
      const variant = assignVariant(config);
      expect(variant).toBe('B');
      expect(cookieStore['ab_test_variant']).toBe('B');
      
      // Step 2: Check current variant
      const currentVariant = getCurrentVariant();
      expect(currentVariant).toBe('B');
      
      // Step 3: Verify variant check
      expect(isVariant('B')).toBe(true);
      expect(isVariant('A')).toBe(false);
      
      // Step 4: Subsequent visits should return same variant
      const secondVisit = assignVariant(config);
      expect(secondVisit).toBe('B');
      
      (Math.random as jest.Mock).mockRestore();
    });

    it('should handle session management alongside A/B testing', () => {
      const mockDate = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.123456789) // For session ID generation
        .mockReturnValueOnce(0.4); // For variant assignment (40% < 50% = A)
      
      // Step 1: Get session ID (should create new one)
      const sessionId = getSessionId();
      expect(sessionId).toMatch(/^\d+-[a-z0-9]+$/);
      expect(cookieStore['session_id']).toBe(sessionId);
      
      // Step 2: Assign variant
      const variant = assignVariant();
      expect(variant).toBe('A');
      expect(cookieStore['ab_test_variant']).toBe('A');
      
      // Step 3: Subsequent session ID calls should return same ID
      const sameSessionId = getSessionId();
      expect(sameSessionId).toBe(sessionId);
      
      (Date.now as jest.Mock).mockRestore();
      (Math.random as jest.Mock).mockRestore();
    });

    it('should handle data clearing and reset', () => {
      // Set up initial state
      jest.spyOn(Math, 'random').mockReturnValue(0.3);
      
      const variant = assignVariant();
      const sessionId = getSessionId();
      
      expect(cookieStore['ab_test_variant']).toBe('A');
      expect(cookieStore['session_id']).toBeDefined();
      
      // Clear data
      clearABTestData();
      
      expect(cookieStore['ab_test_variant']).toBeUndefined();
      expect(cookieStore['session_id']).toBeUndefined();
      
      // Verify functions return appropriate values after clearing
      expect(getCurrentVariant()).toBe(null);
      expect(isVariant('A')).toBe(false);
      expect(isVariant('B')).toBe(false);
      
      (Math.random as jest.Mock).mockRestore();
    });
  });

  describe('Traffic Split Scenarios', () => {
    it('should distribute traffic according to 70/30 split', () => {
      const config: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 70, B: 30 }
      };
      
      // Test edge cases around the 70% threshold
      const testCases = [
        { random: 0.69, expected: 'A' }, // 69% < 70%
        { random: 0.70, expected: 'B' }, // 70% >= 70%
        { random: 0.71, expected: 'B' }  // 71% >= 70%
      ];
      
      testCases.forEach(({ random, expected }, index) => {
        // Clear previous assignment
        clearABTestData();
        
        jest.spyOn(Math, 'random').mockReturnValue(random);
        
        const variant = assignVariant(config);
        expect(variant).toBe(expected);
        
        (Math.random as jest.Mock).mockRestore();
      });
    });

    it('should handle extreme traffic splits', () => {
      const extremeConfigs = [
        { config: { enabled: true, trafficSplit: { A: 1, B: 99 } }, random: 0.005, expected: 'A' },
        { config: { enabled: true, trafficSplit: { A: 1, B: 99 } }, random: 0.02, expected: 'B' },
        { config: { enabled: true, trafficSplit: { A: 99, B: 1 } }, random: 0.98, expected: 'A' },
        { config: { enabled: true, trafficSplit: { A: 99, B: 1 } }, random: 0.995, expected: 'B' }
      ];
      
      extremeConfigs.forEach(({ config, random, expected }, index) => {
        // Clear previous assignment
        clearABTestData();
        
        jest.spyOn(Math, 'random').mockReturnValue(random);
        
        const variant = assignVariant(config as ABTestConfig);
        expect(variant).toBe(expected);
        
        (Math.random as jest.Mock).mockRestore();
      });
    });
  });

  describe('Disabled A/B Testing', () => {
    it('should always return variant A when testing is disabled', () => {
      const disabledConfig: ABTestConfig = {
        enabled: false,
        trafficSplit: { A: 50, B: 50 }
      };
      
      // Test multiple random values - should always get A
      const randomValues = [0.1, 0.5, 0.9];
      
      randomValues.forEach((randomValue) => {
        clearABTestData();
        jest.spyOn(Math, 'random').mockReturnValue(randomValue);
        
        const variant = assignVariant(disabledConfig);
        expect(variant).toBe('A');
        expect(isVariant('A')).toBe(true);
        expect(isVariant('B')).toBe(false);
        
        (Math.random as jest.Mock).mockRestore();
      });
    });
  });

  describe('Persistence and Consistency', () => {
    it('should maintain variant assignment across multiple function calls', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.7); // Should assign B
      
      const config: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 50, B: 50 }
      };
      
      // First assignment
      const firstVariant = assignVariant(config);
      expect(firstVariant).toBe('B');
      
      // Multiple subsequent calls should return same variant
      for (let i = 0; i < 5; i++) {
        const variant = assignVariant(config);
        expect(variant).toBe('B');
        expect(getCurrentVariant()).toBe('B');
        expect(isVariant('B')).toBe(true);
        expect(isVariant('A')).toBe(false);
      }
      
      (Math.random as jest.Mock).mockRestore();
    });

    it('should handle variant switching after data clear', () => {
      // First assignment
      jest.spyOn(Math, 'random').mockReturnValue(0.3); // A
      let variant = assignVariant();
      expect(variant).toBe('A');
      (Math.random as jest.Mock).mockRestore();
      
      // Clear and reassign
      clearABTestData();
      jest.spyOn(Math, 'random').mockReturnValue(0.7); // B
      variant = assignVariant();
      expect(variant).toBe('B');
      (Math.random as jest.Mock).mockRestore();
      
      // Verify new assignment is persistent
      expect(getCurrentVariant()).toBe('B');
      expect(isVariant('B')).toBe(true);
    });
  });
});