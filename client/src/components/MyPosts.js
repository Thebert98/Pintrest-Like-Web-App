import React, {useState} from 'react';
import './App.css';
import DeleteImagePostModal from './modals/DeleteImagePostModal';
import UpdateImagePostModal from './modals/UpdateImagePostModal';
import {useQuery} from '@apollo/client'
import queries from '../queries';

import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
},
titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
},
grid: {
    flexGrow: 1,
    flexDirection: 'column',
    alignContent: 'center',
    margin: 'auto'
},
media: {
    height: '100%',
    width: '100%'
},
button: {
    color: '#90ee90',
    fontWeight: 'bold',
    fontSize: 12,
    background: '#28547a'
}

});
function MyPosts() {
  
	const classes = useStyles();

    const[ showUpdateModal, setShowUpdateModal] = useState(false);
    const[ showDeleteModal, setShowDeleteModal] = useState(false);
    const[updateImage, setUpdateImage] = useState(null);
    const[deleteImage, setDeleteImage] = useState(null);
    const {loading, error, data} =  useQuery(queries.GET_USER_POSTED_IMAGES, {fetchPolicy: 'cache-and-network'});
    const handleOpenUpdateModal = (imagePost)=>{
        setShowUpdateModal(true);
        setUpdateImage(imagePost);
    }
    const handleOpenDeleteModal = (imagePost)=>{
        setShowDeleteModal(true);
        setDeleteImage(imagePost);
    }
  
    const handleCloseModals = () =>{
        setShowDeleteModal(false)
        setShowUpdateModal(false)
    
    }
   
    const buildCard = (imagePost) => {
		
      if(imagePost.binned === false){

        
        return (
            
			<Grid className={classes.grid} item xs={12} sm={6} md={4} lg={3} xl={2} key={imagePost.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						
							<CardMedia
								className={classes.media}
								component='img'
								image={imagePost.url}
								title='ImagePost image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									Posted By: {imagePost.posterName}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{imagePost.description ? imagePost.description : 'No Description '}
									
								</Typography>
							</CardContent>
						
					<Button className={classes.button} onClick={()=>{
                        handleOpenUpdateModal(imagePost)
                    }}>
                        Bin Image
                        </Button>
                        <Button className={classes.button} onClick={()=>{
                        handleOpenDeleteModal(imagePost)
                    }}>
                        Delete Image
                        </Button>
					</CardActionArea>
				</Card>
			</Grid>
		);
	}
    else{
        return (
            
			<Grid className = {classes.grid} item xs={12} sm={6} md={4} lg={3} xl={2} key={imagePost.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						
							<CardMedia
								className={classes.media}
								component='img'
								image={imagePost.url}
								title='ImagePost image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									Posted By :{imagePost.posterName}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{imagePost.description ? imagePost.description : 'No Description '}
									
								</Typography>
							</CardContent>
						
					<Button className={classes.button} onClick={()=>{
                        handleOpenUpdateModal(imagePost)
                    }}>
                        Unbin Image
                        </Button> 
                        <Button className={classes.button} onClick={()=>{
                        handleOpenDeleteModal(imagePost)
                    }}>
                        Delete Image
                        </Button>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    };
    if(data){
        const imagePosts = data.userPostedImages;
       
        return(
          <div>
            <h2>My Posts</h2>
            <br/>
            <br/>
          <a href='/new-post' className='button'>
              Upload New Image
          </a>
          <br />
          <br />
          <ol>
          {imagePosts.map((imagePost)=>{
              return(
                  <li key={imagePost.id}>
                  {buildCard(imagePost)}
                  </li>
              )
          })}
          </ol>
          {showDeleteModal && showDeleteModal && (
          <DeleteImagePostModal
            isOpen={showDeleteModal}
            handleClose={handleCloseModals}
            deleteImage={deleteImage}
          />
        )}
        {showUpdateModal && showUpdateModal && (
          <UpdateImagePostModal
            isOpen={showUpdateModal}
            handleClose={handleCloseModals}
            updateImage={updateImage}
            modal='UpdateImagePostModal'
          />
        )}
          
          
      </div>
  ) 
}else if(loading){
  return<div>Loading...</div>
}else if(error){
  return <div>{error.message}</div>
}

    return (
      
      <div className="App"> MyPosts    
      </div>
      
    );
    
  }
  

  export default MyPosts;