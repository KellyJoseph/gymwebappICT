'use strict';

const logger = require('../utils/logger');
const assessmentStore = require('../models/assessment-store');
const userStore = require('../models/user-store');
const goalStore = require('../models/goal-store');
var moment = require('moment');
moment().format();


const uuid = require('uuid');

const userTests = {
  
  calculateBMI(id) {
    const weight = userStore.getUserById(id).weight;
    const gender = userStore.getUserById(id).gender;
    const height = userStore.getUserById(id).height;
    const BMI = weight/(height*height);
    return BMI;
  },
  
  determineBMICategory(bmi) {
        const  bmiValue = bmi;
    
        if (bmiValue < 16) {
            return "SEVERELY UNDERWEIGHT";
        }
        if ((bmiValue >= 16) && (bmiValue < 18.5)) {
            return "UNDERWEIGHT";
        }
        if ((bmiValue >= 18.5) && (bmiValue < 25)) {
            return "NORMAL";
        }
        if ((bmiValue >= 25) && (bmiValue < 30)) {
            return "OVERWEIGHT";
        }
        if ((bmiValue >= 30) && (bmiValue < 35)) {
            return "MODERATELY OVERWEIGHT";
        }
        if (bmiValue >= 35) {
            return "SEVERELY OVERWEIGHT";
        } else return "invalid input";
    },
  
  sortGender(gender) {
    const inputgender = gender;
    const character = inputgender.charAt(0).toUpperCase();
    if (character === "M") {
      this.character = "M"}
    if (character === "F") {
      this.character = "F"}
    if (character != "M" && character != "F") {
      this.character = "M"}
    return this.character;
  },
  
  getIdealBodyWeight(id)
    {
      const height = userStore.getUserById(id).height; 
      const heightInInches = ((height * 100) * 0.39);
      const gender = userStore.getUserById(id).gender;

        if ((gender != null) && (gender === "M")) {
           
            const idealWeight = 50 + ((heightInInches - 60) * 2.3); //
            //For males, an ideal body weight is: 50 kg + 2.3 kg for each inch over 5 feet. 1.0m = 39"
            return idealWeight;
        }
        if ((gender!= null) && (gender === "F")) {
            const heightInInches = ((height * 100) * 0.39);
        
            const idealWeight = 45 + ((heightInInches - 60) * 2.3);
            //For females, an ideal body weight is: 45.5 kg + 2.3 kg for each inch over 5 feet.
            return idealWeight;
        }

        else return 0;
    },
  
  isIdealWeight(id)
  {
    const idealWeight = this.getIdealBodyWeight(id);
    const weight = userStore.getUserById(id).weight;
    
    if ((weight >= idealWeight-5) && (weight <= idealWeight+5)) {
      
      return true;
    }
    else {
      return false;
    }
  },
  
  // only good for a dashboard display, not suitable for use in the assessment table
  // need to use helpers
  weightDecreasing(id)
  {
    const userAssessments = assessmentStore.getUserAssessment(id);
    const latestWeight = userAssessments[userAssessments.length -1].weight;
    const previousWeight = userAssessments[userAssessments.length -2].weight;
    const idealWeight = this.getIdealBodyWeight(id);
    
    if ((latestWeight - idealWeight) >= (previousWeight - idealWeight))
    {
      return true;
    }
    else return false;  
  },
  
  //determines if each assessment's weight value is closer or farther from the ideal body weight
  getTrend(weight, id) 
  {
    const assessments = assessmentStore.getUserAssessment(id);
    const newWeight = weight;
    const idealWeight = this.getIdealBodyWeight(id);
    if (typeof assessments != "undefined" && assessments.length > 0) {
      if (Math.abs(newWeight - idealWeight) < Math.abs(assessments[assessments.length -1].weight - idealWeight))
    {
      return true;
    }
    }
    else return false;
  },
  
  weightDecreasing(id)
  {
    const assessments = assessmentStore.getUserAssessment(id);
    var weights = [];
    var trends = [];
    for (let i = 0; i < assessments.length; i++)
    {
      weights.push(assessments[i].weight)
    }
    for (let i = 0; i > weights.length; i++) {
      if (weights[i+1] < weights[i]) {
        trends.push(true);
      }
    else trends.push(false);
    }
    
    return trends;
  },
  
  goalTest(assessment, id)
  //userGoals[i].date.getTime() will randomly not work and throw a TypeError: userGoals[i].date.getTime is not a function. No idea why.
  {
    const latestAssessment = assessment; //when adding a new assessment, this is passed in from the dashboard
    const userGoals = goalStore.getUserGoal(id); 
    if (typeof userGoals !== "undefined" && userGoals.length > 0) 
    {
        logger.info('got into goalTest but did not get into for loop');
      //logger.info(typeof(""));
    for (let i = 0; i < userGoals.length; i++) {
          logger.info('got as far as the for loop');
    
    switch (userGoals[i].category) {
      case  "weight":
            logger.info('got as far as the switch case');
        logger.info('category = ', userGoals[i].category, 'userGoals target = ', userGoals[i].target, ', latestAssessment weight =', latestAssessment.weight, ', latestAssessment date =', latestAssessment.date, ', and userGoal date =', userGoals[i].date);
        if ((userGoals[i].status !== "failed") &&(latestAssessment.weight > 0)&&(latestAssessment.weight <= userGoals[i].target) && (latestAssessment.date.getTime() <= userGoals[i].date.getTime()))
        {
          userGoals[i].status = "passed";
          logger.info('latest assessment weight', latestAssessment.weight, 'is less than goal weight', userGoals[i].target, 'latest Assessment date is less than goal date');
          break;
        }
        else if ((userGoals[i].status !== "passed")&&(latestAssessment.date.getTime() > userGoals[i].date))
        {
          userGoals[i].status = "failed";
          break;
        }
        else 
        break;
        case "waist":
        if ((userGoals[i].status !== "failed") &&(latestAssessment.waist > 0)&&(latestAssessment.waist <= userGoals[i].target) && (latestAssessment.date.getTime() <= userGoals[i].date.getTime()))
        {
          userGoals[i].status = "passed";
          break;
        }
         else if ((userGoals[i].status !== "passed")&&(latestAssessment.date.getTime() > userGoals[i].date))
        {
          userGoals[i].status = "failed";
          break;
        }
        else 
        break;
        case "chest":
        if ((userGoals[i].status !== "failed") &&(latestAssessment.chest > 0)&&(latestAssessment.chest <= userGoals[i].target) && (latestAssessment.date.getTime() <= userGoals[i].date.getTime()))
        {
          userGoals[i].status ="passed";
          break;
        }
         else if ((userGoals[i].status !== "passed")&&(latestAssessment.date.getTime() > userGoals[i].date))
        {
          userGoals[i].status = "failed";
          break;
        }
        else
        break;
        case "upperArm":
        if ((userGoals[i].status !== "failed") &&(latestAssessment.upperArm > 0)&&(latestAssessment.upperArm <= userGoals[i].target) && (latestAssessment.date.getTime() <= userGoals[i].date.getTime()))
        {
          userGoals[i].status ="passed";
          break;
        }
         else if ((userGoals[i].status !== "passed")&&(latestAssessment.date.getTime() > userGoals[i].date))
        {
          userGoals[i].status = "failed";
          break;
        }
        else
        break;

        case "thigh":
        if ((userGoals[i].status !== "failed") &&(latestAssessment.thigh > 0)&&(latestAssessment.thigh <= userGoals[i].target) && (latestAssessment.date.getTime() <= userGoals[i].date.getTime()))
        {
          userGoals[i].status ="passed";
          break;
        }
         else if ((userGoals[i].status !== "passed")&&(latestAssessment.date.getTime() > userGoals[i].date))
        {
          userGoals[i].status = "failed";
          break;
        }
        else
        break;

      case "hips":
        if ((userGoals[i].status !== "failed") &&(latestAssessment.hips > 0) && (latestAssessment.hips <= userGoals[i].target) && (latestAssessment.date.getTime() <= userGoals[i].date.getTime()))
        {
          userGoals[i].status = "passed";
          break;
        }
         else if ((userGoals[i].status !== "passed")&&(latestAssessment.date.getTime() > userGoals[i].date))
        {
          userGoals[i].status = "failed";
          break;
        }
        else
        break;
          default:
      userGoals[i].status = "no match"; 
                                 }                          
    }                             
    }
  },
  
    
};

module.exports = userTests;
