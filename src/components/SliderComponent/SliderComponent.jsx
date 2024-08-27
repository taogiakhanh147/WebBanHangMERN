import { Image } from 'antd';
import React from 'react';
import Slider from 'react-slick';
import './SliderComponent.css'; // Nhập file CSS cho kiểu dáng

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2, // Hiển thị 2 hình ảnh mỗi slide
        slidesToScroll: 2, // Cuộn 2 hình ảnh mỗi lần
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <Slider {...settings}>
            {arrImages.map((image, index) => (
                <div key={index} className="slider-item">
                    <Image
                        src={image}
                        alt={`slider-image-${index}`}
                        preview={false}
                        width="100%"
                        height="400px"
                        className="slider-image"
                    />
                </div>
            ))}
        </Slider>
    );
};

export default SliderComponent;
