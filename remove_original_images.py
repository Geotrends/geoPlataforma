#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para eliminar archivos originales (PNG/JPEG) que ya tienen versión WebP
"""

import os
import sys
from pathlib import Path

# Configurar salida UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

def remove_original_images(directory):
    """Elimina archivos PNG/JPEG que tienen versión WebP correspondiente"""
    extensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG']
    removed_count = 0
    skipped_count = 0
    
    print("Buscando archivos originales para eliminar...\n")
    
    for root, dirs, files in os.walk(directory):
        # Ignorar carpetas .git y otras carpetas del sistema
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            file_path = Path(root) / file
            
            # Verificar si es un archivo de imagen original
            if any(file.endswith(ext) for ext in extensions):
                # Crear nombre del archivo WebP correspondiente
                webp_path = file_path.with_suffix('.webp')
                
                # Solo eliminar si existe la versión WebP
                if webp_path.exists():
                    try:
                        file_path.unlink()
                        print(f"[OK] Eliminado: {file_path.relative_to(directory)}")
                        removed_count += 1
                    except Exception as e:
                        print(f"[ERROR] No se pudo eliminar {file_path.name}: {str(e)}")
                else:
                    # Mantener el archivo si no tiene versión WebP
                    print(f"[SKIP] Mantenido (sin WebP): {file_path.relative_to(directory)}")
                    skipped_count += 1
    
    print(f"\n{'='*50}")
    print(f"Resumen:")
    print(f"  - Eliminados: {removed_count} archivos")
    print(f"  - Mantenidos: {skipped_count} archivos (sin versión WebP)")
    print(f"{'='*50}")

def main():
    base_dir = Path(__file__).parent
    img_dir = base_dir / 'img_video'
    
    if not img_dir.exists():
        print(f"Error: No se encuentra el directorio {img_dir}")
        return
    
    print("ADVERTENCIA: Este script eliminará los archivos originales (PNG/JPEG)")
    print("que tienen una versión WebP correspondiente.\n")
    
    response = input("¿Deseas continuar? (s/n): ").strip().lower()
    if response not in ['s', 'si', 'sí', 'y', 'yes']:
        print("Operación cancelada.")
        return
    
    remove_original_images(img_dir)
    print("\n¡Proceso completado!")

if __name__ == '__main__':
    main()
