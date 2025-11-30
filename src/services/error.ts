import { Error, ErrorProperty } from '../types/error';

const collectValidationMessages = (errors?: ErrorProperty[] | null): string[] => {
  if (!errors || !Array.isArray(errors)) return [];

  const messages: string[] = [];

  const visit = (nodes: ErrorProperty[]): void => {
    for (const node of nodes) {
      if (node?.message) {
        messages.push(node.message);
      }
      if (node?.children?.length) {
        visit(node.children);
      }
    }
  };

  visit(errors);
  return messages;
};

const extractErrorDetails = (err: unknown): string[] => {
  const details: string[] = [];

  const httpErr = (err as { response?: { data?: unknown } } | undefined)?.response?.data;

  if (typeof httpErr === 'string') {
    details.push(httpErr);
    return details;
  }

  if (httpErr && typeof httpErr === 'object') {
    const body = httpErr as Error;
    const message = body?.message;
    if (typeof message === 'string') {
      details.push(message);
      return details;
    }
    if (Array.isArray(message)) {
      details.push(...collectValidationMessages(message));
      return details;
    }
  }

  return details;
};

export const handleApiError = (err: unknown, options?: { summary?: string; fallback?: string }): string[] => {
  const fallback = options?.fallback ?? 'Um erro desconhecido ocorreu';

  const details = extractErrorDetails(err);
  console.log(details);

  return details.length ? details : [fallback];
};
