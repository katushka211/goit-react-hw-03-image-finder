import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
// import {
//   ModalBackdrop,
//   ModalContent,
//   ModalDescr,
//   ModalPicture,
// } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  static propTypes = {
    modalData: PropTypes.shape({
      largeImageURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
    }),
    onModalClose: PropTypes.func,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleBackdropeClick);
  }

  handleKeyDown = event => {
    if (event.code === `Escape`) {
      this.props.onModalClose();
    }
  };

  handleBackdropeClick = event => {
    if (event.target === event.currentTarget) {
      this.props.onModalClose();
    }
  };

  render() {
    const { largeImageURL, tags } = this.props.modalData;

    return createPortal(
      <div onClick={this.handleBackdropeClick}>
        <div>
          <img src={largeImageURL} alt={tags} />
          <p>{tags}</p>
        </div>
      </div>,
      modalRoot
    );
  }
}
