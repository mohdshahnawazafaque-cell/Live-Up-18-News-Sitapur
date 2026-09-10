import { Query, getDocs, DocumentSnapshot, getDoc, DocumentReference } from "firebase/firestore";

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export async function getCachedDocs(q: Query, cacheKey: string) {
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION_MS) {
      return data;
    }
  }

  try {
    const snap = await getDocs(q);
    const data: any[] = [];
    snap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    return data;
  } catch (error: any) {
    if (error?.message?.includes("Quota limit exceeded")) {
      if (cached) {
        return JSON.parse(cached).data;
      }
      // If no cache exists, return empty array instead of throwing to avoid breaking the app UI
      return []; 
    }
    throw error;
  }
}

export async function getCachedDoc(ref: DocumentReference, cacheKey: string) {
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION_MS) {
      return data;
    }
  }

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return data;
    }
    return null;
  } catch (error: any) {
    if (error?.message?.includes("Quota limit exceeded")) {
      if (cached) {
        return JSON.parse(cached).data;
      }
      // If no cache exists, return null instead of throwing
      return null;
    }
    throw error;
  }
}
