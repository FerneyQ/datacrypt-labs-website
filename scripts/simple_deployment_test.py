#!/usr/bin/env python3
"""
🧪 DataCrypt Labs - Test Suite de Calidad y Seguridad Adaptado
Pruebas específicas para la estructura real del sitio
"""

import requests
import json
import time
from datetime import datetime
from urllib.parse import urljoin

class DataCryptSimpleTester:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.results = {}
        self.start_time = datetime.now()
        # Páginas que realmente existen
        self.pages_to_test = [
            "/",  # index.html
            "/index.html",
            "/certificaciones.html", 
            "/portafolio.html",
            "/servicios.html",
            "/diagnostico_chatbot.html"
        ]
        
    def log_test(self, test_name, status, details=None, score=None):
        """Registrar resultado de prueba"""
        self.results[test_name] = {
            "status": status,
            "details": details or {},
            "score": score,
            "timestamp": datetime.now().isoformat()
        }
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        score_text = f" [{score}/10]" if score is not None else ""
        print(f"{status_emoji} {test_name}: {status}{score_text}")
        
        if details:
            for key, value in details.items():
                if isinstance(value, (int, float)) and key.endswith('_ms'):
                    print(f"   📊 {key}: {value}ms")
                elif isinstance(value, str) and len(value) < 100:
                    print(f"   📝 {key}: {value}")

    def test_page_availability(self):
        """Test básico de disponibilidad de páginas"""
        print("🔍 TESTING: Disponibilidad de Páginas")
        print("-" * 50)
        
        available_pages = 0
        total_pages = len(self.pages_to_test)
        page_details = {}
        
        for page in self.pages_to_test:
            try:
                start_time = time.time()
                url = urljoin(self.base_url, page)
                response = requests.get(url, timeout=10)
                duration = (time.time() - start_time) * 1000
                
                if response.status_code == 200:
                    available_pages += 1
                    status = "✅ DISPONIBLE"
                    page_details[page] = {
                        "status_code": 200,
                        "response_time_ms": round(duration, 2),
                        "content_size_kb": round(len(response.content) / 1024, 2)
                    }
                else:
                    status = f"❌ ERROR {response.status_code}"
                    page_details[page] = {
                        "status_code": response.status_code,
                        "error": f"HTTP {response.status_code}"
                    }
                    
                print(f"   📄 {page}: {status} ({round(duration, 0)}ms)")
                
            except Exception as e:
                status = f"❌ TIMEOUT/ERROR"
                page_details[page] = {"error": str(e)}
                print(f"   📄 {page}: {status}")
        
        availability_score = (available_pages / total_pages) * 10
        self.log_test("Disponibilidad_Paginas", 
                     "PASS" if availability_score >= 8 else "FAIL",
                     {"available": f"{available_pages}/{total_pages}", "pages": page_details},
                     round(availability_score, 1))
        
        return availability_score

    def test_performance_basic(self):
        """Test básico de rendimiento"""
        print("\n🚀 TESTING: Rendimiento Básico")
        print("-" * 50)
        
        times = []
        errors = 0
        
        # Test multiple requests to index page
        for i in range(5):
            try:
                start_time = time.time()
                response = requests.get(self.base_url, timeout=10)
                duration = (time.time() - start_time) * 1000
                
                if response.status_code == 200:
                    times.append(duration)
                    print(f"   🔄 Request {i+1}: {round(duration, 0)}ms")
                else:
                    errors += 1
                    
                time.sleep(0.2)  # Pequeña pausa entre requests
                
            except Exception as e:
                errors += 1
                print(f"   ❌ Request {i+1}: Error - {str(e)[:50]}")
        
        if times:
            avg_time = sum(times) / len(times)
            min_time = min(times)
            max_time = max(times)
            
            # Scoring basado en tiempo promedio
            if avg_time < 500:
                score = 10
            elif avg_time < 1000:
                score = 8
            elif avg_time < 2000:
                score = 6
            elif avg_time < 3000:
                score = 4
            else:
                score = 2
                
            performance_details = {
                "avg_response_time_ms": round(avg_time, 2),
                "min_time_ms": round(min_time, 2),
                "max_time_ms": round(max_time, 2),
                "errors": errors,
                "success_rate": f"{len(times)}/5"
            }
            
            print(f"   📊 Tiempo promedio: {round(avg_time, 0)}ms")
            print(f"   📊 Rango: {round(min_time, 0)}ms - {round(max_time, 0)}ms")
            
        else:
            score = 0
            performance_details = {"error": "No successful requests", "errors": errors}
            
        self.log_test("Rendimiento_Basico",
                     "PASS" if score >= 6 else "FAIL", 
                     performance_details, score)
        
        return score

    def test_security_basic(self):
        """Test básico de seguridad"""
        print("\n🛡️ TESTING: Seguridad Básica")
        print("-" * 50)
        
        try:
            response = requests.get(self.base_url, timeout=10)
            headers = response.headers
            
            # Headers de seguridad básicos
            security_checks = {
                "X-Content-Type-Options": headers.get("X-Content-Type-Options") == "nosniff",
                "X-Frame-Options": headers.get("X-Frame-Options") in ["DENY", "SAMEORIGIN"],
                "Content-Type": "text/html" in headers.get("Content-Type", ""),
                "Server_Hidden": "Server" not in headers or "nginx" not in headers.get("Server", "").lower()
            }
            
            passed_checks = sum(security_checks.values())
            score = (passed_checks / len(security_checks)) * 10
            
            print(f"   🔒 Headers de seguridad: {passed_checks}/{len(security_checks)}")
            for check, passed in security_checks.items():
                status = "✅" if passed else "❌"
                print(f"     {status} {check}")
            
            security_details = {
                "checks_passed": f"{passed_checks}/{len(security_checks)}",
                "headers_found": dict(headers),
                "security_score": round(score, 1)
            }
            
        except Exception as e:
            score = 0
            security_details = {"error": str(e)}
            
        self.log_test("Seguridad_Basica",
                     "PASS" if score >= 6 else "FAIL",
                     security_details, score)
        
        return score

    def test_chatbot_files(self):
        """Test de archivos del chatbot"""
        print("\n🤖 TESTING: Archivos del Chatbot")
        print("-" * 50)
        
        chatbot_files = [
            "/src/components/DataCryptChatbot.js",
            "/diagnostico_chatbot.html",
            "/src/core/DataCryptSecurity.js",
            "/src/utils/ConfigManager.js"
        ]
        
        available_files = 0
        file_details = {}
        
        for file_path in chatbot_files:
            try:
                url = urljoin(self.base_url, file_path)
                response = requests.get(url, timeout=5)
                
                if response.status_code == 200:
                    available_files += 1
                    size_kb = len(response.content) / 1024
                    status = f"✅ Disponible ({round(size_kb, 1)}KB)"
                    
                    # Verificar contenido específico del chatbot
                    content = response.text
                    if "GitHub Copilot" in content:
                        status += " - GitHub Copilot ✅"
                    if "DataCryptChatbot" in content:
                        status += " - Clase principal ✅"
                        
                    file_details[file_path] = {
                        "status": "available",
                        "size_kb": round(size_kb, 1),
                        "has_github_copilot": "GitHub Copilot" in content,
                        "has_main_class": "DataCryptChatbot" in content
                    }
                else:
                    status = f"❌ No encontrado (HTTP {response.status_code})"
                    file_details[file_path] = {
                        "status": "not_found",
                        "http_code": response.status_code
                    }
                    
                print(f"   📄 {file_path}: {status}")
                
            except Exception as e:
                status = f"❌ Error: {str(e)[:30]}"
                file_details[file_path] = {"status": "error", "error": str(e)}
                print(f"   📄 {file_path}: {status}")
        
        score = (available_files / len(chatbot_files)) * 10
        
        self.log_test("Archivos_Chatbot",
                     "PASS" if score >= 7 else "FAIL",
                     {"available": f"{available_files}/{len(chatbot_files)}", "files": file_details},
                     round(score, 1))
        
        return score

    def test_server_stability(self):
        """Test de estabilidad del servidor"""
        print("\n⚡ TESTING: Estabilidad del Servidor")
        print("-" * 50)
        
        stable_requests = 0
        total_requests = 10
        
        for i in range(total_requests):
            try:
                start_time = time.time()
                response = requests.get(self.base_url, timeout=3)
                duration = time.time() - start_time
                
                if response.status_code == 200 and duration < 2:
                    stable_requests += 1
                    print(f"   ✅ Request {i+1}: OK ({round(duration*1000, 0)}ms)")
                else:
                    print(f"   ❌ Request {i+1}: Slow or error")
                    
                time.sleep(0.1)  # Pausa muy breve
                
            except:
                print(f"   ❌ Request {i+1}: Failed")
        
        stability_rate = (stable_requests / total_requests) * 100
        score = (stable_requests / total_requests) * 10
        
        print(f"   📊 Estabilidad: {stability_rate:.1f}% ({stable_requests}/{total_requests})")
        
        stability_details = {
            "stability_rate": f"{stability_rate:.1f}%",
            "successful_requests": f"{stable_requests}/{total_requests}",
            "stability_score": round(score, 1)
        }
        
        self.log_test("Estabilidad_Servidor",
                     "PASS" if score >= 8 else "FAIL",
                     stability_details, score)
        
        return score

    def run_all_tests(self):
        """Ejecutar todos los tests"""
        print("🚀 DATACRYPT LABS - SUITE DE TESTING SIMPLIFICADA")
        print("🔄 Filosofía de Mejora Continua - Validación para Deployment")
        print("=" * 80)
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 URL Base: {self.base_url}")
        print("=" * 80)
        
        # Ejecutar todos los tests
        scores = []
        
        scores.append(self.test_page_availability())
        scores.append(self.test_performance_basic())
        scores.append(self.test_security_basic())
        scores.append(self.test_chatbot_files())
        scores.append(self.test_server_stability())
        
        # Calcular score general
        overall_score = sum(scores) / len(scores) if scores else 0
        
        # Generar reporte final
        self.generate_simple_report(overall_score, scores)
        
        return overall_score

    def generate_simple_report(self, overall_score, individual_scores):
        """Generar reporte simplificado"""
        print("\n" + "="*80)
        print("📊 REPORTE FINAL DE TESTING")
        print("="*80)
        
        print(f"🎯 PUNTUACIÓN GENERAL: {overall_score:.1f}/10")
        
        test_names = ["Disponibilidad", "Rendimiento", "Seguridad", "Chatbot", "Estabilidad"]
        for i, (name, score) in enumerate(zip(test_names, individual_scores)):
            status = "✅" if score >= 7 else "⚠️" if score >= 5 else "❌"
            print(f"{status} {name}: {score:.1f}/10")
        
        # Estado general
        if overall_score >= 9:
            status = "🏆 EXCELENTE - LISTO PARA PRODUCCIÓN"
            color = "verde"
        elif overall_score >= 8:
            status = "✅ BUENO - APTO PARA DEPLOYMENT"
            color = "verde"
        elif overall_score >= 7:
            status = "⚠️ ACEPTABLE - MEJORAS MENORES REQUERIDAS"
            color = "amarillo"
        elif overall_score >= 6:
            status = "🔶 REGULAR - MEJORAS SIGNIFICATIVAS REQUERIDAS"
            color = "naranja"
        else:
            status = "❌ CRÍTICO - NO APTO PARA PRODUCCIÓN"
            color = "rojo"
        
        print(f"\n🎖️ ESTADO: {status}")
        
        # Guardar reporte
        report_data = {
            "timestamp": self.start_time.isoformat(),
            "base_url": self.base_url,
            "overall_score": round(overall_score, 1),
            "individual_scores": {
                "disponibilidad": round(individual_scores[0], 1),
                "rendimiento": round(individual_scores[1], 1),
                "seguridad": round(individual_scores[2], 1), 
                "chatbot": round(individual_scores[3], 1),
                "estabilidad": round(individual_scores[4], 1)
            },
            "status": status,
            "color": color,
            "detailed_results": self.results
        }
        
        report_file = f"simple_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Reporte guardado: {report_file}")
        
        # Recomendaciones específicas
        print(f"\n💡 RECOMENDACIONES:")
        if individual_scores[0] < 8:  # Disponibilidad
            print("- Verificar que todas las páginas estén accesibles")
        if individual_scores[1] < 7:  # Rendimiento
            print("- Optimizar tiempos de carga del servidor")
        if individual_scores[2] < 7:  # Seguridad
            print("- Implementar headers de seguridad adicionales")
        if individual_scores[3] < 8:  # Chatbot
            print("- Verificar que todos los archivos del chatbot estén disponibles")
        if individual_scores[4] < 8:  # Estabilidad
            print("- Mejorar la estabilidad y consistencia del servidor")
            
        print(f"\n⏱️ Duración total: {(datetime.now() - self.start_time).total_seconds():.1f} segundos")
        
        return report_data

def main():
    """Función principal"""
    import sys
    
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
    
    print(f"🎯 Iniciando tests simplificados para: {base_url}")
    
    tester = DataCryptSimpleTester(base_url)
    final_score = tester.run_all_tests()
    
    # Exit code basado en el score
    if final_score >= 8:
        sys.exit(0)  # Success
    elif final_score >= 6:
        sys.exit(1)  # Warning  
    else:
        sys.exit(2)  # Critical

if __name__ == "__main__":
    main()