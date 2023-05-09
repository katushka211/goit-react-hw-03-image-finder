import PropTypes from 'prop-types';
export const Button = ({ onClick }) => {
  return (
    <button onClick={onClick} type="button">
      Load more
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};
