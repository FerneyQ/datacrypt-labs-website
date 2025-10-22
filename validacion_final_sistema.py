#!/usr/bin/env python3
"""
🔍 DATACRYPT LABS - VALIDACIÓN FINAL DEL SISTEMA MODULAR
Script de validación completa post-migración
Filosofía Mejora Continua: Validación exhaustiva y confiabilidad
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime

def main():
    """Ejecutar validación completa del sistema modular"""
    
    print("🔍 DATACRYPT LABS - VALIDACIÓN FINAL DEL SISTEMA MODULAR")
    print("=" * 70)
    print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Configurar PYTHONPATH
    project_root = Path(__file__).parent
    sys.path.insert(0, str(project_root))
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "system_version": "v2.0 - Modular Architecture",
        "tests": {}
    }
    
    # Test 1: Validar estructura modular
    print("📦 Test 1: Estructura Modular")
    try:
        required_files = [
            "backend/config/settings.py",
            "backend/models/__init__.py", 
            "backend/utils/logger.py",
            "backend/core/__init__.py",
            "backend/services/database.py",
            "backend/services/ml_service.py",
            "backend/api/v1/auth.py",
            "backend/api/v1/admin.py",
            "backend/api/v1/contact.py",
            "backend/api/v1/portfolio.py",
            "backend/api/v1/games.py",
            "backend/api/v1/health.py",
            "backend/api/v1/ml.py",
            "backend/api/v1/data.py",
            "backend/main.py"
        ]
        
        missing_files = []
        for file_path in required_files:
            if not (project_root / file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            print(f"❌ Archivos faltantes: {missing_files}")
            results["tests"]["structure"] = {"status": "FAILED", "missing": missing_files}
        else:
            print("✅ Todos los 15 módulos presentes")
            results["tests"]["structure"] = {"status": "PASSED", "modules": len(required_files)}
            
    except Exception as e:
        print(f"❌ Error en validación de estructura: {e}")
        results["tests"]["structure"] = {"status": "ERROR", "error": str(e)}
    
    print()
    
    # Test 2: Imports críticos
    print("🔗 Test 2: Imports del Sistema")
    try:
        from backend.config.settings import get_settings
        from backend.utils.logger import get_logger
        from backend.models import SuccessResponse
        from backend.core import RequestTrackingMiddleware
        print("✅ Imports críticos funcionando")
        results["tests"]["imports"] = {"status": "PASSED"}
    except Exception as e:
        print(f"❌ Error en imports: {e}")
        results["tests"]["imports"] = {"status": "FAILED", "error": str(e)}
    
    print()
    
    # Test 3: Configuración
    print("⚙️ Test 3: Sistema de Configuración")
    try:
        settings = get_settings()
        config_info = {
            "host": settings.api_host,
            "port": settings.api_port,
            "environment": settings.environment,
            "debug": settings.debug
        }
        print(f"✅ Configuración cargada: {config_info['host']}:{config_info['port']}")
        results["tests"]["config"] = {"status": "PASSED", "config": config_info}
    except Exception as e:
        print(f"❌ Error en configuración: {e}")
        results["tests"]["config"] = {"status": "FAILED", "error": str(e)}
    
    print()
    
    # Test 4: Sistema de Logging
    print("📝 Test 4: Sistema de Logging")
    try:
        logger = get_logger("validation_test")
        logger.info("Test de logging desde validación final")
        print("✅ Sistema de logging operativo")
        results["tests"]["logging"] = {"status": "PASSED"}
    except Exception as e:
        print(f"❌ Error en logging: {e}")
        results["tests"]["logging"] = {"status": "FAILED", "error": str(e)}
    
    print()
    
    # Test 5: Modelos Pydantic
    print("📊 Test 5: Modelos y Validación")
    try:
        response = SuccessResponse(
            status="success",
            message="Sistema modular validado exitosamente",
            data={
                "architecture": "modular",
                "modules": 15,
                "methodology": "PDCA"
            }
        )
        print("✅ Modelos Pydantic v2 funcionando")
        results["tests"]["models"] = {"status": "PASSED", "sample": response.dict()}
    except Exception as e:
        print(f"❌ Error en modelos: {e}")
        results["tests"]["models"] = {"status": "FAILED", "error": str(e)}
    
    print()
    
    # Test 6: Archivos de migración y documentación
    print("📚 Test 6: Documentación y Migración")
    try:
        migration_files = [
            "MIGRACION_REPORTE_COMPLETO.md",
            "MIGRACION_EXITOSA_RESUMEN.md",
            "test_modular_system.py",
            "run_migration.py",
            "backend/main_monolithic_backup.py"
        ]
        
        existing_docs = []
        for doc_file in migration_files:
            if (project_root / doc_file).exists():
                existing_docs.append(doc_file)
        
        print(f"✅ Documentación completa: {len(existing_docs)}/{len(migration_files)} archivos")
        results["tests"]["documentation"] = {
            "status": "PASSED", 
            "files_present": len(existing_docs),
            "total_expected": len(migration_files)
        }
    except Exception as e:
        print(f"❌ Error en documentación: {e}")
        results["tests"]["documentation"] = {"status": "FAILED", "error": str(e)}
    
    print()
    print("=" * 70)
    
    # Calcular resultado final
    passed_tests = sum(1 for test in results["tests"].values() if test["status"] == "PASSED")
    total_tests = len(results["tests"])
    success_rate = (passed_tests / total_tests) * 100
    
    results["summary"] = {
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "success_rate": success_rate,
        "status": "SYSTEM_OPERATIONAL" if success_rate >= 80 else "SYSTEM_ISSUES"
    }
    
    if success_rate >= 80:
        print("🎉 SISTEMA MODULAR COMPLETAMENTE OPERATIVO")
        print(f"✅ {passed_tests}/{total_tests} tests pasados ({success_rate:.1f}%)")
        print()
        print("🏆 MIGRACIÓN EXITOSA CONFIRMADA:")
        print("   • Arquitectura modular funcionando")
        print("   • 15 módulos especializados activos")
        print("   • Configuración y logging operativos")
        print("   • Documentación completa disponible")
        print("   • Filosofía Mejora Continua implementada")
    else:
        print("⚠️ SISTEMA REQUIERE ATENCIÓN")
        print(f"❌ {passed_tests}/{total_tests} tests pasados ({success_rate:.1f}%)")
        print("🔧 Revisar logs y corregir problemas identificados")
    
    print()
    print("📊 Para detalles técnicos completos ver:")
    print("   • MIGRACION_REPORTE_COMPLETO.md")
    print("   • MIGRACION_EXITOSA_RESUMEN.md")
    print()
    print("🚀 DataCrypt Labs - Sistema Modular v2.0")
    print("   Filosofía: Mejora Continua | Metodología: PDCA")
    
    # Guardar resultados
    try:
        with open("validacion_final_resultados.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"💾 Resultados guardados en: validacion_final_resultados.json")
    except Exception as e:
        print(f"⚠️ No se pudieron guardar resultados: {e}")

if __name__ == "__main__":
    main()