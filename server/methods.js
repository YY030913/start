Meteor.methods({
	deleteFile: function(_id) {
		console.log(_id);
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
		console.log("getPhoneCredit");
		try {
			console.log("try");
			var response = HTTP.get(
				"http://apis.baidu.com/baidu_mobile_security/phone_number_service/phone_information_query?tel="+phoneNum+"&location=true"
				,{
					headers: {
	          			'apikey': '431c620621ece68c1df83d329c06190e',
	        		}
				});
			console.log(response.content);

			var phoneCredit = {};
			console.log(response.statusCode);

			
			if (response.statusCode=="200") {
				var json = EJSON.parse(response.content);
				console.log(json);
				console.log(json.response);
				phoneCredit = json.responseHeader;
				console.log(_.isObject(json.response));
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
	getUserIDInfo: function(userID) {
		console.log("getPhoneCredit");
		try {
			console.log("try");
			var response = HTTP.get(
				"http://apis.baidu.com/apistore/idservice/id?id=" + userID
				,{
					headers: {
	          			'apikey': '431c620621ece68c1df83d329c06190e',
	        		}
				});
			
			console.log(response);
			
			if (response.statusCode=="200") {
				console.log(response.content);
				var json = EJSON.parse(response.content);
				// console.log(json);
				// console.log(json.response);
				if (json.retMsg=="success" && json.errNum==0) {
					console.log(json.retData);
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
	setPhoneSMS: function(phoneNum,verificationCode) {
		console.log("getPhoneCredit");
		try {
			console.log("try");
			var response = HTTP.post(
				"https://sms.zhiyan.net/sms/match_send.json"
				,{
					headers: {
						'Accept':'application/json',
						'Content-Type':'application/json;charset=utf-8',
	        		},
	        		data: {
	        			"apiKey":"8f8d7701466a4fd282994df703faed24",
				        "appId":" 7PA526kb45a1",
				        "mobile": phoneNum,
				        "content":"【无妄】您的验证码为：" + verificationCode,
				        "extend":"",
				        "uid":"123456"
	        		}
				});
			
			console.log(response);
			
			if (response.result=="SUCCESS") {
				console.log("SUCCESS");
				
			};
		} catch (error) {
			console.log(error);
		}
		
	}
	
});