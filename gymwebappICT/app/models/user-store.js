'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const userStore = {

  userStore: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',
 

  getAllUsers() {
    return this.userStore.findAll(this.collection);
  },

  addUser(user) {
    this.userStore.add(this.collection, user);
    this.userStore.save();
  },
  
  removeUser(id) {
    const user = this.getUserById(id)
    this.userStore.remove(this.collection, user);
    this.userStore.save();
  },
  
  addAssessment(assessment) {
    this.assessmentStore.add(this.collection, assessment);
    this.assessmentStore.save();
  },

  getUserById(id) {
    return this.userStore.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email) {
    return this.userStore.findOneBy(this.collection, { email: email });
  },
};

module.exports = userStore;
