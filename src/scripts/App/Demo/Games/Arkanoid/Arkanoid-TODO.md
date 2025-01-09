* Bricks that need more than 1 hit to be destroyed
   Set a var 'hits' in 'Brick' class
   Need to use a 'crack' texture (SEE: 'Create brick texture procedurally')


* The 'new Function_Slope()' class should be implemented as a preallocated buffer for quick creation-destruction



Create brick texture procedurally

   * Use a voronoi-worley NOISE
   * Create an alpha mask via a simple noise

   This way the cracks(voronoi) will be visible in some parts

   In fragment main:
   mask alpha = Noise()
   color = Voronoi(mask alpha)

   For efficiency:
   Try to render the alpha mask noise to a texture.
   But the mask could not be updated dynamically.
   In that case re-render the noise with the different params 

   