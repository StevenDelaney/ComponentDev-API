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
	addPost : function(t,l) {   
      if (api.add(t,l)) {  
         this.setState({});
      }
    }, 
    incrementUpvote : function(id) {
      api.upvote(id) ;
      this.setState({});
    },
     getInitialState: function() {
           return { search: '', sort: 'name' } ;
      }, 
     handleChange : function(type,value) {
            if ( type === 'search' ) {
                this.setState( { search: value } ) ;
              } else {
                 this.setState( { sort: value } ) ;
              }
      }, 
        render: function(){
			var posts = _.sortBy(api.getAll(), function(post) {
                return - post.upvotes;
             }
          );
               var list = Movies.filter(function(p) {
                      return p.name.toLowerCase().search(
                             this.state.search.toLowerCase() ) !== -1 ;
                        }.bind(this) );  
               var filteredList = _.sortBy(list, this.state.sort) ;
               return (
              <div className="view-container">
              <div className="view-frame">
                 <div className="container-fluid">
                   <div className="row">
                      <SelectBox onUserInput={this.handleChange } 
                             filterText={this.state.search} 
                             sort={this.state.sort} />
                       <FilteredMovieList movies={filteredList} />
                  </div> 
                  </div>                   
                </div>
              </div>
          );
        }
});

export default Top10App;