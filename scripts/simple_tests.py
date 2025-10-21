#!/usr/bin/env python3
"""
🧪 DataCrypt Labs - Simple Testing Suite
Filosofía de Mejora Continua aplicada al Testing
"""

import requests
import json
import time
import sqlite3
from datetime import datetime
from pathlib import Path

class SimpleTestSuite:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
        self.start_time = datetime.now()
        
    def log_test(self, category, test_name, status, details=None, duration=None):
        """Registrar resultado de prueba"""
        result = {
            "category": category,
            "test_name": test_name,
            "status": status,
            "details": details or {},
            "duration": duration,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} [{category}] {test_name}: {status}")
        if details and status != "PASS":
            print(f"   Details: {details}")
        
        return status == "PASS"

    def test_server_connectivity(self):
        """Test 1: Conectividad básica del servidor"""
        start_time = time.time()
        
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                return self.log_test("connectivity", "server_basic_access", "PASS", 
                            {"response_time": f"{duration:.3f}s"}, duration)
            else:
                return self.log_test("connectivity", "server_basic_access", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("connectivity", "server_basic_access", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_health_endpoint(self):
        """Test 2: Health check endpoint"""
        start_time = time.time()
        
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    return self.log_test("backend", "health_check", "PASS", 
                                {"response_time": f"{duration:.3f}s"}, duration)
                else:
                    return self.log_test("backend", "health_check", "FAIL", 
                                {"unexpected_status": data.get("status")}, duration)
            else:
                return self.log_test("backend", "health_check", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("backend", "health_check", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_api_documentation(self):
        """Test 3: API Documentation disponible"""
        start_time = time.time()
        
        try:
            response = requests.get(f"{self.base_url}/docs", timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                return self.log_test("documentation", "api_docs_access", "PASS", 
                            {"response_time": f"{duration:.3f}s"}, duration)
            else:
                return self.log_test("documentation", "api_docs_access", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("documentation", "api_docs_access", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_game_endpoints(self):
        """Test 4: Endpoints del juego"""
        endpoints = [
            "/api/game/stats",
            "/api/game/leaderboard"
        ]
        
        all_passed = True
        
        for endpoint in endpoints:
            start_time = time.time()
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                duration = time.time() - start_time
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") == "success":
                        self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                    "PASS", {"response_time": f"{duration:.3f}s"}, duration)
                    else:
                        self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                    "FAIL", {"unexpected_response": data}, duration)
                        all_passed = False
                else:
                    self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                "FAIL", {"status_code": response.status_code}, duration)
                    all_passed = False
                    
            except Exception as e:
                self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                            "FAIL", {"error": str(e)}, time.time() - start_time)
                all_passed = False
        
        return all_passed

    def test_database_connection(self):
        """Test 5: Conexión y estructura de base de datos"""
        start_time = time.time()
        
        try:
            db_path = Path("data/datacrypt_production.db")
            if not db_path.exists():
                return self.log_test("database", "database_exists", "FAIL", 
                            {"error": "Production database not found"}, time.time() - start_time)
            
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Verificar tablas principales
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            
            expected_tables = ['game_scores', 'contact_messages']
            found_tables = [table for table in expected_tables if table in tables]
            
            conn.close()
            
            if len(found_tables) == len(expected_tables):
                return self.log_test("database", "table_structure", "PASS", 
                            {"tables_found": found_tables}, time.time() - start_time)
            else:
                missing = [t for t in expected_tables if t not in found_tables]
                return self.log_test("database", "table_structure", "FAIL", 
                            {"missing_tables": missing}, time.time() - start_time)
            
        except Exception as e:
            return self.log_test("database", "table_structure", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_game_score_submission(self):
        """Test 6: Envío de puntaje del juego"""
        start_time = time.time()
        
        try:
            test_score = {
                "player_name": "TestUser_Suite",
                "score": 1234,
                "level_reached": 5,
                "time_played": 180,
                "data_points": 10
            }
            
            response = requests.post(f"{self.base_url}/api/game/score", 
                                   json=test_score, timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    return self.log_test("integration", "score_submission", "PASS", 
                                {"score_id": data.get("id")}, duration)
                else:
                    return self.log_test("integration", "score_submission", "FAIL", 
                                {"unexpected_response": data}, duration)
            else:
                return self.log_test("integration", "score_submission", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("integration", "score_submission", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_frontend_optimization(self):
        """Test 7: Archivos frontend optimizados"""
        start_time = time.time()
        
        try:
            dist_path = Path("dist")
            
            if not dist_path.exists():
                return self.log_test("frontend", "optimized_files", "FAIL", 
                            {"error": "Dist directory not found"}, time.time() - start_time)
            
            # Contar archivos optimizados
            css_files = list(dist_path.rglob("*.css"))
            js_files = list(dist_path.rglob("*.js"))
            gzip_files = list(dist_path.rglob("*.gz"))
            
            if len(css_files) > 0 and len(js_files) > 0:
                return self.log_test("frontend", "optimized_files", "PASS", 
                            {"css_files": len(css_files), 
                             "js_files": len(js_files),
                             "gzip_files": len(gzip_files)}, time.time() - start_time)
            else:
                return self.log_test("frontend", "optimized_files", "FAIL", 
                            {"css_files": len(css_files), 
                             "js_files": len(js_files)}, time.time() - start_time)
                
        except Exception as e:
            return self.log_test("frontend", "optimized_files", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_security_headers(self):
        """Test 8: Headers de seguridad básicos"""
        start_time = time.time()
        
        try:
            response = requests.get(f"{self.base_url}/api/game/stats", timeout=10)
            duration = time.time() - start_time
            
            headers = response.headers
            cors_origin = headers.get("access-control-allow-origin")
            
            if cors_origin is not None:
                return self.log_test("security", "cors_headers", "PASS", 
                            {"cors_origin": cors_origin}, duration)
            else:
                return self.log_test("security", "cors_headers", "WARNING", 
                            {"cors_origin": "Not found"}, duration)
                
        except Exception as e:
            return self.log_test("security", "cors_headers", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def run_all_tests(self):
        """Ejecutar toda la suite de pruebas"""
        print("🧪 DATACRYPT LABS - SUITE DE PRUEBAS COMPLETA")
        print("🔄 Filosofía de Mejora Continua aplicada al Testing")
        print("=" * 60)
        
        passed_tests = 0
        total_tests = 0
        
        print("\n🔗 PRUEBAS DE CONECTIVIDAD")
        if self.test_server_connectivity():
            passed_tests += 1
        total_tests += 1
        
        print("\n🏥 PRUEBAS DE HEALTH CHECK")
        if self.test_health_endpoint():
            passed_tests += 1
        total_tests += 1
        
        print("\n📚 PRUEBAS DE DOCUMENTACIÓN")
        if self.test_api_documentation():
            passed_tests += 1
        total_tests += 1
        
        print("\n🎮 PRUEBAS DE APIs DEL JUEGO")
        if self.test_game_endpoints():
            passed_tests += 1
        total_tests += 1
        
        print("\n🗄️ PRUEBAS DE BASE DE DATOS")
        if self.test_database_connection():
            passed_tests += 1
        total_tests += 1
        
        print("\n🔗 PRUEBAS DE INTEGRACIÓN")
        if self.test_game_score_submission():
            passed_tests += 1
        total_tests += 1
        
        print("\n🎨 PRUEBAS DE FRONTEND")
        if self.test_frontend_optimization():
            passed_tests += 1
        total_tests += 1
        
        print("\n🔒 PRUEBAS DE SEGURIDAD")
        if self.test_security_headers():
            passed_tests += 1
        total_tests += 1
        
        # Generar reporte final
        self.generate_final_report(passed_tests, total_tests)

    def generate_final_report(self, passed, total):
        """Generar reporte final"""
        total_duration = (datetime.now() - self.start_time).total_seconds()
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print("\n" + "=" * 60)
        print("📊 REPORTE FINAL - FILOSOFÍA DE MEJORA CONTINUA")
        print("=" * 60)
        print(f"⏱️  Duración total: {total_duration:.2f} segundos")
        print(f"🧪 Total de pruebas: {total}")
        print(f"✅ Pruebas exitosas: {passed}")
        print(f"❌ Pruebas fallidas: {total - passed}")
        print(f"📈 Tasa de éxito: {success_rate:.1f}%")
        
        # Evaluación del estado
        if success_rate >= 90:
            print("🎉 ESTADO: EXCELENTE - Sistema listo para producción")
            status = "PRODUCTION_READY"
        elif success_rate >= 75:
            print("✅ ESTADO: BUENO - Mejoras menores recomendadas")
            status = "GOOD"
        elif success_rate >= 50:
            print("⚠️  ESTADO: REGULAR - Mejoras importantes necesarias")
            status = "NEEDS_IMPROVEMENT"
        else:
            print("❌ ESTADO: CRÍTICO - Revisión completa requerida")
            status = "CRITICAL"
        
        # Guardar reporte
        self.save_report(passed, total, success_rate, total_duration, status)
        
        # Recomendaciones de mejora continua
        self.print_recommendations(success_rate)

    def save_report(self, passed, total, success_rate, duration, status):
        """Guardar reporte en archivo JSON"""
        report = {
            "test_execution": {
                "timestamp": self.start_time.isoformat(),
                "duration_seconds": duration,
                "total_tests": total,
                "passed_tests": passed,
                "failed_tests": total - passed,
                "success_rate_percent": success_rate,
                "overall_status": status
            },
            "detailed_results": self.results,
            "methodology": "Continuous Improvement Philosophy - PDCA Cycle Applied"
        }
        
        with open("test_results.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Reporte detallado guardado en: test_results.json")

    def print_recommendations(self, success_rate):
        """Imprimir recomendaciones basadas en mejora continua"""
        print("\n🎯 RECOMENDACIONES - CICLO DE MEJORA CONTINUA:")
        
        # Analizar resultados fallidos
        failed_tests = [r for r in self.results if r["status"] == "FAIL"]
        
        if not failed_tests:
            print("🌟 ¡Todas las pruebas pasaron exitosamente!")
            print("📈 Continuar con monitoreo regular para mantener la calidad")
        else:
            print("🔧 PLAN DE ACCIÓN (Basado en filosofía PDCA):")
            
            for i, failed in enumerate(failed_tests, 1):
                print(f"   {i}. 📌 {failed['category']}.{failed['test_name']}")
                print(f"      ❌ Error: {failed['details']}")
                print(f"      🔄 Acción: Revisar y corregir este componente")
        
        print("\n🔄 PRÓXIMOS PASOS - MEJORA CONTINUA:")
        print("   1. 📊 PLANIFICAR: Analizar resultados fallidos")
        print("   2. 🔧 HACER: Implementar correcciones")
        print("   3. ✅ VERIFICAR: Re-ejecutar pruebas")
        print("   4. 📈 ACTUAR: Optimizar proceso para el futuro")


def main():
    """Función principal"""
    print("🚀 Iniciando Testing Suite con Filosofía de Mejora Continua")
    
    # Verificar conectividad antes de empezar
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        print("✅ Servidor detectado - Iniciando pruebas...")
    except:
        print("❌ No se puede conectar al servidor en http://localhost:8000")
        print("📌 Asegúrate de que el servidor esté ejecutándose:")
        print("   uvicorn backend.main:app --host 127.0.0.1 --port 8000")
        return
    
    # Ejecutar pruebas
    test_suite = SimpleTestSuite()
    test_suite.run_all_tests()
    
    print("\n🎉 ¡Testing completado bajo filosofía de mejora continua!")


if __name__ == "__main__":
    main()