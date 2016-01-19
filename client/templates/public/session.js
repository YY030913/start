/**about var scope*/
// File Scope. This variable will be visible only inside this
// one file. Other files in this app or package wont see it.
// var alicePerson = {name: "alice"};

// Package Scope. This variable is visible to every file inside
// of this package or app. The difference is that 'var' is
// omitted.
// bobPerson = {name: "bob"};

// URL
SESSION_URL_CURR = 'SESSION_URL_CURR';//当前路径url
SESSION_URL_HREF = 'SESSION_URL_HREF';//跳转路径url

// POST
SESSION_POST_ID = 'SESSION_POST_ID';//当前文章ID
SESSION_POST_TITLE = 'SESSION_POST_TITLE';//当前文章标题 sessionStorage
SESSION_POST_CONTENT = 'SESSION_POST_CONTENT';//当前文章内容 sessionStorage
SESSION_POST_POSITIVE = 'SESSION_POST_POSITIVE';//当前文章观点
SESSION_POST_NEGATIVE = 'SESSION_POST_NEGATIVE';//当前文章观点

// DEBATE
SESSION_DEBATE_OPTION = 'SESSION_DEBATE_OPTION';//当前评论观点

// REGISTER
SESSION_REGISTER_ERROR = 'SESSION_REGISTER_ERROR';
SESSION_REGISTER_VERIFICATION = 'SESSION_REGISTER_VERIFICATION';
SESSION_REGISTER_PHONENUMBER = 'SESSION_REGISTER_PHONENUMBER';

// LOCALSTORAGE
LOCAL_POST_CONTENT = 'LOCAL_POST_CONTENT';
LOCAL_DEBATE_CONTENT = 'LOCAL_DEBATE_CONTENT';