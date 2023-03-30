const { ApolloServer, gql } = require("apollo-server");
const lodash = require('lodash');
const uuid = require('uuid');
const axios = require('axios')
const bluebird = require('bluebird');
const flat = require('flat');
const unflatten = flat.unflatten;

const redis = require('redis');
const client = redis.createClient();


bluebird.promisifyAll(redis)
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);





const typeDefs = gql`
type Query {
     unsplashImages(pageNum: Int): [ImagePost]
     binnedImages:[ImagePost]
     userPostedImages: [ImagePost]
}
type ImagePost {
    id:ID!
    url: String!
    posterName:String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
}

type Mutation {
    uploadImage(url: String!, description: String, posterName: String): ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean) :ImagePost
    deleteImage(id: ID!) : ImagePost
}

`;

const resolvers = {
    Query:{

        unsplashImages: async (_,args) => {
            const {data: images} = await axios.get("https://api.unsplash.com/photos?page=" + args.pageNum + "&client_id=yatmv6mFUHOkDFYpp4XbogajJjJS4A1Qsae_k7ZNmxw");
            const imagePosts = [];
           
            for(let i = 0; i < images.length;i++){
                
                let newImage = {
                    id: images[i].id,
                    url: images[i].urls.full,
                    //url: "https://api.unsplash.com/photos/" + images[i].id + "?client_id=yatmv6mFUHOkDFYpp4XbogajJjJS4A1Qsae_k7ZNmxw",
                    posterName: images[i].user.username,
                    description: images[i].description,
                    userPosted: false,
                   
                }
                if(await client.existsAsync(images[i].id)!==0)newImage.binned = true;
                else newImage.binned = false
                imagePosts.push(newImage);
            }
            return imagePosts;
        },
        binnedImages: async(_,args) => {
            
            const images = [];
            if(await client.existsAsync("binnedImages")!==0){
            let flatImageKeys =  await client.lrangeAsync('binnedImages',0,-1)
            
            
            if(flatImageKeys.length !=0){
                for(let i = 0; i< flatImageKeys.length;i++) {
                
                    let image = await client.hgetallAsync(flatImageKeys[i]);
                    
                    let imagePost = await unflatten(image)
                    
                    imagePost.userPosted = (imagePost.userPosted === 'true');
                    imagePost.binned = (imagePost.binned === 'true');
                    images.push(imagePost)
                    
                };
        }
    }
            return images;
            
       
        }
        ,
        userPostedImages: async(_,args) => {
            let flatImageKeys =  await client.lrangeAsync('userPostedImages',0,-1)
            
            const images = [];
            if(flatImageKeys.length !=0){
            for(let i = 0; i < flatImageKeys.length;i++) {
                
                let image = await client.hgetallAsync(flatImageKeys[i]);
                
                let imagePost = await unflatten(image)
                imagePost.userPosted = (imagePost.userPosted === 'true');
                imagePost.binned = (imagePost.binned === 'true');
                
                images.push(imagePost)
                
                
            };
            
            return images;
        }
        return images;
        }
    },
        Mutation: {
            uploadImage: async (_,args) =>{
                
                const newImage = {
                    id: uuid.v4(),
                    url: args.url,
                    description: args.description,
                    posterName: args.posterName,
                    userPosted: true,
                    binned: false
                }
                
                let flatImage = await flat(newImage);
                await client.hmsetAsync(flatImage.id,flatImage);
                await client.lpushAsync('userPostedImages',flatImage.id)
                
                return newImage;
            },
            updateImage: async (_,args) =>{
                let newImage;
                let e = {};
                
                
                if(await client.existsAsync(args.id)!==0){
                 e = await client.hgetallAsync(args.id);
              
                     if(e.id===args.id){
                        if(args.url){
                            e.url = args.url
                        }
                        if(args.description){
                            e.description = args.description
                        }
                        if(args.posterName){
                            e.posterName = args.posterName
                        }
                        if(args.userPosted){
                            e.userPosted = args.userPosted 
                        }
                        else{
                            e.userPosted = (e.userPosted === 'true')
                        }
                        
                        if(typeof args.binned == "boolean"){
                           
                           
                            if((e.binned === 'true')&&(args.binned===false)){
                                if(e.userPosted == false){
                                   
                                    await client.del(e.id)
                                }
                                
                                await client.lremAsync('binnedImages',1, e.id);
                               
                                e.binned = (args.binned === true);
                                
                            }
                            else if((e.binned === 'false')&&(args.binned===true)){
                               
                                e.binned = (args.binned === true);
                               
                            await client.lpushAsync('binnedImages',e.id)
                            
                        }
                            
                            
                        
                    }
                     }
                }
                else{
                    if(args.id){
                        e.id = args.id
                    }
                    else throw "Id is required";
                    if(args.url){
                        e.url = args.url
                    }
                    else throw "url is required"
                    if(args.description){
                        e.description = args.description
                    }
                    if(args.posterName){
                        e.posterName = args.posterName
                    }
                    else throw "Postername is required"
                    if(args.userPosted){
                        e.userPosted = args.userPosted 
                    }
                    else{
                        e.userPosted = false;
                    }
                    if(typeof args.binned == "boolean"){
                        
                        if(args.binned===false){                         
                            e.binned = (args.binned === true);
                            
                        }
                        else if(args.binned===true){
                           
                            e.binned = (args.binned === true);
                           
                        await client.lpushAsync('binnedImages',e.id)
                    }                    
                }
                else {
                    e.binned = false;
                }

                }
               
                newImage = e;
                if((newImage.binned ===true)||(newImage.userPosted===true)) await client.hmset(newImage.id, newImage)
                
                return newImage;
                
            },
            deleteImage: async (_,args)=>{
                
                if(await client.exists(args.id)){
                let image = await client.hgetallAsync(args.id)
                image.binned = (image.binned === 'true');
                image.userPosted = (image.userPosted ==='true');
                await client.lremAsync('userPostedImages',1,args.id);
                if(image.userPosted === true) await client.lremAsync('binnedImages',1,args.id);
                await client.del(args.id);
                return  image;
                }
            }
        }

    }




const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`Server is ready at ${url}`)
});