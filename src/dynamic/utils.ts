export function delay(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

export function logStep(message: string) {
  console.log(`[STEP] ${message}`);
} 