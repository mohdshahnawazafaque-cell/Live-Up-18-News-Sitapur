import { Query, getDocs, getDoc, DocumentReference } from "firebase/firestore";

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function safeSetStorage(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.message?.includes('exceeded the quota')) {
      console.warn('Session storage quota exceeded. Clearing cache and trying again.');
      try {
        sessionStorage.clear();
        sessionStorage.setItem(key, value);
      } catch (e2) {
        console.warn('Still exceeding quota after clear. Skipping cache for this item.');
      }
    }
  }
}

export async function getCachedDocs(q: Query, cacheKey: string) {
  let cached: string | null = null;
  try {
    cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION_MS && Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn("SessionStorage read error for key", cacheKey, e);
  }

  try {
    const snap = await getDocs(q);
    const data: any[] = [];
    snap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    if (data.length > 0) {
      safeSetStorage(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    }
    
    return data;
  } catch (error: any) {
    console.error("Firestore getDocs error for key", cacheKey, error);
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch {}
    }
    // Return empty array instead of crashing caller
    return [];
  }
}

export async function getCachedDoc(ref: DocumentReference, cacheKey: string) {
  let cached: string | null = null;
  try {
    cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION_MS && data) {
        return data;
      }
    }
  } catch (e) {
    console.warn("SessionStorage read error for key", cacheKey, e);
  }

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      safeSetStorage(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return data;
    }
    return null;
  } catch (error: any) {
    console.error("Firestore getDoc error for key", cacheKey, error);
    if (cached) {
      try {
        return JSON.parse(cached).data;
      } catch {}
    }
    return null;
  }
}
