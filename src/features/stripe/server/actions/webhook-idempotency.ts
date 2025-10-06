/**
 * Webhook Idempotency Handler
 *
 * Prevents duplicate webhook processing using Stripe event IDs.
 * Essential for production webhook reliability.
 */

const processedEvents = new Set<string>();

export async function isEventProcessed(eventId: string): Promise<boolean> {
  return processedEvents.has(eventId);
}

export async function markEventProcessed(eventId: string): Promise<void> {
  processedEvents.add(eventId);

  // In production, you might want to store this in Redis or database
  // For now, in-memory Set is sufficient for development
}

export async function processWebhookWithIdempotency<T>(
  eventId: string,
  processor: () => Promise<T>
): Promise<T | null> {
  if (await isEventProcessed(eventId)) {
    console.log(`Event ${eventId} already processed, skipping`);
    return null;
  }

  const result = await processor();
  await markEventProcessed(eventId);
  return result;
}
