"use strict";
import { AppInit, Application_loop } from './App/App.js';


window.onload = Entry;

function Entry(){

  AppInit();
  Application_loop();
  
}
