picturesColl = new Mongo.Collection('pictures');

navigationsColl = new Mongo.Collection('navigations');

storeColl = new Mongo.Collection('store');

// type: license,store
storePicColl = new Mongo.Collection('storePic');

productPicColl = new Mongo.Collection('productPic');

// items = new Mongo.Collection('items');

// uploads = new Mongo.Collection('uploads');

vistorsColl = new Mongo.Collection('vistors');

friendsMessageColl = new Mongo.Collection('friendsMessage');

friendsGroupColl = new Mongo.Collection('friendsGroup');

userCreditColl = new Mongo.Collection('userCredit');


// 手机关联
PhonesColl = new Mongo.Collection('phones');
// 身份关联
UserIdColl = new Mongo.Collection('userid');
// 辩论主题
PostsColl = new Mongo.Collection('posts');
// 辩论论点
DebateColl = new Mongo.Collection('debate');
// 好友成员
FriendsColl = new Mongo.Collection('friends');
// 关注成员
FollowerColl = new Mongo.Collection('follower');
// 收藏辩论
FavoriteColl = new Mongo.Collection('favorite');

// 产品集合
ProductColl = new Mongo.Collection('product');
// 购物经验集合
ExperienceColl = new Mongo.Collection('experience');
// 购物车集合
CartColl = new Mongo.Collection('cart');
// 购物车集合
TransportColl = new Mongo.Collection('transport');
// 订单产品集合
ProductListColl = new Mongo.Collection('productlist');
// 订单集合
OrderColl = new Mongo.Collection('order');


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