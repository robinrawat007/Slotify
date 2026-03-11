/**
 * useVenues — Fetches venues from Supabase with optional sport filter.
 * Falls back to mock data if Supabase credentials are not configured.
 */
import { useState, useEffect } from 'react';
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

    useEffect(() => {
        let cancelled = false;

        async function fetchVenues() {
            setLoading(true);
            setError(null);

            try {
                let query = supabase.from('venues').select('*').order('rating', { ascending: false });
                if (sportFilter) {
                    query = query.contains('sports', [sportFilter]);
                }

                const { data, error: dbError } = await query;

                if (cancelled) return;

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
                if (!cancelled) {
                    console.warn('[useVenues] Network error, using mock data');
                    setVenues(MOCK_VENUES);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchVenues();
        return () => { cancelled = true; };
    }, [sportFilter]);

    return { venues, loading, error };
}
