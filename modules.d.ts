/// <reference types="@types/segment-analytics" />
// Declare modules with no @types/ here
declare module 'from-exponential';
declare module 'react-timeseries-charts';
declare module 'd3-format';
declare module 'pondjs';
declare module 'remarkable';
declare global {
  interface Window { analytics: SegmentAnalytics.AnalyticsJS; }
}