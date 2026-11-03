"use strict";

import { Lerp, Max, Min } from "../../../Helpers/Math/MathOperations.js";
import { Color_calculate_luminance_from_hsv, Color_calculate_luminance_from_rgb, Color_hsv_to_rgb_calibrated } from "./Colors.js";

/**
 * if theme ready->load theme
 * if theme specific->create specific
 * 
 * 
 * if user pass color
 * if user dont pa
 */


/** */
export function Color_theme_slider_create() {
   
   const a = Lerp( .5, .7, .3);
   const theme =  {
      col:Color_hsv_to_rgb_calibrated(.60, .0, .5, 1, .75, .3),
      bar_col:Color_hsv_to_rgb_calibrated(.60, .2, 1, 1, .8, 1.),
      handle_col:Color_hsv_to_rgb_calibrated(.60, .75, 1, 1, .75, 1.),
      name_text_col:Color_hsv_to_rgb_calibrated(.60, .4, 1., 1, .75, .3),
      // name_text_col:Color_hsv_to_rgb_calibrated(.60, .4, 1., 1, .75, a),
      value_text_col:Color_hsv_to_rgb_calibrated(.60, .3, 1., 1, 1, 1),
      // value_text_col:Color_hsv_to_rgb_calibrated(.60, .3, 1., 1, 1, 0),
   };

   return theme;
};
/** */
export function Color_theme_slider_auto(hue=.50, sat=0, base_contrast=.20, base_contrast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   // const contrast = base_contrast; // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   // const hue_preserve = base_contrast_mult;
   const hue_preserve = (base_contrast_mult <= 0) ? Lerp( .5, .7, base_contrast_mult) : base_contrast_mult;

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   const calibrate = 1- (contrast * contrast * contrast * contrast * contrast);
   const contrast_cal = (contrast+.5)*calibrate;

   const text_cal_sat = Max(sat-.3, 0);
   // const text_cal_sat = sat;


   // Pass the luminance back to caller for debugging
   const slider_lum = Color_calculate_luminance_from_hsv(.0,  .0,  1., 1, contrast, hue_preserve);
   const text_lum = Color_calculate_luminance_from_hsv(hue, text_cal_sat, 1., 1, contrast_cal, hue_preserve+.4);
   const handle_lum = Color_calculate_luminance_from_hsv(hue, sat, 1.0, 1, contrast_cal, hue_preserve);

   const a = Lerp( .5, .7, base_contrast_mult);

   const theme =  {

      // Calibrated
      col:           Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, contrast     , hue_preserve   ),
      bar_col:       Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, contrast+.15 , hue_preserve   ),
      handle_col:    Color_hsv_to_rgb_calibrated(hue, sat    , 1.0, 1, contrast_cal , hue_preserve   ),
      // handle_col:    Color_hsv_to_rgb_calibrated(hue, text_cal_sat, 1.0, 1, contrast_cal , hue_preserve),
      // name_text_col: Color_hsv_to_rgb_calibrated(hue, text_cal_sat, 1.0, 1, contrast_cal , hue_preserve+.4),
      name_text_col: Color_hsv_to_rgb_calibrated(hue, text_cal_sat, 1.0, 1, contrast_cal , a),
      // name_text_col: Color_hsv_to_rgb_calibrated(hue, sat, 1.0, 1, contrast_cal , hue_preserve),
      value_text_col:Color_hsv_to_rgb_calibrated(.0 , 0      , 1.0, 1, contrast_cal , hue_preserve+.3),
      
      test_slider_lum:slider_lum,
      test_text_lum:text_lum,
      test_handle_lum:handle_lum,
      test_contrast_cal:contrast_cal,
   };

   theme.test_text_lum = Color_calculate_luminance_from_rgb(theme.name_text_col);
   theme.test_handle_lum = Color_calculate_luminance_from_rgb(theme.handle_col);
   return theme;
}
/** */
export function Color_theme_switch_auto(hue=.50, sat=0, base_contrast=.20, base_contrast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   const hue_preserve = base_contrast_mult;

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
/** */
export function Color_theme_label_auto(hue=.50, sat=0, base_contrast=.20, base_contrast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   // Use default 'hue_preserve' value([.5 to .7]) if 'base_contrast_mult = 0'
   const hue_preserve = (base_contrast_mult <= 0) ? Lerp( .5, .7, base_contrast_mult) : base_contrast_mult;
   // const text_cal_sat = Max(sat-.3, 0);
   const text_cal_sat = sat;

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   const calibrate = 1 - (contrast * contrast * contrast * contrast * contrast);
   const contrast_cal = (contrast+.5)*calibrate;


   const theme =  {
      // Calibrated colors
      col:           Color_hsv_to_rgb_calibrated(.0 , 0      , 0.9, 1, contrast     , hue_preserve   ),
      text_col:      Color_hsv_to_rgb_calibrated(hue, text_cal_sat , 1.0, 1, contrast_cal, hue_preserve),
   };

   return theme;
}
/** */
export function Color_theme_label_auto2(hue=.50, sat=0, base_contrast=.20, base_contrast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   // Use default 'hue_preserve' value([.5 to .7]) if 'base_contrast_mult = 0'
   const hue_preserve = (base_contrast_mult <= 0) ? Lerp( .5, .7, base_contrast_mult) : base_contrast_mult;
   // const text_cal_sat = Max(sat-.3, 0);

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   // const calibrate = 1 - (contrast * contrast * contrast * contrast * contrast);
   // const contrast_cal = (contrast+.5)*calibrate;
   // const contrast_cal = Min((contrast+.5)*calibrate, 1.8);
   const contrast_cal = 1;


   const theme =  {
      // Calibrated colors
      col:      Color_hsv_to_rgb_calibrated(hue, sat , 1.0, 1, contrast, hue_preserve),
      text_col: Color_hsv_to_rgb_calibrated(.0 , 0, 1, 1, contrast_cal, hue_preserve),
   };

   return theme;
}
/** */
export function Color_theme_dropdown_auto(hue=.50, sat=0, base_contrast=.20, base_contrast_mult=.0) {

   const contrast = Min(base_contrast, .7); // Max contrast for slider and bar. Avoid too less contrast to handle and texts
   // Use default 'hue_preserve' value([.5 to .7]) if 'base_contrast_mult = 0'
   const hue_preserve = (base_contrast_mult <= 0) ? Lerp( .5, .7, base_contrast_mult) : base_contrast_mult;
   const text_cal_sat = sat;

   // Some calibartion for handle and texts. Gives more contrast on darker contrast values
   const calibrate = 1 - (contrast * contrast * contrast * contrast * contrast);
   const contrast_cal = (contrast+.5)*calibrate;

   const theme =  {
      // Calibrated colors
      col:           Color_hsv_to_rgb_calibrated(.0 , 0, 1, 1, base_contrast, base_contrast_mult),
      menu_col:      Color_hsv_to_rgb_calibrated(.0 , 0, 1., 1, base_contrast-.1, base_contrast_mult),
      btn_col:       Color_hsv_to_rgb_calibrated(.0 , 0, 1, 1, base_contrast-.1, base_contrast_mult), 
      text_col:      Color_hsv_to_rgb_calibrated(hue, text_cal_sat , 1, 1, contrast_cal, hue_preserve),
      // text_col:      Color_hsv_to_rgb_calibrated(hue, text_cal_sat , 1, 1, .9, hue_preserve),
   };

   return theme;
}