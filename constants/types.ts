// Shared TypeScript types for the Slotify app

export interface Slot {
    id: string;
    time: string;
    isAvailable: boolean;
}

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface Venue {
    id: string;
    name: string;
    location: string;
    distance: string;
    pricePerHour: number;
    rating: number;
    reviews: number;
    sports: string[];
    image: string;
    coordinate: Coordinate;
    slots: Slot[];
}

export interface MatchHost {
    name: string;
    avatar: string;
}

export interface Match {
    id: string;
    sport: string;
    title: string;
    venueName: string;
    date: string;
    time: string;
    pricePerPlayer: number;
    skillLevel: string;
    playersJoined: number;
    maxPlayers: number;
    hostId: string;
    host: MatchHost;
}

export interface Booking {
    id: string;
    venue: Venue;
    date: string;
    slots: string[];
    status: 'upcoming' | 'past' | 'cancelled';
    totalAmount: number;
}
