import React, { useCallback, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

const MultiRangeSlider = ({ min, max, onChange }) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    return (
        <div className="relative h-10 w-full">
            {/* Input elements */}
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(e) => {
                    const value = Math.min(Number(e.target.value), maxVal - 1);
                    setMinVal(value);
                }}
                className="absolute w-full z-10 h-0 appearance-none pointer-events-none"
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
                className="absolute w-full z-20 h-0 appearance-none pointer-events-none"
            />

            {/* Slider track and range */}
            <div className="absolute w-full z-0 h-1 bg-gray-300 rounded-full top-1/2 -translate-y-1/2">
                <div
                    ref={range}
                    className="absolute h-full bg-blue-500 rounded-full"
                />
            </div>

            {/* Value labels */}
            <div className="absolute w-full -bottom-6 flex justify-between text-sm">
                <span className="relative" style={{ left: `${getPercent(minVal)}%` }}>
                    {minVal}
                </span>
                <span className="relative" style={{ right: `${100 - getPercent(maxVal)}%` }}>
                    {maxVal}
                </span>
            </div>
        </div>
    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MultiRangeSlider;