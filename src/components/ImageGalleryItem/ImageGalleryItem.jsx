export const ImageGalleryItem = ({ image }) => {
  return (
    <li>
      <img src={image.webformatURL} alt={image.tags} />
    </li>
  );
};
