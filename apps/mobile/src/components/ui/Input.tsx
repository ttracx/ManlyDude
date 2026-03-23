import React from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

/** Reusable text input component with NativeWind styling */
export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </Text>
      )}
      <TextInput
        className={`rounded-xl border px-4 py-3 text-base text-gray-900 dark:text-white ${
          error
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
        }`}
        placeholderTextColor="#9ca3af"
        accessibilityLabel={label}
        {...props}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}
