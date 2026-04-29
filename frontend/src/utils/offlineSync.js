import { openDB } from 'idb';

const DB_NAME = 'KGMAO_Offline_Matrix';
const STORE_NAME = 'pending_sync';

export const initOfflineDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const queueAction = async (action, entity, data) => {
  const db = await initOfflineDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({
    action,
    entity,
    data,
    timestamp: Date.now(),
    status: 'pending'
  });
  await tx.done;
  console.log(`📡 Action queued for offline sync: ${action} on ${entity}`);
};

export const syncOfflineActions = async (api) => {
  if (!navigator.onLine) return;
  
  const db = await initOfflineDB();
  const allActions = await db.getAll(STORE_NAME);
  
  if (allActions.length === 0) return;

  console.log(`🔄 Syncing ${allActions.length} offline actions...`);
  
  for (const item of allActions) {
    try {
      let response;
      const method = item.action.toLowerCase();
      
      if (method === 'post') {
        response = await api.post(item.entity, item.data);
      } else if (method === 'put' || method === 'patch') {
        response = await api[method](item.entity, item.data);
      } else if (method === 'delete') {
        response = await api.delete(item.entity);
      }
      
      if (response && response.status < 300) {
        await db.delete(STORE_NAME, item.id);
        console.log(`✅ Offline action ${item.id} (${item.action}) synchronized successfully.`);
      }
    } catch (err) {
      console.error(`❌ Sync failed for action ${item.id} (${item.action}):`, err);
    }
  }
};
