import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Button from './UI/Button';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const PollCard = ({ poll, onVote, hasVoted = false }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = () => {
    if (selectedOption !== null) {
      onVote(poll.id, selectedOption);
    }
  };

  const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;

  const chartData = poll.options?.map(opt => ({
    name: opt.text.length > 20 ? opt.text.substring(0, 20) + '...' : opt.text,
    votes: opt.votes || 0,
    percentage: totalVotes > 0 ? ((opt.votes || 0) / totalVotes * 100).toFixed(1) : 0,
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {poll.question}
        </h3>
        <p className="text-sm text-gray-500">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </p>
      </div>

      {!hasVoted && !poll.hasVoted ? (
        // Voting Interface
        <div className="space-y-3">
          {poll.options?.map((option, index) => (
            <motion.div
              key={option.id || index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedOption(option.id || index)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedOption === (option.id || index)
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === (option.id || index)
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === (option.id || index) && (
                    <CheckCircleIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900">{option.text}</span>
              </div>
            </motion.div>
          ))}

          <Button
            fullWidth
            onClick={handleVote}
            disabled={selectedOption === null}
            className="mt-4"
          >
            Submit Vote
          </Button>
        </div>
      ) : (
        // Results View
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
                          <p className="text-indigo-600 font-semibold">
                            {payload[0].value} votes ({payload[0].payload.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="votes" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Results */}
          <div className="space-y-2">
            {poll.options?.map((option, index) => {
              const percentage = totalVotes > 0 ? ((option.votes || 0) / totalVotes * 100) : 0;
              return (
                <div key={option.id || index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">{option.text}</span>
                    <span className="text-gray-500">
                      {option.votes || 0} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PollCard;
