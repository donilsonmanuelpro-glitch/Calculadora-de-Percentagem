
import React from 'react';
import { InputGroup } from './InputGroup';

interface CalculatorCardProps {
  title: string;
  description: string;
  val1Label: string;
  val2Label: string;
  val1Value: string;
  val2Value: string;
  val1Suffix?: string;
  val2Suffix?: string;
  onVal1Change: (v: string) => void;
  onVal2Change: (v: string) => void;
  result: string | number;
  fullText?: string;
  resultPrefix?: string;
  accentColor?: string;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  val1Label,
  val2Label,
  val1Value,
  val2Value,
  val1Suffix,
  val2Suffix,
  onVal1Change,
  onVal2Change,
  result,
  fullText,
  resultPrefix = "=",
  accentColor = "indigo"
}) => {
  const colorClasses: Record<string, string> = {
    indigo: "from-indigo-500 to-blue-600",
    emerald: "from-emerald-500 to-teal-600",
    rose: "from-rose-500 to-pink-600",
    amber: "from-amber-500 to-orange-600"
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <InputGroup 
          label={val1Label} 
          value={val1Value} 
          onChange={onVal1Change} 
          suffix={val1Suffix} 
          placeholder="0"
        />
        
        <div className="hidden sm:block text-slate-300 font-light text-2xl pt-4">/</div>
        
        <InputGroup 
          label={val2Label} 
          value={val2Value} 
          onChange={onVal2Change} 
          suffix={val2Suffix}
          placeholder="0"
        />
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase">Resultado</span>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-light text-slate-400">{resultPrefix}</span>
              <span className={`text-4xl font-black bg-gradient-to-r ${colorClasses[accentColor]} bg-clip-text text-transparent`}>
                {result}
              </span>
            </div>
            {fullText && (
              <p className="text-sm font-medium text-slate-500 italic">
                {fullText}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
