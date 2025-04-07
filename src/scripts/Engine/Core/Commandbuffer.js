"use strict";

import { _ } from '../Global/EngineConstants.js';
import { New_generic_buffer } from './Buffers.js';

/**
 * TO BE IMPLEMENT
 */

const COMMANDS = {
   ID: {

   },
};






const _command_storage_buffer = New_generic_buffer(_, 'Command Buffer');
const _command_flags = { mask:0x0 }; // Fast way to find if a spesific ID command has been added to command buffer
export function Command_buffer_reset() { _command_storage_buffer.ResetFull(); }




export function Command_buffer_store(Clbk = null, params = null, ID = null) {
   
   
   // Add command if does not exist OR if user explicitly tells y passing null as ID 
   if (ID !== null && (_command_flags.mask & ID)) return;

   _command_storage_buffer.Add({
      Clbk: Clbk,
      params: params,
      ID: ID,
   });
   _command_flags.mask |= ID;

}




export function Command_buffer_run() {

   if (_command_storage_buffer.boundary < 0) return;

   for (let i = 0; i <= _command_storage_buffer.boundary; i++) {

      const Clbk = _command_storage_buffer.buffer[i].Clbk;
      const params = _command_storage_buffer.buffer[i].params;

      Clbk(params);
   }

   console.log('Command buffer: commands count -> ', _command_storage_buffer.active_count)

   _command_storage_buffer.Reset();
   _command_flags.mask = 0x0; // Reset the flags

}