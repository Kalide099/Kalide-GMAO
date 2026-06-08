import PropTypes from 'prop-types';

/**
 * Premium reusable Card component with glass‑morphism, subtle shadow and fade‑in animation.
 */
export const Card = ({ children, className = '' }) => {
  const baseClasses = 'bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-lg animate-fade-in-up';
  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

Card.defaultProps = {
  className: ''
};
