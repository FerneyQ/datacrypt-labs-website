#!/usr/bin/env python3
"""
🚀 DataCrypt Labs - Verificación Final de Deployment
Script de verificación completa antes del deployment en producción
"""

import os
import json
import hashlib
from pathlib import Path
from datetime import datetime

class DeploymentVerifier:
    def __init__(self, base_path="."):
        self.base_path = Path(base_path)
        self.critical_files = [
            "index.html",
            "src/components/DataCryptChatbot.js", 
            "src/security/DataCryptSecurity.js",
            "src/utils/ConfigManager.js",
            ".htaccess",
            "manifest.json",
            "sw.js",
            "robots.txt",
            "sitemap.xml"
        ]
        self.verification_results = {}
        
    def verify_file_integrity(self):
        """Verificar integridad de archivos críticos"""
        print("🔍 VERIFICANDO INTEGRIDAD DE ARCHIVOS CRÍTICOS")
        print("-" * 60)
        
        missing_files = []
        corrupted_files = []
        verified_files = []
        
        for file_path in self.critical_files:
            full_path = self.base_path / file_path
            
            if not full_path.exists():
                missing_files.append(file_path)
                print(f"❌ FALTA: {file_path}")
                continue
                
            # Verificar que el archivo no esté vacío y tenga contenido válido
            try:
                try:
                    content = full_path.read_text(encoding='utf-8')
                except UnicodeDecodeError:
                    content = full_path.read_text(encoding='utf-8', errors='ignore')
                if len(content) < 10:  # Muy pequeño, posiblemente corrupto
                    corrupted_files.append(file_path)
                    print(f"⚠️ SOSPECHOSO: {file_path} (muy pequeño)")
                else:
                    file_hash = hashlib.md5(content.encode()).hexdigest()
                    verified_files.append({
                        "file": file_path,
                        "size": len(content),
                        "hash": file_hash[:8]
                    })
                    print(f"✅ OK: {file_path} ({len(content)} bytes)")
                    
            except Exception as e:
                corrupted_files.append(file_path)
                print(f"❌ ERROR: {file_path} - {str(e)}")
        
        self.verification_results["file_integrity"] = {
            "verified": len(verified_files),
            "missing": len(missing_files),
            "corrupted": len(corrupted_files),
            "total": len(self.critical_files),
            "files": verified_files,
            "missing_files": missing_files,
            "corrupted_files": corrupted_files
        }
        
        return len(missing_files) == 0 and len(corrupted_files) == 0

    def verify_security_configuration(self):
        """Verificar configuraciones de seguridad"""
        print("\n🛡️ VERIFICANDO CONFIGURACIÓN DE SEGURIDAD")
        print("-" * 60)
        
        security_checks = {}
        
        # Verificar .htaccess
        htaccess_path = self.base_path / ".htaccess"
        if htaccess_path.exists():
            content = htaccess_path.read_text()
            security_features = {
                "X-Frame-Options": "X-Frame-Options" in content,
                "X-Content-Type-Options": "X-Content-Type-Options" in content,
                "X-XSS-Protection": "X-XSS-Protection" in content,
                "Content-Security-Policy": "Content-Security-Policy" in content,
                "HSTS": "Strict-Transport-Security" in content,
                "Rate_Limiting": "mod_evasive" in content or "DOSPageCount" in content
            }
            
            for feature, enabled in security_features.items():
                status = "✅" if enabled else "❌"
                print(f"{status} {feature}: {'ENABLED' if enabled else 'DISABLED'}")
                
            security_checks["htaccess"] = security_features
        else:
            print("❌ .htaccess no encontrado")
            security_checks["htaccess"] = False
        
        # Verificar DataCryptSecurity.js
        security_js_path = self.base_path / "src/security/DataCryptSecurity.js"
        if security_js_path.exists():
            content = security_js_path.read_text()
            js_features = {
                "SecurityMonitor": "SecurityMonitor" in content,
                "AntiBot": "AntiBot" in content,
                "SecurityValidator": "SecurityValidator" in content,
                "SecurityBackup": "SecurityBackup" in content,
                "RateLimit": "rateLimiting" in content or "RateLimit" in content
            }
            
            for feature, enabled in js_features.items():
                status = "✅" if enabled else "❌"
                print(f"{status} JS {feature}: {'PRESENT' if enabled else 'MISSING'}")
                
            security_checks["javascript_security"] = js_features
        else:
            print("❌ DataCryptSecurity.js no encontrado")
            security_checks["javascript_security"] = False
            
        self.verification_results["security"] = security_checks
        
        # Calcular puntuación de seguridad
        total_checks = 0
        passed_checks = 0
        
        if isinstance(security_checks.get("htaccess"), dict):
            total_checks += len(security_checks["htaccess"])
            passed_checks += sum(security_checks["htaccess"].values())
            
        if isinstance(security_checks.get("javascript_security"), dict):
            total_checks += len(security_checks["javascript_security"])
            passed_checks += sum(security_checks["javascript_security"].values())
            
        security_score = (passed_checks / total_checks * 100) if total_checks > 0 else 0
        print(f"\n🏅 PUNTUACIÓN DE SEGURIDAD: {security_score:.1f}% ({passed_checks}/{total_checks})")
        
        return security_score >= 80

    def verify_chatbot_configuration(self):
        """Verificar configuración del chatbot"""
        print("\n🤖 VERIFICANDO CHATBOT GITHUB COPILOT")
        print("-" * 60)
        
        chatbot_path = self.base_path / "src/components/DataCryptChatbot.js"
        if not chatbot_path.exists():
            print("❌ DataCryptChatbot.js no encontrado")
            return False
            
        try:
            content = chatbot_path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            try:
                content = chatbot_path.read_text(encoding='latin1')
            except Exception:
                content = chatbot_path.read_text(encoding='utf-8', errors='ignore')
        
        chatbot_features = {
            "GitHub_Copilot_Identity": "GitHub Copilot" in content,
            "Anti_Loop_Protection": "isProcessingMessage" in content,
            "Singleton_Pattern": "DataCryptChatbot.instance" in content,
            "Error_Handling": "try {" in content and "catch (error)" in content,
            "Security_Integration": "this.security" in content,
            "Destroy_Method": "destroy()" in content,
            "Rate_Limiting": "rateLimiter" in content,
            "XSS_Protection": "sanitize" in content or "validate" in content
        }
        
        for feature, enabled in chatbot_features.items():
            status = "✅" if enabled else "❌"
            print(f"{status} {feature.replace('_', ' ')}: {'IMPLEMENTED' if enabled else 'MISSING'}")
        
        # Verificar página de diagnóstico
        diagnostic_path = self.base_path / "diagnostico_chatbot.html"
        diagnostic_available = diagnostic_path.exists()
        status = "✅" if diagnostic_available else "❌"
        print(f"{status} Diagnostic Page: {'AVAILABLE' if diagnostic_available else 'MISSING'}")
        
        chatbot_score = sum(chatbot_features.values()) / len(chatbot_features) * 100
        print(f"\n🏅 PUNTUACIÓN CHATBOT: {chatbot_score:.1f}%")
        
        self.verification_results["chatbot"] = {
            "features": chatbot_features,
            "diagnostic_page": diagnostic_available,
            "score": chatbot_score
        }
        
        return chatbot_score >= 85

    def verify_web_structure(self):
        """Verificar estructura web completa"""
        print("\n🌐 VERIFICANDO ESTRUCTURA WEB")
        print("-" * 60)
        
        required_pages = [
            "index.html",
            "certificaciones.html", 
            "portafolio.html",
            "servicios.html"
        ]
        
        optional_pages = [
            "diagnostico_chatbot.html",
            "about.html",
            "contact.html"
        ]
        
        seo_files = [
            "robots.txt",
            "sitemap.xml",
            "manifest.json"
        ]
        
        page_status = {}
        
        # Verificar páginas requeridas
        print("📄 Páginas Principales:")
        for page in required_pages:
            exists = (self.base_path / page).exists()
            status = "✅" if exists else "❌"
            print(f"  {status} {page}")
            page_status[page] = exists
        
        # Verificar páginas opcionales
        print("\n📄 Páginas Adicionales:")
        for page in optional_pages:
            exists = (self.base_path / page).exists()
            status = "✅" if exists else "⚪"
            print(f"  {status} {page}")
            page_status[page] = exists
            
        # Verificar archivos SEO
        print("\n🔍 Archivos SEO:")
        seo_status = {}
        for file in seo_files:
            exists = (self.base_path / file).exists()
            status = "✅" if exists else "❌"
            print(f"  {status} {file}")
            seo_status[file] = exists
        
        required_score = sum(page_status[p] for p in required_pages) / len(required_pages) * 100
        seo_score = sum(seo_status.values()) / len(seo_status) * 100
        
        print(f"\n🏅 PÁGINAS PRINCIPALES: {required_score:.1f}%")
        print(f"🏅 SEO FILES: {seo_score:.1f}%")
        
        self.verification_results["web_structure"] = {
            "pages": page_status,
            "seo": seo_status,
            "required_score": required_score,
            "seo_score": seo_score
        }
        
        return required_score >= 100 and seo_score >= 80

    def generate_deployment_report(self):
        """Generar reporte final de deployment"""
        print("\n" + "="*80)
        print("📊 REPORTE FINAL DE VERIFICACIÓN DE DEPLOYMENT")
        print("="*80)
        
        # Calcular puntuación general
        scores = []
        
        # File Integrity Score
        file_results = self.verification_results.get("file_integrity", {})
        file_score = (file_results.get("verified", 0) / file_results.get("total", 1)) * 100
        scores.append(("Integridad de Archivos", file_score))
        
        # Security Score  
        security_results = self.verification_results.get("security", {})
        if isinstance(security_results.get("htaccess"), dict) and isinstance(security_results.get("javascript_security"), dict):
            htaccess_score = sum(security_results["htaccess"].values()) / len(security_results["htaccess"]) * 100
            js_score = sum(security_results["javascript_security"].values()) / len(security_results["javascript_security"]) * 100
            security_score = (htaccess_score + js_score) / 2
        else:
            security_score = 0
        scores.append(("Seguridad", security_score))
        
        # Chatbot Score
        chatbot_results = self.verification_results.get("chatbot", {})
        chatbot_score = chatbot_results.get("score", 0)
        scores.append(("Chatbot", chatbot_score))
        
        # Web Structure Score
        web_results = self.verification_results.get("web_structure", {})
        web_score = (web_results.get("required_score", 0) + web_results.get("seo_score", 0)) / 2
        scores.append(("Estructura Web", web_score))
        
        # Overall Score
        overall_score = sum(score for _, score in scores) / len(scores)
        
        print(f"🎯 PUNTUACIÓN GENERAL: {overall_score:.1f}/100")
        print()
        
        for category, score in scores:
            if score >= 90:
                status = "🏆 EXCELENTE"
            elif score >= 80:
                status = "✅ BUENO"
            elif score >= 70:
                status = "⚠️ ACEPTABLE"
            else:
                status = "❌ CRÍTICO"
            print(f"{status} {category}: {score:.1f}%")
        
        # Determinar estado de deployment
        if overall_score >= 90:
            deployment_status = "🏆 LISTO PARA PRODUCCIÓN"
            exit_code = 0
        elif overall_score >= 80:
            deployment_status = "✅ APTO PARA DEPLOYMENT"
            exit_code = 0
        elif overall_score >= 70:
            deployment_status = "⚠️ DEPLOYMENT CON PRECAUCIÓN"
            exit_code = 1
        else:
            deployment_status = "❌ NO APTO PARA DEPLOYMENT"
            exit_code = 2
        
        print(f"\n🎖️ ESTADO: {deployment_status}")
        
        # Generar archivo de verificación
        verification_data = {
            "timestamp": datetime.now().isoformat(),
            "overall_score": round(overall_score, 1),
            "category_scores": {category: round(score, 1) for category, score in scores},
            "deployment_status": deployment_status,
            "detailed_results": self.verification_results,
            "exit_code": exit_code
        }
        
        report_file = f"deployment_verification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(verification_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Reporte de verificación guardado: {report_file}")
        print(f"⏱️ Verificación completada: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return exit_code

    def run_full_verification(self):
        """Ejecutar verificación completa"""
        print("🚀 DATACRYPT LABS - VERIFICACIÓN FINAL DE DEPLOYMENT")
        print("🔄 Filosofía de Mejora Continua - Validación Pre-Producción")
        print("=" * 80)
        print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📁 Directorio: {self.base_path.absolute()}")
        print("=" * 80)
        
        # Ejecutar todas las verificaciones
        file_integrity_ok = self.verify_file_integrity()
        security_ok = self.verify_security_configuration()
        chatbot_ok = self.verify_chatbot_configuration()
        structure_ok = self.verify_web_structure()
        
        # Generar reporte final
        exit_code = self.generate_deployment_report()
        
        return exit_code

def main():
    """Función principal"""
    import sys
    
    base_path = sys.argv[1] if len(sys.argv) > 1 else "."
    
    verifier = DeploymentVerifier(base_path)
    exit_code = verifier.run_full_verification()
    
    sys.exit(exit_code)

if __name__ == "__main__":
    main()