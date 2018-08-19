'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

  goalStore: new JsonStore('./models/goal-store.json', { goalCollection: [] }),
  collection: 'goalCollection',  

  getAllGoals() {
    return this.goalStore.findAll(this.collection);
  },

  getGoal(id) {
    return this.goalStore.findOneBy(this.collection, { id: id });
  },
  
  getUserGoal(userid) {
    return this.goalStore.findBy(this.collection, { userid: userid });
  },

  addGoal(goal) {
    this.goalStore.add(this.collection, goal);
    this.goalStore.save();
  },

  removeAllGoals() {
    this.goalStore.removeAll(this.collection);
    this.goalStore.save();
  },
 
  removeGoal(id) {
    const goal = this.getGoal(id);
    this.goalStore.remove(this.collection, goal);
    this.goalStore.save();
  },
  
};

module.exports = goalStore;
