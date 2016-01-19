if (Meteor.isServer) {

	Meteor.publishComposite('favoriteByUser', function() {
		if (this.userId) {
			return {
		    	find: function() {
			        return FavoriteColl.find({
			    		accountId: this.userId,
			    	});
			    },
			    children: [
			        {
			            find: function(favorite) {
			                return PostsColl.find(
			                	{_id: favorite.postId},
			                	{limite: 1}
			                );
			            },
			            children: [
			            	{
					            find: function(post) {
					                // Find post author. Even though we only want to return
					                // one record here, we use "find" instead of "findOne"
					                // since this function should return a cursor.
					                return Meteor.users.find(
					                    { _id: post.accountId },
					                    { limit: 1, fields: { profile: 1 } });
					            },
					        },
					        {
					        	find: function(post) {
					            	return DebateColl.find({postId: post._id});
					            },
					        },
					        {
					        	find: function(post) {
					            	return FavoriteColl.find({postId: post._id});
					            }
					        }
			            ]
			        },
			    ]
			}
		};
	    
  	});

  	// Meteor.publish("favoriteUserPost", function(postId) {
  	// 	if (this.userId) {
  	// 		return FavoriteColl.find({
	  //   		accountId: this.userId,
	  //   		postId: postId
	  //   	});
  	// 	};
  	// });
}