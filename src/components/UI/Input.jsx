import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  fullWidth = true,
  ...props
}, ref) => {
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          ${widthClass}
          border border-gray-300 rounded-lg px-4 py-2
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          transition-all duration-200
          placeholder-gray-400
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
