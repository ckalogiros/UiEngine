"use strict";


// export function Gen_array_add_unique_elem(arr, elem) {
export function Gen_array_check_for_existing_element(arr, elem) {

   // if(DEBUG.DEFENSIVE) if(arr instanceof Array) alert('776658876 \n arr is not a type of Array')

   let same_found = false;

   const len = arr.length;

   for(let i=0; i<len; i++) {

      if(arr[i] === elem) {
         same_found = true;
         break;
      }
   }

   return same_found;
   // if(!same_found) arr.push(elem);

}