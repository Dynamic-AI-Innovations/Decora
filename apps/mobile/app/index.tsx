import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>DECORA · V0.1</Text>
      <Text style={styles.title}>Redesign your home with AI.</Text>
      <Text style={styles.body}>
        Built for Nigeria. Photo in, redesign out. Itemised in Naira.
      </Text>
      <Text style={styles.footnote}>
        Scaffolded screen. Real onboarding lives in docs/BUILD.md §9.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 96,
    gap: 16,
    backgroundColor: '#0F0F0F',
  },
  eyebrow: {
    color: '#9B9B9B',
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    color: '#F8F5F0',
    fontSize: 34,
    fontWeight: '600',
    lineHeight: 40,
  },
  body: {
    color: '#C9C2B8',
    fontSize: 17,
    lineHeight: 24,
  },
  footnote: {
    color: '#6F6A62',
    fontSize: 13,
    marginTop: 'auto',
    paddingBottom: 48,
  },
});
