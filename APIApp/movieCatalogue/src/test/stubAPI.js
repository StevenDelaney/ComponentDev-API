import _ from 'lodash';
console.log('loading API' );
var posts = null ;

var posts = [
     {  id: 1 ,
        title : 'The Godfather is a great movie, but dont forget to check out the Godfather 2 & 3 to complete the family story!',
        link : '',
		username : 'Joe McBloggs',
        comments : [],
        upvotes : 20
      },
      { 
        id: 2,
        title : 'The Shawshank Redemption will always be my nyber one!',
        username : 'Jim McBloggs',  
        comments : [],
        upvotes : 5
      },
	  {  id: 3 ,
        title : 'Im more of a comedy gal, but these are all great movies!',
        username : 'Julie McJulison ',
        comments : [],
        upvotes : 7
      },
	  {  id: 4 ,
        title : 'Im not sold on The Wizard of Oz-Surely not one of the greatest of all time?',
        username : 'Bill McBillerson',
        comments : [],
        upvotes : 26
      },
	  {  id: 5 ,
        title : 'Must check out Citizen Kane,never seen it before!',
        username : 'Harry Potter',
        comments : [],
        upvotes : 12
      }
	 
  ] 

var stubAPI = {
     getAll : function() {
        return posts ;
      },
     add : function(t,l) {
          var id = 1 ;
          var last = _.last(posts) ;
          if (last) {
             id = last.id + 1 ;
          }
          var len = posts.length ;
          var newL_len = posts.push({ 
          	'id': id,  
             title: t, link : l, username: '', comments: [], upvotes: 0 }) ;
			 localStorage.setItem('updated', true ) ;
           return newL_len > len ;
          },
     upvote : function(id) {
         var index = _.findIndex(posts, 
         	  function(post) {
                return post.id === id;
              } );      
         if (index !== -1) {                 
              posts[index].upvotes += 1 ;
			  localStorage.setItem('updated', true ) ;
              return true ;
            }
          return false ;
       },
	   getPost : function(id) {
             var result = null ;
             var index = _.findIndex(posts, function(post) {
                    return post.id === id;
                    } );     
             if (index !== -1) {                 
                result = posts[index];
                    }
            return result ;
            },
         addComment : function(postId,c,n) {
            var post = this.getPost(postId ) ;
            var id = 1 ;
            var last = _.last(post.comment) ;
            if (last) {
               id = last.id + 1 ;
            }
            post.comments.push({ 'id': id,  
                     comment: c , author: n, upvotes: 0 } ) ;
			localStorage.setItem('updated', true ) ;
            },
         upvoteComment : function(postId,commentId) {
            var post = this.getPost(postId ) ;
            var index = _.findIndex(post.comments, function(c) {
                      return c.id === commentId;
                    } );      
             if (index !== -1) {                 
                 post.comments[index].upvotes += 1 ;
				 localStorage.setItem('updated', true ) ;
                }
          }
    }
	
export default stubAPI ;