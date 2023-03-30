import React, {useState} from 'react';
import '../App.css';
import ReactModal from 'react-modal';
import {useQuery,useMutation} from '@apollo/client';
import queries from '../../queries';
import { props } from 'bluebird';

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




  function UploadImageModal(props) {
    const[showUploadModal,setShowUploadModal] = useState(props.isOpen)
    const[uploadImage]  = useMutation(queries.UPLOAD_IMAGE,{})
    
  
  
  

    const handleCloseUploadModal = () =>{
      setShowUploadModal(false);
      props.handleClose();
    }
    let body = null;
   
    let url;
    let posterName;
    let description;
    body =(
      <form className='form' id ="upload-image" onSubmit ={(e)=>{
        e.preventDefault();
        uploadImage({
          variables:{
            url:url.value,
            posterName:posterName.value,
            description: description.value
          }
        });
        url.value = '';
        posterName.value = '';
        description.value = '';
        setShowUploadModal(false);
        props.handleClose()
        alert('Photo Uploaded!')
      }}
      >
        <div className='form-group'>
          <label>
            Url:
            <br/>
            <input ref={(node)=>{
              url = node;
            }}
            required
            autoFocus = {true}
            />
          </label>
        </div>
        <br/>
        <div className='form-group'>
          <label>
            Poster Name:
            <br/>
            <input ref={(node)=>{
              posterName = node;
            }}
            required
            autoFocus = {true}
            />
          </label>
        </div>
        <br/>
        <div className='form-group'>
          <label>
            Description:
            <br/>
            <input ref={(node)=>{
              description = node;
            }}
            required
            autoFocus = {true}
            />
          </label>
        </div>
        <br/>
        <br/>
        <button className='button upload-button' type='submit'>Upload Image</button>
      </form>
    )
  
          
  return(
    <div>
      <ReactModal name='uploadModal' isOpen={showUploadModal} contentLabel='Upload Modal' style = {customStyles}>
      

      {body}
      <button className='button cancel-button' onClick={handleCloseUploadModal}>
          Cancel
        </button>
      </ReactModal>
    </div>
  );

}
  export default UploadImageModal;