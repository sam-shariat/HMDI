import React, { useState, useEffect } from "react";
import useScript from '../utils/useScript';

const InteractiveLogo = ()=> {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 767 ? true : false)
    const handleResize = () => {
        if (window.innerWidth < 767) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }
    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })
    useScript('https://cloudflare-ipfs.com/ipfs/QmTKi9CpFecSfqmGt15bxL1WbFubb7t9DMZDoSHakC6a63');
    return (
    <div id="particle-slider" style={{
        zIndex:99,
        height:isMobile ? '300px' : '90%',
        width:isMobile ? '100%' : '50%',
        margin: '0 0 30px 0',
        padding: 0,
        overflow: 'hidden',
        position:'absolute',
        left:0
    }}>
    <div className="slides">
      {isMobile ? (
      <div id="first-slide" className="slide" data-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHRleHQgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZm9udC1mYW1pbHk6IFVidW50dTsgZm9udC1zaXplOiAyMy45cHg7IGZvbnQtd2VpZ2h0OiA3MDA7IHdoaXRlLXNwYWNlOiBwcmU7IiB0cmFuc2Zvcm09Im1hdHJpeCgyLjM1Njk5OCwgMCwgMCwgMi4zNTc3MTgsIC00NjMuMDc0MzcxLCAtMjI5LjgxMzkxOSkiPjx0c3BhbiB4PSIyMTMuMzExIiB5PSIxNTYuMTQzIj4gWW91ciBIb21lPC90c3Bhbj48dHNwYW4geD0iMjEzLjMxMSIgZHk9IjFlbSI+4oCLPC90c3Bhbj48L3RleHQ+CiAgPHRleHQgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZm9udC1mYW1pbHk6IFVidW50dTsgZm9udC1zaXplOiA1OS4ycHg7IGZvbnQtd2VpZ2h0OiA3MDA7IHdoaXRlLXNwYWNlOiBwcmU7IiB4PSI1MC4wMDkiIHk9IjIwMC4yODUiPiBGb3IgICBIZWxwPC90ZXh0Pgo8L3N2Zz4=" ></div>
      ) : (
      <div id="first-slide" className="slide" data-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgNDAwIDMwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHRleHQgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZm9udC1mYW1pbHk6IFVidW50dTsgZm9udC1zaXplOiAyMy45cHg7IGZvbnQtd2VpZ2h0OiA3MDA7IHdoaXRlLXNwYWNlOiBwcmU7IiB0cmFuc2Zvcm09Im1hdHJpeCgyLjM1Njk5OCwgMCwgMCwgMi4zNTc3MTgsIC00NjMuMDc0MzcxLCAtMjI5LjgxMzkxOSkiPjx0c3BhbiB4PSIyMTMuMzExIiB5PSIxNTYuMTQzIj4gWW91ciBIb21lPC90c3Bhbj48dHNwYW4geD0iMjEzLjMxMSIgZHk9IjFlbSI+4oCLPC90c3Bhbj48L3RleHQ+CiAgPHRleHQgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZm9udC1mYW1pbHk6IFVidW50dTsgZm9udC1zaXplOiA1OS4ycHg7IGZvbnQtd2VpZ2h0OiA3MDA7IHdoaXRlLXNwYWNlOiBwcmU7IiB4PSI1MC4wMDkiIHk9IjIwMC4yODUiPiBGb3IgICBIZWxwPC90ZXh0Pgo8L3N2Zz4=" >
        </div>)}
      </div>
    <canvas className="draw"></canvas>
    </div>)
}

export default InteractiveLogo;