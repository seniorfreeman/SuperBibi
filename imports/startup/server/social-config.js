ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
// LOCAL
var fbConf = {
    service: 'facebook',
    appId: '490265651161953',
    secret: '8e45955295ad270db509f979ddfc1626',
    requestPermissions:[]
}
if(Meteor.absoluteUrl().search("http://dev.app.sbb")>-1){
	// DEV
	fbConf = {
	    service: 'facebook',
	    appId: '482313761957142',// 
	    secret: 'e26a0544e0ee02e8495ea018b59ba913',
	    requestPermissions:[]
	}
}
if(Meteor.absoluteUrl().search("http://app.sbb")>-1){
	// PREPROD
	fbConf = {
	    service: 'facebook',
	    appId: '473751232813395',// 
	    secret: 'ccf11a27693098136a15bce2766ee084',
	    requestPermissions:[]
	}
}
ServiceConfiguration.configurations.insert(fbConf);