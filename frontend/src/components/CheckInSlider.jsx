import React from 'react';

export default function CheckInSlider({
  id,
  label,
  description,
  value,
  onChange,
  min = 1,
  max = 5,
  minLabel = "Low",
  midLabel = "Moderate",
  maxLabel = "High",
  stepLabels = ["Very Low", "Low", "Moderate", "High", "Very High"]
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <label htmlFor={id} className="block text-sm font-semibold text-slate-800">
            {label}
          </label>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-lg">
          <span className="text-xs font-bold text-sky-800">{value}</span>
          <span className="text-[11px] text-sky-600 font-medium">/ {max}</span>
        </div>
      </div>

      {/* Slider Input */}
      <div className="relative py-2">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />

        {/* Step buttons */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: max - min + 1 }).map((_, idx) => {
            const stepVal = min + idx;
            const isSelected = value === stepVal;
            return (
              <button
                type="button"
                key={stepVal}
                onClick={() => onChange(stepVal)}
                className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-200 scale-110 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {stepVal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Labels below */}
      <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
        <span>{minLabel}</span>
        <span className="text-slate-600 font-medium">{stepLabels[value - min] || midLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
