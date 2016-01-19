# 无妄之争

#### 应用工具Meteor

#### 启动应用

`meteor run --port 80`

#### 部署应用

meteor deploy yousite.meteor.com

#### 编译app-android
编译
meteor build ~/build-output-directory \
    --server=your-desired-app-hostname.meteor.com
创建app私钥
keytool -genkey -alias your-app-name -keyalg RSA \
    -keysize 2048 -validity 10000
签名并验证签名 
cd ~/build-output-directory/android/
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 unaligned.apk your-app-name

$ANDROID_HOME/build-tools/23.0.0/zipalign 4 \
    unaligned.apk production.apk

#### 编译app-ios