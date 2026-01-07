
import React from 'react';

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  suffix?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, placeholder, suffix }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium"
        />
        {suffix && (
          <span className="absolute right-4 text-slate-400 font-medium">{suffix}</span>
        )}
      </div>
    </div>
  );
};
