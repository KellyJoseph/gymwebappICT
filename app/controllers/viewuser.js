'use strict';

const accounts = require ('./accounts.js');
const logger = require('../utils/logger');
const assessmentStore = require('../models/assessment-store');
const userStore = require('../models/user-store');
const userTests = require('../models/user-tests');
const goalStore = require('../models/goal-store');
const uuid = require('uuid');

const viewUser = {
  
   viewSelectedUser(request, response) {
    logger.info('displaying assessments for chosen user');
    const userId = request.params.id;
    const selectedUser = userStore.getUserById(userId);
    const isIdealWeight = userTests.isIdealWeight(selectedUser.id);
    const trends = userTests.weightDecreasing(selectedUser.id);
    const currentbmi = parseInt(userTests.calculateBMI(selectedUser.id));
    selectedUser.bmi = currentbmi;  //update BMI on the user object

    const viewData = {
      
      goals: goalStore.getUserGoal(selectedUser.id).reverse(),
      user: selectedUser,
      assessments: assessmentStore.getUserAssessment(userId),
      idealWeight: userTests.getIdealBodyWeight(selectedUser.id),
      isIdealWeight: userTests.isIdealWeight(selectedUser.id),
      trends: userTests.weightDecreasing(selectedUser.id),
      assessments: assessmentStore.getUserAssessment(selectedUser.id).reverse(),
      goals: goalStore.getUserGoal(selectedUser.id).reverse(),
      bmi: parseInt(userTests.calculateBMI(selectedUser.id)),
      bmiCategory: userTests.determineBMICategory(selectedUser.bmi),

    };
    logger.info('about to render', assessmentStore.getUserAssessment(userId));
    response.render('viewuser' , viewData);
  },

  
   deleteAssessment(request, response) {
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect('/trainerDashboard');

  },
  
  deleteGoal(request, response) {
    const assessmentId = request.params.id;
    logger.debug(`Deleting Assessment`);
    assessmentStore.removeAssessment(assessmentId);
    response.redirect('/trainerDashboard');

  },
  
  addComment(request, response) {
    const assessmentId = request.params.id;
    const fetchedAssessment = assessmentStore.getAssessment(assessmentId);
    const newComment = request.body.comment;
    fetchedAssessment.comment = newComment;
    assessmentStore.assessmentStore.save();
    logger.debug('adding a comment');
    response.redirect('/trainerDashboard');

      //need to get assessment object, and add the cooment to it
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
    userTests.goalTest(newAssessment, userId);
    goalStore.goalStore.save();
    response.redirect('/trainerDashboard');
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
    response.redirect('/trainerDashboard');
  },
      
};

module.exports = viewUser;

