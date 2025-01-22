import React from 'react';
import Slider from 'react-slick';
import { Card } from '@mui/material';

const BannerCarousel = () => {
    const settings = {
        infinite: true, // Infinite scroll
        speed: 500, // Animation speed
        slidesToShow: 1, // Show 2 items at a time
        slidesToScroll: 1, // Scroll 1 item at a time
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, // Set autoplay interval to 2 seconds
        arrows: false, // Disable next/prev arrows
        responsive: [
            {
                breakpoint: 1024, // On desktop and tablets
                settings: {
                    slidesToShow: 1, // Show 2 items
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640, // On mobile
                settings: {
                    slidesToShow: 1, // Show 1 item
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const images = [
        {
            imageUrl: "./banner1.png",
            title: "NFT Title 1", // Optional
        },
        {
            imageUrl: "./banner2.png",
            title: "NFT Title 2", // Optional
        },
        {
            imageUrl: "./banner3.png",
            title: "NFT Title 3", // Optional
        },
        {
            imageUrl: "./banner4.png",
            title: "NFT Title 4", // Optional
        },
    ];

    return (
        <div className="bg-app-bg-secondary p-4 flex flex-col gap-5">
            <Slider {...settings} className="w-full mt-1 px-1">
                {images.map((item, index) => (
                    <div className="px-1" key={index}>
                        <Card sx={{ maxWidth: 400 }}>
                            {/* Dynamic image rendering */}
                            <img
                                src={item.imageUrl}
                                alt={item.title || `NFT-${index}`}
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Card>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default BannerCarousel;
