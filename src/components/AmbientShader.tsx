import React, { useEffect, useRef } from 'react';

interface AmbientShaderProps {
  opacity?: number;
  className?: string;
}

export const AmbientShader: React.FC<AmbientShaderProps> = ({
  opacity = 0.45,
  className = 'fixed inset-0 w-full h-full pointer-events-none z-0',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = new ResizeObserver(() => syncSize());
    resizeObserver.observe(canvas);
    syncSize();

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        
        // Warm Ivory, Soft Champagne Beige & Warm Sage palette
        vec3 ivory = vec3(0.980, 0.968, 0.941);     // #FAF7F0
        vec3 softBeige = vec3(0.953, 0.921, 0.867); // #F3EBDD
        vec3 champagne = vec3(0.847, 0.745, 0.533); // #D8BE88
        vec3 warmSage = vec3(0.301, 0.337, 0.321);  // #4D5652
        
        // Ultra-slow, serene organic movement (8-12s scale)
        float n1 = sin(uv.x * 1.8 + u_time * 0.08) * cos(uv.y * 1.4 - u_time * 0.06);
        float n2 = cos(uv.x * 1.1 - u_time * 0.05) * sin(uv.y * 2.1 + u_time * 0.07);
        
        float mixFactor = smoothstep(-0.8, 0.8, n1 + n2);
        vec3 baseColor = mix(ivory, softBeige, mixFactor);
        
        // Very subtle champagne light aura in upper right
        float aura = smoothstep(0.7, 0.0, length(uv - vec2(0.82, 0.25) + vec2(sin(u_time * 0.05) * 0.1, cos(u_time * 0.04) * 0.1)));
        baseColor = mix(baseColor, champagne, aura * 0.08);
        
        // Muted soothing sage ambient accent at bottom left
        float sageAura = smoothstep(0.8, 0.0, length(uv - vec2(0.15, 0.85)));
        baseColor = mix(baseColor, warmSage, sageAura * 0.03);
        
        gl_FragColor = vec4(baseColor, 1.0);
      }
    `;

    function compileShader(type: number, src: string) {
      const shader = (gl as WebGLRenderingContext).createShader(type);
      if (!shader) return null;
      (gl as WebGLRenderingContext).shaderSource(shader, src);
      (gl as WebGLRenderingContext).compileShader(shader);
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    function render(t: number) {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={className} style={{ opacity }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
