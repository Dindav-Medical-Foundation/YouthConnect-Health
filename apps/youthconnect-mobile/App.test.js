import { SyncEngine } from './src/services/SyncEngine';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

describe('SyncEngine', () => {
  it('should be able to check online status', async () => {
    const isOnline = await SyncEngine.isOnline();
    expect(isOnline).toBe(true);
  });

  it('should enqueue action successfully', async () => {
    await SyncEngine.enqueueAction('test_action', { data: 123 });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
