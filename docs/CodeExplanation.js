/**
 * Uniforms
 *
 * UniformsBuffer
 * It is dificult to know the size of the Float32Array uniforms buffer
 * for the initialization, cause meshes could and should add uniforms
 * to the uniformsBuffer when ever is needed. So we need to have a big
 * enough uniformsBuffer Float32Array.
 * On the contrary, in the glsl shader code,
 */

/**
 * Creating 'style' border-feather and round corners.
 *
 * The @params1 attribute is used to pass the 'style'.
 * 1. Set the Material's class function @mat.SetStyle(60, 30, 20)
 *    with the border-width, feather and round-corners as parameters.
 * 2. At @Matterial class set the curents material @sid.attr with the SID.ATTR.Border, ... for the rest styles,
 *    + the SID.ATTR.PARAMS1 to enable the construction of the @a_params1 attribute in the vertex shader.
 * 3. The @CreateShader() will contruct the rest of the vertex shader code, with the check in the sid.attr.'styles'.
 *    1 'in' float, 1 'out' float and 1 assigment statement for each of the styles are added to the vertex shader.
 * 4. At the frament shader the apropriate 'in' floats are constructed and then used for the final result
 */

/**
 * Automatic Shaders Creation.
 *
 * Enabling uniforms and attributes in shaders.
 *    Different 'enables' of uniforms for different meshes,
 *    creates different glPrograms.
 *    Uniforms have to be set, attributes already exist in the shaders.
 *    That saying, enable a uniform can only happen from the first mesh,
 *    cause the shader will be created with its uniforms state at the creation time.
 *    Attributes on the other hand, may be enabled from any mesh belonging to the
 *    shader program,
 */

/** // TODO:NOT VALID, RE-WRITE
 * Position-Size Controler and grid sections
 *
 * A section should be responsible for:
 *    position: all its children
 *    size: resize all its children, if they are sections
 *          resize its self, that means repositioning its children
 */

/** ### Event Listener

   [CreateListenEvent(TYPE_IDX, Clbk, source_params, target_params)]
   Listener takes a callback, [source_params] and [target_params].
   Internaly creates and stores an object 'event_params':
      const event_params = {
         type: TYPE_IDX,
         Clbk: Clbk,
         source_params: source_params,
         target_params: target_params,
      }


   [DispatchEvents(TYPE_IDX, trigger_params)]
   Upon Dispatch, the callback[Clbk] is called, passing an object 'dispatch_params':
      const dispatch_params = {
         source_params:    this.event_type[TYPE_IDX].buffer[i].source_params,
         target_params:    this.event_type[TYPE_IDX].buffer[i].target_params,
         trigger_params:   trigger_params,
         event_type:       TYPE_IDX,
      }
   So any [Clbk] function must accept as params an object of type:
   [dispatch_params]
      source_params:
      target_params:
      trigger_params:
      event_type:

 */

/****************************************************************************** */
// Scenes

/** ### Scene gfx buffer
 * Stores all meshes gfx in that order:
 *    1. buffer of programs groups
 *    2. buffer of programs
 *    3. buffer of vertex buffers
 *    4 buffer of meshes in vertex buffer
 *
 * Used for: Have a refference to all meshes of each buffer of each shader program.
 *    1. Batch update all 'start' of all meshes in a specific vertex buffer.
 */


/****************************************************************************** */
// Widgets And Meshes

/** ### Widget Drop down menu.

      
   // TODO: OLD recheck if it is according to current app's implementation 
   Widget is comprised of a section with a button widget as the trigger 
   (expansion/contraction). The expanded mesh is called 'menu' 
   (with type of Section).

   Any Mesh/Widget can be added to a dropdown's menu.
   
   When a dropdown is insertet to the menu of another dropdown,
   it retains its state (openened/closed).
   Example: If a dropdown (dp2) was deactivated because a higher dropdown (dp1) contracted, then 
   upon dp1 expansion the current dp2 must retain its state(openened/closed). If its 
   state was 'openened' then it must expand its menu and also have the
   expansion symbol(+/-, or any texture symbols). 

   ## Dropdown Menu
   The 'menu' variable is used to store the state of the dropdowns menu items.
   Based on the 'menu' variable, we expand/activate/open the menu of a dropdown 
   by adding the 'menu' to the dropdown's children buffer.
   For contracting/deactivating/closing a dropdown's menu, we remove the menu from the 
   dropdown's children.buffer[] and from the gfx buffers(remove the menu's attributes, or FAKE remove via varius implementations),
   BUT the 'menu' class variable retains all state.


   ## OnClick()
      Upon trigger 'On', the class variable 'menu' is coppied as a reference to
      the dropdown's children buffer. Then we call gfx generation, find private 
      gfx buffers for the menu section mesh and all its children (any Mesh type).  
      The menu's items may be on the same gfx buffers, as long their sid match,
      because the activation/deactivation hapens on the menu level. 



   ## ActivateMenu()
      TODO: Implement



       
   ## Widget Dropdown generate gfx Context (for menu and items activation)
      
      TEXT gfxctx
      It is for sure that under any circumstances, whichever menu is under the procedure of genarating gfx context
      for self and for it's items, there is already a text gfx buffer created from the root dropdown bottom.
      
      So the options are:
         1. Using the same buffers(where sid's match) for the menu and all it's item widgets/meshes,
            and for any different gfx Program sid's, create new gfx buffers. 
            (That is if a widget/mesh needs to instansiate a certain Gfx Program with specific shaders, 
            other than what ever shaders are used for a dropdown(Rext_Mesh) and its text(Text_Mesh))
         2. Create NEW gfx buffers for a menu and its items.
            All items should use the NEW gfx buffer (where apropriate), for efficiency reasons(can't have too many vertexbuffers)

      * In the 1. case, it is much more efficient to handle/find the gfx buffer indexes from within the dropdown class, on the site of gfx context generation,
         instead of calling any recursion functions to find gfx buffer sid match (functions from GfxContextFindMatch.js) 

      * Widget Dropdown gfx buffer context algorithm.

         1. For every dropdown root, that means its parent is a scene: We create a new PRIVATE gfx buffer.
         2. If dp is an item of another dp-menu: Find gfx buffer context match from the menu's children items (NOT RECURSIVE).
            . Find the gfx contexes of the gathered gfx's that match the sid of the new dp: and call the GenerateGfx() with SPECIFIC gfx.
            . If non sid match found, create new PRIVATE (The creation of the sid gfx program will be automaticaly constructed) 

         INFO:
            GFX_GROUPS: Where the '.sid.gfx_group' value is set (for all dps, dp buttons, menus and menu items).
               1. It is set by the GenGfxCtx function, where the menu and button of the dropdown are set equal to the dp's .sid.gfx_group.
               2. On dp activation it is set in GenMenuGfxCtx_recursive() method.

 */

/** ### Fake Events // TODO:IMPLEMENT DISCRIPTION
 * 
 */

/** ### Fake Remove
  * Discription: Don't display meshes on the gl canvas, by setting
  In order to not display a mesh in the canvas without removing the mesh vertices from the vertex buffers,
  we set its Y position to be OUT_OF_VIEW.
  
  Remove mesh:
  1. Store the curent y pos in the mesh's default y pos.
  2. Call .SetPosY, to update the y pos in the vertex buffer.
  
  Restore mesh:
  1. Copy the mesh's y pos from the default y pos where it is stored.
  2. Call .SetPosY, to update the y pos in the vertex buffer.

 */

/** ### OnMove Events Implementation Logic
 * 
 * The OnMove() method is called from the 'TimeIntervals' class as a callback function,
 * not directly from the EventListeners buffer. That is because of:
 * 1. The move event must update on every frame, so a time interval is needed.
 * 2. We need a function to initialize the time interval and what better place to do
 *    if not in the object's OnClick() method, since it is only logical because the object was clicked(in order to be moved).
 *
 * The OnClick() method of the class is responsible for creating a interval timer
 * and pass the this.OnMove() as a callback.
 *  
 * Logic: Uppon object click for moving:
 * 1. The OnClick() is called, which is only natural, since the object was clicked (in order to be moved).
 * 2. The OnClick() checks/decides if the object is movable and creates a time interval event, 
 *    with the OnMove() method passed as a callback. 
 *    The Update for the OnMove() will run independetly from the Event System, updating on a time interval.
 * 3. The OnMove() checks if the user let go of the grabbed object, and if so
 *    destroys the OnMove time interval and the moving operation for the object stops.
 * 
 * 
 */

/** ### Construct Listeners
   Constructs-creates lisetn events, recursively.
   It is called from a root mesh, and recursively runs down the children.
   It is looking at the mesh's variable 'listeners', which is a buffer, for any events for the mesh.
   If an event is registered in the buffer, creates a listen event via the .AddListenEvent() function,
   which creates and stores the event in the 'Events Listener' buffer and returns the events index to the mesh,
   to be stored to the mesh's 'listeners' buffer .evt field.

   Each widget must have it's own 'ConstructListeners' function, so it handles the construction of it's own.
   That way, despite the type of root widget that starts to costruct the listeners,
   the recursion part will follow the path of the current widget's 'ConstructListeners' function,
   which happens to be a method of that widget class, handling *efficiently and *uniquely all of its children events.
   *efficiently: The widget knows how many children it has and whom to operate upon.
   *uniquely: Some widgets may want to create an event for some spesific child OR do not create an event in that matter.
 */

/** ### Clamp
      
   ## THRESHOLD: integer value in pixels

   SCROLLER example
                               ___------> Upper limit: clamp y upp + threshold
                  |          |    \
                  |          |     |-> threshold. The height of which a mesh may or may not be rendered
   clamp y upp  ->|__________| ___/ 
                  |          |                        
                  |          |                        
                  |          |                        
                  |          |                        
                  |          |                        
   clamp y down ->|__________|
                  |          |
                  |          |------>Lower limit: clamp y down + threshold


 */