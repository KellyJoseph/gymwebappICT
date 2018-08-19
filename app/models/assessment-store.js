'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const assessmentStore = {

  assessmentStore: new JsonStore('./models/assessment-store.json', { assessmentCollection: [] }),
  collection: 'assessmentCollection',  

  getAllAssessments() {
    return this.assessmentStore.findAll(this.collection);
  },

  getAssessment(id) {
    return this.assessmentStore.findOneBy(this.collection, { id: id });
  },
  
  getUserAssessment(userid) {
    return this.assessmentStore.findBy(this.collection, { userid: userid });
  },

  addAssessment(assessment) {
    this.assessmentStore.add(this.collection, assessment);
    this.assessmentStore.save();
  },


  removeAllAssessments() {
    this.assessmentStore.removeAll(this.collection);
    this.assessmentStore.save();
  },

  addSong(id, song) {
    const playlist = this.getPlaylist(id);
    playlist.songs.push(song);
    
    let duration = 0;
    for (let i = 0; i < playlist.songs.length; i++) {
      duration += playlist.songs[i].duration;
    }
    
    playlist.duration = duration;
    this.playlistStore.save();
  },

  removeSong(id, songId) {
    const playlist = this.getPlaylist(id);
    const songs = playlist.songs;
    _.remove(songs, { id: songId});
    this.playlistStore.save();
  },
  
  removeAssessment(id) {
    const assessment = this.getAssessment(id);
    this.assessmentStore.remove(this.collection, assessment);
    this.assessmentStore.save();
  },
  
};

module.exports = assessmentStore;
