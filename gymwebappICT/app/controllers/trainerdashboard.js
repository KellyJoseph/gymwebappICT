'use strict';

const accounts = require ('./accounts.js');
const logger = require('../utils/logger');
const assessmentStore = require('../models/assessment-store');
const userStore = require('../models/user-store');
const goalStore = require('../models/goal-store');
const userTests = require('../models/user-tests');
const uuid = require('uuid');

const trainerDashboard = {
  
  trainerIndex(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'All Members Dashboard',
      members: userStore.getAllUsers(),
      //assessments: assessmentStore.getAllAssessments(),
    };
    logger.info('about to render', userStore.getAllUsers());
    response.render('trainerdashboard', viewData);
  },
  

  
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Assessment Dashboard',
      assessments: assessmentStore.getUserAssessment(loggedInUser.id).reverse(),
      user: accounts.getCurrentUser(request),
    };
    logger.info('about to render', assessmentStore.getAllAssessments());
    response.render('dashboard', viewData);
  },
  
   
  
  removeUser(request, response) {
    const accountId = request.params.id;
    logger.debug(`Deleting Account`);
    userStore.removeUser(accountId);
    response.redirect('/trainerdashboard');
  },
  
  addComment(request, response) {
    const assessmentId = request.params.id;
    const fetchedAssessment = assessmentStore.getAssessment(assessmentId);
    logger.debug("assessment id is", assessmentId);
    const newComment = request.body.comment;
    fetchedAssessment.comment = newComment;
    logger.debug('adding a comment');
    response.redirect('/trainerdashboard');
      //need to get assessment object, and add the cooment to it
  }, 
  
   addGoal(request, response) {
    const userId = request.params.id;
    const date = new Date();
    date.setFullYear(request.body.year);
    date.setMonth(request.body.month);
    date.setDate(request.body.day);

    const fetchedUser = userStore.getUserById(userId);
    logger.debug('Setting a new goal');
    const newGoal = {
      id: uuid(),
      userid: request.params.id,
      date:  date,
      category: request.body.category,
      target: request.body.target,
      status: "tbd",
    };
    logger.debug('Creating a new Goal', newGoal);
    goalStore.addGoal(newGoal);
    goalStore.goalStore.save();
    response.redirect('/trainerdashboard');
  },
  
  deleteGoal(request, response) {
    const goalId = request.params.id;
    logger.debug(`Deleting Goal ${goalId}`);
    goalStore.removeGoal(goalId);
    response.redirect('/trainerdashboard');
  },    
      
};

module.exports = trainerDashboard;

