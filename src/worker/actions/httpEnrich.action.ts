export const httpEnrichAction = async (
  payload: Record<string, unknown>,
  config: {
    url:      string;
    method?:  string;
    headers?: Record<string, string>;
    mergeKey: string;
  }
): Promise<Record<string, unknown>> => {

  if (!config.url || !config.mergeKey) {
    throw new Error('httpEnrich requires "url" and "mergeKey" in actionConfig');
  }

  const response = await fetch(config.url, {
    method:  config.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP enrich failed with status ${response.status}`);
  }

  const externalData = await response.json();

  return {
    ...payload,
    [config.mergeKey]: externalData,
  };
};