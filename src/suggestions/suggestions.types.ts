export interface SuggestionResult {
  value: string;
}

export interface DaDataSuggestion {
  value: string;
  unrestricted_value?: string;
  data?: Record<string, string>;
}

export interface DaDataResponse {
  suggestions: DaDataSuggestion[];
}

export interface DaDataRequest {
  query: string;
  count?: number;
  locations_boost?: Array<{ kladr_id: number }>;
}
