import './camion-page.jade';

Template.camion_page.onCreated(function camionPageOnCreated() {
  this.camionData = new ReactiveVar( [] );
  self=this;
  Meteor.call('getOffres','75011',function(error,result){
    self.camionData.set(result.data.offres);
    console.log(result);
    $('#agence h2').html(result.data.agence.nom);
    $('#agence p').html(result.data.agence.adresse1+"<br>"+result.data.agence.cp+" "+result.data.agence.ville);
 });
});
Template.camion_page.helpers({
  listCamion:function(){
     return Template.instance().camionData.get();
  },
});
