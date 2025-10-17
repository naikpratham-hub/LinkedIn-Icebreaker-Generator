/**
 * A simple analytics service to track user events.
 * In a real-world application, this could be replaced with a proper
 * analytics provider like Google Analytics, Mixpanel, etc.
 */

interface AnalyticsEvent {
  eventName: string;
  eventData: Record<string, any>;
  timestamp: string;
}

const trackEvent = (eventName: string, eventData: Record<string, any> = {}): void => {
  const event: AnalyticsEvent = {
    eventName,
    eventData,
    timestamp: new Date().toISOString(),
  };

  // For this implementation, we'll just log to the console.
  // This can be easily extended to send data to an analytics backend.
  console.log('[Analytics Event]', event);
};

export const analyticsService = {
  trackEvent,
};
