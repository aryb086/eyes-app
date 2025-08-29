import React from 'react';
import { Button } from './ui/Button';
import { Wifi, WifiOff } from 'lucide-react';
import { useRealtime } from '../contexts/RealtimeContext';

const RealtimeIndicator = () => {
  const { isConnected, connectionStatus, toggleConnection } = useRealtime();

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
        return 'text-red-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Offline';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleConnection}
      className={`flex items-center space-x-2 transition-colors ${getStatusColor()}`}
      title={`Real-time connection: ${getStatusText()}`}
    >
      {isConnected ? (
        <Wifi className="h-4 w-4" />
      ) : (
        <WifiOff className="h-4 w-4" />
      )}
      <span className="hidden sm:inline text-xs font-medium">
        {getStatusText()}
      </span>
    </Button>
  );
};

export default RealtimeIndicator;
