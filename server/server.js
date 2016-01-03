Meteor.onConnection(function(conn) {
    console.log("onConnection : " + conn.clientAddress);
});