import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpEnrichAction } from '../../../worker/actions/httpEnrich.action';


const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('httpEnrichAction', () => {

  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should merge external data into payload', async () => {
    mockFetch.mockResolvedValue({
      ok:   true,
      json: async () => ({ temp: 18, condition: 'Sunny' }),
    });

    const payload = { city: 'Ramallah' };
    const config  = {
      url:      'https://api.weather.com/current',
      mergeKey: 'weather',
    };

    const result = await httpEnrichAction(payload, config);

    expect(result).toEqual({
      city:    'Ramallah',
      weather: { temp: 18, condition: 'Sunny' },
    });
  });

  it('should throw if url is missing', async () => {
    await expect(
      httpEnrichAction({ name: 'Ali' }, { mergeKey: 'data' } as any)
    ).rejects.toThrow('httpEnrich requires "url" and "mergeKey"');
  });

  it('should throw if external API returns error status', async () => {
    mockFetch.mockResolvedValue({
      ok:     false,
      status: 500,
    });

    await expect(
      httpEnrichAction(
        { name: 'Ali' },
        { url: 'https://api.example.com', mergeKey: 'data' }
      )
    ).rejects.toThrow('HTTP enrich failed with status 500');
  });

});