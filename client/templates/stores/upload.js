Template['tmp_uploadStoreLicense'].created = function() {
    console.log(this);
    Uploader.init(this);
    console.log("created tmp_uploadStoreLicense template");
    // copy values to context
    if (this.data) {
        this.autoStart = this.data.autoStart;
    }
};

Template['tmp_uploadStoreLicense'].helpers({
    'class': function(where) {
        return Uploader.UI[this.type][where];
    },
    'uploadContext': function() {
        console.log("uploadContext");
        console.log(Template.instance());
        return Template.instance();
    },
    'submitData': function() {
        console.log("submitData");
        console.log(this);
        if (this.formData) {
            this.formData['contentType'] = this.contentType;
        } else {
            this.formData = {
                contentType: this.contentType
            };
        }
        return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
    },
    'infoLabel': function() {
        var instance = Template.instance();

        var progress = instance.globalInfo.get();
        var info = instance.info.get();
        if (!instance.info.get()) {
            return "";
        }
        console.log("info");
        console.log(info.name);

        return progress.running ?
            Uploader.formatProgress(info.name, progress.progress, progress.bitrate) :
            (info.name + '&nbsp;<span style="font-size: smaller; color: #333">' + bytesToSize(info.size) + '</span>');
    },
    'progress': function() {
        console.log("progress");
        return 'width:' + Template.instance().globalInfo.get().progress + '%';
    },
    buttonState: function() {
        var that = Template.instance();
        return {
            'idle': function() {
                return !that.globalInfo.get().running;
            },
            'cancelled': function() {
                return that.globalInfo.get().cancelled;
            },
            'waiting': function() {
                return that.globalInfo.get().progress !== 100;
            },
            'removeFromQueue': function() {
                return false;
            }
        }
    },
    'queueItems': function() {
        return Template.instance().queueView.get();
    },
    'showQueue': function() {
        return Template.instance().queueView.get().length > 1;
    }
});

Template['tmp_uploadStoreLicense'].rendered = function() {
    console.log("tmp_uploadStoreLicense template render");
    Uploader.render.call(this);
};

Template['tmp_uploadStorePic'].created = function() {
    console.log(this);
    Uploader.init(this);
    console.log("created tmp_uploadStorePic template");
    // copy values to context
    if (this.data) {
        this.autoStart = this.data.autoStart;
    }
};

Template['tmp_uploadStorePic'].helpers({
    'class': function(where) {
        return Uploader.UI[this.type][where];
    },
    'uploadContext': function() {
        return Template.instance();
    },
    'submitData': function() {
        if (this.formData) {
            this.formData['contentType'] = this.contentType;
        } else {
            this.formData = {
                contentType: this.contentType
            };
        }
        return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
    },
    'infoLabel': function() {
        var instance = Template.instance();

        var progress = instance.globalInfo.get();
        var info = instance.info.get();
        if (!instance.info.get()) {
            return "";
        }
        console.log("info");

        console.log(this);
        console.log(Template.instance());
        
        console.log(info.name);

        return progress.running ?
            Uploader.formatProgress(info.name, progress.progress, progress.bitrate) :
            (info.name + '&nbsp;<span style="font-size: smaller; color: #333">' + bytesToSize(info.size) + '</span>');
    },
    'progress': function() {
        return 'width:' + Template.instance().globalInfo.get().progress + '%';
    },
    buttonState: function() {
        var that = Template.instance();
        return {
            'idle': function() {
                return !that.globalInfo.get().running;
            },
            'cancelled': function() {
                return that.globalInfo.get().cancelled;
            },
            'waiting': function() {
                return that.globalInfo.get().progress !== 100;
            },
            'removeFromQueue': function() {
                return false;
            }
        }
    },
    'queueItems': function() {
        return Template.instance().queueView.get();
    },
    'showQueue': function() {
        return Template.instance().queueView.get().length > 1;
    }
});

Template['tmp_uploadStorePic'].rendered = function() {
    console.log("tmp_uploadStorePic template render");
    Uploader.render.call(this);
};


Template['uploadedStoreInfo'].helpers({
    storePics: function() {
        console.log(uploads.find().count());
        return uploads.find();
    },
    src: function() {

        console.log("src");
        console.log(this);
        if (this.type.indexOf('image') >= 0) {
            return 'upload/' + this.path;
        } else return 'file_icon.png';
    }
});

Template['uploadedStoreInfo'].events({
    'click .deleteUpload': function() {
        if (confirm('Are you sure?')) {
            console.log("confim" + this._id);
            Meteor.call('deleteFile', this._id);
        }
    }
})