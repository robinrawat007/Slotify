import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

export default function Map({ venues, onMarkerPress }: any) {
    return (
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: 28.5355, // Center near Delhi/Gurgaon
                longitude: 77.3910,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            }}
        >
            {venues.map((venue: any) => (
                <Marker
                    key={venue.id}
                    coordinate={venue.coordinate}
                    title={venue.name}
                    description={venue.location}
                >
                    <Callout onPress={() => onMarkerPress(venue.id)}>
                        <View style={styles.calloutContainer}>
                            <Text style={styles.calloutTitle}>{venue.name}</Text>
                            <Text style={styles.calloutPrice}>₹{venue.pricePerHour}/hr</Text>
                            <Text style={styles.calloutAction}>Tap to view →</Text>
                        </View>
                    </Callout>
                </Marker>
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    calloutContainer: {
        padding: 8,
        alignItems: 'center',
        minWidth: 120,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    calloutPrice: {
        fontSize: 14,
        color: '#1DB954',
        fontWeight: '700',
        marginBottom: 4,
    },
    calloutAction: {
        fontSize: 12,
        color: '#888',
    },
});
