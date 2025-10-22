"""
🧪 DATACRYPT LABS - SISTEMA DE TESTING
Script para probar el sistema modular v2.0
Filosofía Mejora Continua: Validación continua y calidad
"""

import asyncio
import requests
import json
from pathlib import Path
from datetime import datetime
import time

class SystemTester:
    """Tester completo del sistema modular"""
    
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = []
        self.start_time = None
        
    def log_test(self, test_name: str, status: str, details: str = ""):
        """Registra resultado de test"""
        result = {
            "test": test_name,
            "status": status,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        
        status_emoji = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
        print(f"{status_emoji} {test_name}: {status}")
        if details and status != "PASS":
            print(f"   └─ {details}")
    
    def test_basic_connectivity(self):
        """Test 1: Conectividad básica"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            if response.status_code == 200:
                self.log_test("Conectividad Básica", "PASS")
                return True
            else:
                self.log_test("Conectividad Básica", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Conectividad Básica", "FAIL", str(e))
            return False
    
    def test_health_endpoint(self):
        """Test 2: Health Check"""
        try:
            response = requests.get(f"{self.base_url}/api/v1/health/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    self.log_test("Health Check", "PASS")
                    return True
                else:
                    self.log_test("Health Check", "FAIL", "Status no exitoso")
                    return False
            else:
                self.log_test("Health Check", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", "FAIL", str(e))
            return False
    
    def test_detailed_health(self):
        """Test 3: Health Check Detallado"""
        try:
            response = requests.get(f"{self.base_url}/api/v1/health/detailed", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "overview" in data.get("data", {}):
                    self.log_test("Health Detallado", "PASS")
                    return True
                else:
                    self.log_test("Health Detallado", "FAIL", "Estructura de datos incorrecta")
                    return False
            else:
                self.log_test("Health Detallado", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Detallado", "FAIL", str(e))
            return False
    
    def test_portfolio_endpoints(self):
        """Test 4: Endpoints de Portfolio"""
        endpoints = [
            "/api/v1/portfolio/projects",
            "/api/v1/portfolio/featured", 
            "/api/v1/portfolio/categories",
            "/api/v1/portfolio/technologies",
            "/api/v1/portfolio/stats"
        ]
        
        passed = 0
        for endpoint in endpoints:
            try:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=5)
                if response.status_code == 200:
                    passed += 1
                else:
                    self.log_test(f"Portfolio {endpoint}", "FAIL", f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Portfolio {endpoint}", "FAIL", str(e))
        
        if passed == len(endpoints):
            self.log_test("Portfolio Endpoints", "PASS", f"{passed}/{len(endpoints)} endpoints")
            return True
        else:
            self.log_test("Portfolio Endpoints", "FAIL", f"{passed}/{len(endpoints)} endpoints")
            return False
    
    def test_games_endpoints(self):
        """Test 5: Endpoints de Juegos"""
        try:
            # Test leaderboard
            response = requests.get(f"{self.base_url}/api/v1/games/leaderboard", timeout=5)
            if response.status_code == 200:
                # Test stats
                response = requests.get(f"{self.base_url}/api/v1/games/stats", timeout=5)
                if response.status_code == 200:
                    self.log_test("Games Endpoints", "PASS")
                    return True
                else:
                    self.log_test("Games Endpoints", "FAIL", "Stats endpoint failed")
                    return False
            else:
                self.log_test("Games Endpoints", "FAIL", "Leaderboard endpoint failed")
                return False
        except Exception as e:
            self.log_test("Games Endpoints", "FAIL", str(e))
            return False
    
    def test_ml_endpoints(self):
        """Test 6: Endpoints de Machine Learning"""
        try:
            # Test available models
            response = requests.get(f"{self.base_url}/api/v1/ml/models", timeout=5)
            if response.status_code == 200:
                # Test prediction endpoint
                prediction_data = {
                    "model_type": "regression",
                    "features": [1.0, 2.0, 3.0],
                    "model_parameters": {}
                }
                response = requests.post(
                    f"{self.base_url}/api/v1/ml/predict", 
                    json=prediction_data,
                    timeout=10
                )
                if response.status_code == 200:
                    self.log_test("ML Endpoints", "PASS")
                    return True
                else:
                    self.log_test("ML Endpoints", "FAIL", "Prediction endpoint failed")
                    return False
            else:
                self.log_test("ML Endpoints", "FAIL", "Models endpoint failed")
                return False
        except Exception as e:
            self.log_test("ML Endpoints", "FAIL", str(e))
            return False
    
    def test_data_endpoints(self):
        """Test 7: Endpoints de Análisis de Datos"""
        try:
            # Test available datasets
            response = requests.get(f"{self.base_url}/api/v1/data/datasets", timeout=5)
            if response.status_code == 200:
                # Test crypto sample
                response = requests.get(f"{self.base_url}/api/v1/data/crypto/sample?count=5", timeout=5)
                if response.status_code == 200:
                    self.log_test("Data Analysis Endpoints", "PASS")
                    return True
                else:
                    self.log_test("Data Analysis Endpoints", "FAIL", "Crypto sample failed")
                    return False
            else:
                self.log_test("Data Analysis Endpoints", "FAIL", "Datasets endpoint failed")
                return False
        except Exception as e:
            self.log_test("Data Analysis Endpoints", "FAIL", str(e))
            return False
    
    def test_contact_endpoint(self):
        """Test 8: Endpoint de Contacto"""
        try:
            contact_data = {
                "name": "Test User",
                "email": "test@datacryptlabs.com",
                "message": "Este es un mensaje de prueba del sistema modular"
            }
            response = requests.post(
                f"{self.base_url}/api/v1/contact/send",
                json=contact_data,
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    self.log_test("Contact Endpoint", "PASS")
                    return True
                else:
                    self.log_test("Contact Endpoint", "FAIL", "Response not successful")
                    return False
            else:
                self.log_test("Contact Endpoint", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Contact Endpoint", "FAIL", str(e))
            return False
    
    def test_api_docs(self):
        """Test 9: Documentación de API"""
        try:
            response = requests.get(f"{self.base_url}/docs", timeout=5)
            if response.status_code == 200:
                self.log_test("API Documentation", "PASS")
                return True
            else:
                self.log_test("API Documentation", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("API Documentation", "FAIL", str(e))
            return False
    
    def test_database_health(self):
        """Test 10: Salud de Base de Datos"""
        try:
            response = requests.get(f"{self.base_url}/api/v1/health/database", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("data", {}).get("status") == "healthy":
                    self.log_test("Database Health", "PASS")
                    return True
                else:
                    self.log_test("Database Health", "FAIL", "Database not healthy")
                    return False
            else:
                self.log_test("Database Health", "FAIL", f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Database Health", "FAIL", str(e))
            return False
    
    def run_all_tests(self):
        """Ejecuta todos los tests"""
        print("🧪 INICIANDO TESTS DEL SISTEMA MODULAR v2.0")
        print("=" * 60)
        
        self.start_time = time.time()
        
        tests = [
            self.test_basic_connectivity,
            self.test_health_endpoint,
            self.test_detailed_health,
            self.test_portfolio_endpoints,
            self.test_games_endpoints,
            self.test_ml_endpoints,
            self.test_data_endpoints,
            self.test_contact_endpoint,
            self.test_api_docs,
            self.test_database_health
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            if test():
                passed += 1
            else:
                failed += 1
        
        execution_time = time.time() - self.start_time
        
        print("\n" + "=" * 60)
        print("📊 RESUMEN DE TESTS")
        print(f"✅ Tests Pasados: {passed}")
        print(f"❌ Tests Fallidos: {failed}")
        print(f"📈 Tasa de Éxito: {(passed/(passed+failed)*100):.1f}%")
        print(f"⏱️ Tiempo de Ejecución: {execution_time:.2f}s")
        
        if failed == 0:
            print("\n🎉 TODOS LOS TESTS PASARON - SISTEMA FUNCIONAL")
        else:
            print(f"\n⚠️ {failed} TESTS FALLARON - REVISAR ERRORES")
        
        # Guardar reporte
        self.save_report(passed, failed, execution_time)
        
        return failed == 0
    
    def save_report(self, passed: int, failed: int, execution_time: float):
        """Guarda reporte de tests"""
        report = {
            "test_summary": {
                "timestamp": datetime.now().isoformat(),
                "total_tests": passed + failed,
                "passed": passed,
                "failed": failed,
                "success_rate": (passed/(passed+failed)*100) if (passed+failed) > 0 else 0,
                "execution_time_seconds": execution_time
            },
            "detailed_results": self.results
        }
        
        report_file = Path("test_results.json")
        with open(report_file, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📋 Reporte guardado en: {report_file}")

def main():
    """Función principal"""
    print("🚀 DataCrypt Labs - System Tester v2.0")
    print("Validando sistema modular...")
    print()
    
    # Verificar que el servidor esté corriendo
    print("🔍 Verificando servidor...")
    tester = SystemTester()
    
    try:
        response = requests.get("http://localhost:8000/status", timeout=3)
        if response.status_code == 200:
            print("✅ Servidor detectado en http://localhost:8000")
        else:
            print("❌ Servidor no responde correctamente")
            return
    except:
        print("❌ Servidor no detectado en http://localhost:8000")
        print("💡 Asegúrate de que el servidor esté corriendo:")
        print("   python backend/main_new.py")
        return
    
    print()
    
    # Ejecutar tests
    success = tester.run_all_tests()
    
    if success:
        print("\n🏆 SISTEMA MODULAR VALIDADO EXITOSAMENTE")
        print("🚀 Listo para producción!")
    else:
        print("\n🔧 SISTEMA REQUIERE AJUSTES")
        print("📋 Revisar errores en test_results.json")

if __name__ == "__main__":
    main()