import { ImageErrorView } from 'components/ImageErrorViews/ImageErrorView';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Component } from 'react';
import { fetchImages } from 'services/fetchImages';
import { Button } from 'components/Searchbar/Button/Button';

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

    if (prevName !== nextName || prevState.page !== page) {
      this.setState({
        status: Status.PENDING,
      });
    }

    if (this.state.error) {
      this.setState({ error: null });
    }

    //   setTimeout(() => {page === 1 ? images.hits : [...prevState.images, ...images.hits],
    fetchImages(nextName, page)
      .then(images => {
        this.setState(prevState => ({
          images:
            page === 1
              ? images.hits
              : [...prevState.images.hits, ...images.hits],
          status: Status.RESOLVED,
          totalPages: Math.floor(images.totalHits / 12),
        }));
      })
      .catch(error => this.setState({ error, status: Status.REJECTED }));
    //   }, 2000);
  }

  loadMoreBtnClick = () => {
    const { page, totalPages } = this.state;
    if (page < totalPages) {
      this.setState(prevState => ({
        page: prevState.page + 1,
      }));
    }
  };

  render() {
    const { status, error, images, page, totalPages } = this.state;
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
        <>
          <ul>
            {images.map(image => (
              <ImageGalleryItem key={image.id} image={image} />
            ))}
          </ul>
          {page <= totalPages && <Button onClick={this.loadMoreBtnClick} />}
        </>
      );
    }
  }
}
