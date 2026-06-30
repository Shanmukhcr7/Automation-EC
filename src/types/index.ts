/**
 * Core types and interfaces for the automation project.
 */

export interface AppConfig {
  headless: boolean;
  timeout: number;
  downloadPath: string;
  baseUrl: string;
  logLevel: string;
  screenshotOnError: boolean;
}

export interface ECPropertyDetails {
  district: string;
  sro: string;
  village: string;
  surveyNumber?: string;
  plotNumber?: string;
  fromYear: string;
  toYear: string;
}

export interface ECDocumentDetails {
  documentNumber: string;
  year: string;
  sro: string;
}

export type ECSearchCriteria = 
  | { type: 'Property'; details: ECPropertyDetails }
  | { type: 'Document'; details: ECDocumentDetails };

export interface AutomationResult {
  success: boolean;
  filePath?: string;
  error?: string;
}
