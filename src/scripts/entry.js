"use strict";
import { AppInit, Application_loop } from './App/App.js';

window.onload = Entry;

function Entry(params){

  AppInit();
  Application_loop();
  
}
