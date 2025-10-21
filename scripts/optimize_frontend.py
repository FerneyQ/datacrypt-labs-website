#!/usr/bin/env python3
"""
⚡ DataCrypt Labs - Frontend Optimization Script
Filosofía Mejora Continua - Optimización automática para producción
"""

import os
import re
import gzip
import shutil
from pathlib import Path
# Optional PIL import for image optimization
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("⚠️ PIL no disponible - saltando optimización de imágenes")

class FrontendOptimizer:
    def __init__(self, src_dir=".", build_dir="dist"):
        self.src_dir = Path(src_dir)
        self.build_dir = Path(build_dir)
        self.build_dir.mkdir(exist_ok=True)
        
    def optimize_images(self):
        """Optimizar imágenes para web"""
        print("🖼️ Optimizando imágenes...")
        
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        optimized_count = 0
        
        for root, dirs, files in os.walk(self.src_dir):
            # Skip build directory
            if 'dist' in root or 'node_modules' in root or '.git' in root:
                continue
                
            for file in files:
                if any(file.lower().endswith(ext) for ext in image_extensions):
                    src_path = Path(root) / file
                    rel_path = src_path.relative_to(self.src_dir)
                    dst_path = self.build_dir / rel_path
                    dst_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    try:
                        if PIL_AVAILABLE and file.lower().endswith(('.jpg', '.jpeg', '.png')):
                            with Image.open(src_path) as img:
                                # Convert to RGB if necessary
                                if img.mode in ("RGBA", "P"):
                                    img = img.convert("RGB")
                                
                                # Optimize
                                img.save(dst_path, optimize=True, quality=85)
                                optimized_count += 1
                        else:
                            # Just copy other formats
                            shutil.copy2(src_path, dst_path)
                            
                    except Exception as e:
                        print(f"⚠️ Error optimizing {src_path}: {e}")
                        # Fallback: just copy
                        shutil.copy2(src_path, dst_path)
        
        print(f"✅ {optimized_count} imágenes optimizadas")
    
    def minify_css(self):
        """Minificar archivos CSS"""
        print("🎨 Minificando CSS...")
        
        css_files = list(self.src_dir.rglob("*.css"))
        minified_count = 0
        
        for css_file in css_files:
            if 'dist' in str(css_file) or 'node_modules' in str(css_file):
                continue
                
            try:
                with open(css_file, 'r', encoding='utf-8') as f:
                    css_content = f.read()
                
                # Simple CSS minification (remove comments, extra spaces)
                minified_css = self.simple_css_minify(css_content)
                
                rel_path = css_file.relative_to(self.src_dir)
                dst_path = self.build_dir / rel_path
                dst_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(dst_path, 'w', encoding='utf-8') as f:
                    f.write(minified_css)
                
                # Create gzipped version
                with gzip.open(str(dst_path) + '.gz', 'wt', encoding='utf-8') as f:
                    f.write(minified_css)
                
                minified_count += 1
                
            except Exception as e:
                print(f"⚠️ Error minifying {css_file}: {e}")
        
        print(f"✅ {minified_count} archivos CSS minificados")
    
    def minify_js(self):
        """Minificar archivos JavaScript"""
        print("⚡ Minificando JavaScript...")
        
        js_files = list(self.src_dir.rglob("*.js"))
        minified_count = 0
        
        for js_file in js_files:
            if 'dist' in str(js_file) or 'node_modules' in str(js_file) or 'min.js' in str(js_file):
                continue
                
            try:
                with open(js_file, 'r', encoding='utf-8') as f:
                    js_content = f.read()
                
                # Simple JS minification (remove comments, extra spaces)
                minified_js = self.simple_js_minify(js_content)
                
                rel_path = js_file.relative_to(self.src_dir)
                dst_path = self.build_dir / rel_path
                dst_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(dst_path, 'w', encoding='utf-8') as f:
                    f.write(minified_js)
                
                # Create gzipped version
                with gzip.open(str(dst_path) + '.gz', 'wt', encoding='utf-8') as f:
                    f.write(minified_js)
                
                minified_count += 1
                
            except Exception as e:
                print(f"⚠️ Error minifying {js_file}: {e}")
        
        print(f"✅ {minified_count} archivos JavaScript minificados")
    
    def optimize_html(self):
        """Optimizar archivos HTML"""
        print("📄 Optimizando HTML...")
        
        html_files = list(self.src_dir.rglob("*.html"))
        optimized_count = 0
        
        for html_file in html_files:
            if 'dist' in str(html_file) or 'node_modules' in str(html_file):
                continue
                
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    html_content = f.read()
                
                # Simple HTML minification
                optimized_html = self.simple_html_minify(html_content)
                
                rel_path = html_file.relative_to(self.src_dir)
                dst_path = self.build_dir / rel_path
                dst_path.parent.mkdir(parents=True, exist_ok=True)
                
                with open(dst_path, 'w', encoding='utf-8') as f:
                    f.write(optimized_html)
                
                optimized_count += 1
                
            except Exception as e:
                print(f"⚠️ Error optimizing {html_file}: {e}")
        
        print(f"✅ {optimized_count} archivos HTML optimizados")
    
    def copy_other_files(self):
        """Copiar otros archivos necesarios"""
        print("📁 Copiando archivos adicionales...")
        
        # Files to copy as-is
        copy_extensions = ['.json', '.xml', '.txt', '.md', '.ico', '.svg']
        copy_files = ['robots.txt', 'sitemap.xml', 'manifest.json', 'sw.js']
        
        copied_count = 0
        
        for root, dirs, files in os.walk(self.src_dir):
            if 'dist' in root or 'node_modules' in root or '.git' in root:
                continue
                
            for file in files:
                if (any(file.lower().endswith(ext) for ext in copy_extensions) or 
                    file in copy_files):
                    
                    src_path = Path(root) / file
                    rel_path = src_path.relative_to(self.src_dir)
                    dst_path = self.build_dir / rel_path
                    dst_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    shutil.copy2(src_path, dst_path)
                    copied_count += 1
        
        print(f"✅ {copied_count} archivos adicionales copiados")
    
    def simple_css_minify(self, css):
        """Minificación simple de CSS"""
        # Remove comments
        css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
        # Remove extra whitespace
        css = re.sub(r'\s+', ' ', css)
        # Remove spaces around certain characters
        css = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css)
        return css.strip()
    
    def simple_js_minify(self, js):
        """Minificación simple de JavaScript"""
        # Remove single-line comments (but be careful with URLs)
        js = re.sub(r'(?<!:)//.*$', '', js, flags=re.MULTILINE)
        # Remove multi-line comments
        js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
        # Remove extra whitespace
        js = re.sub(r'\s+', ' ', js)
        return js.strip()
    
    def simple_html_minify(self, html):
        """Minificación simple de HTML"""
        # Remove comments
        html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL)
        # Remove extra whitespace between tags
        html = re.sub(r'>\s+<', '><', html)
        # Remove extra whitespace
        html = re.sub(r'\s+', ' ', html)
        return html.strip()
    
    def generate_cache_manifest(self):
        """Generar manifiesto de cache para PWA"""
        print("📦 Generando manifiesto de cache...")
        
        files_to_cache = []
        
        for root, dirs, files in os.walk(self.build_dir):
            for file in files:
                if not file.endswith('.gz'):
                    file_path = Path(root) / file
                    rel_path = file_path.relative_to(self.build_dir)
                    files_to_cache.append(str(rel_path).replace('\\', '/'))
        
        cache_manifest = {
            "version": "1.0.0",
            "cache_files": sorted(files_to_cache),
            "generated": "2025-10-21T11:00:00Z"
        }
        
        import json
        with open(self.build_dir / 'cache-manifest.json', 'w') as f:
            json.dump(cache_manifest, f, indent=2)
        
        print(f"✅ Manifiesto de cache generado con {len(files_to_cache)} archivos")

def main():
    """Ejecutar optimización completa"""
    print("⚡ Iniciando optimización de frontend de DataCrypt Labs...")
    
    optimizer = FrontendOptimizer()
    
    # 1. Optimize images
    optimizer.optimize_images()
    
    # 2. Minify CSS
    optimizer.minify_css()
    
    # 3. Minify JS
    optimizer.minify_js()
    
    # 4. Optimize HTML
    optimizer.optimize_html()
    
    # 5. Copy other files
    optimizer.copy_other_files()
    
    # 6. Generate cache manifest
    optimizer.generate_cache_manifest()
    
    print("🎉 ¡Optimización de frontend completada!")
    print(f"📁 Archivos optimizados disponibles en: {optimizer.build_dir}")

if __name__ == "__main__":
    main()