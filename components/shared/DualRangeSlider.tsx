import React, { useState, useRef, useCallback, useEffect } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  formatValue = (val) => val.toString(),
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return min;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const rawValue = min + percentage * (max - min);

      // Round to nearest step
      return Math.round(rawValue / step) * step;
    },
    [min, max, step]
  );

  const handleMouseDown = (handle: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(handle);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newValue = getValueFromPosition(e.clientX);

      if (isDragging === "min") {
        // Ensure min doesn't exceed max
        const newMin = Math.min(newValue, value[1]);
        if (newMin !== value[0]) {
          onChange([newMin, value[1]]);
        }
      } else {
        // Ensure max doesn't go below min
        const newMax = Math.max(newValue, value[0]);
        if (newMax !== value[1]) {
          onChange([value[0], newMax]);
        }
      }
    },
    [isDragging, getValueFromPosition, value, onChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return;

    const newValue = getValueFromPosition(e.clientX);
    const [minVal, maxVal] = value;

    // Determine which handle is closer to the click position
    const distanceToMin = Math.abs(newValue - minVal);
    const distanceToMax = Math.abs(newValue - maxVal);

    if (distanceToMin <= distanceToMax) {
      // Move min handle
      const newMin = Math.min(newValue, maxVal);
      onChange([newMin, maxVal]);
    } else {
      // Move max handle
      const newMax = Math.max(newValue, minVal);
      onChange([minVal, newMax]);
    }
  };

  const minPercentage = getPercentage(value[0]);
  const maxPercentage = getPercentage(value[1]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900">Price Range</h3>

      {/* Slider Container */}
      <div className="relative px-3">
        {/* Track */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer select-none"
          onClick={handleTrackClick}
        >
          {/* Active Range */}
          <div
            className="absolute h-2 bg-blue-500 rounded-full transition-all duration-150"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`,
            }}
          />

          {/* Min Handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab transform -translate-y-1.5 transition-all duration-150 shadow-md hover:shadow-lg ${
              isDragging === "min" ? "scale-110 cursor-grabbing shadow-lg" : ""
            }`}
            style={{ left: `${minPercentage}%`, marginLeft: "-10px" }}
            onMouseDown={handleMouseDown("min")}
          >
            {/* Handle dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </div>

          {/* Max Handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab transform -translate-y-1.5 transition-all duration-150 shadow-md hover:shadow-lg ${
              isDragging === "max" ? "scale-110 cursor-grabbing shadow-lg" : ""
            }`}
            style={{ left: `${maxPercentage}%`, marginLeft: "-10px" }}
            onMouseDown={handleMouseDown("max")}
          >
            {/* Handle dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Value Labels */}
        <div className="flex justify-between mt-3">
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500">Min</span>
            <span className="text-sm font-medium text-gray-900">
              {formatValue(value[0])}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500">Max</span>
            <span className="text-sm font-medium text-gray-900">
              {formatValue(value[1])}
            </span>
          </div>
        </div>
      </div>

      {/* Input Fields (Optional Alternative Control) */}
      <div className="flex items-center gap-3 px-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Min Price</label>
          <input
            type="number"
            min={min}
            max={value[1]}
            value={value[0]}
            onChange={(e) => {
              const newMin = Math.max(
                min,
                Math.min(Number(e.target.value), value[1])
              );
              onChange([newMin, value[1]]);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Max Price</label>
          <input
            type="number"
            min={value[0]}
            max={max}
            value={value[1]}
            onChange={(e) => {
              const newMax = Math.min(
                max,
                Math.max(Number(e.target.value), value[0])
              );
              onChange([value[0], newMax]);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Preset Buttons (Optional) */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange([min, max])}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          All Prices
        </button>
        <button
          onClick={() => onChange([min, 50])}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          Under $50
        </button>
        <button
          onClick={() => onChange([50, 100])}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          $50 - $100
        </button>
        <button
          onClick={() => onChange([100, max])}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          $100+
        </button>
      </div>
    </div>
  );
};
