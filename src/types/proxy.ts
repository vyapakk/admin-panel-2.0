export interface ProxyEntry {
  id: string;
  name: string;
  csvUrl: string;
  allowedDomains: string[];
  apiKey: string | null;
  createdAt: string;
}
