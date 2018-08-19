'use strict';

const accounts = require ('./accounts.js');
const logger = require('../utils/logger');
const assessmentStore = require('../models/assessment-store');
const userStore = require('../models/user-store');
const userTests = require('../models/user-tests');
const uuid = require('uuid');

const updateInfo = {
  
  viewUpdateInfo(request, response) {
    logger.info('updateinfo rendering');
    const userId = request.params.id;
    const selectedUser = userStore.getUserById(userId);
    const viewData = {
      user: selectedUser,
    };
    logger.info('about to render userinfo');
    response.render('updateinfo', viewData);
  },
  
  setFirstName(request, response) {
    const userId = request.params.id;
    const fetchedUser = userStore.getUserById(userId);
    const newFirstName = request.body.firstName;
    fetchedUser.firstName = newFirstName;
    userStore.userStore.save();
    logger.info('new name set');
    const viewData = {
      user: fetchedUser,
    };
    response.render('updateinfo', viewData);
  },
  
  setLastName(request, response) {
    const userId = request.params.id;
    const fetchedUser = userStore.getUserById(userId);
    const newLastName = request.body.lastName;
    fetchedUser.lastName = newLastName;
    userStore.userStore.save();
    logger.info('new last name set');
    const viewData = {
      user: fetchedUser,
    };
    response.render('updateinfo', viewData);
  },
  
  setEmail(request, response) {
    const userId = request.params.id;
    const fetchedUser = userStore.getUserById(userId);
    const newEmail = request.body.email;
    fetchedUser.email = newEmail;
    userStore.userStore.save();
    logger.info('new email set');
    const viewData = {
      user: fetchedUser,
    };
    response.render('updateinfo', viewData);
  },
  
  setPassword(request, response) {
    const userId = request.params.id;
    const fetchedUser = userStore.getUserById(userId);
    const newPassword = request.body.password;
    fetchedUser.password = newPassword;
    userStore.userStore.save();
    logger.info('new password set');
    const viewData = {
      user: fetchedUser,
    };
    response.render('updateinfo', viewData);
  },
  
  setGender(request, response) {
    const userId = request.params.id;
    const fetchedUser = userStore.getUserById(userId);
    const newGender =  userTests.sortGender(request.body.gender);
    fetchedUser.gender = newGender;
    userStore.userStore.save();
    logger.info('new gender set');
    const viewData = {
      user: fetchedUser,
    };
    response.render('updateinfo', viewData);
  },
  
  setHeight(request, response) {
    const userId = request.params.id;
    const fetchedUser = userStore.getUserById(userId);
    const newHeight = parseFloat(request.body.height);
    //if ((newHeight > 0) && (newHeight <= 3)){
    fetchedUser.height = newHeight;
    userStore.userStore.save();
  
    logger.info('new height set');
    const viewData = {
      user: fetchedUser,
    };
    response.render('updateinfo',viewData);
  },
};

module.exports = updateInfo;

