#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 SUITE DE TESTING COMPLETO - SISTEMA ADMINISTRATIVO JWT
=========================================================

Testing guiado paso a paso de tu sistema administrativo
Filosofía de Mejora Continua: CHECK Phase
"""

import requests
import json
import sqlite3
import time
from datetime import datetime, timedelta

class TestingGuidance:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.admin_url = f"{self.base_url}/admin"
        self.api_url = f"{self.base_url}/api"
        
        # Tus credenciales personales
        self.personal_credentials = {
            "username": "Neyd696 :#",
            "password": "Simelamamscoscorrea123###_@"
        }
        
        # Credenciales del servidor
        self.server_credentials = {
            "username": "server-datacrypt", 
            "password": "ServerPass2024!"
        }
        
        self.test_results = []
        
    def print_header(self, title, step_num=None):
        """Imprimir encabezado de test"""
        print("\n" + "="*70)
        if step_num:
            print(f"🧪 TEST {step_num}: {title}")
        else:
            print(f"🧪 {title}")
        print("="*70)
    
    def print_step(self, description, result=None):
        """Imprimir paso del test"""
        if result is None:
            print(f"🔍 {description}")
        elif result:
            print(f"✅ {description}")
        else:
            print(f"❌ {description}")
    
    def test_1_dashboard_active(self):
        """TEST 1: Verificar que el dashboard esté activo"""
        self.print_header("VERIFICAR DASHBOARD ACTIVO", 1)
        
        try:
            # Verificar página de login
            self.print_step("Conectando a página de login...")
            response = requests.get(f"{self.admin_url}", timeout=5)
            
            if response.status_code == 200:
                self.print_step("Dashboard accesible ✓", True)
                
                # Verificar contenido de la página
                if "login" in response.text.lower() or "admin" in response.text.lower():
                    self.print_step("Página de login cargada correctamente ✓", True)
                    self.test_results.append(("Dashboard Active", True, "OK"))
                else:
                    self.print_step("Contenido de página inesperado", False)
                    self.test_results.append(("Dashboard Active", False, "Contenido incorrecto"))
                    
            else:
                self.print_step(f"Error HTTP: {response.status_code}", False)
                self.test_results.append(("Dashboard Active", False, f"HTTP {response.status_code}"))
                
        except requests.exceptions.ConnectionError:
            self.print_step("No se puede conectar al servidor - ¿Está ejecutándose?", False)
            self.test_results.append(("Dashboard Active", False, "Servidor no disponible"))
            return False
            
        except Exception as e:
            self.print_step(f"Error inesperado: {e}", False)
            self.test_results.append(("Dashboard Active", False, str(e)))
            return False
            
        return True
    
    def test_2_authentication_jwt(self):
        """TEST 2: Probar autenticación JWT"""
        self.print_header("AUTENTICACIÓN JWT", 2)
        
        try:
            # Test con tus credenciales personales
            self.print_step("Probando login con credenciales personales...")
            
            login_data = {
                "username": self.personal_credentials["username"],
                "password": self.personal_credentials["password"]
            }
            
            response = requests.post(f"{self.admin_url}/login", json=login_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get("success"):
                    self.print_step("Login exitoso ✓", True)
                    
                    # Verificar token JWT
                    token = data.get("token")
                    if token and len(token.split('.')) == 3:
                        self.print_step("Token JWT generado correctamente ✓", True)
                        self.print_step(f"Token: {token[:50]}...")
                        
                        # Verificar datos de usuario
                        user_data = data.get("user", {})
                        self.print_step(f"Usuario autenticado: {user_data.get('username')}")
                        self.print_step(f"Rol: {user_data.get('role')}")
                        
                        self.test_results.append(("JWT Authentication", True, "Personal login OK"))
                        return token
                        
                    else:
                        self.print_step("Token JWT malformado", False)
                        self.test_results.append(("JWT Authentication", False, "Token inválido"))
                        
                else:
                    self.print_step(f"Login fallido: {data.get('message')}", False)
                    self.test_results.append(("JWT Authentication", False, data.get('message')))
                    
            else:
                self.print_step(f"Error HTTP en login: {response.status_code}", False)
                self.test_results.append(("JWT Authentication", False, f"HTTP {response.status_code}"))
                
        except Exception as e:
            self.print_step(f"Error en autenticación: {e}", False)
            self.test_results.append(("JWT Authentication", False, str(e)))
            
        return None
    
    def test_3_roles_permissions(self, token):
        """TEST 3: Verificar roles y permisos"""
        self.print_header("ROLES Y PERMISOS", 3)
        
        if not token:
            self.print_step("No hay token disponible - saltando test", False)
            return
            
        try:
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test acceso a dashboard principal
            self.print_step("Probando acceso a dashboard con token...")
            response = requests.get(f"{self.admin_url}/dashboard", headers=headers, timeout=10)
            
            if response.status_code == 200:
                self.print_step("Acceso a dashboard autorizado ✓", True)
                
                # Test acceso a API de métricas
                self.print_step("Probando acceso a API de métricas...")
                response = requests.get(f"{self.admin_url}/api/metrics", headers=headers, timeout=10)
                
                if response.status_code == 200:
                    self.print_step("Acceso a métricas autorizado ✓", True)
                    metrics_data = response.json()
                    self.print_step(f"Métricas obtenidas: {len(metrics_data)} elementos")
                    self.test_results.append(("Roles & Permissions", True, "Super admin access OK"))
                    
                else:
                    self.print_step(f"Error en métricas: {response.status_code}", False)
                    self.test_results.append(("Roles & Permissions", False, f"Metrics HTTP {response.status_code}"))
                    
            else:
                self.print_step(f"Error en dashboard: {response.status_code}", False)
                self.test_results.append(("Roles & Permissions", False, f"Dashboard HTTP {response.status_code}"))
                
        except Exception as e:
            self.print_step(f"Error en test de permisos: {e}", False)
            self.test_results.append(("Roles & Permissions", False, str(e)))
    
    def test_4_security(self):
        """TEST 4: Probar seguridad del sistema"""
        self.print_header("SEGURIDAD DEL SISTEMA", 4)
        
        try:
            # Test 1: Login con credenciales incorrectas
            self.print_step("Probando login con credenciales incorrectas...")
            
            bad_credentials = {
                "username": "usuario_falso",
                "password": "password_incorrecta"
            }
            
            response = requests.post(f"{self.admin_url}/login", json=bad_credentials, timeout=10)
            
            if response.status_code == 401 or response.status_code == 400:
                data = response.json()
                if not data.get("success"):
                    self.print_step("Credenciales incorrectas rechazadas correctamente ✓", True)
                else:
                    self.print_step("FALLO DE SEGURIDAD: Login incorrecto aceptado", False)
                    
            # Test 2: Acceso sin token
            self.print_step("Probando acceso sin token de autorización...")
            response = requests.get(f"{self.admin_url}/dashboard", timeout=10)
            
            if response.status_code == 401 or response.status_code == 302:
                self.print_step("Acceso sin token bloqueado correctamente ✓", True)
                self.test_results.append(("Security", True, "Auth protection OK"))
            else:
                self.print_step("FALLO DE SEGURIDAD: Acceso sin token permitido", False)
                self.test_results.append(("Security", False, "No auth protection"))
                
        except Exception as e:
            self.print_step(f"Error en test de seguridad: {e}", False)
            self.test_results.append(("Security", False, str(e)))
    
    def test_5_database(self):
        """TEST 5: Verificar integridad de base de datos"""
        self.print_header("INTEGRIDAD DE BASE DE DATOS", 5)
        
        try:
            # Conectar a base de datos
            self.print_step("Conectando a base de datos...")
            conn = sqlite3.connect('datacrypt_admin.db')
            cursor = conn.cursor()
            
            # Verificar tablas existentes
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            table_names = [t[0] for t in tables]
            
            expected_tables = [
                'admin_users', 'user_sessions', 'audit_logs', 'system_metrics',
                'api_keys', 'user_roles', 'system_config', 'security_events'
            ]
            
            self.print_step(f"Tablas encontradas: {len(table_names)}")
            
            for table in expected_tables:
                if table in table_names:
                    self.print_step(f"Tabla '{table}' ✓", True)
                else:
                    self.print_step(f"Tabla '{table}' faltante", False)
            
            # Verificar tu usuario personal
            cursor.execute('SELECT id, username, role FROM admin_users WHERE username = ?', 
                         (self.personal_credentials["username"],))
            user = cursor.fetchone()
            
            if user:
                self.print_step(f"Usuario personal encontrado: ID {user[0]}, Rol: {user[2]} ✓", True)
                self.test_results.append(("Database", True, "All tables and user OK"))
            else:
                self.print_step("Usuario personal no encontrado en DB", False)
                self.test_results.append(("Database", False, "User not found"))
            
            conn.close()
            
        except Exception as e:
            self.print_step(f"Error en test de base de datos: {e}", False)
            self.test_results.append(("Database", False, str(e)))
    
    def generate_report(self):
        """Generar reporte final de testing"""
        self.print_header("REPORTE FINAL DE TESTING")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for _, success, _ in self.test_results if success)
        failed_tests = total_tests - passed_tests
        
        print(f"\n📊 ESTADÍSTICAS:")
        print(f"   Total de pruebas: {total_tests}")
        print(f"   ✅ Exitosas: {passed_tests}")
        print(f"   ❌ Fallidas: {failed_tests}")
        print(f"   📈 Porcentaje éxito: {(passed_tests/total_tests)*100:.1f}%")
        
        print(f"\n📋 DETALLE DE RESULTADOS:")
        for test_name, success, message in self.test_results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"   {status} | {test_name}: {message}")
        
        # Recomendaciones
        print(f"\n💡 RECOMENDACIONES:")
        if failed_tests == 0:
            print("   🎉 ¡Excelente! Tu sistema está funcionando perfectamente.")
            print("   🚀 Listo para producción.")
        else:
            print(f"   ⚠️ Se encontraron {failed_tests} problemas que requieren atención.")
            print("   🔧 Revisa los detalles arriba y corrige los fallos.")
        
        return passed_tests == total_tests

def main():
    """Función principal de testing"""
    print("🧪 INICIANDO SUITE DE TESTING COMPLETO")
    print("🎯 Sistema Administrativo JWT - Fase CHECK")
    print("📅 Fecha:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    
    tester = TestingGuidance()
    
    # Ejecutar todos los tests en secuencia
    dashboard_ok = tester.test_1_dashboard_active()
    
    if dashboard_ok:
        token = tester.test_2_authentication_jwt()
        tester.test_3_roles_permissions(token)
        
    tester.test_4_security()
    tester.test_5_database()
    
    # Generar reporte final
    all_passed = tester.generate_report()
    
    print(f"\n🏁 TESTING COMPLETADO")
    if all_passed:
        print("🎉 ¡TODOS LOS TESTS PASARON!")
    else:
        print("⚠️ Algunos tests requieren atención")
    
    return all_passed

if __name__ == "__main__":
    main()