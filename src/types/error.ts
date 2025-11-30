export interface Error {
  timestamp: string;
  status: number;
  message: string | ErrorProperty[];
  path: string;
}

export interface ErrorProperty {
  field: string;
  message?: string;
  children?: ErrorProperty[];
}
