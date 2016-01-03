picturesColl = new Mongo.Collection('pictures');

navigationsColl = new Mongo.Collection('navigations');

storeColl = new Mongo.Collection('store');

// type: license,store
storePicColl = new Mongo.Collection('storePic');

productPicColl = new Mongo.Collection('productPic');

// items = new Mongo.Collection('items');

// uploads = new Mongo.Collection('uploads');

vistorsColl = new Mongo.Collection('vistors');

friendsColl = new Mongo.Collection('friends');

friendsMessageColl = new Mongo.Collection('friendsMessage');

friendsGroupColl = new Mongo.Collection('friendsGroup');

userCreditColl = new Mongo.Collection('userCredit');

navigationsColl.defaultName = function() {
	var nextLetter = 'A',
		nextName = 'List ' + nextLetter;
	while (navigationsColl.findOne({
			name: nextName
		})) {
		nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
		nextName = 'List ' + nextLetter;
	}

	return nextName;
};