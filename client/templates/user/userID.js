Template.userID.helpers({
	// result: function() {
	// 	userIDCollColl.find();
	// },

})


Template.userID.events({
	'click button': function() {
		console.log("click");
		Session.set("verificationCode", chance.string({length: 4, pool: '0123456789'}));
		
		console.log(Session.get("verificationCode"));
		// Meteor.call('setPhoneSMS', $("input").val());
	}
});
