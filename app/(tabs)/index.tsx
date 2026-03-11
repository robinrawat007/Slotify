import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, SafeAreaView, Platform, StatusBar, FlatList, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { CATEGORIES } from '@/constants/mockData';
import { VenueCard } from '@/components/VenueCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useVenues } from '@/hooks/use-venues';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { venues, loading, refresh } = useVenues(selectedCategory ?? undefined);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const renderHeader = () => (
    <>
      {/* Search Bar Placeholder */}
      <Pressable
        style={[styles.searchBar, { backgroundColor: theme.icon + '15' }]}
        onPress={() => router.push('/search')}
      >
        <IconSymbol name="magnifyingglass" size={20} color={theme.icon} />
        <Text style={[styles.searchText, { color: theme.icon }]}>Search for venues, sports...</Text>
      </Pressable>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Sports</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map(category => {
          const isSelected = selectedCategory === category.id;
          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryCard,
                { backgroundColor: isSelected ? theme.tint : theme.icon + '15' }
              ]}
              onPress={() => setSelectedCategory(isSelected ? null : category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryName,
                { color: isSelected ? '#fff' : theme.text }
              ]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Featured Venues */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular Venues</Text>
        <Pressable onPress={() => router.push('/search')}>
          <Text style={[styles.seeAll, { color: theme.tint }]}>See All</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/logo-icon.png')}
            style={{ width: 40, height: 40, marginRight: 10, resizeMode: 'contain' }}
          />
          <View>
            <Text style={[styles.greeting, { color: theme.icon }]}>Hello, Player!</Text>
            <Text style={[styles.title, { color: theme.tint }]}>Slotify</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable style={styles.iconBtn} onPress={() => router.push('/notifications')}>
            <IconSymbol name="bell.fill" size={24} color={theme.text} />
            <View style={[styles.badge, { backgroundColor: '#EF4444' }]} />
          </Pressable>
          <Pressable style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
            <IconSymbol name="person.crop.circle.fill" size={36} color={theme.tint} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <VenueCard
            venue={item}
            onPress={() => router.push({ pathname: '/venue/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          loading
            ? <ActivityIndicator size="large" color={theme.tint} style={{ marginTop: 40 }} />
            : <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: theme.icon }}>No venues found for this sport.</Text>
            </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  profileBtn: {
    padding: 2,
  },
  iconBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff', // Gets overriden in theme mode if needed
  },
  scrollContent: {
    paddingBottom: 100, // padding for bottom tabs
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginHorizontal: 4,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  venuesContainer: {
    paddingHorizontal: 20,
  },
});
