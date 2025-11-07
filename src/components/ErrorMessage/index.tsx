import React from 'react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'default' | 'inline';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
  variant = 'default'
}) => {
  const getErrorIcon = (error: string): string => {
    const lowerError = error.toLowerCase();
    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return '🌐';
    }
    if (lowerError.includes('location') || lowerError.includes('not found')) {
      return '📍';
    }
    if (lowerError.includes('api') || lowerError.includes('key')) {
      return '🔑';
    }
    if (lowerError.includes('rate limit') || lowerError.includes('too many')) {
      return '⏱️';
    }
    return '⚠️';
  };

  const getErrorColor = (error: string): string => {
    const lowerError = error.toLowerCase();
    if (lowerError.includes('network') || lowerError.includes('connection')) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    if (lowerError.includes('location') || lowerError.includes('not found')) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    if (lowerError.includes('api') || lowerError.includes('key')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    if (lowerError.includes('rate limit') || lowerError.includes('too many')) {
      return 'text-purple-600 bg-purple-50 border-purple-200';
    }
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className={`flex items-center gap-2 p-3 rounded-lg border ${getErrorColor(message)}`}
      >
        <span className="text-lg">{getErrorIcon(message)}</span>
        <span className="text-sm font-medium flex-1">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm underline hover:no-underline focus:outline-none focus:underline"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-sm underline hover:no-underline focus:outline-none focus:underline ml-2"
          >
            Dismiss
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-4 py-8"
    >
      <div className={`rounded-xl border-2 p-6 text-center ${getErrorColor(message)}`}>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
          {getErrorIcon(message)}
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold mb-2"
        >
          Oops! Something went wrong
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm mb-6"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full px-4 py-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-lg font-medium transition-all duration-200 border border-current"
            >
              Try Again
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full px-4 py-2 bg-transparent hover:bg-white hover:bg-opacity-20 rounded-lg font-medium transition-all duration-200"
            >
              Close
            </button>
          )}

          {/* Helpful tips */}
          <div className="mt-4 pt-4 border-t border-current border-opacity-20 text-xs opacity-75">
            <div className="text-left space-y-1">
              <p>💡 <strong>Tips:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Try a different search term</li>
                <li>• Use popular city names</li>
                <li>• Enable location services for "Use My Location"</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;