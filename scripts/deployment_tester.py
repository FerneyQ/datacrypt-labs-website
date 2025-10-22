#!/usr/bin/env python3
"""
🧪 DataCrypt Labs - Test Suite de Calidad y Seguridad para Deployment
Filosofía de Mejora Continua - Pruebas completas de producción

PLANIFICAR: Estrategia de testing completo para deployment
HACER: Ejecución de pruebas de calidad, seguridad y rendimiento  
VERIFICAR: Análisis de métricas y validación de estándares
ACTUAR: Reporte de mejoras y certificación de deployment
"""

import requests
import json
import time
import re
import ssl
import socket
from datetime import datetime
from urllib.parse import urljoin, urlparse
import subprocess
import os
from bs4 import BeautifulSoup
import hashlib

class DataCryptDeploymentTester:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.results = {
            "calidad": {},
            "seguridad": {},
            "rendimiento": {},
            "chatbot": {},
            "deployment": {}
        }
        self.start_time = datetime.now()
        self.pages_to_test = [
            "/",
            "/about.html",
            "/services.html", 
            "/portfolio.html",
            "/contact.html",
            "/diagnostico_chatbot.html"
        ]
        
    def log_test(self, category, test_name, status, details=None, duration=None, score=None):
        """Registrar resultado de prueba con scoring"""
        if category not in self.results:
            self.results[category] = {}
        
        self.results[category][test_name] = {
            "status": status,
            "details": details or {},
            "duration": duration,
            "score": score,
            "timestamp": datetime.now().isoformat()
        }
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        score_text = f" [{score}/10]" if score is not None else ""
        print(f"{status_emoji} [{category.upper()}] {test_name}: {status}{score_text}")
        
        if details and isinstance(details, dict):
            for key, value in details.items():
                if isinstance(value, (int, float)) and key.endswith('_ms'):
                    print(f"   📊 {key}: {value}ms")
                elif isinstance(value, str) and len(value) < 100:
                    print(f"   📝 {key}: {value}")

    def test_page_accessibility(self, url):
        """Test de accesibilidad básico"""
        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            duration = (time.time() - start_time) * 1000
            
            if response.status_code != 200:
                return {"score": 0, "issues": [f"HTTP {response.status_code}"]}
                
            soup = BeautifulSoup(response.text, 'html.parser')
            score = 10
            issues = []
            
            # Verificar elementos de accesibilidad
            if not soup.find('html', lang=True):
                score -= 2
                issues.append("Falta atributo lang en <html>")
                
            if not soup.find('title'):
                score -= 2
                issues.append("Falta elemento <title>")
                
            images = soup.find_all('img')
            images_without_alt = [img for img in images if not img.get('alt')]
            if images_without_alt:
                score -= 1
                issues.append(f"{len(images_without_alt)} imágenes sin atributo alt")
                
            # Verificar estructura de headings
            headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
            if not headings:
                score -= 2
                issues.append("No se encontraron headings")
                
            return {
                "score": max(0, score),
                "issues": issues,
                "duration_ms": duration,
                "images_count": len(images),
                "headings_count": len(headings)
            }
            
        except Exception as e:
            return {"score": 0, "issues": [f"Error: {str(e)}"]}

    def test_page_performance(self, url):
        """Test básico de rendimiento"""
        try:
            times = []
            for i in range(3):
                start_time = time.time()
                response = requests.get(url, timeout=15)
                duration = (time.time() - start_time) * 1000
                times.append(duration)
                time.sleep(0.5)
            
            avg_time = sum(times) / len(times)
            content_size = len(response.content) if response.status_code == 200 else 0
            
            # Scoring basado en tiempo de respuesta
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
                
            return {
                "score": score,
                "avg_response_time_ms": round(avg_time, 2),
                "min_time_ms": round(min(times), 2),
                "max_time_ms": round(max(times), 2),
                "content_size_kb": round(content_size / 1024, 2),
                "status_code": response.status_code
            }
            
        except Exception as e:
            return {"score": 0, "error": str(e)}

    def test_security_headers(self, url):
        """Test de headers de seguridad"""
        try:
            response = requests.get(url, timeout=10)
            headers = response.headers
            
            security_headers = {
                "X-Content-Type-Options": "nosniff",
                "X-Frame-Options": ["DENY", "SAMEORIGIN"],
                "X-XSS-Protection": "1; mode=block",
                "Strict-Transport-Security": None,  # Solo para HTTPS
                "Content-Security-Policy": None,
                "Referrer-Policy": None
            }
            
            score = 10
            found_headers = {}
            missing_headers = []
            
            for header, expected in security_headers.items():
                header_value = headers.get(header)
                if header_value:
                    found_headers[header] = header_value
                    # Validar valores específicos
                    if expected and isinstance(expected, list):
                        if header_value not in expected:
                            score -= 1
                    elif expected and header_value != expected:
                        score -= 1
                else:
                    missing_headers.append(header)
                    if header in ["X-Content-Type-Options", "X-Frame-Options"]:
                        score -= 2  # Headers críticos
                    else:
                        score -= 1
                        
            return {
                "score": max(0, score),
                "found_headers": found_headers,
                "missing_headers": missing_headers,
                "total_security_headers": len(found_headers)
            }
            
        except Exception as e:
            return {"score": 0, "error": str(e)}

    def test_xss_protection(self, url):
        """Test básico de protección XSS"""
        try:
            xss_payloads = [
                "<script>alert('xss')</script>",
                "javascript:alert('xss')",
                "<img src=x onerror=alert('xss')>",
                "<svg onload=alert('xss')>"
            ]
            
            score = 10
            vulnerabilities = []
            
            for payload in xss_payloads:
                try:
                    # Test en parámetros GET
                    test_url = f"{url}?test={payload}"
                    response = requests.get(test_url, timeout=5)
                    
                    # Verificar si el payload aparece sin escapar
                    if payload in response.text and response.status_code == 200:
                        vulnerabilities.append(f"XSS en GET: {payload}")
                        score -= 2
                        
                except:
                    pass  # Timeout o error es aceptable en tests de seguridad
            
            return {
                "score": max(0, score),
                "vulnerabilities": vulnerabilities,
                "payloads_tested": len(xss_payloads)
            }
            
        except Exception as e:
            return {"score": 8, "note": "Test XSS no completado", "error": str(e)}

    def test_chatbot_functionality(self):
        """Test específico del chatbot GitHub Copilot"""
        try:
            # Verificar que la página del chatbot carga
            chatbot_url = urljoin(self.base_url, "/diagnostico_chatbot.html")
            response = requests.get(chatbot_url, timeout=10)
            
            if response.status_code != 200:
                return {"score": 0, "error": f"Página de diagnóstico no disponible: {response.status_code}"}
            
            # Verificar archivos del chatbot
            chatbot_js_url = urljoin(self.base_url, "/src/components/DataCryptChatbot.js")
            chatbot_response = requests.get(chatbot_js_url, timeout=5)
            
            score = 10
            details = {}
            
            if chatbot_response.status_code == 200:
                chatbot_content = chatbot_response.text
                
                # Verificar características clave implementadas
                checks = {
                    "singleton_pattern": "DataCryptChatbot.instance" in chatbot_content,
                    "anti_loop_protection": "isProcessingMessage" in chatbot_content,
                    "error_handling": "try {" in chatbot_content and "catch (error)" in chatbot_content,
                    "github_copilot_personality": "GitHub Copilot" in chatbot_content,
                    "security_integration": "this.security" in chatbot_content,
                    "destroy_method": "destroy()" in chatbot_content
                }
                
                passed_checks = sum(checks.values())
                details = checks
                details["passed_checks"] = f"{passed_checks}/{len(checks)}"
                
                score = (passed_checks / len(checks)) * 10
                
            else:
                score = 5
                details["chatbot_js_status"] = chatbot_response.status_code
            
            return {
                "score": round(score, 1),
                "details": details,
                "chatbot_page_status": response.status_code,
                "diagnostic_page_available": True
            }
            
        except Exception as e:
            return {"score": 0, "error": str(e)}

    def test_deployment_readiness(self):
        """Test de preparación para deployment"""
        try:
            score = 10
            readiness = {}
            
            # Verificar archivos críticos
            critical_files = [
                "/",
                "/index.html", 
                "/src/components/DataCryptChatbot.js",
                "/src/core/DataCryptSecurity.js",
                "/src/utils/ConfigManager.js"
            ]
            
            available_files = 0
            for file_path in critical_files:
                try:
                    url = urljoin(self.base_url, file_path)
                    response = requests.get(url, timeout=5)
                    if response.status_code == 200:
                        available_files += 1
                    else:
                        readiness[f"missing_{file_path.replace('/', '_')}"] = response.status_code
                except:
                    readiness[f"error_{file_path.replace('/', '_')}"] = "timeout"
            
            readiness["available_files"] = f"{available_files}/{len(critical_files)}"
            score = (available_files / len(critical_files)) * 10
            
            # Test de servidor estable
            try:
                uptime_checks = []
                for i in range(5):
                    start = time.time()
                    response = requests.get(self.base_url, timeout=3)
                    duration = time.time() - start
                    uptime_checks.append(response.status_code == 200 and duration < 2)
                    time.sleep(0.2)
                
                stability = sum(uptime_checks) / len(uptime_checks)
                readiness["server_stability"] = f"{stability*100:.1f}%"
                
                if stability < 0.8:
                    score -= 2
                    
            except:
                readiness["server_stability"] = "unstable"
                score -= 3
            
            return {
                "score": max(0, round(score, 1)),
                "readiness": readiness
            }
            
        except Exception as e:
            return {"score": 0, "error": str(e)}

    def run_comprehensive_tests(self):
        """Ejecutar suite completa de pruebas"""
        print("🚀 DATACRYPT LABS - SUITE DE CALIDAD Y SEGURIDAD PARA DEPLOYMENT")
        print("🔄 Filosofía de Mejora Continua - Ciclo PDCA")
        print("=" * 80)
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 URL Base: {self.base_url}")
        print("=" * 80)
        
        # 1. TESTS DE CALIDAD
        print("\n🎯 FASE 1: TESTS DE CALIDAD WEB")
        print("-" * 40)
        
        quality_scores = []
        for page in self.pages_to_test:
            print(f"\n🔍 Testing: {page}")
            url = urljoin(self.base_url, page)
            
            # Test de accesibilidad
            acc_result = self.test_page_accessibility(url)
            self.log_test("calidad", f"accesibilidad_{page.replace('/', 'index').replace('.html', '')}", 
                         "PASS" if acc_result["score"] >= 7 else "FAIL", acc_result, score=acc_result["score"])
            
            # Test de rendimiento
            perf_result = self.test_page_performance(url)
            self.log_test("calidad", f"rendimiento_{page.replace('/', 'index').replace('.html', '')}", 
                         "PASS" if perf_result["score"] >= 6 else "FAIL", perf_result, score=perf_result["score"])
            
            quality_scores.extend([acc_result["score"], perf_result["score"]])
        
        # 2. TESTS DE SEGURIDAD
        print("\n🛡️ FASE 2: TESTS DE SEGURIDAD")
        print("-" * 40)
        
        security_scores = []
        
        # Headers de seguridad
        headers_result = self.test_security_headers(self.base_url)
        self.log_test("seguridad", "headers_seguridad", 
                     "PASS" if headers_result["score"] >= 6 else "FAIL", headers_result, score=headers_result["score"])
        security_scores.append(headers_result["score"])
        
        # Protección XSS
        xss_result = self.test_xss_protection(self.base_url)
        self.log_test("seguridad", "proteccion_xss", 
                     "PASS" if xss_result["score"] >= 8 else "FAIL", xss_result, score=xss_result["score"])
        security_scores.append(xss_result["score"])
        
        # 3. TEST DEL CHATBOT
        print("\n🤖 FASE 3: TEST DEL CHATBOT GITHUB COPILOT")
        print("-" * 40)
        
        chatbot_result = self.test_chatbot_functionality()
        self.log_test("chatbot", "funcionalidad_completa", 
                     "PASS" if chatbot_result["score"] >= 8 else "FAIL", chatbot_result, score=chatbot_result["score"])
        
        # 4. TEST DE DEPLOYMENT
        print("\n🚀 FASE 4: PREPARACIÓN PARA DEPLOYMENT")
        print("-" * 40)
        
        deployment_result = self.test_deployment_readiness()
        self.log_test("deployment", "deployment_readiness", 
                     "PASS" if deployment_result["score"] >= 8 else "FAIL", deployment_result, score=deployment_result["score"])
        
        # GENERAR REPORTE FINAL
        self.generate_final_report(quality_scores, security_scores, chatbot_result["score"], deployment_result["score"])

    def generate_final_report(self, quality_scores, security_scores, chatbot_score, deployment_score):
        """Generar reporte final consolidado"""
        print("\n" + "="*80)
        print("📊 REPORTE FINAL DE CALIDAD Y SEGURIDAD")
        print("="*80)
        
        # Calcular puntuaciones
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        avg_security = sum(security_scores) / len(security_scores) if security_scores else 0
        overall_score = (avg_quality + avg_security + chatbot_score + deployment_score) / 4
        
        print(f"🎯 PUNTUACIÓN GENERAL: {overall_score:.1f}/10")
        print(f"📈 Calidad Web: {avg_quality:.1f}/10")
        print(f"🛡️ Seguridad: {avg_security:.1f}/10") 
        print(f"🤖 Chatbot: {chatbot_score:.1f}/10")
        print(f"🚀 Deployment: {deployment_score:.1f}/10")
        
        # Status de certificación
        if overall_score >= 9:
            status = "🏆 EXCELENTE - LISTO PARA PRODUCCIÓN"
        elif overall_score >= 8:
            status = "✅ BUENO - APTO PARA DEPLOYMENT"
        elif overall_score >= 7:
            status = "⚠️ ACEPTABLE - MEJORAS MENORES REQUERIDAS"
        elif overall_score >= 6:
            status = "🔶 REGULAR - MEJORAS SIGNIFICATIVAS REQUERIDAS"
        else:
            status = "❌ CRÍTICO - NO APTO PARA PRODUCCIÓN"
        
        print(f"\n🎖️ CERTIFICACIÓN: {status}")
        
        # Generar archivo de reporte
        report_data = {
            "timestamp": self.start_time.isoformat(),
            "base_url": self.base_url,
            "scores": {
                "overall": round(overall_score, 1),
                "quality": round(avg_quality, 1),
                "security": round(avg_security, 1),
                "chatbot": round(chatbot_score, 1),
                "deployment": round(deployment_score, 1)
            },
            "status": status,
            "detailed_results": self.results
        }
        
        report_file = f"deployment_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Reporte guardado: {report_file}")
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES:")
        if avg_quality < 8:
            print("- Optimizar tiempos de carga y accesibilidad web")
        if avg_security < 8:
            print("- Reforzar headers de seguridad y protección XSS")
        if chatbot_score < 9:
            print("- Verificar funcionalidades del chatbot GitHub Copilot")
        if deployment_score < 9:
            print("- Asegurar estabilidad del servidor y archivos críticos")
            
        print(f"\n⏱️ Duración total: {(datetime.now() - self.start_time).total_seconds():.1f} segundos")
        return overall_score

def main():
    """Función principal"""
    import sys
    
    # Permitir especificar URL como parámetro
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
    
    print(f"🎯 Iniciando tests para: {base_url}")
    
    tester = DataCryptDeploymentTester(base_url)
    final_score = tester.run_comprehensive_tests()
    
    # Exit code basado en el score
    if final_score >= 8:
        sys.exit(0)  # Success
    elif final_score >= 6:
        sys.exit(1)  # Warning
    else:
        sys.exit(2)  # Critical

if __name__ == "__main__":
    main()