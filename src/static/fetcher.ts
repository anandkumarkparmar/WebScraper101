import axios from 'axios';

export async function fetchHTML(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

export async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchHTML(url);
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`);
} 