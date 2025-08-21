"use strict";


export function Pow(base, exp){
    if(exp < 1) alert('Power function takes only > 1 integers')
    let res = base;
    while(exp){
        res *= base;
        exp--;
    }
    return res;
}




/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Set Array */
// TODO: dst and src are logicaly opposite, swap them
/** */
export function Set_mat4_collumn(mat, scalar, colidx){
    return[
        mat[0][colidx] * scalar,
        mat[1][colidx] * scalar,
        mat[2][colidx] * scalar,
        mat[3][colidx] * scalar,
    ];
}

/** */
export function Mult_arr3_scalar(arr, scalar){
    arr[0] *= scalar;
    arr[1] *= scalar;
    arr[2] *= scalar;
}
/** */
export function Mult_arr4_scalar2(arr, scalar){
    return[
        arr[0] * scalar,
        arr[1] * scalar,
        arr[2] * scalar,
        arr[3] * scalar,
    ]

}
/** */
export function Mult_arr4_scalar(arr, scalar){
    arr[0] *=  scalar;
    arr[1] *=  scalar;
    arr[2] *=  scalar;
    arr[3] *=  scalar;
    return arr;
}
/** */
export function Mult_mat4_scalar2(mat, scalar){
    return[
        mat[0][0] * scalar,
        mat[0][1] * scalar,
        mat[0][2] * scalar,
        mat[0][3] * scalar,
        mat[1][0] * scalar,
        mat[1][1] * scalar,
        mat[1][2] * scalar,
        mat[1][3] * scalar,
        mat[2][0] * scalar,
        mat[2][1] * scalar,
        mat[2][2] * scalar,
        mat[2][3] * scalar,
        mat[3][0] * scalar,
        mat[3][1] * scalar,
        mat[3][2] * scalar,
        mat[3][3] * scalar,
    ];
}
/** */
export function Mult_mat4_scalar(mat, scalar){
    let k = 0;
    mat[k][0] *=  scalar;
    mat[k][1] *=  scalar;
    mat[k][2] *=  scalar;
    mat[k][3] *=  scalar; k++;
    mat[k][0] *=  scalar;
    mat[k][1] *=  scalar;
    mat[k][2] *=  scalar;
    mat[k][3] *=  scalar; k++;
    mat[k][0] *=  scalar;
    mat[k][1] *=  scalar;
    mat[k][2] *=  scalar;
    mat[k][3] *=  scalar; k++;
    if(mat[k][1] === undefined)
    console.error('888888888888888888888')
    mat[k][0] *=  scalar;
    mat[k][1] *=  scalar;
    mat[k][2] *=  scalar;
    mat[k][3] *=  scalar;
}
/** */
export function CopyMat4_arr4(dst, src){
    dst[0][0] = src[0];
    dst[0][1] = src[1];
    dst[0][2] = src[2];
    dst[0][3] = src[3];
    dst[1][0] = src[0];
    dst[1][1] = src[1];
    dst[1][2] = src[2];
    dst[1][3] = src[3];
    dst[2][0] = src[0];
    dst[2][1] = src[1];
    dst[2][2] = src[2];
    dst[2][3] = src[3];
    dst[3][0] = src[0];
    dst[3][1] = src[1];
    dst[3][2] = src[2];
    dst[3][3] = src[3];
}
/** */
export function CopyMat4(dst, src){
    dst[0][0] = src[0][0];
    dst[0][1] = src[0][1];
    dst[0][2] = src[0][2];
    dst[0][3] = src[0][3];
    dst[1][0] = src[1][0];
    dst[1][1] = src[1][1];
    dst[1][2] = src[1][2];
    dst[1][3] = src[1][3];
    dst[2][0] = src[2][0];
    dst[2][1] = src[2][1];
    dst[2][2] = src[2][2];
    dst[2][3] = src[2][3];
    dst[3][0] = src[3][0];
    dst[3][1] = src[3][1];
    dst[3][2] = src[3][2];
    dst[3][3] = src[3][3];
}
/** */
export function CopyArr(dst, src){
    
    if(!src || src === undefined){
        console.error('src is null. @ MathOperations.js');
        return null;
    }
    if(src[0] && src[0].constructor === Float32Array) alert('4478932')
    
    const len = src.length;
    let out = new Array(len);

    if(Array.isArray(src[0])){

        const len2 = src[0].length;
        
        for(let i=0; i<len; i++){
            out[i] = new Array(len2);
            for(let j=0; j<len2; j++){
                out[i][j] = src[i][j]
            }
        }
    }
    else{
        for(let i=0; i<len; i++){
            out[i] = src[i]
        }
    }
    
    dst = out;
    return dst;
}
/** */
export function CopyArr4(dst, src){
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
}
/** */
export function CopyArr3(dst, src){
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
}
/** */
export function CopyArr2(dst, src){
    dst[0] = src[0];
    dst[1] = src[1];
}
/** */
export function CopyArr1(dst, src){
    dst[0] = src[0];
}
/** */
export function SetArrElem(dst, src, idx){
    dst[idx] = src[idx];
}
/** */
export function CopyArr1_4(dst, val){
    dst[0] = val;
    dst[1] = val;
    dst[2] = val;
    dst[3] = val;
}
/** */
export function CopyArr1_3(dst, val){
    dst[0] = val;
    dst[1] = val;
    dst[2] = val;
}
/** */
export function CopyArr1_2(dst, val){
    dst[0] = val;
    dst[1] = val;
}

/** */
export function AddArr2(arr1, arr2){
    arr1[0]+=arr2[0];
    arr1[1]+=arr2[1];
}
/** */
export function AddArr3(arr1, arr2){
    arr1[0] += arr2[0];
    arr1[1] += arr2[1];
    arr1[2] += arr2[2];
}

/** */
export function SubArr2(arr1, arr2){
    //TODO: IIMPLEMENT
}
/** */
export function SubArr3(arr1, arr2){
    //TODO: IIMPLEMENT
}


/** */
export function Floor(val){
    return ~~val;
}
/** */
export function FloorArr2(arr){
    return [~~arr[0], ~~arr[1]]
}
/** */
export function FloorArr3(arr){
    return [~~arr[0], ~~arr[1], ~~arr[2]]
}
/** */
export function Round(val){
    return Math.round(val);
}
/** */
export function RoundArr2(arr){
    return [Math.round(arr[0]), Math.round(arr[1])];
}
/** */
export function RoundArr3(arr){
    return [Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])];
}
/** */
export function Abs(a){
    // return (a <= -0) ? -a : a;
    return (a < -0) ? -a : a;
}
/** */
export function Max(val1, val2) {
    return val1 > val2 ? val1 : val2;
}
/** */
export function Min(val1, val2) {
    return val1 < val2 ? val1 : val2;
}
/** */
export function Max3(val1, val2, val3) {
    return val1 > val2 ? Max(val1, val3) : Max(val2, val3);
}
/** */
export function Min3(val1, val2, val3) {
    return val1 < val2 ? Min(val1, val3) : Min(val2, val3);
}
/** */
export function Min4(val1, val2, val3, val4) {
    return val1 < val2 ? Min3(val1, val3, val4) : Min3(val2, val3, val4);
}
/** */
export function RoundFloat1Decimal(val) {
    return Math.round(val * 10) / 10;
}


/** */
export function Hash(a) {
    let x = Math.sin(a) * 43758.5453123;
    return (x - Math.trunc(x));
}
/** */
export function Hash11(seed){

    let x = Math.sin(seed*19287.8873)*28715.715; 
    return (x-Math.floor(x));
}


/** */
export function Clamp(val, min, max) {

    const v = val < min ? min : val;
    return v > max ? max : v;
}
/* Linear mapping from range <a1, a2> to range <b1, b2> */
/**
 * 
 * @param {float} x Value to interpolate
 * @param {float} a1 from min
 * @param {float} a2 from max
 * @param {float} b1 to min
 * @param {float} b2 to max
 * @returns 
 */
export function MapLinear( x, a1, a2, b1, b2 ) {

	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
}
/** See difference of the 2 lerp functions in DESMOS @ https://www.desmos.com/calculator/h5uj3zwpks */
// https://en.wikipedia.org/wiki/Linear_interpolation
export function Lerp_slow( x0, x1, t ) {

	return (( 1 - t ) * x0) + (x1 * t);
}
/** */
export function Lerp( x0, x1, t ) {

	return x0 + (x1 - x0) * t; // 
}


/** */
export function InterpolateToRange(value, resolution, maxVal) {

    const res = maxVal / resolution;
    // console.log('res:', res);
    const interpolatedVal = value * res;
    return interpolatedVal;
}

/** */
// export function InterpolateToRange01Inverted(value) {
//     return 1/value;
// }
// export function InterpolateToRange01(value, max) {
//     return (1.0/max) * value;
// }





// export function Map(min, max, t) {
//     return min + (t * (max-min));
// }



// export function Range(val, min, max){

//     return min + (val * (max - min));
// }

/** */
// http://en.wikipedia.org/wiki/Smoothstep
export function Smoothstep( x, min, max ) {

	if ( x <= min ) return 0;
	if ( x >= max ) return 1;
	x = ( x - min ) / ( max - min );

	return x * x * ( 3 - 2 * x );
}
/** */
export function Smootherstep( x, min, max ) {

	if ( x <= min ) return 0;
	if ( x >= max ) return 1;

	x = ( x - min ) / ( max - min );

	return x * x * x * ( x * ( x * 6 - 15 ) + 10 );
}
/** */
export function Mix_vec4_float32Array( vec1, vec2, ratio ) {

    const res = new Float32Array([
        Lerp(vec1[0], vec2[0], ratio),
        Lerp(vec1[1], vec2[1], ratio),
        Lerp(vec1[2], vec2[2], ratio),
        Lerp(vec1[3], vec2[3], ratio),
    ]);

	return res;
}
/** */
export function Mix_vec3_float32Array( vec1, vec2, ratio ) {

    const res = new Float32Array([
        Lerp(vec1[0], vec2[0], ratio),
        Lerp(vec1[1], vec2[1], ratio),
        Lerp(vec1[2], vec2[2], ratio),
    ]);

	return res;
}


/**
 * 
 * @param {*} x: Number 
 * @param {*} y: Number
 */
export function Magnitude(x, y){

    const length = Math.sqrt((x*x)+(y*y));

    return length;
}
/**
 * 
 * @param {*} v1: Array[x, y] 
 * @param {*} v2: Array[x, y]
 */
export function Magnitude_2vectors(v1, v2){

    const x = v1[0]-v2[0];
    const y = v1[1]-v2[1];
    const length = Math.sqrt(( (x*x) + (y*y) ));

    return length;
}
/** */
export function Dot(vx1, vy1, vx2, vy2){
    return (vx1*vx2) + (vy1*vy2);
}
/** */
export function Normalize_vec2(vx, vy){

    const mag = Magnitude(vx, vy);
    return [vx/mag, vy/mag];
}
/** */
export function Fract(f) {
    return f % 1;
}
/** */
export function Mod(a, b) {
    return a % b;
}


// TODO: rgb = rgb*rgb*(3.0-2.0*rgb); // cubic smoothing. By IQ for smooth color transition: https://www.shadertoy.com/view/MsS3Wc
