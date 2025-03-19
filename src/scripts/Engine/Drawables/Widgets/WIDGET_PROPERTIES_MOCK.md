

WIDGET PROPERTIES MOCK


style: {
   pad:[x,y],
   margin:[x,y], ???
   hover_margin:[x,y],

   rcorners:float,
   feather:float,
},
geom: {
   pos:[x,y,z],
   dim[x,y],
},
mat: {
   col:[r,g,b,a],
   texture_id:const,
   variant_idx:const,
},

OR EACH WIDGET SHOULD HAVE ITS OWN properties struct??
Slider for example needs handle_dim. So how to pass it on widget construction?
