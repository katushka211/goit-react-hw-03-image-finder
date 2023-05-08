import { ImageErrorView } from 'components/ImageErrorViews/ImageErrorView';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Component } from 'react';
import { fetchImages } from 'services/fetchImages';
const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class ImageGallery extends Component {
  state = {
    image: '',
    images: [],
    status: Status.IDLE,
    error: null,
    page: 1,
    totalPages: 0,
  };

  componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;
    const prevName = prevProps.image;
    const nextName = this.props.image;
    if (prevName !== nextName) {
      this.setState({
        status: Status.PENDING,
      });

      if (this.state.error) {
        this.setState({ error: null });
      }

      fetchImages(nextName)
        .then(images => {
          this.setState(prevState => ({
            images:
              page === 1 ? images.hits : [...prevState.images, ...images.hits],
            status: Status.RESOLVED,
            totalPages: Math.floor(images.totalHits / 12),
          }));
        })
        .catch(error => this.setState({ error, status: Status.REJECTED }));
    }
  }
  render() {
    const { status, error, images } = this.state;
    if (status === Status.IDLE) {
      return <div>Please, enter a search query</div>;
    }

    if (status === Status.PENDING) {
      return <Loader />;
    }

    if (status === Status.REJECTED) {
      return <ImageErrorView message={error.message} />;
    }

    if (status === Status.RESOLVED) {
      return (
        <ul>
          {images.map(image => (
            <ImageGalleryItem key={image.id} image={image} />
          ))}
        </ul>
      );
    }
  }
}
