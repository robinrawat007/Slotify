/**
 * useBookings — Fetches, creates, and cancels bookings via Supabase.
 * Requires user to be authenticated (useAuth).
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Booking } from '@/constants/types';
import { MOCK_VENUES } from '@/constants/mockData';

// Fallback mock bookings for offline / no-credentials mode
const FALLBACK_BOOKINGS: Booking[] = [
    { id: 'b1', venue: MOCK_VENUES[0], date: new Date(Date.now() + 86400000).toISOString(), slots: ['06:00 PM', '07:00 PM'], status: 'upcoming', totalAmount: 2400 },
    { id: 'b2', venue: MOCK_VENUES[1], date: new Date(Date.now() - 86400000 * 3).toISOString(), slots: ['06:00 AM'], status: 'past', totalAmount: 800 },
    { id: 'b3', venue: MOCK_VENUES[2], date: new Date(Date.now() - 86400000 * 10).toISOString(), slots: ['07:00 PM'], status: 'cancelled', totalAmount: 1500 },
];

export function useBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = useCallback(async () => {
        if (!user) { setBookings([]); setLoading(false); return; }
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, venues(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error || !data) {
                console.warn('[useBookings] Using fallback data:', error?.message);
                setBookings(FALLBACK_BOOKINGS);
            } else {
                const mapped: Booking[] = (data as Record<string, unknown>[]).map((row) => {
                    const v = row.venues as Record<string, unknown>;
                    return {
                        id: row.id as string,
                        venue: {
                            id: v.id as string,
                            name: v.name as string,
                            location: v.location as string,
                            distance: (v.distance as string) ?? '',
                            pricePerHour: v.price_per_hour as number,
                            rating: Number(v.rating),
                            reviews: v.reviews as number,
                            sports: v.sports as string[],
                            image: (v.image_url as string) ?? '',
                            coordinate: { latitude: (v.latitude as number) ?? 0, longitude: (v.longitude as number) ?? 0 },
                            slots: [],
                        },
                        date: row.date as string,
                        slots: (row.slot_ids as string[]) ?? [],
                        status: row.status as Booking['status'],
                        totalAmount: row.total_amount as number,
                    };
                });
                setBookings(mapped);
            }
        } catch {
            setBookings(FALLBACK_BOOKINGS);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const cancelBooking = useCallback(async (bookingId: string) => {
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));

        const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId);

        if (error) {
            // Revert on failure
            fetchBookings();
            return false;
        }
        return true;
    }, [fetchBookings]);

    const createBooking = useCallback(async (bookingData: {
        venueId: string;
        slotIds: string[];
        date: string;
        totalAmount: number;
    }) => {
        if (!user) return { error: 'Not authenticated' };

        const { data, error } = await supabase.rpc('create_booking_atomic', {
            p_user_id: user.id,
            p_venue_id: bookingData.venueId,
            p_slot_ids: bookingData.slotIds,
            p_date: bookingData.date,
            p_total_amount: bookingData.totalAmount
        });

        if (error) {
            console.error('[createBooking]', error.message);
            return { error: error.message };
        }

        await fetchBookings();
        return { data, error: null };
    }, [user, fetchBookings]);

    return { bookings, loading, refresh: fetchBookings, cancelBooking, createBooking };
}
