// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./ImageSwiper.css";

// import required modules
import { EffectFlip, Navigation } from "swiper";
import { Image } from "antd";

export default function ImageSwiper(props) {
  return (
    <>
      <Swiper
        effect={"flip"}
        navigation={true}
        modules={[EffectFlip, Navigation]}
        className="mySwiper"
      >
        {props.photos.map(photo=>(<SwiperSlide key={photo._id}>
          <Image preview={{ getContainer: '#root',zIndex:1000000 }} src={photo.src} />
        </SwiperSlide>))}
      </Swiper>
    </>
  );
}
