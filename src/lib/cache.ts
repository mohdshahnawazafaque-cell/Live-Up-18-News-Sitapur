import { Query, getDocs, getDoc, DocumentReference } from "firebase/firestore";
import { FALLBACK_ARTICLES } from "../data/fallbackNews";

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes cache for high performance
const PERSISTENT_NEWS_KEY = "liveup18_persisted_articles_v3";
const CACHE_VERSION_KEY = "liveup18_cache_version";
const CURRENT_VERSION = "v3_clean_real";

// Automatically clear legacy caches containing old dummy data
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem(CACHE_VERSION_KEY) !== CURRENT_VERSION) {
      localStorage.removeItem("liveup18_persisted_articles");
      localStorage.removeItem("home-news");
      localStorage.removeItem("breaking-news");
      localStorage.removeItem("trending-news");
      localStorage.removeItem("latest-news-fallback");
      sessionStorage.clear();
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_VERSION);
    }
  } catch {}
}

const MEMORY_CACHE = new Map<string, { data: any; timestamp: number }>();

function safeSetStorage(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch (e: any) {
    if (e?.name === 'QuotaExceededError' || e?.message?.includes('exceeded the quota')) {
      try {
        sessionStorage.clear();
        sessionStorage.setItem(key, value);
      } catch {}
    }
  }

  try {
    localStorage.setItem(key, value);
  } catch {}
}

function safeGetStorage(key: string): string | null {
  try {
    const sess = sessionStorage.getItem(key);
    if (sess) return sess;
  } catch {}

  try {
    const loc = localStorage.getItem(key);
    if (loc) return loc;
  } catch {}

  return null;
}

// Timeout helper so slow network never hangs the user experience
function fetchWithTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Network timeout")), ms))
  ]);
}

export async function getCachedDocs(q: Query, cacheKey: string, fallbackData?: any[]) {
  const isNewsQuery = cacheKey.includes('news') || cacheKey.includes('article') || cacheKey.includes('related') || cacheKey.includes('category') || cacheKey.includes('search');
  const defaultFallback = fallbackData !== undefined ? fallbackData : (isNewsQuery ? FALLBACK_ARTICLES : []);

  // 1. Instant check in Memory Cache (0ms)
  const mem = MEMORY_CACHE.get(cacheKey);
  if (mem && (Date.now() - mem.timestamp < CACHE_DURATION_MS) && Array.isArray(mem.data)) {
    return mem.data;
  }

  // 2. Instant check in Local/Session Storage (1ms)
  let cachedData: any[] | null = null;
  try {
    const cached = safeGetStorage(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Array.isArray(data)) {
        cachedData = data;
        MEMORY_CACHE.set(cacheKey, { data, timestamp });
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          return data;
        }
      }
    }
  } catch (e) {
    console.warn("Storage read error for key", cacheKey, e);
  }

  // 3. Network fetch with fast timeout
  try {
    const snap = await fetchWithTimeout(getDocs(q), 3000);
    const data: any[] = [];
    snap.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    
    if (data.length > 0) {
      MEMORY_CACHE.set(cacheKey, { data, timestamp: Date.now() });
      safeSetStorage(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      if (isNewsQuery) {
        try {
          localStorage.setItem(PERSISTENT_NEWS_KEY, JSON.stringify(data));
        } catch {}
      }
      return data;
    }
    
    return cachedData || defaultFallback;
  } catch (error: any) {
    // Return cached or master persisted news or fallback
    if (cachedData && cachedData.length > 0) {
      return cachedData;
    }

    if (isNewsQuery) {
      try {
        const persisted = localStorage.getItem(PERSISTENT_NEWS_KEY);
        if (persisted) {
          const parsed = JSON.parse(persisted);
          if (Array.isArray(parsed) && parsed.length > 0) {
            MEMORY_CACHE.set(cacheKey, { data: parsed, timestamp: Date.now() });
            return parsed;
          }
        }
      } catch {}
    }

    return defaultFallback;
  }
}

export async function getCachedDoc(ref: DocumentReference, cacheKey: string) {
  // 1. Instant memory cache
  const mem = MEMORY_CACHE.get(cacheKey);
  if (mem && (Date.now() - mem.timestamp < CACHE_DURATION_MS) && mem.data) {
    return mem.data;
  }

  // 2. Storage cache
  let cachedData: any = null;
  try {
    const cached = safeGetStorage(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (data) {
        cachedData = data;
        MEMORY_CACHE.set(cacheKey, { data, timestamp });
        if (Date.now() - timestamp < CACHE_DURATION_MS) {
          return data;
        }
      }
    }
  } catch (e) {
    console.warn("Storage read error for key", cacheKey, e);
  }

  // 3. Fallback article check by ID
  const foundFallback = FALLBACK_ARTICLES.find(a => a.id === ref.id);
  if (foundFallback && !cachedData) {
    cachedData = foundFallback;
  }

  try {
    const docSnap = await fetchWithTimeout(getDoc(ref), 3000);
    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      MEMORY_CACHE.set(cacheKey, { data, timestamp: Date.now() });
      safeSetStorage(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return data;
    }
    return cachedData || null;
  } catch {
    return cachedData || foundFallback || null;
  }
}
