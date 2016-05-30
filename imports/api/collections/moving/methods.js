import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import {Moving,Address} from './moving.js'
/*****************Todo Methods Region************************/
export const createOrUpdateMovingDate= new ValidatedMethod({
	name: 'createOrUpdateMovingDate',
  	validate: new SimpleSchema({
      movingDate: { type: Date }

  }).validator(), run({ movingDate}) {


        user=Meteor.user();
        if(user){
          if(user.profile.movingId){
              moving=Moving.findOne({_id:user.profile.movingId});
              Moving.update({
                        _id: user.profile.movingId
                      },{
                        $set:{
                            "movingDate" : movingDate
                        }
                      },function(error,result){
                        console.log(error);
                      })
          }
          else{

              createdMoving=Moving.insert({
                            "movingDate" : movingDate
                        },function(error,result){
                        console.log(error);
                      });

              Meteor.users.update({
                                  _id: Meteor.userId()
                                  },{
                                    $set:{
                                      "profile.movingId" : createdMoving
                                    }
                                  }
              ,function(error,result){
                console.log(error);
              })

          }
        }
  },
});

export const updateCreateMovingAddress= new ValidatedMethod({
  name: 'updateCreateMovingAddress',
    validate: new SimpleSchema({
     isOld:{type:Boolean,optional: true}
    , type: { type: Number ,optional: true}
    , displayAddress: { type: String,optional: true}
    , num:{type:Number,optional: true}
    , address:{type:String,optional: true}
    , addressPlus:{type:String,optional: true}
    , postalCode:{type:String,optional: true}
    , city:{type:String,optional: true}
    , coordonates:{type: {
          lat:Number,
          lng:Number
        },optional: true}

  }).validator(), run({isOld, type,displayAddress,num,address,addressPlus,postalCode,city,coordonates}) {

          user=Meteor.user();
          if(user){
            if(user.profile.movingId){
                moving=Moving.findOne({_id:user.profile.movingId});
                addressId=null;
                if(isOld){
                    addressId=moving.oldAddressId;
                }
                else{
                    addressId=moving.newAddressId;
                }  
                if(addressId){
                    adress=Address.findOne({_id:addressId});
                    Address.update({_id:addressId},{$set:{
                           type: type?type:adress.type
                          , displayAddress: displayAddress?displayAddress:adress.displayAddress
                          , num:num?num:adress.num
                          , address:address?address:adress.address
                          , addressPlus:addressPlus?addressPlus:adress.addressPlus
                          , postalCode:postalCode?postalCode:adress.postalCode
                          , city:city?city:adress.city
                          , coordonates:coordonates?coordonates:adress.coordonates
                    }})
                }
                else{
                    adress=Address.insert({
                          type: type?type:null
                          , displayAddress: displayAddress?displayAddress:null
                          , num:num?num:null
                          , address:address?address:null
                          , addressPlus:addressPlus?addressPlus:null
                          , postalCode:postalCode?postalCode:null
                          , city:city?city:null
                          , coordonates:coordonates?coordonates:null
                    })
                    if(!addressId)
                    if(isOld){
                        Moving.update({_id:user.profile.movingId},{$set:{oldAddressId:adress}})
                    }
                    else{
                        Moving.update({_id:user.profile.movingId},{$set:{newAddressId:adress}})
                    }
                }

            }
          }

    },
});


 

export const updateAnimal= new ValidatedMethod({
  name: 'updateAnimal',
    validate: new SimpleSchema({
      movingId:{type:String},
      animals: { type: Boolean }

  }).validator(), run(movingId,animals){

        Moving.update({_id:movingId},{$set:{animals:animals}});

  },
});
export const updateOldHouseSize= new ValidatedMethod({
  name: 'updateOldHouseSize',
    validate: new SimpleSchema({
      movingId:{type:String},
      oldHouseSize: { type: Number }

  }).validator(), run(movingId,oldHouseSize){

        Moving.update({_id:movingId},{$set:{oldHouseSize:oldHouseSize}});

  },
});
export const updateChildren= new ValidatedMethod({
  name: 'updateChildren',
    validate: new SimpleSchema({
      movingId:{type:String},
      children: { type: Boolean }

  }).validator(), run(movingId,children){

        Moving.update({_id:movingId},{$set:{children:children}});

  },
});
 
export const updateOldRoomCount= new ValidatedMethod({
  name: 'updateOldRoomCount',
    validate: new SimpleSchema({
      movingId:{type:String},
      oldRoomCount: { type: Number }

  }).validator(), run(movingId,oldRoomCount){

        Moving.update({_id:movingId},{$set:{children:oldRoomCount}});

  },
});
export const updateRentingOldAddress= new ValidatedMethod({
  name: 'updateRentingOldAddress',
    validate: new SimpleSchema({
      movingId:{type:String},
      rentingOldAddress: { type: Number }

  }).validator(), run(movingId,rentingOldAddress){

        Moving.update({_id:movingId},{$set:{children:rentingOldAddress}});

  },
});
export const updateRentingNewAddress= new ValidatedMethod({
  name: 'updateRentingNewAddress',
    validate: new SimpleSchema({
      movingId:{type:String},
      rentingNewAddress: { type: Number }

  }).validator(), run(movingId,rentingNewAddress){

        Moving.update({_id:movingId},{$set:{children:rentingNewAddress}});

  },
});