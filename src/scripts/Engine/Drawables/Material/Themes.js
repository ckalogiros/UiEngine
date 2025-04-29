"use strict";

import { Max, Min } from "../../../Helpers/Math/MathOperations.js";
import { Color_calculate_luminance_from_hsv, Color_hsv_to_rgb_calibrated } from "./Colors.js";

/**
 * if theme ready->load theme
 * if theme specific->create specific
 * 
 * 
 * if user pass color
 * if user dont pa
 */


export function Color_theme_slider_1() {

   return {
      col:Color_hsv_to_rgb_calibrated(.60, .0, .5, 1, .75, .3),
      bar_col:Color_hsv_to_rgb_calibrated(.60, .2, 1, 1, .8, 1.),
      handle_col:Color_hsv_to_rgb_calibrated(.60, .75, 1, 1, .75, 1.),
      name_text_col:Color_hsv_to_rgb_calibrated(.60, .4, 1., 1, .75, .3),
      value_text_col:Color_hsv_to_rgb_calibrated(.60, .3, 1., 1, 1, 1),
   };
};


export function Color_theme_slider_create() {
   
   const theme =  {
      col:Color_hsv_to_rgb_calibrated(.60, .0, .5, 1, .75, .3),
      bar_col:Color_hsv_to_rgb_calibrated(.60, .2, 1, 1, .8, 1.),
      handle_col:Color_hsv_to_rgb_calibrated(.60, .75, 1, 1, .75, 1.),
      name_text_col:Color_hsv_to_rgb_calibrated(.60, .4, 1., 1, .75, .3),
      value_text_col:Color_hsv_to_rgb_calibrated(.60, .3, 1., 1, 1, 1),
   };

   return theme;
};


export function Color_theme_slider_auto(hue=.50, sat=0, base_contrast=.20, base_contast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   const hue_preserve = base_contast_mult;

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   const calibrate = 1- (contrast * contrast * contrast * contrast * contrast);
   const contrast_cal = (contrast+.5)*calibrate;

   const text_cal_sat = Max(sat-.3, 0);


   // Pass the luminance back to caller for debugging
   const slider_lum = Color_calculate_luminance_from_hsv(.0,  .0,  1., 1, contrast, hue_preserve);
   const text_lum = Color_calculate_luminance_from_hsv(hue, text_cal_sat, 1., 1, contrast_cal, hue_preserve+.4);
   const handle_lum = Color_calculate_luminance_from_hsv(hue, sat, 1.0, 1, contrast_cal, hue_preserve);


   const theme =  {

      // Calibrated
      col:           Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, contrast     , hue_preserve   ),
      bar_col:       Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, contrast+.15 , hue_preserve   ),
      handle_col:    Color_hsv_to_rgb_calibrated(hue, sat    , 1.0, 1, contrast_cal , hue_preserve   ),
      name_text_col: Color_hsv_to_rgb_calibrated(hue, text_cal_sat , 1.0, 1, contrast_cal , hue_preserve+.4),
      value_text_col:Color_hsv_to_rgb_calibrated(.0 , 0      , 1.0, 1, contrast_cal , hue_preserve+.3),
      
      // REGULAR 
      // col:           Color_hsv_to_rgb_calibrated(.0,  .0,  .9, 1, contrast    , hue_preserve),
      // bar_col:       Color_hsv_to_rgb_calibrated(.0,  .0,  .9, 1, contrast+.15, hue_preserve),
      // handle_col:    Color_hsv_to_rgb_calibrated(hue, sat, 1., 1, contrast+.35, hue_preserve),
      // name_text_col: Color_hsv_to_rgb_calibrated(hue, sat, 1., 1, contrast+.35, hue_preserve),
      // value_text_col:Color_hsv_to_rgb_calibrated(.0,  .0,  1., 1, contrast+.35, hue_preserve),
      
      // SAVE
      // col:           Color_hsv_to_rgb_calibrated(.0,  .0,  .9, 1, contrast, hue_preserve),
      // bar_col:       Color_hsv_to_rgb_calibrated(.0,  .0,  .9, 1, contrast+.15, hue_preserve),
      // handle_col:    Color_hsv_to_rgb_calibrated(hue, sat, 1., 1, contrast_cal, hue_preserve),
      // name_text_col: Color_hsv_to_rgb_calibrated(hue, sat-.2, 1., 1, contrast_cal, hue_preserve+.4),
      // value_text_col:Color_hsv_to_rgb_calibrated(.0,  .0,  1., 1, contrast_cal, hue_preserve+.3),
      test_slider_lum:slider_lum,
      test_text_lum:text_lum,
      test_handle_lum:handle_lum,
      test_contrast_cal:contrast_cal,
   };

   return theme;
}


export function Color_theme_switch_auto(hue=.50, sat=0, base_contrast=.20, base_contast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   const hue_preserve = base_contast_mult;

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   const calibrate = 1- (contrast * contrast * contrast * contrast * contrast);
   const contrast_cal = (contrast+.5)*calibrate;
   
   const theme =  {
      // Calibrated
      col:           Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, base_contrast , hue_preserve   ),
      handle_col:    Color_hsv_to_rgb_calibrated(hue, sat    , 1.0, 1, contrast_cal , hue_preserve   ),
   };

   return theme;
}


export function Color_theme_label_auto(hue=.50, sat=0, base_contrast=.20, base_contast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   const hue_preserve = base_contast_mult;
   const text_cal_sat = Max(sat-.3, 0);

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   const calibrate = 1- (contrast * contrast * contrast * contrast * contrast);
   // const contrast_cal = (contrast+Max(base_contrast, .5))*calibrate;
   const contrast_cal = (contrast+.5)*calibrate;

   const theme =  {
      // Calibrated
      col:           Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, contrast     , hue_preserve   ),
      text_col:      Color_hsv_to_rgb_calibrated(hue, text_cal_sat , 1.0, 1, contrast_cal , hue_preserve+.4),
   };

   return theme;
}
