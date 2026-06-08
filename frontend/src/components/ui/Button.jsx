import PropTypes from 'prop-types';

/**
 * Premium reusable button component with gradient, glass‑morphism and micro‑animation.
 * Supports variant "primary", "secondary" and "danger".
 */
export const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const baseClasses = 'px-5 py-2 rounded-xl font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500',
    secondary: 'bg-white/70 backdrop-blur-md border border-gray-300 text-gray-800 hover:bg-white/80',
    danger: 'bg-red-600 text-white hover:bg-red-500'
  }[variant];

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  disabled: PropTypes.bool,
  className: PropTypes.string
};

Button.defaultProps = {
  onClick: undefined,
  variant: 'primary',
  disabled: false,
  className: ''
};
