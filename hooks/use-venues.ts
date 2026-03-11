/**
 * useVenues — Fetches venues from Supabase with optional sport filter.
 * Falls back to mock data if Supabase credentials are not configured.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_VENUES } from '@/constants/mockData';
import type { Venue } from '@/constants/types';

function dbRowToVenue(row: Record<string, unknown>): Venue {
    return {
        id: row.id as string,
        name: row.name as string,
        location: row.location as string,
        distance: (row.distance as string) ?? '—',
        pricePerHour: row.price_per_hour as number,
        rating: Number(row.rating),
        reviews: row.reviews as number,
        sports: row.sports as string[],
        image: (row.image_url as string) ?? '',
        coordinate: {
            latitude: (row.latitude as number) ?? 28.45,
            longitude: (row.longitude as number) ?? 77.02,
        },
        slots: [],
    };
}

export function useVenues(sportFilter?: string) {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVenues = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let query = supabase.from('venues').select('*').order('rating', { ascending: false });
            if (sportFilter) {
                query = query.contains('sports', [sportFilter]);
            }

            const { data, error: dbError } = await query;

            if (dbError) {
                console.warn('[useVenues] Supabase error, using mock data:', dbError.message);
                setVenues(sportFilter
                    ? MOCK_VENUES.filter(v => v.sports.includes(sportFilter))
                    : MOCK_VENUES
                );
            } else {
                setVenues((data as Record<string, unknown>[]).map(dbRowToVenue));
            }
        } catch (e) {
            console.warn('[useVenues] Network error, using mock data');
            setVenues(MOCK_VENUES);
        } finally {
            setLoading(false);
        }
    }, [sportFilter]);

    useEffect(() => {
        let cancelled = false;
        fetchVenues().finally(() => { if (cancelled) return; });
        return () => { cancelled = true; };
    }, [fetchVenues]);

    return { venues, loading, error, refresh: fetchVenues };
}

export function useVenue(id: string) {
    const [venue, setVenue] = useState<Venue | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVenue = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);

        try {
            const { data, error: dbError } = await supabase
                .from('venues')
                .select('*')
                .eq('id', id)
                .single();

            if (dbError) {
                const mock = MOCK_VENUES.find(v => v.id === id);
                if (mock) setVenue(mock);
                else setError(dbError.message);
            } else {
                setVenue(dbRowToVenue(data as Record<string, unknown>));
            }
        } catch (e) {
            const mock = MOCK_VENUES.find(v => v.id === id);
            if (mock) setVenue(mock);
            else setError('Network error');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchVenue(); }, [fetchVenue]);

    return { venue, loading, error, refresh: fetchVenue };
}
