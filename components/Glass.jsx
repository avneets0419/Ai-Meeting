import React from 'react'
import GlassSurface from './ui/GlassSurface'


function Glass() {
  return (
    <div>



<nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
<GlassSurface

  height={60}
    width={450}
  brightness={60}
  opacity={0.9}
  blur={10}
  backgroundOpacity={0.7}
  saturation={1.5}
  displace={-45}

><h3 className='font-readex text-white font-semibold p-3'>Home</h3>
<h3 className='font-readex text-white font-semibold p-3'>Features</h3>
<h3 className='font-readex text-white font-semibold p-3'>Reviews</h3>
<h3 className='font-readex text-white font-semibold p-3'>Contact Us</h3></GlassSurface>
</nav>
</div>

  )
}

export default Glass