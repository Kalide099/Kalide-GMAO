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
      if (item.action === 'CREATE') {
        response = await api.post(item.entity, item.data);
      } else if (item.action === 'UPDATE') {
        response = await api.put(`${item.entity}/${item.data.id}`, item.data);
      }
      
      if (response && response.status < 300) {
        await db.delete(STORE_NAME, item.id);
      }
    } catch (err) {
      console.error(`❌ Sync failed for action ${item.id}:`, err);
      // Logic for conflict resolution could be added here
      // Standard: Keep in pending if it's a transient server error, or log as conflict if 409
    }
  }
};
