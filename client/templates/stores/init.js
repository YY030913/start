Meteor.startup(function() {
	Uploader.render = function() {
			// template context is the template instance itself
			var templateContext = this;
			templateContext.progressBar = this.$('.progress-bar');
			templateContext.progressLabel = this.$('.progress-label');
			templateContext.uploadControl = this.$('.jqUploadclass');
			templateContext.dropZone = this.$('.jqDropZone');

			// this.data holds the template context (arguments supplied to the template in HTML)
			var dataContext = this.data;

			// attach the context to the form object (so that we can access it in the callbacks such as add() etc.)
			this.find('form').uploadContext = templateContext;

			// set the upload related callbacks for HTML node that has jqUploadclass specified for it
			// Example html node: <input type="file" class="jqUploadclass" />
			templateContext.uploadControl.fileupload({
					url: Uploader.uploadUrl,
					dataType: 'json',
					dropZone: templateContext.dropZone,
					add: function(e, data) {
						console.log(data);
						console.log("data");
						Uploader.log(Uploader.logLevels.debug, 'render.add ');

						// get dynamic formData
						if (dataContext != null && dataContext.callbacks != null) {

							// form data

							if (dataContext.callbacks.formData != null) {
								data.formData = dataContext.callbacks.formData();
							}

							// validate
							if (dataContext.callbacks.validate != null &&
								!dataContext.callbacks.validate(data.files)) {
								return;
							}
						}

						// adding file will clear the queue
						if (dataContext == null ||
							!dataContext.multiple) {
							templateContext.queue = [];
							templateContext.queueView.set([]);
						}

						// update the queue collection, so that the ui gets updated
						$.each(data.files, function(index, file) {
							var item = file;
							item.data = data;
							templateContext.queue[file.name] = new ReactiveVar({
								running: false,
								progress: 0
							});
							templateContext.queue.push(item);
							templateContext.queue.size += parseInt(file.size);
						});

						// say name
						Uploader.createName(templateContext);

						// set template context
						templateContext.queueView.set(templateContext.queue);

						// we can automatically start the upload
						if (templateContext.autoStart) {
							Uploader.startUpload.call(templateContext);
						}

					}, // end of add callback handler
					done: function(e, data) {
						Uploader.log(Uploader.logLevels.debug, 'render.done ');

						templateContext.globalInfo.set({
							running: false,
							progress: 100
						});

						$.each(data.result.files, function(index, file) {
							Uploader.finished(index, file, templateContext);

							// notify user
							if (dataContext.callbacks != null &&
								dataContext.callbacks.finished != null) {
								dataContext.callbacks.finished(index, file, templateContext);
							}
						});
					},
					fail: function(e, data) {
						Uploader.log(Uploader.logLevels.debug, 'render.fail ');
					},
					progress: function(e, data) {
						// file progress is displayed only when single file is uploaded
						var fi = templateContext.queue[data.files[0].name];
						if (fi) {
							fi.set({
								running: true,
								progress: parseInt(data.loaded / data.total * 100, 10),
								bitrate: data.bitrate
							});
						}
					},
					progressall: function(e, data) {
						templateContext.globalInfo.set({
							running: true,
							progress: parseInt(data.loaded / data.total * 100, 10),
							bitrate: data.bitrate
						});
					},
					drop: function(e, data) { // called when files are dropped onto ui
						$.each(data.files, function(index, file) {
							Uploader.log(Uploader.logLevels.debug, "render.drop file: " + file.name);
						});
					},
					change: function(e, data) { // called when input selection changes (file selected)
						// clear the queue, this is used to visualise all the data
						templateContext.queue = [];
						templateContext.queue.size = 0;
						templateContext.progressBar.css('width', '0%');
						templateContext.globalInfo.set({
							running: false,
							progress: 0
						});

						$.each(data.files, function(index, file) {
							Uploader.log(Uploader.logLevels.debug, 'render.change file: ' + file.name);
						});
					}
				})
				.prop('disabled', ($.support != null && $.support.fileInput != null) ? !$.support.fileInput : false)
				.parent().addClass(($.support != null && $.support.fileInput != null && !$.support.fileInput) ? 'disabled' : undefined);
	},

	Uploader.finished = function(index, file) {
		console.log("Uploader.finished");
		console.log(file);
		console.log(this);

		storePicColl.insert(file);
	}
});