'use strict';

const express = require('express');
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const dashboard = require('./controllers/dashboard.js');
const updateInfo = require('./controllers/updateinfo.js');
const trainerDashboard = require('./controllers/trainerdashboard.js');
const viewUser = require('./controllers/viewuser.js');
const about = require('./controllers/about.js');

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/registerMember', accounts.register);
router.post('/registerTrainer', accounts.registerTrainer);
router.post('/authenticate', accounts.authenticate);
router.post('/authenticateTrainer', accounts.authenticateTrainer);

router.get('/dashboard', dashboard.index);
router.post('/dashboard/addassessment/:id', dashboard.addAssessment);
router.get('/dashboard/deleteassessment/:id', dashboard.deleteAssessment);
router.post('/dashboard/addgoal/:id', dashboard.addGoal);
router.get('/dashboard/deletegoal/:id', dashboard.deleteGoal);

router.get('/viewuser/viewselecteduser/:id', viewUser.viewSelectedUser);
router.post('/viewuser/addassessment/:id', viewUser.addAssessment);
router.get('/viewuser/deleteassessment/:id', viewUser.deleteAssessment);
router.post('/viewuser/addgoal/:id', viewUser.addGoal);
router.get('/viewUser/deletegoal/:id', viewUser.deleteGoal);
router.post('/viewuser/addcomment/:id', viewUser.addComment);

router.get('/updateinfo/:id', updateInfo.viewUpdateInfo);
router.post('/updateinfo/setfirstname/:id', updateInfo.setFirstName);
router.post('/updateinfo/setlastname/:id', updateInfo.setLastName);
router.post('/updateinfo/setemail/:id', updateInfo.setEmail);
router.post('/updateinfo/setpassword:id', updateInfo.setPassword);
router.post('/updateinfo/setheight/:id', updateInfo.setHeight);
router.post('/updateinfo/setgender/:id', updateInfo.setGender);

router.get('/trainerdashboard', trainerDashboard.trainerIndex);
router.get('/trainerdashboard/removeuser/:id', trainerDashboard.removeUser); 
router.post('/trainerdashboard/:id', trainerDashboard.addGoal);
router.get('/trainerdashboard/deletegoal/:id', trainerDashboard.deleteGoal);



router.get('/about', about.index);

module.exports = router;
