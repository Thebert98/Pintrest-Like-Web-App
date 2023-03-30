
import React, {useState} from 'react';
import './App.css';

import {useQuery,useMutation} from '@apollo/client'
import queries from '../queries';





function NewPost() {
    
   
    const[uploadImage]  = useMutation(queries.UPLOAD_IMAGE,{})
    
  
  
  

 
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
     <h2>New Post</h2>
     <br/>
     <br/>

      {body}
      
      
    </div>
  );
      
    
    
    }
    
  

  export default NewPost;