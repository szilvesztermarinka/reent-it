import React, { useCallback, useEffect, useState, useRef } from "react";
import "./style.css";

const valueCSS = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  gap: "2px",
  paddingTop: "10px",
};

const PriceRangeSlider = ({
  min,
  max,
  trackColor = "#E5E7EB",
  onChange,
  rangeColor = "#724ee9",
  valueStyle = valueCSS,
  width = "100%",
  currencyText = "Ft",
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);
  const containerRef = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  // Update values
  useEffect(() => {
    if (minVal !== minValRef.current || maxVal !== maxValRef.current) {
      onChange({ min: minVal, max: maxVal });
      minValRef.current = minVal;
      maxValRef.current = maxVal;
    }
  }, [minVal, maxVal, onChange]);

  return (
    <div className="w-full flex items-center justify-center flex-col space-y-4">
      {/* Input fields remain unchanged */}
      <div className="w-full px-4 flex items-center gap-2">
        <div className="flex items-center bg-gray-100 rounded py-2.5 justify-center">
          <span>{currencyText}</span>
          <input
            type="number"
            className="bg-transparent outline-none"
            value={minVal}
            min={min}
            max={maxVal - 1}
            onChange={(e) => {
              const value = Math.min(
                Math.max(Number(e.target.value), min),
                maxVal - 1
              );
              setMinVal(value);
            }}
            step="1"
          />
        </div>

        <div className="flex flex-1 items-center bg-gray-100 rounded py-2.5 justify-center">
          <span>{currencyText}</span>
          <input
            type="number"
            className="bg-transparent outline-none"
            value={maxVal}
            min={minVal + 1}
            max={max}
            onChange={(e) => {
              const value = Math.max(
                Math.min(Number(e.target.value), max),
                minVal + 1
              );
              setMaxVal(value);
            }}
            step="1"
          />
        </div>
      </div>

      {/* Modified slider container */}
      <div
        className="multi-slide-input-container relative h-5"
        style={{ width }}
        ref={containerRef}
      >
        <div className="slider absolute w-full h-full">
          <div
            style={{ backgroundColor: trackColor }}
            className="track-slider absolute w-full h-1 rounded"
          />
          <div
            ref={range}
            style={{ backgroundColor: rangeColor }}
            className="range-slider absolute h-1 rounded"
          />
        </div>

        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxVal - 1);
            setMinVal(value);
          }}
          className="thumb thumb-left absolute w-full h-0 top-1/2 -translate-y-1/2"

        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minVal + 1);
            setMaxVal(value);
          }}
          className="thumb thumb-right absolute w-full h-0 top-1/2 -translate-y-1/2"
          />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
