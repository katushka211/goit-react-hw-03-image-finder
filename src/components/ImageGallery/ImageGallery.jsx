import { ImageErrorView } from 'components/ImageErrorViews/ImageErrorView';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
import { Component } from 'react';
import { fetchImages } from 'services/fetchImages';
import { Button } from 'components/Searchbar/Button/Button';
import { toast } from 'react-toastify';
import { Modal } from 'components/Modal/Modal';

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
    isShowModal: false,
    modalData: { img: '', tags: '' },
  };

  async componentDidUpdate(prevProps, prevState) {
    const { page } = this.state;
    const prevName = prevProps.image;
    const nextName = this.props.image;
    if (prevName !== nextName || prevState.page !== page) {
      try {
        this.setState({
          status: Status.PENDING,
        });

        const images = await fetchImages(nextName, page);
        if (nextName.trim() === '' || !images.length) {
          toast.error(`Sorry, but there are no pictures with ${nextName}`);
        }

        const totalPages = Math.ceil(images.totalHits / 12);
        this.setState(prevState => ({
          images: [...prevState.images, ...images],
          status: Status.RESOLVED,
          totalPages: totalPages,
        }));
      } catch (error) {
        this.setState({ status: Status.REJECTED });
        toast.error('Something went wrong');
      }
    }
  }

  loadMoreBtnClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { status, images, totalPages, page, isShowModal, modalData } =
      this.state;
    if (status === Status.IDLE) {
      return <div>Please, enter a search query</div>;
    }

    if (status === Status.PENDING) {
      return <Loader />;
    }

    if (status === Status.REJECTED) {
      return <ImageErrorView />;
    }

    if (status === Status.RESOLVED) {
      return (
        <>
          <ul>
            {images.map(image => (
              <ImageGalleryItem key={image.id} image={image} />
            ))}
          </ul>
          {images.length >= 12 &&
            (page < totalPages || images.length % 12 === 0) && (
              <Button onClick={this.loadMoreBtnClick} />
            )}
          {images.length === 0 && <ImageErrorView />}
          {isShowModal && (
            <Modal modalData={modalData} onModalClose={this.handleModalClose} />
          )}
        </>
      );
    }
  }
}
