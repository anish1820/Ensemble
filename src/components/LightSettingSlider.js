import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const LightSettingSlider = ({
  title,
  value,
  defaultValue,
  minimumValue,
  maximumValue,
  step,
  format,
  onValueChange,
}) => {
  // Determine if the current value differs from the recommended value
  const isAdjusted = value !== defaultValue;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{format(value)}</Text>
      </View>
      
      <Slider
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#3498db"
        maximumTrackTintColor="#d0d0d0"
        thumbTintColor="#2980b9"
        style={styles.slider}
      />
      
      <View style={styles.labelsContainer}>
        <Text style={styles.minMaxLabel}>{format(minimumValue)}</Text>
        
        {defaultValue !== null && (
          <View style={styles.recommendedContainer}>
            <View
              style={[
                styles.recommendedMarker,
                { left: `${((defaultValue - minimumValue) / (maximumValue - minimumValue)) * 100}%` }
              ]}
            />
            <Text style={styles.recommendedLabel}>Recommended</Text>
          </View>
        )}
        
        <Text style={styles.minMaxLabel}>{format(maximumValue)}</Text>
      </View>
      
      {isAdjusted && (
        <Text style={styles.adjustedText}>
          Adjusted from recommended {format(defaultValue)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  slider: {
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -12,
  },
  minMaxLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  recommendedContainer: {
    position: 'relative',
    height: 20,
    flex: 1,
  },
  recommendedMarker: {
    position: 'absolute',
    height: 12,
    width: 3,
    backgroundColor: '#e74c3c',
    top: 0,
    transform: [{ translateX: -1.5 }], // Center the marker
  },
  recommendedLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#e74c3c',
    width: 80,
    textAlign: 'center',
    top: 14,
    left: '50%',
    marginLeft: -40, // Center the text
  },
  adjustedText: {
    fontSize: 12,
    color: '#e67e22',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default LightSettingSlider;
