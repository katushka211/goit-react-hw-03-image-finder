import { Component } from 'react';
const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export class ImageGallery extends Component {
  state = {
    name: '',
    images: [],
    status: Status.IDLE,
    error: null,
    page: 1,
    totalPages: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.imageName;
    const nextName = this.props.imageName;
    if (prevName !== nextName) {
      this.setState({
        status: Status.PENDING,
      });
    }
  }
}
