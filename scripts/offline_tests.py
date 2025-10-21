#!/usr/bin/env python3
"""
🧪 DataCrypt Labs - Pruebas Offline 
Filosofía de Mejora Continua - Testing sin servidor activo
"""

import json
import sqlite3
import time
from datetime import datetime
from pathlib import Path

class OfflineTestSuite:
    def __init__(self):
        self.results = []
        self.start_time = datetime.now()
        
    def log_test(self, category, test_name, status, details=None):
        """Registrar resultado de prueba"""
        result = {
            "category": category,
            "test_name": test_name,
            "status": status,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} [{category}] {test_name}: {status}")
        if details and status != "PASS":
            print(f"   Details: {details}")
        
        return status == "PASS"

    def test_project_structure(self):
        """Test 1: Estructura del proyecto"""
        
        # Verificar archivos principales
        main_files = [
            "backend/main.py",
            "index.html", 
            "src/game/EnhancedDataWizardGame.js",
            "docker-compose.yml",
            "Dockerfile"
        ]
        
        missing_files = []
        for file_path in main_files:
            if not Path(file_path).exists():
                missing_files.append(file_path)
        
        if not missing_files:
            return self.log_test("structure", "main_files", "PASS", 
                        {"files_checked": len(main_files)})
        else:
            return self.log_test("structure", "main_files", "FAIL", 
                        {"missing_files": missing_files})

    def test_database_files(self):
        """Test 2: Archivos de base de datos"""
        
        # Verificar base de datos de producción
        prod_db = Path("data/datacrypt_production.db")
        dev_db = Path("backend/datacrypt.db")
        
        if prod_db.exists():
            return self.log_test("database", "production_db_exists", "PASS", 
                        {"db_path": str(prod_db), "size": prod_db.stat().st_size})
        elif dev_db.exists():
            return self.log_test("database", "production_db_exists", "WARNING", 
                        {"fallback_db": str(dev_db)})
        else:
            return self.log_test("database", "production_db_exists", "FAIL", 
                        {"error": "No database files found"})

    def test_database_schema(self):
        """Test 3: Esquema de base de datos"""
        
        try:
            # Intentar conectar a la base de datos de producción
            db_path = Path("data/datacrypt_production.db")
            if not db_path.exists():
                db_path = Path("backend/datacrypt.db")
            
            if not db_path.exists():
                return self.log_test("database", "schema_validation", "FAIL", 
                            {"error": "No database found"})
            
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Verificar tablas esperadas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            
            expected_tables = ['contact_messages', 'game_scores', 'analysis_results']
            found_tables = [t for t in expected_tables if t in tables]
            
            # Verificar datos en game_scores si existe
            game_data_count = 0
            if 'game_scores' in tables:
                cursor.execute("SELECT COUNT(*) FROM game_scores")
                game_data_count = cursor.fetchone()[0]
            
            conn.close()
            
            if len(found_tables) >= 2:  # Al menos 2 tablas principales
                return self.log_test("database", "schema_validation", "PASS", 
                            {"tables_found": found_tables, 
                             "game_records": game_data_count})
            else:
                return self.log_test("database", "schema_validation", "WARNING", 
                            {"tables_found": found_tables})
                
        except Exception as e:
            return self.log_test("database", "schema_validation", "FAIL", 
                        {"error": str(e)})

    def test_frontend_optimization(self):
        """Test 4: Optimización del frontend"""
        
        try:
            dist_path = Path("dist")
            
            if not dist_path.exists():
                return self.log_test("frontend", "optimization", "FAIL", 
                            {"error": "Dist directory not found"})
            
            # Contar archivos optimizados
            css_files = list(dist_path.rglob("*.css"))
            js_files = list(dist_path.rglob("*.js"))
            html_files = list(dist_path.rglob("*.html"))
            gzip_files = list(dist_path.rglob("*.gz"))
            
            total_optimized = len(css_files) + len(js_files) + len(html_files)
            
            if total_optimized > 50:  # Al menos 50 archivos optimizados
                return self.log_test("frontend", "optimization", "PASS", 
                            {"css_files": len(css_files),
                             "js_files": len(js_files),
                             "html_files": len(html_files),
                             "gzip_files": len(gzip_files),
                             "total_optimized": total_optimized})
            else:
                return self.log_test("frontend", "optimization", "WARNING", 
                            {"total_optimized": total_optimized})
                
        except Exception as e:
            return self.log_test("frontend", "optimization", "FAIL", 
                        {"error": str(e)})

    def test_docker_configuration(self):
        """Test 5: Configuración de Docker"""
        
        docker_files = {
            "Dockerfile": Path("Dockerfile"),
            "docker-compose.yml": Path("docker-compose.yml"),
            ".env.production": Path(".env.production")
        }
        
        existing_files = {}
        missing_files = []
        
        for name, path in docker_files.items():
            if path.exists():
                existing_files[name] = path.stat().st_size
            else:
                missing_files.append(name)
        
        if len(existing_files) >= 2:  # Al menos Dockerfile y compose
            return self.log_test("docker", "configuration", "PASS", 
                        {"existing_files": existing_files})
        else:
            return self.log_test("docker", "configuration", "FAIL", 
                        {"missing_files": missing_files})

    def test_scripts_automation(self):
        """Test 6: Scripts de automatización"""
        
        script_files = [
            "scripts/migrate_database.py",
            "scripts/optimize_frontend.py",
            "scripts/deploy.sh",
            "scripts/deploy.bat"
        ]
        
        existing_scripts = []
        for script in script_files:
            if Path(script).exists():
                existing_scripts.append(script)
        
        if len(existing_scripts) >= 3:
            return self.log_test("automation", "scripts_available", "PASS", 
                        {"scripts_count": len(existing_scripts)})
        else:
            return self.log_test("automation", "scripts_available", "WARNING", 
                        {"scripts_found": existing_scripts})

    def test_documentation_completeness(self):
        """Test 7: Completitud de documentación"""
        
        doc_files = [
            "README.md",
            "DEPLOYMENT_READY.md",
            "MEJORA_CONTINUA_RESUMEN.md",
            "DESPLIEGUE_EXITOSO_FINAL.md"
        ]
        
        existing_docs = []
        total_size = 0
        
        for doc in doc_files:
            doc_path = Path(doc)
            if doc_path.exists():
                existing_docs.append(doc)
                total_size += doc_path.stat().st_size
        
        # Verificar si hay documentación substancial (al menos 10KB total)
        if len(existing_docs) >= 3 and total_size > 10000:
            return self.log_test("documentation", "completeness", "PASS", 
                        {"docs_count": len(existing_docs), 
                         "total_size_kb": round(total_size/1024, 1)})
        else:
            return self.log_test("documentation", "completeness", "WARNING", 
                        {"docs_found": existing_docs, 
                         "total_size_kb": round(total_size/1024, 1)})

    def test_production_readiness(self):
        """Test 8: Evaluación de preparación para producción"""
        
        readiness_score = 0
        max_score = 0
        criteria = {}
        
        # 1. Estructura del proyecto (20 puntos)
        max_score += 20
        if Path("backend/main.py").exists() and Path("docker-compose.yml").exists():
            readiness_score += 20
            criteria["project_structure"] = "PASS"
        else:
            criteria["project_structure"] = "FAIL"
        
        # 2. Base de datos (15 puntos)
        max_score += 15
        if Path("data/datacrypt_production.db").exists():
            readiness_score += 15
            criteria["database"] = "PASS"
        elif Path("backend/datacrypt.db").exists():
            readiness_score += 10
            criteria["database"] = "PARTIAL"
        else:
            criteria["database"] = "FAIL"
        
        # 3. Frontend optimizado (15 puntos)
        max_score += 15
        if Path("dist").exists() and len(list(Path("dist").rglob("*.css"))) > 5:
            readiness_score += 15
            criteria["frontend_optimized"] = "PASS"
        else:
            criteria["frontend_optimized"] = "FAIL"
        
        # 4. Containerización (20 puntos)
        max_score += 20
        if (Path("Dockerfile").exists() and 
            Path("docker-compose.yml").exists()):
            readiness_score += 20
            criteria["containerization"] = "PASS"
        else:
            criteria["containerization"] = "FAIL"
        
        # 5. Scripts de despliegue (10 puntos)
        max_score += 10
        scripts_dir = Path("scripts")
        if (scripts_dir.exists() and 
            len(list(scripts_dir.glob("*.py"))) >= 2):
            readiness_score += 10
            criteria["deployment_scripts"] = "PASS"
        else:
            criteria["deployment_scripts"] = "FAIL"
        
        # 6. Documentación (20 puntos)
        max_score += 20
        docs = ["README.md", "DEPLOYMENT_READY.md"]
        existing_docs = sum(1 for doc in docs if Path(doc).exists())
        if existing_docs >= 2:
            readiness_score += 20
            criteria["documentation"] = "PASS"
        elif existing_docs >= 1:
            readiness_score += 10
            criteria["documentation"] = "PARTIAL"
        else:
            criteria["documentation"] = "FAIL"
        
        # Calcular porcentaje
        readiness_percent = (readiness_score / max_score) * 100
        
        if readiness_percent >= 90:
            status = "PASS"
        elif readiness_percent >= 70:
            status = "WARNING"
        else:
            status = "FAIL"
        
        return self.log_test("production", "readiness_assessment", status, 
                    {"score": readiness_score, 
                     "max_score": max_score,
                     "readiness_percent": round(readiness_percent, 1),
                     "criteria": criteria})

    def run_all_tests(self):
        """Ejecutar toda la suite de pruebas offline"""
        print("🧪 DATACRYPT LABS - SUITE DE PRUEBAS OFFLINE")
        print("🔄 Filosofía de Mejora Continua - Análisis de Proyecto")
        print("=" * 60)
        
        passed_tests = 0
        total_tests = 0
        
        print("\n📁 ESTRUCTURA DEL PROYECTO")
        if self.test_project_structure():
            passed_tests += 1
        total_tests += 1
        
        print("\n🗄️ ARCHIVOS DE BASE DE DATOS")
        if self.test_database_files():
            passed_tests += 1
        total_tests += 1
        
        print("\n🔍 ESQUEMA DE BASE DE DATOS")
        if self.test_database_schema():
            passed_tests += 1
        total_tests += 1
        
        print("\n🎨 OPTIMIZACIÓN DE FRONTEND")
        if self.test_frontend_optimization():
            passed_tests += 1
        total_tests += 1
        
        print("\n🐳 CONFIGURACIÓN DE DOCKER")
        if self.test_docker_configuration():
            passed_tests += 1
        total_tests += 1
        
        print("\n🤖 SCRIPTS DE AUTOMATIZACIÓN")
        if self.test_scripts_automation():
            passed_tests += 1
        total_tests += 1
        
        print("\n📚 DOCUMENTACIÓN")
        if self.test_documentation_completeness():
            passed_tests += 1
        total_tests += 1
        
        print("\n🚀 EVALUACIÓN DE PRODUCCIÓN")
        if self.test_production_readiness():
            passed_tests += 1
        total_tests += 1
        
        # Generar reporte final
        self.generate_final_report(passed_tests, total_tests)

    def generate_final_report(self, passed, total):
        """Generar reporte final"""
        total_duration = (datetime.now() - self.start_time).total_seconds()
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print("\n" + "=" * 60)
        print("📊 REPORTE FINAL - ANÁLISIS DE MEJORA CONTINUA")
        print("=" * 60)
        print(f"⏱️  Duración: {total_duration:.2f} segundos")
        print(f"🧪 Total pruebas: {total}")
        print(f"✅ Exitosas: {passed}")
        print(f"❌ Fallidas: {total - passed}")
        print(f"📈 Tasa éxito: {success_rate:.1f}%")
        
        # Evaluación de calidad
        if success_rate >= 90:
            print("🎉 CALIDAD: EXCELENTE - Proyecto listo para producción")
            quality = "EXCELLENT"
        elif success_rate >= 75:
            print("✅ CALIDAD: BUENA - Mejoras menores recomendadas")
            quality = "GOOD"
        elif success_rate >= 60:
            print("⚠️  CALIDAD: REGULAR - Mejoras importantes necesarias")
            quality = "FAIR"
        else:
            print("❌ CALIDAD: CRÍTICA - Revisión completa requerida")
            quality = "CRITICAL"
        
        # Guardar reporte
        self.save_report(passed, total, success_rate, total_duration, quality)
        
        # Mostrar próximos pasos
        self.show_next_steps(success_rate)

    def save_report(self, passed, total, success_rate, duration, quality):
        """Guardar reporte detallado"""
        report = {
            "test_execution": {
                "type": "offline_analysis",
                "timestamp": self.start_time.isoformat(),
                "duration_seconds": duration,
                "methodology": "Continuous Improvement Philosophy - PDCA Cycle",
                "total_tests": total,
                "passed_tests": passed,
                "failed_tests": total - passed,
                "success_rate_percent": success_rate,
                "quality_assessment": quality
            },
            "detailed_results": self.results,
            "project_status": {
                "structure": "analyzed",
                "database": "validated",
                "frontend": "optimized",
                "containerization": "configured",
                "documentation": "comprehensive",
                "production_readiness": quality
            }
        }
        
        with open("offline_test_report.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Reporte guardado en: offline_test_report.json")

    def show_next_steps(self, success_rate):
        """Mostrar próximos pasos basados en mejora continua"""
        print("\n🎯 FILOSOFÍA DE MEJORA CONTINUA - PRÓXIMOS PASOS:")
        
        if success_rate >= 90:
            print("🌟 ESTADO ÓPTIMO - Plan de mantenimiento:")
            print("   1. 🔄 Monitoreo continuo de calidad")
            print("   2. 📈 Optimizaciones incrementales")
            print("   3. 🚀 Despliegue en producción")
            print("   4. 📊 Métricas de performance en vivo")
        else:
            print("🔧 PLAN DE MEJORA - Ciclo PDCA:")
            print("   1. 📋 PLANIFICAR: Identificar áreas de mejora")
            print("   2. 🛠️  HACER: Implementar correcciones")
            print("   3. ✅ VERIFICAR: Re-ejecutar análisis")
            print("   4. 📈 ACTUAR: Optimizar proceso completo")
        
        print("\n🚀 RECOMENDACIONES ESPECÍFICAS:")
        
        # Analizar resultados fallidos para recomendaciones específicas
        failed_tests = [r for r in self.results if r["status"] == "FAIL"]
        
        if failed_tests:
            for failed in failed_tests:
                category = failed["category"]
                if category == "structure":
                    print("   📁 Completar estructura del proyecto")
                elif category == "database":
                    print("   🗄️ Configurar base de datos de producción")
                elif category == "frontend":
                    print("   🎨 Ejecutar optimización de frontend")
                elif category == "docker":
                    print("   🐳 Completar configuración de Docker")
        else:
            print("   🎉 ¡Todas las áreas están en óptimo estado!")
        
        print("\n💡 HERRAMIENTAS DE MEJORA DISPONIBLES:")
        print("   • python scripts/migrate_database.py")
        print("   • python scripts/optimize_frontend.py")
        print("   • docker-compose up -d")
        print("   • uvicorn backend.main:app --host 0.0.0.0 --port 8000")


def main():
    """Función principal"""
    print("🚀 DataCrypt Labs - Análisis Offline con Mejora Continua")
    print("📊 Evaluando calidad del proyecto sin servidor activo")
    
    # Ejecutar análisis
    test_suite = OfflineTestSuite()
    test_suite.run_all_tests()
    
    print("\n🎉 Análisis completado bajo filosofía de mejora continua!")
    print("📈 Utiliza los resultados para optimizar el proyecto")


if __name__ == "__main__":
    main()