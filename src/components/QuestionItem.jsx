import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HandThumbUpIcon, 
  ChatBubbleLeftIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import Button from './UI/Button';

const QuestionItem = ({ question, onUpvote, onAnswer }) => {
  const { isSpeaker } = useAuth();
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState('');

  const handleSubmitAnswer = () => {
    if (answer.trim()) {
      onAnswer(question.id, answer);
      setAnswer('');
      setShowAnswerForm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100"
    >
      <div className="flex gap-4">
        {/* Upvote Section */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onUpvote(question.id)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {question.upvoted ? (
              <HandThumbUpIconSolid className="h-5 w-5 text-indigo-600" />
            ) : (
              <HandThumbUpIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {question.upvotes || 0}
          </span>
        </div>

        {/* Question Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{question.question}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span>by {question.askedBy || 'Anonymous'}</span>
                <span>•</span>
                <span>{question.timestamp || 'Just now'}</span>
                {question.answered && (
                  <>
                    <span>•</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Answered
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Answer Section */}
          {question.answer && (
            <div className="mt-4 pl-4 border-l-2 border-indigo-200 bg-indigo-50 p-4 rounded-r-lg">
              <p className="text-sm font-medium text-indigo-900 mb-1">Answer:</p>
              <p className="text-gray-700">{question.answer}</p>
              {question.answeredBy && (
                <p className="text-sm text-gray-500 mt-2">
                  — {question.answeredBy}
                </p>
              )}
            </div>
          )}

          {/* Answer Form for Speakers */}
          {isSpeaker && !question.answered && (
            <div className="mt-4">
              {!showAnswerForm ? (
                <button
                  onClick={() => setShowAnswerForm(true)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  Answer this question
                </button>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3"
                  >
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSubmitAnswer}>
                        Submit Answer
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setShowAnswerForm(false);
                          setAnswer('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionItem;
