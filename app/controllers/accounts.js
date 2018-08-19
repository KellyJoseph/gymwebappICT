'use strict';

const userstore = require('../models/user-store');
const trainerstore = require('../models/trainer-store');
const usertests = require('../models/user-tests');

const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },

  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('playlist', '');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    //const user = request.body;
    const user = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
      height: request.body.height,
      // sortGender ensures that the gender value will always be either M or F
      // If another value is entered, gender defaults to Male
      gender: usertests.sortGender(request.body.gender),
      bmi: "placeholder",
    };
      
    user.id = uuid();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect('/');
  },
  
  
  registerTrainer(request, response) {
    const trainer = request.body;
    trainer.id = uuid();
    trainerstore.addTrainer(trainer);
    logger.info(`registering ${trainer.email}`);
    response.redirect('/');
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie('playlist', user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect('/dashboard');
    } else {
      logger.info(`authentification failed`);
      response.redirect('/login');
    }
  },
  
  authenticateTrainer(request, response) {
    const trainer = trainerstore.getTrainerByEmail(request.body.email);
    if (trainer && trainer.password === request.body.password) {
      response.cookie(trainer.email);
      logger.info(`logging in ${trainer.email}`);
      response.redirect('/trainerDashboard');
    } else {
      logger.info(`authentification failed`);
      response.redirect('/login');
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.playlist;
    return userstore.getUserByEmail(userEmail);
  },
};

module.exports = accounts;
