import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
}

/** Reusable button component with NativeWind styling */
export function Button({ title, variant = 'primary', loading, disabled, ...props }: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-xl px-6 py-4';
  const variantClasses = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-200 dark:bg-gray-700 active:bg-gray-300',
    outline: 'border-2 border-primary-600 active:bg-primary-50',
  };
  const textClasses = {
    primary: 'text-white font-semibold text-base',
    secondary: 'text-gray-900 dark:text-white font-semibold text-base',
    outline: 'text-primary-600 font-semibold text-base',
  };

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || loading ? 'opacity-50' : ''}`}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      {loading && <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563eb'} className="mr-2" />}
      <Text className={textClasses[variant]}>{title}</Text>
    </Pressable>
  );
}
