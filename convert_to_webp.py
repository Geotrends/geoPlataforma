#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para convertir todas las imágenes a formato WebP manteniendo alta calidad
"""

import os
import re
import sys
from pathlib import Path
from PIL import Image

# Configurar salida UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

def convert_image_to_webp(image_path, quality=90):
    """Convierte una imagen a WebP manteniendo alta calidad"""
    try:
        img = Image.open(image_path)
        
        # Si la imagen tiene transparencia (RGBA), mantenerla
        if img.mode in ('RGBA', 'LA'):
            img = img.convert('RGBA')
        elif img.mode == 'P' and 'transparency' in img.info:
            img = img.convert('RGBA')
        else:
            img = img.convert('RGB')
        
        # Crear nombre del archivo WebP
        webp_path = str(image_path).rsplit('.', 1)[0] + '.webp'
        
        # Guardar como WebP con alta calidad
        img.save(webp_path, 'WEBP', quality=quality, method=6)
        
        print(f"[OK] Convertido: {image_path.name} -> {Path(webp_path).name}")
        return webp_path
    except Exception as e:
        print(f"[ERROR] Error al convertir {image_path.name}: {str(e)}")
        return None

def find_images(directory):
    """Encuentra todas las imágenes PNG, JPEG, JPG en el directorio"""
    extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG']
    images = []
    
    for root, dirs, files in os.walk(directory):
        # Ignorar carpetas .git y otras carpetas del sistema
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                images.append(Path(root) / file)
    
    return images

def update_file_references(file_path, conversions):
    """Actualiza las referencias de imágenes en archivos HTML/JS"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Actualizar cada referencia
        for old_path, new_path in conversions.items():
            # Normalizar rutas para comparación (usar siempre /)
            old_path_normalized = old_path.replace('\\', '/')
            new_path_normalized = new_path.replace('\\', '/')
            
            # Obtener solo el nombre del archivo y su extensión
            old_filename = Path(old_path_normalized).name
            new_filename = Path(new_path_normalized).name
            
            # Extraer la extensión antigua y nueva
            old_ext = Path(old_path_normalized).suffix.lower()
            new_ext = '.webp'
            
            # Buscar y reemplazar el nombre del archivo con su extensión
            # Patrón: cualquier ruta que termine con el nombre del archivo y extensión antigua
            # Buscar con diferentes variaciones de rutas relativas
            patterns = [
                # Ruta completa relativa
                (re.escape(old_path_normalized), new_path_normalized),
                # Solo nombre de archivo con extensión
                (re.escape(old_filename), new_filename),
                # Ruta con ../ o ./ al inicio
                (re.escape('../' + old_path_normalized), '../' + new_path_normalized),
                (re.escape('./' + old_path_normalized), './' + new_path_normalized),
            ]
            
            for old_pattern, new_pattern in patterns:
                # Reemplazar en comillas simples o dobles
                content = re.sub(
                    rf'(["\'])({old_pattern})\1',
                    rf'\1{new_pattern}\1',
                    content
                )
                # Reemplazar en url() de CSS
                content = re.sub(
                    rf'url\((["\']?)({old_pattern})\1\)',
                    rf'url(\1{new_pattern}\1)',
                    content
                )
                # Reemplazar en atributos HTML (src, href, etc.)
                content = re.sub(
                    rf'(src|href|data-[^=]*)=(["\'])({old_pattern})\2',
                    rf'\1=\2{new_pattern}\2',
                    content
                )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[OK] Actualizado: {file_path.name}")
            return True
        return False
    except Exception as e:
        print(f"[ERROR] Error al actualizar {file_path.name}: {str(e)}")
        return False

def main():
    base_dir = Path(__file__).parent
    img_dir = base_dir / 'img_video'
    
    if not img_dir.exists():
        print(f"Error: No se encuentra el directorio {img_dir}")
        return
    
    print("Buscando imágenes...")
    images = find_images(img_dir)
    print(f"Encontradas {len(images)} imágenes para convertir\n")
    
    if not images:
        print("No se encontraron imágenes para convertir.")
        return
    
    # Diccionario para mapear conversiones (ruta antigua -> ruta nueva)
    conversions = {}
    converted_count = 0
    
    # Convertir imágenes
    print("Convirtiendo imágenes a WebP...")
    for img_path in images:
        webp_path = convert_image_to_webp(img_path, quality=90)
        if webp_path:
            # Guardar la conversión relativa al directorio base
            old_rel = str(img_path.relative_to(base_dir)).replace('\\', '/')
            new_rel = str(Path(webp_path).relative_to(base_dir)).replace('\\', '/')
            conversions[old_rel] = new_rel
            converted_count += 1
    
    print(f"\n[OK] Convertidas {converted_count} imágenes a WebP\n")
    
    if not conversions:
        print("No se realizaron conversiones.")
        return
    
    # Buscar archivos HTML y JS para actualizar referencias
    print("Actualizando referencias en archivos HTML y JS...")
    html_files = list((base_dir / 'html').rglob('*.html'))
    js_files = list((base_dir / 'js').rglob('*.js'))
    css_files = list((base_dir / 'css').rglob('*.css'))
    
    all_files = html_files + js_files + css_files
    updated_count = 0
    
    for file_path in all_files:
        if update_file_references(file_path, conversions):
            updated_count += 1
    
    print(f"\n[OK] Actualizados {updated_count} archivos")
    print("\n¡Conversión completada!")
    print(f"\nNota: Los archivos originales (PNG/JPEG) se mantienen.")
    print("Puedes eliminarlos manualmente después de verificar que todo funciona correctamente.")

if __name__ == '__main__':
    main()
