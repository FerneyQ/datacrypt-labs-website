#!/usr/bin/env python3
"""
🧪 DATACRYPT LABS - SUITE DE TESTING WEB
Filosofía de Mejora Continua aplicada al Testing en Entorno Web - Ciclo PDCA

PLANIFICAR: Estrategia completa de testing web
HACER: Ejecución de pruebas en entorno real
VERIFICAR: Análisis de resultados y métricas
ACTUAR: Plan de mejoras basado en resultados
"""

import requests
import json
import time
from datetime import datetime
from pathlib import Path
import sys

class WebTestingSuite:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
        self.start_time = datetime.now()
        self.session = requests.Session()
        
        # Configurar session con timeouts apropiados
        self.session.timeout = 30
        self.session.headers.update({
            'User-Agent': 'DataCrypt-Labs-Testing-Suite/1.0'
        })
        
    def log_test(self, category, test_name, status, details=None, duration=None):
        """Registrar resultado de prueba con filosofía de mejora continua"""
        result = {
            "category": category,
            "test_name": test_name,
            "status": status,
            "details": details or {},
            "duration": duration,
            "timestamp": datetime.now().isoformat(),
            "methodology": "PDCA - Continuous Improvement"
        }
        self.results.append(result)
        
        # Emojis para estado visual
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} [{category}] {test_name}: {status}")
        
        if details and status != "PASS":
            for key, value in details.items():
                print(f"   📋 {key}: {value}")
        
        if duration:
            print(f"   ⏱️ Duración: {duration:.3f}s")
        
        return status == "PASS"

    def test_server_connectivity(self):
        """PDCA - PLANIFICAR: Test básico de conectividad"""
        print("\n🔄 FASE PLANIFICAR: Verificando conectividad del servidor...")
        start_time = time.time()
        
        try:
            response = self.session.get(f"{self.base_url}/", timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                return self.log_test("connectivity", "server_basic_access", "PASS", 
                            {"status_code": response.status_code, 
                             "response_time": f"{duration:.3f}s"}, duration)
            else:
                return self.log_test("connectivity", "server_basic_access", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("connectivity", "server_basic_access", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_health_endpoint(self):
        """PDCA - HACER: Verificar health check del sistema"""
        print("\n🔄 FASE HACER: Ejecutando health check...")
        start_time = time.time()
        
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    return self.log_test("health", "endpoint_validation", "PASS", 
                                {"health_status": data.get("status"),
                                 "response_time": f"{duration:.3f}s",
                                 "server_info": data.get("message", "")}, duration)
                else:
                    return self.log_test("health", "endpoint_validation", "FAIL", 
                                {"unexpected_status": data.get("status")}, duration)
            else:
                return self.log_test("health", "endpoint_validation", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("health", "endpoint_validation", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_api_documentation(self):
        """PDCA - HACER: Verificar documentación de APIs"""
        print("\n📚 Verificando documentación de APIs...")
        start_time = time.time()
        
        try:
            response = self.session.get(f"{self.base_url}/docs", timeout=15)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                # Verificar que contiene elementos de Swagger
                content = response.text
                has_swagger = "swagger" in content.lower() or "openapi" in content.lower()
                
                return self.log_test("documentation", "api_docs_accessibility", "PASS", 
                            {"response_time": f"{duration:.3f}s",
                             "content_length": len(content),
                             "swagger_detected": has_swagger}, duration)
            else:
                return self.log_test("documentation", "api_docs_accessibility", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("documentation", "api_docs_accessibility", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_game_apis(self):
        """PDCA - HACER: Testing de APIs del juego Data Wizard"""
        print("\n🎮 Testing APIs del juego Data Wizard...")
        
        # Lista de endpoints del juego a probar
        game_endpoints = [
            ("/api/game/stats", "estadísticas del juego"),
            ("/api/game/leaderboard", "leaderboard de jugadores"),
        ]
        
        all_passed = True
        
        for endpoint, description in game_endpoints:
            start_time = time.time()
            print(f"  🔍 Probando {description}...")
            
            try:
                response = self.session.get(f"{self.base_url}{endpoint}", timeout=10)
                duration = time.time() - start_time
                
                if response.status_code == 200:
                    try:
                        data = response.json()
                        if data.get("status") == "success":
                            self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                        "PASS", {"response_time": f"{duration:.3f}s",
                                               "data_keys": list(data.keys())}, duration)
                        else:
                            self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                        "FAIL", {"unexpected_response": data}, duration)
                            all_passed = False
                    except json.JSONDecodeError:
                        self.log_test("game_apis", f"endpoint_{endpoint.replace('/', '_')}", 
                                    "FAIL", {"error": "Invalid JSON response"}, duration)
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

    def test_game_integration(self):
        """PDCA - HACER: Testing de integración completa del juego"""
        print("\n🔗 Testing integración completa del juego...")
        start_time = time.time()
        
        try:
            # Test 1: Enviar un score de prueba
            test_score = {
                "player_name": "TestPlayer_WebTesting",
                "score": 2500,
                "level_reached": 8,
                "time_played": 320,
                "data_points": 16
            }
            
            print("  📤 Enviando score de prueba...")
            response = self.session.post(f"{self.base_url}/api/game/score", 
                                       json=test_score, timeout=15)
            
            if response.status_code == 200:
                score_result = response.json()
                
                if score_result.get("status") == "success":
                    score_id = score_result.get("id")
                    
                    # Test 2: Verificar que aparece en leaderboard
                    print("  🏆 Verificando leaderboard...")
                    time.sleep(1)  # Pequeña pausa para asegurar persistencia
                    
                    lb_response = self.session.get(f"{self.base_url}/api/game/leaderboard", timeout=10)
                    
                    if lb_response.status_code == 200:
                        leaderboard = lb_response.json()
                        
                        # Buscar nuestro jugador de prueba
                        found_player = False
                        if "leaderboard" in leaderboard:
                            for player in leaderboard["leaderboard"]:
                                if player.get("player_name") == "TestPlayer_WebTesting":
                                    found_player = True
                                    break
                        
                        duration = time.time() - start_time
                        
                        if found_player:
                            return self.log_test("integration", "game_full_cycle", "PASS", 
                                        {"score_id": score_id,
                                         "player_found_in_leaderboard": True,
                                         "total_players": leaderboard.get("total_players", 0)}, duration)
                        else:
                            return self.log_test("integration", "game_full_cycle", "FAIL", 
                                        {"error": "Score not found in leaderboard"}, duration)
                    else:
                        return self.log_test("integration", "game_full_cycle", "FAIL", 
                                    {"error": "Leaderboard endpoint failed"}, time.time() - start_time)
                else:
                    return self.log_test("integration", "game_full_cycle", "FAIL", 
                                {"error": "Score submission failed"}, time.time() - start_time)
            else:
                return self.log_test("integration", "game_full_cycle", "FAIL", 
                            {"status_code": response.status_code}, time.time() - start_time)
                
        except Exception as e:
            return self.log_test("integration", "game_full_cycle", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_portfolio_apis(self):
        """PDCA - HACER: Testing de APIs del portfolio"""
        print("\n📊 Testing APIs del portfolio...")
        start_time = time.time()
        
        try:
            response = self.session.get(f"{self.base_url}/api/portfolio/stats", timeout=10)
            duration = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                return self.log_test("portfolio", "stats_endpoint", "PASS", 
                            {"response_time": f"{duration:.3f}s",
                             "data_structure": list(data.keys()) if isinstance(data, dict) else "Not dict"}, duration)
            else:
                return self.log_test("portfolio", "stats_endpoint", "FAIL", 
                            {"status_code": response.status_code}, duration)
                
        except Exception as e:
            return self.log_test("portfolio", "stats_endpoint", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def test_performance_benchmarks(self):
        """PDCA - VERIFICAR: Testing de performance"""
        print("\n⚡ Testing de performance y carga...")
        
        # Test de múltiples requests concurrentes
        import threading
        import queue
        
        start_time = time.time()
        results_queue = queue.Queue()
        
        def make_request():
            try:
                resp_start = time.time()
                response = self.session.get(f"{self.base_url}/health", timeout=5)
                resp_duration = time.time() - resp_start
                results_queue.put({
                    "success": response.status_code == 200,
                    "duration": resp_duration,
                    "status_code": response.status_code
                })
            except Exception as e:
                results_queue.put({
                    "success": False,
                    "duration": 0,
                    "error": str(e)
                })
        
        # Ejecutar 5 requests concurrentes
        print("  🚀 Ejecutando 5 requests concurrentes...")
        threads = []
        for _ in range(5):
            thread = threading.Thread(target=make_request)
            thread.start()
            threads.append(thread)
        
        # Esperar a que terminen
        for thread in threads:
            thread.join()
        
        # Analizar resultados
        total_duration = time.time() - start_time
        successful_requests = 0
        total_requests = 5
        response_times = []
        
        while not results_queue.empty():
            result = results_queue.get()
            if result["success"]:
                successful_requests += 1
                response_times.append(result["duration"])
        
        success_rate = (successful_requests / total_requests) * 100
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        if success_rate >= 80:  # 80% success rate
            return self.log_test("performance", "concurrent_load_test", "PASS", 
                        {"successful_requests": successful_requests,
                         "total_requests": total_requests,
                         "success_rate": f"{success_rate:.1f}%",
                         "avg_response_time": f"{avg_response_time:.3f}s",
                         "total_duration": f"{total_duration:.3f}s"}, total_duration)
        else:
            return self.log_test("performance", "concurrent_load_test", "FAIL", 
                        {"successful_requests": successful_requests,
                         "total_requests": total_requests,
                         "success_rate": f"{success_rate:.1f}%"}, total_duration)

    def test_security_headers(self):
        """PDCA - VERIFICAR: Testing de headers de seguridad"""
        print("\n🔒 Verificando headers de seguridad...")
        start_time = time.time()
        
        try:
            response = self.session.get(f"{self.base_url}/api/game/stats", timeout=10)
            duration = time.time() - start_time
            
            headers = response.headers
            security_headers = {
                "cors_origin": headers.get("access-control-allow-origin"),
                "cors_methods": headers.get("access-control-allow-methods"),
                "content_type": headers.get("content-type"),
                "server": headers.get("server", "Hidden")
            }
            
            # Verificar CORS
            has_cors = security_headers["cors_origin"] is not None
            
            return self.log_test("security", "headers_validation", "PASS" if has_cors else "WARNING", 
                        {"security_headers": security_headers,
                         "cors_configured": has_cors}, duration)
                
        except Exception as e:
            return self.log_test("security", "headers_validation", "FAIL", 
                        {"error": str(e)}, time.time() - start_time)

    def run_complete_testing_suite(self):
        """PDCA - Ejecutar suite completa de testing web"""
        print("🧪 DATACRYPT LABS - SUITE COMPLETA DE TESTING WEB")
        print("🔄 Filosofía de Mejora Continua - Ciclo PDCA Aplicado")
        print("=" * 70)
        print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Servidor: {self.base_url}")
        print("=" * 70)
        
        passed_tests = 0
        total_tests = 0
        
        # FASE 1: PLANIFICAR - Verificaciones básicas
        print("\n🔄 FASE 1: PLANIFICAR - Verificaciones básicas")
        if self.test_server_connectivity():
            passed_tests += 1
        total_tests += 1
        
        # FASE 2: HACER - Ejecución de pruebas funcionales
        print("\n🔄 FASE 2: HACER - Ejecución de pruebas funcionales")
        
        if self.test_health_endpoint():
            passed_tests += 1
        total_tests += 1
        
        if self.test_api_documentation():
            passed_tests += 1
        total_tests += 1
        
        if self.test_game_apis():
            passed_tests += 1
        total_tests += 1
        
        if self.test_game_integration():
            passed_tests += 1
        total_tests += 1
        
        if self.test_portfolio_apis():
            passed_tests += 1
        total_tests += 1
        
        # FASE 3: VERIFICAR - Análisis de performance y seguridad
        print("\n🔄 FASE 3: VERIFICAR - Análisis de performance y seguridad")
        
        if self.test_performance_benchmarks():
            passed_tests += 1
        total_tests += 1
        
        if self.test_security_headers():
            passed_tests += 1
        total_tests += 1
        
        # FASE 4: ACTUAR - Generar reporte y recomendaciones
        print("\n🔄 FASE 4: ACTUAR - Análisis y recomendaciones")
        self.generate_final_report(passed_tests, total_tests)

    def generate_final_report(self, passed, total):
        """PDCA - ACTUAR: Generar reporte final con mejora continua"""
        total_duration = (datetime.now() - self.start_time).total_seconds()
        success_rate = (passed / total * 100) if total > 0 else 0
        
        print("\n" + "=" * 70)
        print("📊 REPORTE FINAL - TESTING WEB CON MEJORA CONTINUA")
        print("=" * 70)
        print(f"⏱️  Duración total: {total_duration:.2f} segundos")
        print(f"🧪 Total de pruebas: {total}")
        print(f"✅ Pruebas exitosas: {passed}")
        print(f"❌ Pruebas fallidas: {total - passed}")
        print(f"📈 Tasa de éxito: {success_rate:.1f}%")
        
        # Evaluación del estado según mejora continua
        if success_rate >= 95:
            print("🎉 ESTADO: EXCELENTE - Sistema óptimo para producción")
            quality_level = "EXCELLENT"
        elif success_rate >= 85:
            print("✅ ESTADO: MUY BUENO - Listo para producción")
            quality_level = "VERY_GOOD"
        elif success_rate >= 75:
            print("⚠️  ESTADO: BUENO - Mejoras menores recomendadas")
            quality_level = "GOOD"
        elif success_rate >= 60:
            print("⚠️  ESTADO: REGULAR - Mejoras importantes necesarias")
            quality_level = "FAIR"
        else:
            print("❌ ESTADO: CRÍTICO - Revisión completa requerida")
            quality_level = "CRITICAL"
        
        # Guardar reporte detallado
        self.save_detailed_report(passed, total, success_rate, total_duration, quality_level)
        
        # Mostrar recomendaciones PDCA
        self.show_pdca_recommendations(success_rate)

    def save_detailed_report(self, passed, total, success_rate, duration, quality):
        """Guardar reporte detallado para mejora continua"""
        report = {
            "test_execution": {
                "methodology": "PDCA - Plan-Do-Check-Act Continuous Improvement",
                "type": "web_environment_testing",
                "timestamp": self.start_time.isoformat(),
                "duration_seconds": duration,
                "server_url": self.base_url,
                "total_tests": total,
                "passed_tests": passed,
                "failed_tests": total - passed,
                "success_rate_percent": success_rate,
                "quality_assessment": quality
            },
            "pdca_phases": {
                "plan": "Estrategia de testing web definida",
                "do": "Pruebas ejecutadas en entorno real",
                "check": "Resultados analizados y verificados",
                "act": "Recomendaciones generadas para mejora"
            },
            "detailed_results": self.results,
            "continuous_improvement": {
                "strengths": self.identify_strengths(),
                "areas_for_improvement": self.identify_improvements(),
                "next_cycle_recommendations": self.generate_next_cycle_plan()
            }
        }
        
        report_file = f"web_testing_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Reporte detallado guardado en: {report_file}")

    def identify_strengths(self):
        """Identificar fortalezas del sistema"""
        strengths = []
        passed_tests = [r for r in self.results if r["status"] == "PASS"]
        
        if any(r["category"] == "connectivity" for r in passed_tests):
            strengths.append("✅ Conectividad del servidor estable")
        
        if any(r["category"] == "health" for r in passed_tests):
            strengths.append("✅ Health checks funcionando correctamente")
        
        if any(r["category"] == "game_apis" for r in passed_tests):
            strengths.append("✅ APIs del juego completamente operativas")
            
        if any(r["category"] == "integration" for r in passed_tests):
            strengths.append("✅ Integración frontend-backend exitosa")
            
        if any(r["category"] == "performance" for r in passed_tests):
            strengths.append("✅ Performance del servidor adecuado")
        
        return strengths

    def identify_improvements(self):
        """Identificar áreas de mejora"""
        improvements = []
        failed_tests = [r for r in self.results if r["status"] == "FAIL"]
        
        for failed in failed_tests:
            category = failed["category"]
            if category == "connectivity":
                improvements.append("🔧 Mejorar estabilidad de conectividad")
            elif category == "health":
                improvements.append("🔧 Optimizar health check endpoints")
            elif category == "game_apis":
                improvements.append("🔧 Revisar APIs del juego")
            elif category == "integration":
                improvements.append("🔧 Mejorar integración de componentes")
            elif category == "performance":
                improvements.append("🔧 Optimizar performance del servidor")
            elif category == "security":
                improvements.append("🔧 Fortalecer headers de seguridad")
        
        return improvements

    def generate_next_cycle_plan(self):
        """Generar plan para próximo ciclo PDCA"""
        return [
            "📋 PLANIFICAR: Definir mejoras basadas en resultados actuales",
            "🔧 HACER: Implementar optimizaciones identificadas",
            "✅ VERIFICAR: Re-ejecutar testing para validar mejoras",
            "📈 ACTUAR: Establecer nuevos estándares de calidad"
        ]

    def show_pdca_recommendations(self, success_rate):
        """Mostrar recomendaciones basadas en PDCA"""
        print("\n🔄 RECOMENDACIONES PDCA - MEJORA CONTINUA:")
        
        # Analizar resultados fallidos
        failed_tests = [r for r in self.results if r["status"] == "FAIL"]
        
        if not failed_tests:
            print("🌟 ¡EXCELENTE! Todas las pruebas pasaron exitosamente")
            print("📈 PRÓXIMO CICLO PDCA:")
            print("   1. 📊 PLANIFICAR: Monitoreo continuo de performance")
            print("   2. 🚀 HACER: Optimizaciones incrementales")
            print("   3. 📋 VERIFICAR: Testing de regression automático")
            print("   4. 🎯 ACTUAR: Establecer nuevos benchmarks")
        else:
            print("🔧 PLAN DE MEJORA CONTINUA:")
            print("   1. 📋 PLANIFICAR: Análisis de fallos identificados")
            
            for failed in failed_tests:
                print(f"      • {failed['category']}: {failed['test_name']}")
            
            print("   2. 🛠️  HACER: Implementar correcciones")
            print("   3. ✅ VERIFICAR: Re-ejecutar testing")
            print("   4. 📈 ACTUAR: Documentar mejoras aplicadas")
        
        print("\n💡 HERRAMIENTAS PARA MEJORA CONTINUA:")
        print("   • Monitoreo automático con scripts/simple_tests.py")
        print("   • Performance tracking en cada deploy")
        print("   • Regression testing antes de releases")
        print("   • Métricas de calidad en tiempo real")

def main():
    """Función principal para testing web con mejora continua"""
    print("🚀 INICIANDO TESTING WEB CON FILOSOFÍA DE MEJORA CONTINUA")
    print("🔄 Aplicando metodología PDCA al testing en entorno real")
    
    # Verificar conectividad antes de empezar
    try:
        test_response = requests.get("http://localhost:8000/", timeout=5)
        print("✅ Servidor detectado - Iniciando suite completa de pruebas...")
    except Exception as e:
        print("❌ No se puede conectar al servidor en http://localhost:8000")
        print(f"💥 Error: {e}")
        print("📌 Asegúrate de que el servidor esté ejecutándose:")
        print("   python railway_start.py")
        return
    
    # Ejecutar suite completa
    testing_suite = WebTestingSuite()
    testing_suite.run_complete_testing_suite()
    
    print("\n🎉 ¡TESTING WEB COMPLETADO BAJO FILOSOFÍA DE MEJORA CONTINUA!")
    print("📈 Utiliza los resultados para el próximo ciclo PDCA")

if __name__ == "__main__":
    main()