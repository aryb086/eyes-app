import React from 'react';
import { useRealtime } from '../contexts/RealtimeContext';
import { WifiOff, AlertCircle, CheckCircle, RefreshCw, Server } from 'lucide-react';

const RealtimeIndicator = () => {
  const { connectionStatus } = useRealtime();

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'fallback':
        return <Server className="w-4 h-4 text-blue-500" />;
      case 'disconnected':
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      case 'fallback':
        return 'Fallback Mode';
      case 'disconnected':
      default:
        return 'Offline';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'fallback':
        return 'text-blue-500';
      case 'disconnected':
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100';
      case 'connecting':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      case 'fallback':
        return 'bg-blue-100';
      case 'disconnected':
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusBg()}`}>
      {getStatusIcon()}
      <span className={`text-xs font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
};

export default RealtimeIndicator;
