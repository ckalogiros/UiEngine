"use strict";


export class ImageLoader{

   static Load(img_path, img_name, img_type){
      const image = new Image();
      const src = `${RESOURCES_PATH}/${img_path}/${img_name}.${img_type}`;
      image.src = src;
      return image;
   }

}