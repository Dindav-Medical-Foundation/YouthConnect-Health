import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = '@offline_queue';
const CACHE_KEY = '@srh_cache';

export const SyncEngine = {
  async isOnline() {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable !== false;
  },

  async enqueueAction(actionType, payload) {
    try {
      const queueStr = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = queueStr ? JSON.parse(queueStr) : [];
      queue.push({ id: Date.now().toString(), actionType, payload, status: 'pending' });
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.error('Error queuing offline action', e);
    }
  },

  async syncQueue() {
    const online = await this.isOnline();
    if (!online) return;

    try {
      const queueStr = await AsyncStorage.getItem(QUEUE_KEY);
      if (!queueStr) return;
      
      let queue = JSON.parse(queueStr);
      const pendingActions = queue.filter(a => a.status === 'pending');

      if (pendingActions.length === 0) return;

      for (let action of pendingActions) {
        // Mock sync to backend
        console.log(`[SyncEngine] Synced offline action: ${action.actionType}`, action.payload);
        action.status = 'synced';
      }

      const remainingQueue = queue.filter(a => a.status !== 'synced');
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
    } catch (e) {
      console.error('Error syncing queue', e);
    }
  },

  async cacheContent(data) {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
  },

  async getCachedContent() {
    const data = await AsyncStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : null;
  }
};
