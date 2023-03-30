import React from 'react';

import './App.css';
import {ApolloClient, HttpLink, InMemoryCache,ApolloProvider} from '@apollo/client';
import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './Home';
import MyBin from './MyBin';
import MyPosts from './MyPosts'
import NewPost from './NewPost'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})

function App() {
  return (
    <ApolloProvider client = {client}>
      <Router>
        <div className="App">
          <header className = 'App-header'>
            <h1 className='App-title'>Bintrest</h1>
            <nav>
              <NavLink className='navLink' to = '/'>
                Home
              </NavLink>
              <NavLink className='navLink' to = '/my-bin'>
                My Bin
              </NavLink>
              <NavLink className='navLink' to = '/my-posts'>
                My Posts
              </NavLink>
              
            </nav>

          </header>
          <Route exact path = "/" component ={Home}/>
          <Route exact path = "/my-bin" component ={MyBin}/>
          <Route exact path = "/my-posts" component ={MyPosts}/>
          <Route exact path = "/new-post" component ={NewPost}/>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
