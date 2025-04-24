import { useState } from 'react';
import { StyleSheet, View, Button, Text, TextInput } from 'react-native';
import {
  showTimedSplash,
  useHideSplash,
} from 'react-native-lottie-splash-view';

export default function App() {
  const [lottieName, setLottieName] = useState('logoanimation');
  const [duration, setDuration] = useState('3000');
  const [bgColor, setBgColor] = useState('#000000'); // Default to black

  // --- Use the hook for Initial Splash Hiding ---
  // Call the hook - it handles readiness internally now
  useHideSplash({ minimumDuration: 3000, readinessDelay: 2000}); // Optional: readinessDelay: 2000

  const handleShowStaticSplash = () => {
    showTimedSplash({
      duration: parseInt(duration, 10),
      backgroundColor: bgColor,
    });
  };

  const handleShowLottieSplash = () => {
    showTimedSplash({
      lottie: lottieName || undefined,
      duration: parseInt(duration, 10),
      backgroundColor: bgColor,
      resizeMode: 'contain',
      repeat: false,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lottie Splash View Demo</Text>

      {/* ... TextInputs for Lottie and Duration ... */}
      <View style={styles.inputContainer}>
        <Text>Lottie Animation Name:</Text>
        <TextInput
          style={styles.input}
          value={lottieName}
          onChangeText={setLottieName}
          placeholder="e.g. logoanimation"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text>Duration for JS Splash (ms):</Text>
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="e.g. 3000"
        />
      </View>

      {/* *** Add TextInput for Background Color *** */}
      <View style={styles.inputContainer}>
        <Text>Background Color (Hex):</Text>
        <TextInput
          style={styles.input}
          value={bgColor}
          onChangeText={setBgColor}
          placeholder="#000000"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Show Static Splash" onPress={handleShowStaticSplash} />
        <Button title="Show Lottie Splash" onPress={handleShowLottieSplash} />
      </View>
    </View>
  );
}

// --- Styles (remain the same) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});
