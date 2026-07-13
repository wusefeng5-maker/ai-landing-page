 interface Entry { count: number; resetAt: number; }
 const store = new Map<string, Entry>();
 
 export function checkRateLimit(
   key: string,
   limit: number,
   windowMs: number
 ): { allowed: boolean; remaining: number; resetInMs: number } {
   const now = Date.now();
   const entry = store.get(key);
 
   if (!entry || now > entry.resetAt) {
     store.set(key, { count: 1, resetAt: now + windowMs });
     return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
   }
 
   if (entry.count >= limit) {
     return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
   }
 
   entry.count++;
   return { allowed: true, remaining: limit - entry.count, resetInMs: entry.resetAt - now };
 }
 
 export function getClientIp(request: Request): string {
   return (
     request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
     request.headers.get("x-real-ip") ||
     "127.0.0.1"
   );
 }
