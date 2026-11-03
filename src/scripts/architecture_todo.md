* Implement having root widgets use the same vertex buffers (using find-match from GfxContextFindMatch)
   In other words, we need to reconfigure ViewGrouups and RenderGroups for one buffer rules.
   I think that the only matter is the index buffer buld, which is called by each root widget
   therefore the index count resets (0) on every call from root

* Add to gfx buffers - new implementation
Mesh: has an attributes float32 buffer
The buffers is part of Attributes[], a larger buffer to hold all attributes of all meshes

1. the attributes must be populated by a function
2. we need the attribs info
3. build the attribs based on attribs info


Vertex buffer update
update for one mesh
pass: 
   indexes [vbidx, start, offset, stride]
   values: [attributes]

The vb data update may change all attributes, then the offset is not necessary

batch update (per frame)
Same as per mesh update. 
The only difference is the values is another float32 buffer that has storred
pass: 
   indexes [vbidx, stride]
   values: [attributes]



* Particles:
   Particles could be like text elements. Have an emitter for position like the first character of a text_mesh has the info,
   and the particles like the rest of the text characters.


* Rename align ui elements with layout.
   Incorporate a style struct as parameter to pas any styles like padding-alignment-

* Implement framebuffers

* Implement instance buffer drawing