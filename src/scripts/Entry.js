"use strict";
import { AppInit, Application_loop } from './App/App.js';

// window.onload = Entry;

// Check if in browser (by checking for `window` and `document`)
if (typeof window !== 'undefined' && window.document) {
  // In the browser, use window.onload
  window.onload = Entry;
} else {
  // In Node.js, directly call Entry() when the script is loaded
  Entry();
}

function Entry(params){

  AppInit();
  Application_loop();
  
}
