import React, { Fragment } from 'react';
import { X } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  footer?: React.ReactNode;
}

export const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm,
  confirmLabel = "Confirm",
  footer
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

        {/* Footer (Conditional) */}
        {footer ? (
          <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end gap-3">
            {footer}
          </div>
        ) : (onConfirm && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm"
            >
              {confirmLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};