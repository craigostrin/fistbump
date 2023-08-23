import Image, { StaticImageData } from 'next/image'
import React, { FunctionComponent } from 'react'

interface IPhoto {
  photo: StaticImageData
  alt: string
  width?: number
  height?: number
}

const Photo: FunctionComponent<IPhoto> = ({
  photo,
  alt,
  width = 90,
  height = 100,
}) => {
  return (
    <Image
      width={width}
      height={height}
      src={photo}
      alt={alt}
      style={{ borderRadius: '80px', border: '0.5px solid blue' }}
    />
  )
}

export default Photo