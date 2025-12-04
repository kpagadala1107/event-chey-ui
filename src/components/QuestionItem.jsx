import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HandThumbUpIcon, 
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';
import Button from './UI/Button';

const QuestionItem = ({ question, onUpvote, onAnswer, onEditAnswer }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [answerText, setAnswerText] = useState('');

  // Get the single answer (first one if exists)
  const hasAnswer = question.answer;
  const currentAnswer = hasAnswer ? question.answer  : '';

  const handleSubmitOrEdit = () => {
    if (answerText.trim()) {
      if (hasAnswer && isEditing) {
        // Edit existing answer
        onEditAnswer && onEditAnswer(question.id, 0, answerText);
      } else {
        // Add new answer
        onAnswer(question.id, answerText);
      }
      setAnswerText('');
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setAnswerText(currentAnswer);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setAnswerText('');
    setIsEditing(false);
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
                {hasAnswer && (
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

          {/* Single Answer Display */}
          {hasAnswer && !isEditing && (
            <div className="mt-4">
              <div className="pl-4 border-l-2 border-indigo-200 bg-indigo-50 p-4 rounded-r-lg">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-indigo-900">Answer:</p>
                  <button
                    onClick={handleEditClick}
                    className="text-indigo-600 hover:text-indigo-700 p-1 rounded hover:bg-indigo-100 transition-colors"
                    title="Edit answer"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-700">{currentAnswer}</p>
                {question.askedBy && (
                  <p className="text-sm text-gray-500 mt-2">
                    — {question.askedBy}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Answer Form (for new answer or editing) */}
          {(!hasAnswer || isEditing) && (
            <div className="mt-4">
              <div className="space-y-3">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder={isEditing ? "Edit your answer..." : "Type your answer..."}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSubmitOrEdit}>
                    {isEditing ? 'Save Changes' : 'Submit Answer'}
                  </Button>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionItem;
