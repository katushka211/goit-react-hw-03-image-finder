import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ToastContainer } from 'react-toastify';
import { ImageGallery } from './ImageGallery/ImageGallery';

export class App extends Component {
  state = {
    imageName: '',
  };

  handleFormSubmit = imageName => this.setState({ imageName });
  render() {
    return (
      <div style={{ maxWidth: 1170, margin: '0 auto', padding: 20 }}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        <ImageGallery image={this.state.imageName} />
        <ToastContainer autoClose={2500} />
      </div>
    );
  }
}
