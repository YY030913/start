// var FS = Npm.require('fs');

Meteor.startup(function() {
	if (navigationsColl.find().count() == 0) {
	    var data = [
	      	{
	      		name: "Home"
	      	},
	    ];
		var timestamp = (new Date()).getTime();
	    _.each(data, function(list) {
	      	var list_id = navigationsColl.insert({name: list.name,
	        	totalCount: 0});
	    });	
	};

	if (!Accounts.findUserByUsername("admin")) {
		Accounts.createUser(
			{
				username: "admin",
				email: "a15102902812@gmail.com",
				password: "123456"
			}
		);
	};

	adminUserId = Accounts.findUserByUsername("admin")._id;
	// console.log(adminUserId);
	// if (Roles.userIsInRole(adminUserId, ['admin'], 'web-owner')) {
		Roles.addUsersToRoles(adminUserId, ['admin'], 'web-owner');
	// }

	nullPictures = picturesColl.find({type: null});
	if (nullPictures.count()!=0) {
		nullPictures.forEach(function(picture) {
			// console.log(picture);
			picturesColl.insert({_id: picture._id, type:'user'});
		});
	};


	// CSV
	var csvStore = new FS.Store.FileSystem("csv", {
		path: "countrycode.csv", //optional, default is "/cfs/files" path within app container
		// transformWrite: myTransformWriteFunction, //optional
		// transformRead: myTransformReadFunction, //optional
		// maxTries: 1 //optional, default 5
	});

	var Csv = new FS.Collection("csv", {
		stores: [csvStore]
	});
	// console.log(Csv);
	
	// Papa.parse(Csv, {
	// 	complete: function(results) {
	// 		console.log("Finished:", results.data);
	// 	}
	// });

	// // Upload
	// // config server
	// UploadServer.init({
	// 	tmpDir: process.env.PWD + '/.uploads/tmp',
	// 	uploadDir: process.env.PWD + '/.uploads/',
	// 	checkCreateDirectories: true, //create the directories for you
	// 	validateRequest: function(req) { 
	//         if (req.header["content-length"] > 1000) {
	//             return "File is too long!";
	//         }
	//         return null; 
	//     },
	//     validateFile: function(file, req) {
	//         // e.g. read file content
	//         if (doSomethingWith(file.path)) {
	//             return "Error Message";
	//         }
	//         return null; 
	//     },
	// 	getDirectory: function(fileInfo, formData) {
	// 		// create a sub-directory in the uploadDir based on the content type (e.g. 'images')
	// 		return formData.contentType;
	// 	},
	// 	finished: function(fileInfo, formFields) {
	// 		// passing data from server to client
	// 		fileInfo.extraData = "12345676"
	// 	},
	// 	cacheTime: 100,
	// 	mimeTypes: {
	// 		"xml": "application/xml",
	// 		"vcf": "text/x-vcard"
	// 	}
	// });
})