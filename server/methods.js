Meteor.methods({
	updateGooleAccount: function(_id, attr) {
		var googleAccount = Meteor.users.findOne(Meteor.userId());
		var attr = {};
		attr.$set={};
        attr.$set["username"] = Meteor.user().profile.name;
        attr.$set.profile = {}
        attr.$set.profile["gender"] = googleAccount.services.google.gender;
        attr.$set.profile["email"] = googleAccount.services.google.email;
        attr.$set.profile["googleId"] = googleAccount.services.google.id;
        attr.$set.profile["avator"] = googleAccount.services.google.picture;
        attr.$set.profile["aboutMe"] = " ";
        attr.$set.profile["name"] = Meteor.user().profile.name;
		return Meteor.users.update(_id, attr);
	},
	createAccount: function(_id, phone) {
		try {
			var attr = {};
			attr.$set={};
			attr.$set.profile = {}
	        attr.$set.profile["gender"] = "male";
	        attr.$set.profile["telphone"] = phone;
	        attr.$set.profile["avator"] = "/images/avator.png";
	        attr.$set.profile["aboutMe"] = " ";
	        attr.$set.profile["name"] = phone.substr(0, 3) + "*" + phone.substr(7, 4) + new Chance().string({length: 5}),
			// Accounts.createUser(attr);
			Meteor.users.update(_id, attr);
		} catch(e) {
			throw e;
			return false;
		}
		return true;
	},
	// isExistUser: function(username) {
	// 	var account = Meteor.users.findOne({"profile.telphone": username});
	// 	if (account) {
 //            return account.username;
 //        };
	// 	return null;
	// },
	updateUsername: function(username) {
		try {
			// var $set = {};
	  //       $set.profile = {};
	  //       $set.profile["name"] = escape(username);
			Meteor.users.update(this.userId, {$set: {"profile.name": username}});
		} catch(e) {
			throw e;
			console.log(e);
			return false;
		}
		return true;
	},
	updateAboutMe: function(aboutMe) {

		try {
			// var $set = {};
	  //       $set.profile = {};
	  //       $set.profile["aboutMe"] = escape(aboutMe);
	        Meteor.users.update(this.userId, {$set: {"profile.aboutMe": aboutMe}});
		} catch(e) {
			throw e;
			console.log(e);
			return false;
		}
		return true;
	},
	deleteFollwer: function(followerId) {
		try {
			FollowerColl.update(followerId,
				{$set: 
					{
						"time": new Date(),
						"status": "delete",
					}
				}
			);
		} catch(e) {
			throw e;
			console.log(e);
			return false;
		}
		return true;
	},
	addFollwer: function(accountId) {
		try {
			FollowerColl.insert(
				{
					"accountId": this.userId,
					"follower": accountId,
					"time": new Date(),
					"category": "未分组",
					"status": "",
				}
			);
		} catch(e) {
			throw e;
			console.log(e);
			return false;
		}
		return true;
	},
	deleteFavorite: function(favoriteId) {
		try {
			FavoriteColl.update(favoriteId,
				{$set: 
					{
						"time": new Date(),
						"status": "delete",
					}
				}
			);
		} catch(e) {
			throw e;
			console.log(e);
			return false;
		}
		return true;
	},
	addFavorite: function(postId) {
		try {
			FavoriteColl.insert(
				{
					"accountId": this.userId,
					"postId": postId,
					"time": new Date(),
					"status": "",
				}
			);
		} catch(e) {
			throw e;
			console.log(e);
			return false;
		}
		return true;
	},
	isValidUsername: function(username) {
		return Accounts.findUserByUsername(username);
	},
	deleteFile: function(_id) {
		check(_id, String);

		var upload = storePicColl.findOne(_id);
		if (upload == null) {
			throw new Meteor.Error(404, 'Upload not found'); // maybe some other code
		}
		try {
			UploadServer.delete(upload.path);
		} catch (exception) {
			console.log(exception);
		}
		storePicColl.remove(_id);
	},

	// The method expects a valid IPv4 address
	getPhoneCredit: function(phoneNum) {
		try {
			var response = HTTP.get(
				"http://apis.baidu.com/baidu_mobile_security/phone_number_service/phone_information_query?tel=" + phoneNum + "&location=true", {
					headers: {
						'apikey': '431c620621ece68c1df83d329c06190e',
					}
				});

			var phoneCredit = {};
			console.log(response.statusCode);


			if (response.statusCode == "200") {
				var json = EJSON.parse(response.content);
				phoneCredit = json.responseHeader;
				_.each(json.response, function(item) {
					console.log(item);
					_.extend(phoneCredit, item);
				});
				console.log(phoneCredit);
				userCreditColl.insert(phoneCredit);
			};
		} catch (error) {
			console.log(error);
		}
	},
	isValidUserID: function(accountId) {
		return UserIdColl.find({accountId: Meteor.userId()}).count();
	},
	getUserIDInfo: function(userID) {
		try {
			console.log("try");
			var response = HTTP.get(
				"http://apis.baidu.com/apistore/idservice/id?id=" + userID, {
					headers: {
						'apikey': '431c620621ece68c1df83d329c06190e',
					}
				}
			);

			if (response.statusCode == "200") {
				var json = EJSON.parse(response.content);
				if (json.retMsg == "success" && json.errNum == 0) {
					var userid = {
						userID: userID,
						accountId: Meteor.userId(),
					};
					_.extend(userid, json.retData);
					UserIdColl.insert(userid);
					console.log(userid);
					return true;
				};
				// phoneCredit = json.responseHeader;
				// console.log(_.isObject(json.response));
				// _.each(json.response, function(item) {
				// 	console.log(item);
				// 	_.extend(phoneCredit, item);
				// });
				// console.log(phoneCredit);

			};
		} catch (error) {
			console.log(error);
			return false;
		}
		return false;

	},
    checkVerification: function(verification) {
    	return verification == verificationCode;
    },
	sendPhoneSMS: function(phoneNum) {
		var sms = {
			"phoneNum": phoneNum,
			"verificationCode": verificationCode,
			"time": new Date()
		}
		try {
			var response = HTTP.post(
				"https://sms.zhiyan.net/sms/match_send.json", {
					headers: {
						'Accept': 'application/json',
						"Accept-Charset": "UTF-8",
						'Content-Type': 'application/json;charset=utf-8',
					},
					data: {
						apiKey: '8f8d7701466a4fd282994df703faed24',
						appId: '7PA526kb45a1',
						mobile: phoneNum,
						content: "【无妄】您的验证码为：" + verificationCode + "。",
						extend: "",
						uid: "123456"
					},
					rejectUnauthorized: false,
				});
			sms.reason=response.reason;
			sms.status=response.result;
			if (response.result == "SUCCESS") {
				console.log("SUCCESS");
			};
		} catch (error) {
			sms.status="error";
			sms.reason=error;
		}
		PhonesColl.insert(sms);
		if (sms.status=="error") {
			return false;
		}
		return true;
	}

});