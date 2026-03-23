import React from 'react';
import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

/** Reusable card component with NativeWind styling */
export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
