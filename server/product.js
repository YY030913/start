if (Meteor.isServer) {

	Meteor.publishComposite('productById', function() {
		if (this.productId) {
			return {
		    	find: function() {
			        return ProductColl.find({
			    		_id: this.productId,
			    	});
			    },
			    children: [
			        {
			            find: function(product) {
			                return Meteor.users.find(
			                	{_id: product.accountId},
			                	{limite: 1}
			                );
			            },
			        },
			        {
			        	find: function(product) {
			        		return ExperienceColl.find(
			        			{_id: product.experienceId},
			        			{sort: {time: -1}}
			        		);
			        	},
			        	children: function(experience) {
			        		return Meteor.users.find(
			        			{_id: experience.accountId},
			        			{limite: 1}
			        		);
			        	}
			        }
			    ]
			}
		};
	    
  	});
}