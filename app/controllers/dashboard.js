'use strict';

const accounts = require ('./accounts.js');
const logger = require('../utils/logger');
const assessmentStore = require('../models/assessment-store');
const userStore = require('../models/user-store');
const goalStore = require('../models/goal-store');
const userTests = require('../models/user-tests');
var moment = require('moment');
moment().format();


const uuid = require('uuid');

const dashboard = {
  
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const currentbmi = parseInt(userTests.calculateBMI(loggedInUser.id));
    loggedInUser.bmi = currentbmi;
    const isIdealWeight = userTests.isIdealWeight(loggedInUser.id);
    const trends = userTests.weightDecreasing(loggedInUser.id);
    logger.info('trends values are', userTests.weightDecreasing(loggedInUser.id));
    
    const viewData = {
      title: 'Assessment Dashboard',
      idealWeight: userTests.getIdealBodyWeight(loggedInUser.id),
      isIdealWeight: userTests.isIdealWeight(loggedInUser.id),
      trends: userTests.weightDecreasing(loggedInUser.id),
      assessments: assessmentStore.getUserAssessment(loggedInUser.id).reverse(),
      goals: goalStore.getUserGoal(loggedInUser.id).reverse(),
      user: accounts.getCurrentUser(request),
      bmi: parseInt(userTests.calculateBMI(loggedInUser.id)),
      bmiCategory: userTests.determineBMICategory(loggedInUser.bmi),
    };
    logger.info('about to render', assessmentStore.getAllAssessments());
    response.render('dashboard', viewData);
  },
  
  addAssessment(request, response) {
    const userId = request.params.id;
    const weight = request.body.weight;
    const fetchedUser = userStore.getUserById(userId);
    //Here, the weight parameter from the latest 
    //assessment is used to update the weight paramater of the user object 
    const date = new Date();
    const newWeight = request.body.weight;
    logger.debug('Setting user weight as', newWeight);
    fetchedUser.weight = newWeight;
    userStore.userStore.save();
    const newAssessment = {
      id: uuid(),
      userid: request.params.id,
      date: request.body.date,
      weight: request.body.weight,
      waist: request.body.waist,
      chest: request.body.chest,
      upperArm: request.body.upperArm,
      thigh: request.body.thigh,
      hips: request.body.hips,
      comment: "nothing yet",
      trend: userTests.getTrend(weight, userId),
      date: date,
    };
    logger.debug('Creating a new Assessment', newAssessment);
    assessmentStore.addAssessment(newAssessment);
    assessmentStore.assessmentStore.save();
    goalStore.goalStore.save();
    userTests.goalTest(newAssessment, userId);
    response.redirect('/dashboard');
  },
  
  deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    
    logger.debug(`Deleting Assessment ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect('/dashboard');
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
    response.redirect('/dashboard');
  },
  
  deleteGoal(request, response) {
    const goalId = request.params.id;
    logger.debug(`Deleting Goal ${goalId}`);
    goalStore.removeGoal(goalId);
    response.redirect('/dashboard');
  },    
  
};

module.exports = dashboard;
