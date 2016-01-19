// collection.find(query)

// collection.find({ sort: doc
//[["a", "asc"], ["b", "desc"]]
//["a", ["b", "desc"]]
//{a: 1, b: -1}
// Meteor.publish('hotPosts', function() {
//   	return PostsColl.find({}, {sort: [["hot", "desc"],["time", "desc"]], limit : 3});
// });

Meteor.publishComposite('hotPosts', {
    find: function() {
        // Find top ten highest scoring posts
        return PostsColl.find({}, {sort: [["hot", "desc"],["time", "desc"]], limit : 3});
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
});

// Meteor.publish('miniPosts', function() {
//   	return PostsColl.find({}, {sort: {time: -1}});
// });

Meteor.publishComposite('miniPosts', {
    find: function() {
        return PostsColl.find({}, {sort: {time: -1}});
    },
    children: [
        {
            find: function(post) {
                return Meteor.users.find(
                    { _id: post.accountId },
                    { limit: 1, fields: { profile: 1 } });
            }
        },
    ]
});

Meteor.publishComposite('postById', function(postId) {
    
    return {
    	find: function() {
	        return PostsColl.find({_id: postId}, {limit: 1});
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
	            }
	        },
	        {
	            find: function(post) {
	                // Find top two comments on post
	                return DebateColl.find(
	                	{
	                		postId: postId
	                	}, {
	                		sort: {time: -1}
	                	}
	                );
	            },
	            children: [
	                {
	                    find: function(debate, post) {
	                        // Find user that authored comment.
	                        return Meteor.users.find(
	                            { _id: debate.accountId },
	                            { limit: 1, fields: { profile: 1 } });
	                    }
	                }
	            ]
	        }
	    ]
	}
});

// Meteor.publish('postById', function(postId) {
// 	check(postId, String);
// 	return [
// 	    PostsColl.find({postId : postId}),
// 	    DebateColl.find({postId: postId}, {sort: {time: -1}})
//   	];
// });

 

Meteor.publish('postByUser', function(userId) {
	check(userId, String);
	return PostsColl.find({userId : userId});
});

Meteor.publish('postByTag', function(tag) {
	check(tag, String);
	return PostsColl.find({tags : tag});
});

Meteor.publish('postByTags', function(tags) {
	check(tag, Array);
	return PostsColl.find({tags : {$in: tags}});
});