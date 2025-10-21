#!/usr/bin/env python3
"""
🧪 DataCrypt Labs - Comprehensive Testing Suite
Filosofía de Mejora Continua aplicada al Testing - Ciclo PDCA

PLANIFICAR: Diseño de estrategia completa de testing
HACER: Ejecución de pruebas automatizadas
VERIFICAR: Análisis de resultados y métricas
ACTUAR: Plan de mejoras basado en resultados
"""

import asyncio
import aiohttp
import json
import time
import sqlite3
import requests
from datetime import datetime
from pathlib import Path
import subprocess
import sys
import os

class DataCryptTestSuite:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = {
            "backend_apis": {},
            "frontend_tests": {},
            "database_tests": {},
            "performance_tests": {},
            "security_tests": {},
            "integration_tests": {}
        }
        self.start_time = datetime.now()
        
    def log_test(self, category, test_name, status, details=None, duration=None):
        """Registrar resultado de prueba"""
        if category not in self.results:
            self.results[category] = {}
        
        self.results[category][test_name] = {
            "status": status,
            "details": details or {},
            "duration": duration,
            "timestamp": datetime.now().isoformat()
        }
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} [{category}] {test_name}: {status}")
        if details and status != "PASS":
            print(f"   Details: {details}")

    async def test_backend_health(self):
        """Test 1: Health Check del Backend"""
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/health") as response:
                    data = await response.json()
                    duration = time.time() - start_time
                    
                    if response.status == 200 and data.get("status") == "healthy":
                        self.log_test("backend_apis", "health_check", "PASS", 
                                    {"response_time": f"{duration:.3f}s", "data": data}, duration)
                    else:
                        self.log_test("backend_apis", "health_check", "FAIL", 
                                    {"status_code": response.status, "data": data}, duration)
                        
        except Exception as e:
            self.log_test("backend_apis", "health_check", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    async def test_all_endpoints(self):
        """Test 2: Todos los endpoints del API"""
        endpoints = [
            "/",
            "/docs",
            "/api/portfolio/stats",
            "/api/game/stats", 
            "/api/game/leaderboard",
            "/api/analytics/sample",
            "/api/crypto/btc"
        ]
        
        async with aiohttp.ClientSession() as session:
            for endpoint in endpoints:
                start_time = time.time()
                try:
                    async with session.get(f"{self.base_url}{endpoint}") as response:
                        duration = time.time() - start_time
                        
                        if response.status == 200:
                            data = await response.text()
                            self.log_test("backend_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                        "PASS", {"response_time": f"{duration:.3f}s"}, duration)
                        else:
                            self.log_test("backend_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                        "FAIL", {"status_code": response.status}, duration)
                            
                except Exception as e:
                    self.log_test("backend_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                "FAIL", {"error": str(e)}, time.time() - start_time)

    async def test_game_integration(self):
        """Test 3: Integración completa del juego"""
        start_time = time.time()
        
        try:
            # Test 1: Enviar score
            test_score = {
                "player_name": "TestPlayer_CI",
                "score": 1500,
                "level_reached": 7,
                "time_played": 300,
                "data_points": 15
            }
            
            async with aiohttp.ClientSession() as session:
                # Enviar score
                async with session.post(f"{self.base_url}/api/game/score", 
                                      json=test_score) as response:
                    if response.status == 200:
                        score_result = await response.json()
                        
                        # Verificar leaderboard
                        async with session.get(f"{self.base_url}/api/game/leaderboard") as lb_response:
                            if lb_response.status == 200:
                                leaderboard = await lb_response.json()
                                
                                # Verificar que el score aparece en el leaderboard
                                found_player = any(player["player_name"] == "TestPlayer_CI" 
                                                 for player in leaderboard.get("leaderboard", []))
                                
                                if found_player:
                                    self.log_test("integration_tests", "game_score_integration", 
                                                "PASS", {"score_id": score_result.get("id")}, 
                                                time.time() - start_time)
                                else:
                                    self.log_test("integration_tests", "game_score_integration", 
                                                "FAIL", {"error": "Score not found in leaderboard"}, 
                                                time.time() - start_time)
                            else:
                                self.log_test("integration_tests", "game_score_integration", 
                                            "FAIL", {"error": "Leaderboard endpoint failed"}, 
                                            time.time() - start_time)
                    else:
                        self.log_test("integration_tests", "game_score_integration", 
                                    "FAIL", {"error": f"Score submission failed: {response.status}"}, 
                                    time.time() - start_time)
                        
        except Exception as e:
            self.log_test("integration_tests", "game_score_integration", 
                        "FAIL", {"error": str(e)}, time.time() - start_time)

    def test_database_integrity(self):
        """Test 4: Integridad de la base de datos"""
        start_time = time.time()
        
        try:
            db_path = Path("data/datacrypt_production.db")
            if not db_path.exists():
                self.log_test("database_tests", "database_exists", "FAIL", 
                            {"error": "Production database not found"}, time.time() - start_time)
                return
            
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Test 1: Verificar tablas existentes
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            
            expected_tables = ['contact_messages', 'analysis_results', 'code_executions', 
                             'game_scores', 'app_metrics']
            
            missing_tables = [table for table in expected_tables if table not in tables]
            
            if not missing_tables:
                self.log_test("database_tests", "table_structure", "PASS", 
                            {"tables_found": len(tables)}, time.time() - start_time)
            else:
                self.log_test("database_tests", "table_structure", "FAIL", 
                            {"missing_tables": missing_tables}, time.time() - start_time)
            
            # Test 2: Verificar datos en game_scores
            cursor.execute("SELECT COUNT(*) FROM game_scores")
            score_count = cursor.fetchone()[0]
            
            if score_count > 0:
                self.log_test("database_tests", "game_data_integrity", "PASS", 
                            {"score_records": score_count}, time.time() - start_time)
            else:
                self.log_test("database_tests", "game_data_integrity", "WARNING", 
                            {"score_records": score_count}, time.time() - start_time)
            
            conn.close()
            
        except Exception as e:
            self.log_test("database_tests", "database_integrity", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    async def test_performance_benchmarks(self):
        """Test 5: Performance y benchmarks"""
        
        # Test de carga con múltiples requests
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                # 10 requests concurrentes al health check
                tasks = []
                for _ in range(10):
                    tasks.append(session.get(f"{self.base_url}/health"))
                
                responses = await asyncio.gather(*tasks, return_exceptions=True)
                
                successful_requests = sum(1 for r in responses 
                                        if not isinstance(r, Exception) and r.status == 200)
                
                total_duration = time.time() - start_time
                avg_response_time = total_duration / len(responses)
                
                if successful_requests >= 8:  # 80% success rate
                    self.log_test("performance_tests", "concurrent_load_test", "PASS", 
                                {"successful_requests": successful_requests, 
                                 "total_requests": len(responses),
                                 "avg_response_time": f"{avg_response_time:.3f}s"}, total_duration)
                else:
                    self.log_test("performance_tests", "concurrent_load_test", "FAIL", 
                                {"successful_requests": successful_requests, 
                                 "total_requests": len(responses)}, total_duration)
                
                # Cerrar responses
                for response in responses:
                    if not isinstance(response, Exception):
                        response.close()
                        
        except Exception as e:
            self.log_test("performance_tests", "concurrent_load_test", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    async def test_security_basic(self):
        """Test 6: Pruebas básicas de seguridad"""
        
        # Test 1: CORS headers
        start_time = time.time()
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.options(f"{self.base_url}/api/game/stats") as response:
                    headers = response.headers
                    
                    cors_headers = {
                        "Access-Control-Allow-Origin": headers.get("Access-Control-Allow-Origin"),
                        "Access-Control-Allow-Methods": headers.get("Access-Control-Allow-Methods")
                    }
                    
                    if cors_headers["Access-Control-Allow-Origin"]:
                        self.log_test("security_tests", "cors_configuration", "PASS", 
                                    {"cors_headers": cors_headers}, time.time() - start_time)
                    else:
                        self.log_test("security_tests", "cors_configuration", "WARNING", 
                                    {"cors_headers": cors_headers}, time.time() - start_time)
                        
        except Exception as e:
            self.log_test("security_tests", "cors_configuration", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)
        
        # Test 2: Invalid input handling
        start_time = time.time()
        
        try:
            invalid_score = {
                "player_name": "A" * 1000,  # Nombre muy largo
                "score": -1000,  # Score negativo
                "level_reached": "invalid",  # Tipo incorrecto
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/api/game/score", 
                                      json=invalid_score) as response:
                    
                    if response.status in [400, 422]:  # Bad Request o Validation Error
                        self.log_test("security_tests", "input_validation", "PASS", 
                                    {"status_code": response.status}, time.time() - start_time)
                    else:
                        self.log_test("security_tests", "input_validation", "FAIL", 
                                    {"status_code": response.status, 
                                     "error": "Invalid input was accepted"}, time.time() - start_time)
                        
        except Exception as e:
            self.log_test("security_tests", "input_validation", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_frontend_files(self):
        """Test 7: Archivos frontend y optimización"""
        start_time = time.time()
        
        try:
            # Verificar que los archivos optimizados existen
            dist_path = Path("dist")
            
            if dist_path.exists():
                # Contar archivos optimizados
                css_files = list(dist_path.rglob("*.css"))
                js_files = list(dist_path.rglob("*.js"))
                html_files = list(dist_path.rglob("*.html"))
                
                # Verificar archivos gzip
                gzip_files = list(dist_path.rglob("*.gz"))
                
                total_optimized = len(css_files) + len(js_files) + len(html_files)
                
                if total_optimized > 0:
                    self.log_test("frontend_tests", "optimized_files", "PASS", 
                                {"css_files": len(css_files), 
                                 "js_files": len(js_files),
                                 "html_files": len(html_files),
                                 "gzip_files": len(gzip_files)}, time.time() - start_time)
                else:
                    self.log_test("frontend_tests", "optimized_files", "FAIL", 
                                {"error": "No optimized files found"}, time.time() - start_time)
            else:
                self.log_test("frontend_tests", "optimized_files", "FAIL", 
                            {"error": "Dist directory not found"}, time.time() - start_time)
                
        except Exception as e:
            self.log_test("frontend_tests", "optimized_files", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    async def run_all_tests(self):
        """Ejecutar toda la suite de pruebas"""
        print("🧪 Iniciando Suite Completa de Pruebas - DataCrypt Labs")
        print("📋 Filosofía de Mejora Continua aplicada al Testing")
        print("=" * 70)
        
        # Backend API Tests
        print("\n🔧 PRUEBAS BACKEND APIs")
        await self.test_backend_health()
        await self.test_all_endpoints()
        
        # Integration Tests
        print("\n🔗 PRUEBAS DE INTEGRACIÓN")
        await self.test_game_integration()
        
        # Database Tests
        print("\n🗄️ PRUEBAS BASE DE DATOS")
        self.test_database_integrity()
        
        # Performance Tests
        print("\n⚡ PRUEBAS DE PERFORMANCE")
        await self.test_performance_benchmarks()
        
        # Security Tests
        print("\n🔒 PRUEBAS DE SEGURIDAD")
        await self.test_security_basic()
        
        # Frontend Tests
        print("\n🎨 PRUEBAS FRONTEND")
        self.test_frontend_files()
        
        # Generar reporte final
        self.generate_final_report()

    def generate_final_report(self):
        """Generar reporte final de pruebas"""
        total_duration = (datetime.now() - self.start_time).total_seconds()
        
        # Calcular estadísticas
        total_tests = 0
        passed_tests = 0
        failed_tests = 0
        warning_tests = 0
        
        for category, tests in self.results.items():
            for test_name, result in tests.items():
                total_tests += 1
                if result["status"] == "PASS":
                    passed_tests += 1
                elif result["status"] == "FAIL":
                    failed_tests += 1
                else:
                    warning_tests += 1
        
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print("\n" + "=" * 70)
        print("📊 REPORTE FINAL DE PRUEBAS - MEJORA CONTINUA")
        print("=" * 70)
        print(f"⏱️  Duración total: {total_duration:.2f} segundos")
        print(f"🧪 Total de pruebas: {total_tests}")
        print(f"✅ Pruebas exitosas: {passed_tests}")
        print(f"❌ Pruebas fallidas: {failed_tests}")
        print(f"⚠️  Advertencias: {warning_tests}")
        print(f"📈 Tasa de éxito: {success_rate:.1f}%")
        
        # Status general
        if success_rate >= 90:
            print("🎉 ESTADO: EXCELENTE - Sistema listo para producción")
        elif success_rate >= 75:
            print("✅ ESTADO: BUENO - Mejoras menores recomendadas")
        elif success_rate >= 50:
            print("⚠️  ESTADO: REGULAR - Mejoras importantes necesarias")
        else:
            print("❌ ESTADO: CRÍTICO - Revisión completa requerida")
        
        # Guardar reporte detallado
        self.save_detailed_report(total_tests, passed_tests, failed_tests, 
                                warning_tests, success_rate, total_duration)

    def save_detailed_report(self, total, passed, failed, warnings, success_rate, duration):
        """Guardar reporte detallado en archivo"""
        report_data = {
            "test_execution": {
                "timestamp": self.start_time.isoformat(),
                "duration_seconds": duration,
                "total_tests": total,
                "passed_tests": passed,
                "failed_tests": failed,
                "warning_tests": warnings,
                "success_rate_percent": success_rate
            },
            "detailed_results": self.results,
            "recommendations": self.generate_recommendations()
        }
        
        report_path = Path("test_report.json")
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Reporte detallado guardado en: {report_path}")

    def generate_recommendations(self):
        """Generar recomendaciones basadas en resultados"""
        recommendations = []
        
        # Analizar resultados por categoría
        for category, tests in self.results.items():
            failed_in_category = [test for test, result in tests.items() 
                                if result["status"] == "FAIL"]
            
            if failed_in_category:
                if category == "backend_apis":
                    recommendations.append(f"🔧 Backend: Revisar endpoints fallidos: {failed_in_category}")
                elif category == "security_tests":
                    recommendations.append(f"🔒 Seguridad: Atender vulnerabilidades: {failed_in_category}")
                elif category == "performance_tests":
                    recommendations.append(f"⚡ Performance: Optimizar rendimiento: {failed_in_category}")
                elif category == "database_tests":
                    recommendations.append(f"🗄️ Base de datos: Revisar integridad: {failed_in_category}")
        
        return recommendations


async def main():
    """Función principal para ejecutar las pruebas"""
    print("🚀 DataCrypt Labs - Testing Suite con Filosofía de Mejora Continua")
    print("🔄 Aplicando ciclo PDCA al proceso de testing")
    
    # Verificar que el servidor esté funcionando
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code != 200:
            print("❌ Servidor no está respondiendo correctamente")
            print("📌 Asegúrate de que el servidor esté ejecutándose en http://localhost:8000")
            return
    except requests.exceptions.RequestException:
        print("❌ No se puede conectar al servidor en http://localhost:8000")
        print("📌 Inicia el servidor antes de ejecutar las pruebas:")
        print("   uvicorn backend.main:app --host 127.0.0.1 --port 8000")
        return
    
    # Ejecutar suite de pruebas
    test_suite = DataCryptTestSuite()
    await test_suite.run_all_tests()
    
    print("\n🎯 PRÓXIMOS PASOS - MEJORA CONTINUA:")
    print("1. 📊 Revisar reporte detallado en test_report.json")
    print("2. 🔧 Implementar correcciones para pruebas fallidas")
    print("3. 📈 Ejecutar pruebas nuevamente para validar mejoras")
    print("4. 🔄 Repetir ciclo de mejora continua")


if __name__ == "__main__":
    asyncio.run(main())