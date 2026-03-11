/**
 * useMatches — Fetches and creates matches via Supabase.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_MATCHES } from '@/constants/mockData';
import type { Match } from '@/constants/types';
import { useAuth } from '@/context/AuthContext';

export function useMatches() {
    const { user } = useAuth();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMatches = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('matches')
                .select('*, profiles!host_id(name, avatar_url)')
                .order('created_at', { ascending: false });

            if (error || !data) {
                setMatches(MOCK_MATCHES);
            } else {
                const mapped: Match[] = (data as Record<string, unknown>[]).map((row) => {
                    const profile = row.profiles as Record<string, string> | null;
                    return {
                        id: row.id as string,
                        sport: row.sport as string,
                        title: row.title as string,
                        venueName: row.venue_name as string,
                        date: row.date as string,
                        time: row.time as string,
                        pricePerPlayer: row.price_per_player as number,
                        skillLevel: row.skill_level as string,
                        playersJoined: row.players_joined as number,
                        maxPlayers: row.max_players as number,
                        hostId: row.host_id as string,
                        host: {
                            name: profile?.name ?? 'Unknown',
                            avatar: profile?.avatar_url ?? `https://i.pravatar.cc/150?u=${row.host_id}`,
                        },
                    };
                });
                setMatches(mapped);
            }
        } catch {
            setMatches(MOCK_MATCHES);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMatches(); }, [fetchMatches]);

    const createMatch = useCallback(async (matchData: {
        title: string;
        sport: string;
        venueName: string;
        date: string;
        time: string;
        pricePerPlayer: number;
        skillLevel: string;
        maxPlayers: number;
    }): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase.from('matches').insert({
            host_id: user.id,
            title: matchData.title,
            sport: matchData.sport,
            venue_name: matchData.venueName,
            date: matchData.date,
            time: matchData.time,
            price_per_player: matchData.pricePerPlayer,
            skill_level: matchData.skillLevel,
            max_players: matchData.maxPlayers,
            players_joined: 1,
        });

        if (error) {
            console.error('[createMatch]', error.message);
            return false;
        }
        await fetchMatches();
        return true;
    }, [user, fetchMatches]);

    const joinMatch = useCallback(async (matchId: string): Promise<boolean> => {
        if (!user) return false;

        // Add player to match_players join table
        const { error } = await supabase
            .from('match_players')
            .insert({ match_id: matchId, user_id: user.id });

        if (error) {
            console.error('[joinMatch]', error.message);
            return false;
        }

        // Increment players_joined
        await supabase.rpc('increment_match_players', { match_id: matchId });
        await fetchMatches();
        return true;
    }, [user, fetchMatches]);

    return { matches, loading, refresh: fetchMatches, createMatch, joinMatch };
}
