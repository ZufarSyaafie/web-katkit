'use client'
import React, { useState, useEffect } from 'react';

const ProgressCard = () => {
  const [data, setData] = useState({
    title: "Task Completion",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.",
    current: 4,
    total: 10
  });

  const percentage = Math.round((data.current / data.total) * 100);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const updateData = (current, total) => {
    setData(prev => ({
      ...prev,
      current,
      total
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-tr from-[#19AC63] to-[#44CC88] rounded-2xl p-6 text-white shadow-xl">
      <div className="flex justify-between items-start">
        {/* Content kiri */}
        <div className="flex-1 pr-4">
          <h2 className="text-xl font-bold mb-3">{data.title}</h2>
          <p className="text-white text-sm leading-relaxed">
            {data.description}
          </p>
          <div className="mt-4 text-xs text-white">
            Progress: {data.current} / {data.total}
          </div>
        </div>

        {/* Progress Circle */}
        <div className="relative w-29 h-29">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-green-300"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              strokeOpacity="0.3"
            />
            {/* Progress circle */}
            <path
              className="text-white"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${animatedPercentage}, 100`}
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{
                transition: 'stroke-dasharray 1s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
