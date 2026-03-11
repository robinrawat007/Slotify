import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, SafeAreaView, Platform, StatusBar, Pressable, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MOCK_VENUES } from '@/constants/mockData';
import { VenueCard } from '@/components/VenueCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import Map from '@/components/Map';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useState(false);

  const filteredVenues = MOCK_VENUES.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sports.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Discover</Text>
        <Pressable
          style={[styles.mapToggleBtn, { backgroundColor: theme.icon + '15' }]}
          onPress={() => setIsMapView(!isMapView)}
        >
          <IconSymbol name={isMapView ? "list.bullet" : "map.fill"} size={20} color={theme.text} />
          <Text style={[styles.mapToggleText, { color: theme.text }]}>
            {isMapView ? 'List View' : 'Map View'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.icon + '15' }]}>
          <IconSymbol name="magnifyingglass" size={20} color={theme.icon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search venue, sports, locations..."
            placeholderTextColor={theme.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} style={{ marginRight: 8 }}>
              <IconSymbol
                name="xmark.circle.fill"
                size={20}
                color={theme.icon}
              />
            </Pressable>
          ) : null}
          <View style={{ width: 1, height: 20, backgroundColor: theme.icon, marginHorizontal: 8, opacity: 0.3 }} />
          <Pressable onPress={() => router.push('/search/filter')}>
            <IconSymbol name="line.3.horizontal.decrease.circle" size={24} color={theme.tint} />
          </Pressable>
        </View>

        {/* Mock Filters Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {['Football', 'Cricket', 'Within 5km', 'Top Rated', '< ₹1000'].map((f) => (
            <View key={f} style={[styles.filterChip, { borderColor: theme.tint }]}>
              <Text style={{ color: theme.tint }}>{f}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {isMapView ? (
        <View style={styles.mapContainer}>
          <Map
            venues={filteredVenues}
            onMarkerPress={(venueId: string) => router.push({ pathname: '/venue/[id]', params: { id: venueId } })}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultsContainer} keyboardShouldPersistTaps="handled">
          <Text style={[styles.resultsText, { color: theme.icon }]}>
            Showing {filteredVenues.length} results
          </Text>

          {filteredVenues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onPress={() => router.push({ pathname: '/venue/[id]', params: { id: venue.id } })}
            />
          ))}

          {filteredVenues.length === 0 && (
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={theme.icon} />
              <Text style={{ color: theme.icon, marginTop: 16 }}>No venues found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  mapToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  mapToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
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
  webMapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#00000005',
  },
  webMapText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});
