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




  function UpdateImageModal(props) {
    const[showUpdateModal,setShowUpdateModal] = useState(props.isOpen)
    const[imagePost,setImagePost] = useState(props.updateImage);
    
    const [updateImage] = useMutation(queries.UPDATE_IMAGE);
    
  
  
  
    
    const handleCloseUpdateModal = () =>{
      setShowUpdateModal(false);
      props.handleClose();
    }
    
   if(props.updateImage.binned=== true){
     console.log('hi')
    return(
      <div>
        <ReactModal name='UpdateImagePostModal' isOpen={showUpdateModal} contentLabel='Update ImagePost' style = {customStyles}>
        
        <div>
          <p>Are you sure you want to unbin this post?</p>
          <form className='form'
          id= "update-imagepost"
          onSubmit={(e)=>{
            e.preventDefault();
            updateImage({
              variables:{
                id: imagePost.id,
                url: imagePost.url,
                posterName: imagePost.posterName,
                description:imagePost.description,
                userPosted:imagePost.userPosted,
                binned:false
              }
            })
            setShowUpdateModal(false)
            alert("Post has been Unbinned");
            props.handleClose()
          }}>
            <br/>
            <br/>
            <button className='button upload-button' type="submit">Unbin</button>
          </form>
          <br/>
          <br/>
          <button className='button cancel-button' onClick={handleCloseUpdateModal}>
            Cancel
          </button>
          </div>
        </ReactModal>
      </div>
    );
    
        }
        else if(props.updateImage.binned ===false){
          console.log('hey')
          return(
            <div>
              <ReactModal name='UpdateImagePostModal' isOpen={showUpdateModal} contentLabel='Update ImagePost' style = {customStyles}>
              
              <div>
                <p>Are you sure you want to bin this post?</p>
                <form className='form'
                id= "update-imagepost"
                onSubmit={(e)=>{
                  e.preventDefault();
                  updateImage({
                    variables:{
                      id: imagePost.id,
                      url: imagePost.url,
                      posterName: imagePost.posterName,
                      description:imagePost.description,
                      userPosted:imagePost.userPosted,
                      binned:true
                    }
                  })
                  setShowUpdateModal(false)
                  alert("Post has been binned");
                  props.handleClose()
                }}>
                  <br/>
                  <br/>
                  <button className='button upload-button' type="submit">Bin</button>
                </form>
                <br/>
                <br/>
                <button className='button cancel-button' onClick={handleCloseUpdateModal}>
                  Cancel
                </button>
                </div>
              </ReactModal>
            </div>
          );
        }
  }
  

  export default UpdateImageModal;