import React from 'react';

import _ from 'lodash';
import Movies from  './Data';
import { Link } from 'react-router'; 
import api from './test/stubAPI';
import request from 'superagent' ;

var Form = React.createClass({
   getInitialState: function() {
       return { title: '', link: ''};
    },
    handleTitleChange: function(e) {
       this.setState({title: e.target.value});
     },
     handleLinkChange: function(e) {
        this.setState({link: e.target.value});
     },
     handleSubmit : function(e) {
        e.preventDefault();
        var title = this.state.title.trim();
        var link = this.state.link.trim();
        if (!title ) {
            return;
        }
        this.props.addHandler(title,link );
        this.setState({title: '', link: ''});
     },
     render : function() {
       return (
         <form style={{marginTop: '30px'}}>
            <h3>Add a new post</h3>
            <div className="form-group">
              <input type="text"
                className="form-control" placeholder="Title"
                value={this.state.title}
                onChange={this.handleTitleChange} ></input>
            </div>
            <div className="form-group">
              <input type="text"
                 className="form-control" placeholder="Link"
                 value={this.state.link}
                 onChange={this.handleLinkChange} ></input>
            </div>
            <button type="submit" className="btn btn-primary"
                 onClick={this.handleSubmit} >Post</button>
          </form>
        );
      }
   });

      var SelectBox = React.createClass({
          handleChange : function(e, type,value) {
               e.preventDefault();
               this.props.onUserInput( type,value);
          },
          handleTextChange : function(e) {
                this.handleChange( e, 'search', e.target.value);
          },
          handleSortChange : function(e) {
              this.handleChange(e, 'sort', e.target.value);
          },
          render: function(){
               return (
                  <div className="col-md-10">
				
				 <h4> Click the link below to purchase some of the greatest movies of all time!				 </h4>
					<p> 
					<u>
					<b>
					<a href="https://www.amazon.co.uk/s/ref=nb_sb_noss?url=search-alias%3Ddvd&field-keywords=">Amazon DVD Store!</a>
					</b>
					</u>
					</p>
					 <h4> Click the link to view a short video on these fantastic movies! </h4>
					<p> 
					<u>
					<b>
					<a href="https://www.youtube.com/watch?v=Bi57_AYFVTQ">YouTube Video!</a>
					</b>
					</u>
					</p>
				<p><b><u>Enter a Movie's name here: </u></b></p>
                 <input type="text" placeholder="Search" 
                              value={this.props.filterText}
                              onChange={this.handleTextChange} />
               Sort by:
                   <select id="sort" value={this.props.order } 
                             onChange={this.handleSortChange} >
							 <option value="age">Newest</option>
                   <option value="name">Alphabetical</option>
                   
               </select>
                 </div>
                );
              }
           });

     var MovieItem = React.createClass({
		 handleVote : function() {
			 var count = parseInt(this.props.post.upvotes,10 ) + 1 ;
      this.props.upvoteHandler(this.props.post.id,count);
		 },
      render: function(){
		  var lineStyle = {
             fontSize: '20px', marginLeft: '10px'  };
        var cursor = { cursor: 'pointer' } ;
        var line ;
        
           return (
		   
                <li className="thumbnail movie-listing">
                  <Link to={'/movies/' + this.props.movie.id} className="thumb">
                       <img src={"/movieSpecs/movies/" + this.props.movie.imageUrl}
                     alt={this.props.movie.name} /> </Link>
                  <Link to={'/movies/' + this.props.movie.id}> {this.props.movie.name}</Link>
                  <p>{this.props.movie.snippet}</p>
				  
                </li>
                ) ;
             }
         }) ;

   var FilteredMovieList = React.createClass({
        render: function(){
            var displayedMovies = this.props.movies.map(function(movie) {
              return <MovieItem key={movie.id} movie={movie} /> ;
            }) ;
            return (
                    <div className="col-md-10">
                      <ul className="movies">
                          {displayedMovies}
                      </ul>
                    </div>
              ) ;
        }
    }); 


var Top10App = React.createClass({
	componentDidMount : function() {
       request.get('http://0.0.0.0:4000/api/posts')
          .end(function(error, res){
            if (res) {
              var json = JSON.parse(res.text);
              localStorage.clear();
              localStorage.setItem('posts', JSON.stringify(json)) ;
              this.setState( {}) ;                
            } else {
              console.log(error );
            }
          }.bind(this)); 
    },  
    addPost : function(t,l) {  
        var that = this;
        request
           .post('http://0.0.0.0:4000/api/posts/')
           .send({ title: t, link: l })
           .set('Content-Type', 'application/json')
           .end(function(err, res){
             if (err || !res.ok) {
               alert('Error adding');
             } else {
                request.get('http://0.0.0.0:4000/api/posts')
                  .end(function(error, res){
                    if (res) {
                      var json = JSON.parse(res.text);
                      localStorage.clear();
                      localStorage.setItem('posts', JSON.stringify(json)) ;
                      that.setState( {}) ;                
                    } else {
                      console.log(error );
                    }
                  }); 
             } 
           });       
    }, 
    incrementUpvote : function(id, count) {
       var that = this;
        request
           .post('http://0.0.0.0:4000/api/posts/' + id + '/upvotes' )
           .send({ upvotes: count })
           .set('Content-Type', 'application/json')           
           .end(function(err, res){
             if (err || !res.ok) {
               alert('Error upvoting post');
             } else {
                request.get('http://0.0.0.0:4000/api/posts')
                  .end(function(error, res){
                    if (res) {
                      var json = JSON.parse(res.text);
                      localStorage.clear();
                      localStorage.setItem('posts', JSON.stringify(json)) ;
                      that.setState( {}) ;                
                    } else {
                      console.log(error );
                    }
                  }); 
             } 
           }); 
    },    
    render: function(){
        var unsorted_posts = localStorage.getItem('posts') ?
            JSON.parse(localStorage.getItem('posts')) : [] ;
        var posts = _.sortBy(unsorted_posts, function(post) {
                return - post.upvotes;
             }
          );
        return (
           <div >
               <NewsList posts={posts} 
                    upvoteHandler={this.incrementUpvote} />
               <Form addHandler={this.addPost}  />
          </div>
        );
    }
});