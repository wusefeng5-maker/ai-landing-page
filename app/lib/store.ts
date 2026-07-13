export interface StoredPage {
   id: string;
   data: string;
   industry: string;
   theme: string;
   createdAt: string;
   updatedAt: string;
 }
 
 const store = new Map<string, StoredPage>();
 
 export function savePage(id: string, data: string, industry: string, theme: string): void {
   const now = new Date().toISOString();
   const existing = store.get(id);
   store.set(id, {
     id,
     data,
     industry,
     theme,
     createdAt: existing?.createdAt || now,
     updatedAt: now,
   });
 }
 
 export function getPage(id: string): StoredPage | undefined {
   return store.get(id);
 }
 
 export function generateId(): string {
   return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
 }
 
 export function getAllPages(): StoredPage[] {
   return Array.from(store.values());
 }
