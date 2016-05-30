import './camion-page.jade';
import {
  updatePreferedShop
} from '../../../api/collections/profile/methods.js';

Template.camion_page.onCreated(function camionPageOnCreated() {
  
  this.camionData = new ReactiveVar( [] );

  self = this;
  
  if(!Meteor.user()){
    // ON DECLENCHE UNE POPIN pour guetter son addresse
    $('.changeOffice').trigger('click');
    return;
  }

  var stillPreferedShop = Meteor.user().profile.preferedShop ?  Meteor.user().profile.preferedShop : Meteor.user().profile.address;
  
  if(stillPreferedShop) {
    Meteor.call('getOffres', stillPreferedShop,function(error,result){
      console.log(error)
      if(!error) {
        console.log(result,stillPreferedShop)
        self.camionData.set(result.data.offres);
        
        $('#agence .openingTimes').removeAttr('disabled');
        $('#agence .websiteOffice').attr({'data-href':result.data.agence.url}).removeAttr('disabled');
        
        $('#agence h2').html(result.data.agence.nom);
        $('#agence p').html(result.data.agence.adresse1+"<br>"+result.data.agence.cp+" "+result.data.agence.ville);
        Meteor.users.update({_id: Meteor.userId()}, {$set:{"profile.preferedShop" : result.data.agence.id}}, console.log);
      }
   });

  }

});
  
// updateStressMode.call({stressMode:false});
Template.camion_page.helpers({
  listCamion:function(){
     return Template.instance().camionData.get();
  }
});

Template.camion_page.events({
  "click .openingTimes" : function(event) {
    Modal.show('schedules_modal');
  },
  "click .websiteOffice" : function(event) {
    window.open(event.target.dataset.href, '_blank');
  },
  "click .changeOffice" : function(event) {
    alert('get and display liste agence in modal');
  },
  "mouseenter .offres li" : function(event) {
    $('.camion_page').addClass('decrease');
  },
  "mouseleave .offres li" : function(event) {
    $('.camion_page').removeClass('decrease');
  }
})

Template.schedules_modal.helpers({
  adaSchedules: function() {
    var adaSchedules = Session.get('adaSchedules');
    var dayMap = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    var res = "";
    for(var idx in adaSchedules) {
      res += dayMap[idx] + ": ";
      if(adaSchedules[idx].ouverture)
        res += adaSchedules[idx].ouverture + " - " + adaSchedules[idx].pause_debut + "   " + adaSchedules[idx].pause_fin + " - " + adaSchedules[idx].fermeture + "<br>"; 
      else
        res += "fermé<br>";
    }
    return res;
  }
});

Template.schedules_modal.events({
  "click button.vert" : function(event) {
    Modal.hide();
  }
});