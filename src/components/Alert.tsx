import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  description,
  onClose,
  className = '',
}) => {
  const typeStyles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };

  const IconComponent = iconMap[type];

  return (
    <div className={`rounded-md border p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {IconComponent ? (
            <IconComponent className="h-5 w-5" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-current opacity-20"></div>
          )}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                aria-label="Fechar alerta"
              >
                {X ? (
                  <X className="h-5 w-5" />
                ) : (
                  <span className="h-5 w-5 flex items-center justify-center text-sm">×</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};