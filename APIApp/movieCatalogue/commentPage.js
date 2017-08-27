import React from 'react';
    import _ from 'lodash';
    import api from './test/stubAPI';
	import { Link } from 'react-router';
	import request from 'superagent' ;
	
    var Form = React.createClass({
       getInitialState: function() {
           return { comment: '', name: ''};
        },
        handleCommentChange: function(e) {
             this.setState({comment : e.target.value});
         },
         handleNameChange: function(e) {
             this.setState({name: e.target.value});
         },
         onSubmit : function(e) {
              e.preventDefault();
              var comment = this.state.comment.trim();
              var name = this.state.name.trim();
              if (!comment ) {
                  return;
              }
              this.props.commentHandler(comment ,name );
              this.setState({comment: '', name: ''});
         },
        render : function() {
             return (
               <form  style={{marginTop: '30px'}}>
                <h3>Add a new comment</h3>

                <div className="form-group">
                  <input type="text"  className="form-control"
                        placeholder="Comment" value={this.state.comment}
                        onChange={this.handleCommentChange} ></input>
                </div>     
                <div className="form-group">
                  <input type="text"  className="form-control"
                        placeholder="Your name" value={this.state.name}
                        onChange={this.handleNameChange} ></input>
                </div>
                <button type="submit" className="btn btn-primary"
                        onClick={this.onSubmit}>Submit</button>
              </form>
              );
          }
       });

    var Comment = React.createClass({
        handleVote : function() {
			var count = parseInt(this.props.comment.upvotes,10 ) + 1 ;
             this.props.upvoteHandler(this.props.comment.id, count);
        },
        render : function() {
            var lineStyle = {
                 fontSize: '20px', marginLeft: '10px'  };
            return (
               <div>
                  <span className="glyphicon glyphicon-thumbs-up"
                        onClick={this.handleVote}></span>
                   {this.props.comment.upvotes} {this.props.comment.title} - by {this.props.comment.username}
                  <span style={lineStyle} >
                    {this.props.comment.comment}
                  </span>
                </div>                
               );
          }
     }) ;

    var CommentList = React.createClass({
        render : function() {
          var items = this.props.comments.map(function(comment,index) {
                 return <Comment key={index} comment={comment} 
                          upvoteHandler={this.props.upvoteHandler}  /> ;
             }.bind(this) )
          return (
                <div>
                  {items}
                </div>
            );
        }
    }) ;  

    var CommentView = React.createClass({ 
    componentDidMount : function() {
       request.get('http://0.0.0.0:4000/api/posts/' + this.props.params.postId )
          .end(function(error, res){
            if (res) {
              var json = JSON.parse(res.text);
              localStorage.clear();
              localStorage.setItem('post', JSON.stringify(json)) ;
              this.setState( {}) ;                
            } else {
              console.log(error );
            }
          }.bind(this)); 
      }, 
    addComment : function(c,n) {
        request
           .post('http://0.0.0.0:4000/api/posts/' + 
                      this.props.params.postId    + '/comments' )
           .send({ comment: c, author: n })
           .set('Content-Type', 'application/json')
           .end(function(err, res){
             if (err || !res.ok) {
               alert('Error adding');
             } else {
                var json = JSON.parse(res.text);
                localStorage.clear();
                localStorage.setItem('post', JSON.stringify(json)) ;
                this.setState( {}) ;                
             } // end else
           }.bind(this)); 
  }, 
  incrementUpvote : function(commentId, count ) {
        request
           .post('http://0.0.0.0:4000/api/posts/' + 
                      this.props.params.postId    +
                       '/comments/' + commentId  + '/upvotes' )
           .send({ upvotes : count })
           .set('Content-Type', 'application/json')
           .end(function(err, res){
             if (err || !res.ok) {
               alert('Error upvoting');
             } else {
                var json = JSON.parse(res.text);
                localStorage.clear();
                localStorage.setItem('post', JSON.stringify(json)) ;
                this.setState( {}) ;                
             } // end else
           }.bind(this)); 
  },    
  render: function(){
        var post = localStorage.getItem('post') ?
            JSON.parse(localStorage.getItem('post')) : 
               {title: '', link: '', comments: [], upvotes: 0 } ;
  	   // var pid = parseInt(this.props.params.postId,10) ;
       // var post = api.getPost( pid);
       var line = null ;
       if (post.link ) {
           line = <a href={post.link} >
                        {post.title} </a> ;
        } else {
           line = <span>{post.title} </span> ;
        }
       var comments = _.sortBy(post.comments, function(comment) {
                             return - comment.upvotes;
                        }
                    ); 
       return (  
        <div >
          <h3>{line} </h3>
          <CommentList comments={comments} 
              upvoteHandler={this.incrementUpvote } />
          <Form post={post}  commentHandler={this.addComment} /> 
        </div>
      );
  }
});

export default CommentView;