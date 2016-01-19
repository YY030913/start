if (Meteor.isServer) {

	Meteor.publishComposite('orderByUser', function() {
		return {
	    	find: function() {
		        return OrderColl.find(
		        	{accountId: this.userId,},
		        	{sort: {time: -1}}
		        );
		    },
		    children: [
		        {
		            find: function(order) {
		                return ProductListColl.find(
		                	{productList: order.productListId},
		                );
		            },
		            children: [
		            	{
		            		find: function(productList) {
				        		return ProductColl.find(
				        			{_id: productList.productId},
				        			{sort: {time: -1}}
				        		);
				        	},
		            	}

		            ]
		        },
		    ]
		}
	    
  	});
}