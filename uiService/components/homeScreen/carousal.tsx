'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import '@/styles/carousel.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Carousel = () => {
  const router = useRouter();
  return (
    <div className="carousel-container py-3">
      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, EffectFade]}
      >
        <SwiperSlide>
          <div className="carousel-slide carousel-slide1">
            <div className='left_carousel1 d-sm-block p-sm-3 w-100'>
              <div className="d-flex align-items-center gap-1 mb-4 d-none d-md-flex">
                <Image src="/booking_logo.png" alt="web_logo" height={45} width={45}/>
                <p
                  className="m-0 fs-4 "
                  style={{ lineHeight: "1", position: "relative", top: "-3px", color: "#FFFFFF" }}
                >
                  Bookzy
                </p>
              </div>
              <div className='display-5'>
                <p className='left_carousel1_text'>GET READY FOR MOVIE DATE WITH <span style={{ color: "#d78519" }}>YOUR LOVED ONCE</span></p>
              </div>
              <div>
                <button className='left_carousel1_btn' onClick={() => router.push("/explore/cinema")}>Book Tickets</button>
              </div>
            </div>
            <div className='right_carousel1 d-none d-md-block'>
              <Image src="/ticket.png" alt="ticket_image" height={350} width={300}/>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carousel-slide carousel-slide2">
          <div className='right_carousel2 d-none d-md-block'>
              <div className="d-flex justify-content-center align-items-center gap-1 my-2 d-none d-md-flex">
                <Image src="/booking_logo.png" alt="web_logo" height={45} width={45}/>
                <p className="m-0 fs-4" style={{ lineHeight: "1", position: "relative", top: "-3px", color: "#FFFFFF" }}>Bookzy</p>
              </div>
              <div className='carousel_slide2_text py-3 display-5'>
                <div>One man. One mission.</div>
                <div>One endangered truth!</div>
              </div>
              <div className='d-flex justify-content-center my-4'>
                <button className='carousel_slide2_btn'>Watch</button>
              </div>
            </div>
            <div className='left_carousel2 d-sm-block'>
              <Image src='https://media.licdn.com/dms/image/v2/D4D12AQFMmQ-T8elR0w/article-cover_image-shrink_600_2000/B4DZhatozeHwAU-/0/1753868570337?e=2147483647&v=beta&t=wgqYcab0xRTP2rZI4wtlixAak0qWbOjLVC-B7zmkaq4' priority alt='slide_image' fill
              sizes="(max-width: 768px) 100vw, 50vw"  />
            </div>
           
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="carousel-slide carousel-slide3">
            <div className='center_slide3 display-3'>Every great story deserves a great screen</div>
          </div>
        </SwiperSlide>
      </Swiper>

    </div>
  );
};

export default Carousel;
