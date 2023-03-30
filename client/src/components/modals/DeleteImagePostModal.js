import React, {useState} from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import {useQuery,useMutation} from '@apollo/client';
import queries from '../../queries';
import { props } from 'bluebird';
const bluebird = require('bluebird');


ReactModal.setAppElement('#root');
const customStyles = {
  content:{
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform:'translate(-50%,-50%)',
    width: '50%',
    border: '1px solid #28547a',
    boarderRadius: '4px'
  }
}




  function DeleteImagePostModal(props) {
    const[showDeleteModal,setShowDeleteModal] = useState(props.isOpen)
    const[imagePost,setImagePost] = useState(props.deleteImage);
    
    const [deleteImage] = useMutation(queries.DELETE_IMAGE, {
      update(cache, {data: {deleteImage}}) {
        
        let images = cache.readQuery({ query: queries.GET_USER_POSTED_IMAGES})
        
        cache.writeQuery({
          query: queries.GET_USER_POSTED_IMAGES,
          data: {
            userPostedImages: images.userPostedImages.filter((e) => e.id !== imagePost.id)
          }
          
        });
       
       
      }
    });
   
    const handleCloseDeleteModal = ()=>{
      setShowDeleteModal(false);
      setImagePost(null);
      props.handleClose();
    }
    
          
  return(
    <div>
      <ReactModal name='deleteModal' isOpen={showDeleteModal} contentLabel='Delete ImagePost' style = {customStyles}>
      
      <div>
        <p>Are you sure you want to delete that post?</p>
        <form className='form'
        id= "delete-imagepost"
        onSubmit={(e)=>{
          e.preventDefault();
          deleteImage({
            variables:{
              id: imagePost.id
            }
          })
          setShowDeleteModal(false)
          alert("Post has been deleted!");
          props.handleClose()
        }}>
          <br/>
          <br/>
          <button className='button upload-button' type="submit">Delete Post</button>
        </form>
        <br/>
        <br/>
        <button className='button cancel-button' onClick={handleCloseDeleteModal}>
          Cancel
        </button>
        </div>
      </ReactModal>
    </div>
  );

}

  export default DeleteImagePostModal;