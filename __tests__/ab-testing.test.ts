import {
  generateSessionId,
  getSessionId,
  assignVariant,
  getCurrentVariant,
  clearABTestData,
  isVariant,
} from '@/lib/ab-testing';
import { ABTestConfig } from '@/types';

// Mock js-cookie
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

const mockCookies = require('js-cookie');

describe('A/B Testing Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset crypto.randomUUID mock
    (global.crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid-123');
  });

  describe('generateSessionId', () => {
    it('should generate a session ID using timestamp and random string', () => {
      const mockDate = 1640995200000; // 2022-01-01 00:00:00
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);
      jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

      const sessionId = generateSessionId();

      expect(sessionId).toMatch(/^\d+-[a-z0-9]+$/);
      expect(sessionId).toContain('1640995200000-');

      (Date.now as jest.Mock).mockRestore();
      (Math.random as jest.Mock).mockRestore();
    });
  });

  describe('getSessionId', () => {
    it('should return existing session ID from cookie', () => {
      mockCookies.get.mockReturnValue('existing-session-id');

      const sessionId = getSessionId();

      expect(sessionId).toBe('existing-session-id');
      expect(mockCookies.get).toHaveBeenCalledWith('session_id');
      expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it('should generate and set new session ID when none exists', () => {
      mockCookies.get.mockReturnValue(undefined);
      const mockDate = 1640995200000;
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);
      jest.spyOn(Math, 'random').mockReturnValue(0.123456789);

      const sessionId = getSessionId();

      expect(sessionId).toMatch(/^\d+-[a-z0-9]+$/);
      expect(sessionId).toContain('1640995200000-');
      expect(mockCookies.get).toHaveBeenCalledWith('session_id');
      expect(mockCookies.set).toHaveBeenCalledWith('session_id', sessionId, {
        expires: 30,
        secure: false, // NODE_ENV is not production in tests
        sameSite: 'strict',
        path: '/',
      });

      (Date.now as jest.Mock).mockRestore();
      (Math.random as jest.Mock).mockRestore();
    });
  });

  describe('assignVariant', () => {
    const defaultConfig: ABTestConfig = {
      enabled: true,
      trafficSplit: { A: 50, B: 50 },
    };

    it('should return existing variant from cookie', () => {
      mockCookies.get.mockReturnValue('B');

      const variant = assignVariant(defaultConfig);

      expect(variant).toBe('B');
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
      expect(mockCookies.set).not.toHaveBeenCalled();
    });

    it('should return variant A when A/B testing is disabled', () => {
      mockCookies.get.mockReturnValue(undefined);
      const disabledConfig: ABTestConfig = {
        enabled: false,
        trafficSplit: { A: 50, B: 50 },
      };

      const variant = assignVariant(disabledConfig);

      expect(variant).toBe('A');
      expect(mockCookies.set).toHaveBeenCalledWith('ab_test_variant', 'A', {
        expires: 30,
        secure: false, // NODE_ENV is not production in tests
        sameSite: 'strict',
      });
    });

    it('should assign variant A when random number is less than traffic split', () => {
      mockCookies.get.mockReturnValue(undefined);
      jest.spyOn(Math, 'random').mockReturnValue(0.3); // 30% < 50%

      const variant = assignVariant(defaultConfig);

      expect(variant).toBe('A');
      expect(mockCookies.set).toHaveBeenCalledWith('ab_test_variant', 'A', {
        expires: 30,
        secure: false, // NODE_ENV is not production in tests
        sameSite: 'strict',
        path: '/',
      });

      (Math.random as jest.Mock).mockRestore();
    });

    it('should assign variant B when random number is greater than traffic split', () => {
      mockCookies.get.mockReturnValue(undefined);
      jest.spyOn(Math, 'random').mockReturnValue(0.7); // 70% >= 50%

      const variant = assignVariant(defaultConfig);

      expect(variant).toBe('B');
      expect(mockCookies.set).toHaveBeenCalledWith('ab_test_variant', 'B', {
        expires: 30,
        secure: false, // NODE_ENV is not production in tests
        sameSite: 'strict',
        path: '/',
      });

      (Math.random as jest.Mock).mockRestore();
    });

    it('should handle custom traffic split configuration', () => {
      mockCookies.get.mockReturnValue(undefined);
      jest.spyOn(Math, 'random').mockReturnValue(0.6); // 60%

      const customConfig: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 70, B: 30 }, // 70% for A, 30% for B
      };

      const variant = assignVariant(customConfig);

      expect(variant).toBe('A'); // 60% < 70%
      expect(mockCookies.set).toHaveBeenCalledWith('ab_test_variant', 'A', {
        expires: 30,
        secure: false, // NODE_ENV is not production in tests
        sameSite: 'strict',
        path: '/',
      });

      (Math.random as jest.Mock).mockRestore();
    });
  });

  describe('getCurrentVariant', () => {
    it('should return current variant from cookie', () => {
      mockCookies.get.mockReturnValue('B');

      const variant = getCurrentVariant();

      expect(variant).toBe('B');
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
    });

    it('should return null when no cookie exists', () => {
      mockCookies.get.mockReturnValue(undefined);

      const variant = getCurrentVariant();

      expect(variant).toBe(null);
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
    });
  });

  describe('clearABTestData', () => {
    it('should remove A/B test variant cookie', () => {
      clearABTestData();

      expect(mockCookies.remove).toHaveBeenCalledWith('ab_test_variant');
      expect(mockCookies.remove).toHaveBeenCalledWith('session_id');
    });
  });

  describe('isVariant', () => {
    it('should return true when current variant matches specified variant', () => {
      mockCookies.get.mockReturnValue('A');

      const result = isVariant('A');

      expect(result).toBe(true);
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
    });

    it('should return false when current variant does not match specified variant', () => {
      mockCookies.get.mockReturnValue('A');

      const result = isVariant('B');

      expect(result).toBe(false);
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
    });

    it('should return false when no variant is set and checking for B', () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = isVariant('B');

      expect(result).toBe(false);
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
    });

    it('should return false when no variant is set and checking for A', () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = isVariant('A');

      expect(result).toBe(false);
      expect(mockCookies.get).toHaveBeenCalledWith('ab_test_variant');
    });
  });

  describe('Edge Cases', () => {
    it('should return invalid variant values as-is from cookies', () => {
      mockCookies.get.mockReturnValue('invalid-variant');

      const variant = getCurrentVariant();

      expect(variant).toBe('invalid-variant'); // Returns whatever is in the cookie
    });

    it('should handle extreme traffic split values', () => {
      mockCookies.get.mockReturnValue(undefined);
      jest.spyOn(Math, 'random').mockReturnValue(0.99); // 99%

      const extremeConfig: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 1, B: 99 }, // 1% for A, 99% for B
      };

      const variant = assignVariant(extremeConfig);

      expect(variant).toBe('B'); // 99% >= 1%

      (Math.random as jest.Mock).mockRestore();
    });

    it('should handle zero traffic split for variant A', () => {
      mockCookies.get.mockReturnValue(undefined);
      jest.spyOn(Math, 'random').mockReturnValue(0.5); // 50%

      const zeroAConfig: ABTestConfig = {
        enabled: true,
        trafficSplit: { A: 0, B: 100 }, // 0% for A, 100% for B
      };

      const variant = assignVariant(zeroAConfig);

      expect(variant).toBe('B'); // 50% >= 0%

      (Math.random as jest.Mock).mockRestore();
    });
  });
});
