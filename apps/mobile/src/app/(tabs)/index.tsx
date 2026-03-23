import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ManlyDude</Text>
      <Text style={styles.subtitle}>AI-powered strength coaching</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#ffffff' },
  subtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
});
