export const CATEGORIES = [
    { id: '1', name: 'Football', icon: '⚽' },
    { id: '2', name: 'Cricket', icon: '🏏' },
    { id: '3', name: 'Badminton', icon: '🏸' },
    { id: '4', name: 'Tennis', icon: '🎾' },
    { id: '5', name: 'Basketball', icon: '🏀' },
];

export const MOCK_VENUES = [
    {
        id: 'v1',
        name: 'Greenfield Sports Arena',
        location: 'Gurgaon, Sector 45',
        distance: '3.2 km',
        pricePerHour: 1200,
        rating: 4.8,
        reviews: 124,
        sports: ['Football', 'Cricket'],
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
        coordinate: { latitude: 28.4357, longitude: 77.0505 }, // Gurgaon
        slots: [
            { id: 's1', time: '06:00 AM', isAvailable: true },
            { id: 's2', time: '07:00 AM', isAvailable: false },
            { id: 's3', time: '08:00 AM', isAvailable: true },
            { id: 's4', time: '06:00 PM', isAvailable: true },
            { id: 's5', time: '07:00 PM', isAvailable: false },
            { id: 's6', time: '08:00 PM', isAvailable: true },
        ]
    },
    {
        id: 'v2',
        name: 'Smash & Sprint Complex',
        location: 'Delhi, Vasant Kunj',
        distance: '5.5 km',
        pricePerHour: 800,
        rating: 4.5,
        reviews: 89,
        sports: ['Badminton', 'Tennis'],
        image: 'https://images.unsplash.com/photo-1622279457486-640c4cb6856c?q=80&w=1000&auto=format&fit=crop',
        coordinate: { latitude: 28.5298, longitude: 77.1432 }, // Vasant Kunj
        slots: [
            { id: 's1', time: '06:00 AM', isAvailable: true },
            { id: 's2', time: '07:00 AM', isAvailable: true },
            { id: 's3', time: '08:00 AM', isAvailable: false },
            { id: 's4', time: '06:00 PM', isAvailable: false },
            { id: 's5', time: '07:00 PM', isAvailable: true },
        ]
    },
    {
        id: 'v3',
        name: 'The Dugout',
        location: 'Noida, Sector 18',
        distance: '8.1 km',
        pricePerHour: 1500,
        rating: 4.9,
        reviews: 210,
        sports: ['Cricket'],
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
        coordinate: { latitude: 28.5702, longitude: 77.3204 }, // Noida
        slots: [
            { id: 's1', time: '05:00 PM', isAvailable: true },
            { id: 's2', time: '06:00 PM', isAvailable: false },
            { id: 's3', time: '07:00 PM', isAvailable: false },
            { id: 's4', time: '08:00 PM', isAvailable: true },
        ]
    }
];

export const MOCK_MATCHES = [
    {
        id: 'm1',
        sport: 'Football',
        title: '5v5 Weekend Kickoff',
        venueName: 'Greenfield Sports Arena',
        date: 'Sat, 14 Oct',
        time: '06:00 PM',
        pricePerPlayer: 240,
        skillLevel: 'Intermediate',
        playersJoined: 7,
        maxPlayers: 10,
        host: {
            name: 'Priya S.',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
        }
    },
    {
        id: 'm2',
        sport: 'Cricket',
        title: 'Net Practice & Friendly Match',
        venueName: 'The Dugout',
        date: 'Sun, 15 Oct',
        time: '08:00 AM',
        pricePerPlayer: 150,
        skillLevel: 'All Levels',
        playersJoined: 3,
        maxPlayers: 5,
        host: {
            name: 'Rahul K.',
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
        }
    },
    {
        id: 'm3',
        sport: 'Badminton',
        title: 'Doubles Tournament Prep',
        venueName: 'Smash & Sprint Complex',
        date: 'Mon, 16 Oct',
        time: '07:00 PM',
        pricePerPlayer: 400,
        skillLevel: 'Advanced',
        playersJoined: 2,
        maxPlayers: 4,
        host: {
            name: 'Amit V.',
            avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d'
        }
    }
];
