// // Voronoi from iq
// vec3 Voronoi( in vec3 x )
// {
//     x.y *= 15. * (1.+ cos(iTime)/15.); // scale of my voronoi
//     x.x *= 15. * (1.- sin(iTime)/10.); 
    
//     vec3 p = floor( x );
//     vec3 f = fract( x );

// 	float id = 1.;
//     vec2 res = vec2( .8 );
//     for( int k=-1; k<=1; k++ )
//     for( int j=-1; j<=1; j++ )
//     for( int i=-1; i<=1; i++ )
//     {
//         vec3 b = vec3( float(i), float(j), float(k) );
//         vec3 r = vec3( b ) - f + rand_1_05( 10.*vec2(p + b) );


//         float d = dot( r, r ) ;

//         if( d < res.x )
//         {
// 			id = dot( p+b, vec3(1.0,57.0,113.0 ) );
            
//             res = vec2( d, res.x );

            
//         }
//         else if( d < res.y )
//         {
//             res.y = d;
//         }
//     }

//     return vec3( res, abs(id));
// }
