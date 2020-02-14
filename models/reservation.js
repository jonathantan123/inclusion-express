'use strict';

var moment = require('moment');
moment().format();

module.exports = (sequelize, DataTypes) => {
  const SequelizeReservation = sequelize.define('Reservation', {
    name: DataTypes.STRING,
    slot: DataTypes.DATE
  }, {});

  class Reservation extends SequelizeReservation {

    
    static async all(){
      return await this.findAll();
    }

    static async createNew(obj){
      let nums = obj.date.split("-")
      let date1 = new Date(parseInt(nums[0]), parseInt(nums[1])-1, parseInt(nums[2]), parseInt(obj.slot[0]) + 12, obj.slot.slice(2,4))
      let res = 
      {
        name: obj.name, 
        slot: date1
      }
      Reservation.create(res)
    }
  }

  return Reservation;
};
