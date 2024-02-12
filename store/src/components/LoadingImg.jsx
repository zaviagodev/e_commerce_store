import React from 'react'
import { useState } from "react";
import PropTypes from 'prop-types'
import { Skeleton } from '../components/Skeleton';

const LoadingImg = ({src,alt,id,className, onClick}) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <>
            {loaded ? null : (
                <div className='grid gap-[14px] grid-cols-1 lg:grid-cols-1 place-items-center w-full h-full'>
                    <Skeleton className='h-full w-full aspect-square'/>
                </div>
            )}
            <img
                style={loaded ? {} : { display: 'none' }}
                src={src}
                id={id}
                alt={alt}
                className={className}
                onClick={onClick}
                onLoad={() => setLoaded(true)}
            />
        </>
    )
}
export default LoadingImg
LoadingImg.propTypes = {src: PropTypes.string.isRequired,alt: PropTypes.string.isRequired};
