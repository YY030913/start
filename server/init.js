// Meteor.startup(function() {
// 	UploadServer.init({
// 		tmpDir: process.env.PWD + '/.uploads/tmp',
// 		uploadDir: process.env.PWD + '/.uploads/',
// 		checkCreateDirectories: true,
// 		getDirectory: function(fileInfo, formData) {
// 			if (formData && formData.directoryName != null) {
// 				return formData.directoryName;
// 			}
// 			return "";
// 		},
// 		getFileName: function(fileInfo, formData) {
// 			if (formData && formData.prefix != null) {
// 				return formData.prefix + '_' + fileInfo.name;
// 			}
// 			return fileInfo.name;
// 		},
// 		finished: function(fileInfo, formData) {
// 			console.log(fileInfo);
// 			console.log(formData);
// 			// if (formData && formData._id != null) {
// 			// 	items.update({
// 			// 		_id: formData._id
// 			// 	}, {
// 			// 		$push: {
// 			// 			uploads: fileInfo
// 			// 		}
// 			// 	});
// 			// }
// 		}
// 	});
// });