import{a as e}from"./rolldown-runtime-Cyuzqnbw.js";import{p as t}from"./icons-vendor-DUIKhuwt.js";import{l as n}from"./motion-vendor-l0ztXjJy.js";var r=e(t(),1),i=n(),a=`
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,o=`
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 proofGlow = vec2(0.72 * (u_resolution.x / u_resolution.y), 0.48);
    float dist = distance(uv, proofGlow);

    vec2 q = vec2(0.0);
    q.x = fbm(uv + 0.035 * u_time);
    q.y = fbm(uv + vec2(1.0, 1.0));

    vec2 r = vec2(0.0);
    r.x = fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.075 * u_time);
    r.y = fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.063 * u_time);

    float f = fbm(uv + r);

    vec3 baseColor = vec3(0.935, 0.895, 0.810);
    vec3 mistColor = vec3(0.990, 0.955, 0.875);
    vec3 accentColor = vec3(0.740, 0.665, 0.410);

    vec3 color = mix(baseColor, mistColor, f);
    color = mix(color, accentColor, dot(q, r) * 0.22);

    float fixedGlow = smoothstep(0.42, 0.0, dist);
    color += fixedGlow * 0.014 * vec3(1.0, 0.86, 0.55);

    float vignette = smoothstep(1.15, 0.22, distance(uv, vec2(0.72, 0.48)));
    color = mix(color * 0.93, color * 1.04, vignette);
    color = pow(color, vec3(1.04));

    gl_FragColor = vec4(color, 1.0);
  }
`;function s(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null}var c=()=>{let e=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t=e.current;if(!t)return;let n=t.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:`low-power`});if(!n)return;let r=s(n,n.VERTEX_SHADER,a),i=s(n,n.FRAGMENT_SHADER,o),c=n.createProgram();if(!r||!i||!c)return;if(n.attachShader(c,r),n.attachShader(c,i),n.linkProgram(c),!n.getProgramParameter(c,n.LINK_STATUS)){n.deleteProgram(c),n.deleteShader(r),n.deleteShader(i);return}n.useProgram(c);let l=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),u=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,u),n.bufferData(n.ARRAY_BUFFER,l,n.STATIC_DRAW);let d=n.getAttribLocation(c,`position`);n.enableVertexAttribArray(d),n.vertexAttribPointer(d,2,n.FLOAT,!1,0,0);let f=n.getUniformLocation(c,`u_time`),p=n.getUniformLocation(c,`u_resolution`),m=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,h=window.matchMedia(`(max-width: 760px)`).matches,g=()=>{let e=Math.min(window.devicePixelRatio||1,1.5),r=Math.max(1,Math.floor(window.innerWidth*e)),i=Math.max(1,Math.floor(window.innerHeight*e));(t.width!==r||t.height!==i)&&(t.width=r,t.height=i,t.style.width=`${window.innerWidth}px`,t.style.height=`${window.innerHeight}px`,n.viewport(0,0,r,i))},_=h?0:5200,v=0,y=0,b=!1,x=e=>{g(),y||=e;let r=Math.min(e-y,_);n.uniform1f(f,m||h?0:r*.001),n.uniform2f(p,t.width,t.height),n.drawArrays(n.TRIANGLES,0,6)},S=e=>{x(e);let t=e-y;v=!m&&!h&&t<_&&document.visibilityState===`visible`&&!b?window.requestAnimationFrame(S):0},C=()=>{b||v||(v=window.requestAnimationFrame(S))},w=()=>{if(document.visibilityState===`hidden`){window.cancelAnimationFrame(v),v=0;return}let e=y?performance.now()-y:0;!m&&!h&&e<_?C():window.requestAnimationFrame(x)},T=()=>{window.requestAnimationFrame(x)};return window.addEventListener(`resize`,T,{passive:!0}),document.addEventListener(`visibilitychange`,w),h||m?window.requestAnimationFrame(x):C(),()=>{b=!0,window.removeEventListener(`resize`,T),document.removeEventListener(`visibilitychange`,w),window.cancelAnimationFrame(v),n.deleteBuffer(u),n.deleteProgram(c),n.deleteShader(r),n.deleteShader(i)}},[]),(0,i.jsx)(`canvas`,{ref:e,className:`mist-background`,"aria-hidden":`true`})};export{c as Component,c as default};