"use strict";



/**
 * TO BE IMPLEMENT
 */


// store a reference to our file handle
let fileHandle;

export async function getFile() {
  // open file picker
  [fileHandle] = await window.showOpenFilePicker();

  if (fileHandle.kind === "file") {
    // run file code
  } else if (fileHandle.kind === "directory") {
    // run directory code
  }
}
