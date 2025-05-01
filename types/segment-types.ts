export interface SegmentFilter {
  id: string
  type: string
  operator?: string
  value?: string
  unit?: string
  messageType?: string
  count?: string
  timeframe?: string
  timeValue?: string
  timeUnit?: string
  eventName?: string
  logicalOperator?: "AND" | "OR" // New property for logical operators
}
