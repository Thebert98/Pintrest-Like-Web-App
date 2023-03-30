import {gql} from '@apollo/client';

const GET_UNSPLASH_IMAGES = gql`
query Query($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
query{
    binnedImages{
        id
        url
        posterName
        description
        userPosted
        binned
    }
}
`;
const GET_USER_POSTED_IMAGES = gql`
query{
    userPostedImages{
        id
        url
        posterName
        description
        userPosted
        binned
    }
}
`;

const UPLOAD_IMAGE = gql`
    mutation uploadImage( $url: String!, $posterName: String, $description: String){
        uploadImage(url: $url , posterName:$posterName, description:$description){
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }

`;

const UPDATE_IMAGE =  gql`
     mutation updateImage($id:ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean){
        updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned){
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const DELETE_IMAGE = gql`
    mutation deleteImage($id:ID!){
        deleteImage(id:$id){
            id
            url
            posterName
            description
            userPosted
            binned
        }
    } 

`;

export default {
    GET_UNSPLASH_IMAGES,
    GET_BINNED_IMAGES,
    GET_USER_POSTED_IMAGES,
    UPLOAD_IMAGE,
    UPDATE_IMAGE,
    DELETE_IMAGE
}