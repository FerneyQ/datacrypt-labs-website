#!/usr/bin/env python3
"""
🧪 Testing Web Directo - Filosofía Mejora Continua
Pruebas rápidas en entorno web sin interferir con el servidor
"""

import requests
import json
import time
from datetime import datetime

def test_web_environment():
    """Testing directo del entorno web"""
    print("🧪 DATACRYPT LABS - TESTING WEB DIRECTO")
    print("🔄 Filosofía de Mejora Continua - Ciclo PDCA")
    print("=" * 60)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    results = []
    
    # Test 1: Health Check
    print("\n🔄 PLANIFICAR - Test 1: Health Check")
    try:
        start_time = time.time()
        response = requests.get(f"{base_url}/health", timeout=10)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {response.status_code}")
            print(f"   📊 Status: {data.get('status')}")
            print(f"   ⏱️ Tiempo: {duration:.3f}s")
            results.append({"test": "health_check", "status": "PASS", "duration": duration})
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            results.append({"test": "health_check", "status": "FAIL", "code": response.status_code})
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        results.append({"test": "health_check", "status": "FAIL", "error": str(e)})
    
    # Test 2: Game APIs
    print("\n🔄 HACER - Test 2: Game Stats API")
    try:
        start_time = time.time()
        response = requests.get(f"{base_url}/api/game/stats", timeout=10)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Game Stats: {response.status_code}")
            print(f"   📊 Data keys: {list(data.keys())}")
            print(f"   ⏱️ Tiempo: {duration:.3f}s")
            results.append({"test": "game_stats", "status": "PASS", "duration": duration})
        else:
            print(f"❌ Game Stats Failed: {response.status_code}")
            results.append({"test": "game_stats", "status": "FAIL", "code": response.status_code})
    except Exception as e:
        print(f"❌ Game Stats Error: {e}")
        results.append({"test": "game_stats", "status": "FAIL", "error": str(e)})
    
    # Test 3: Leaderboard
    print("\n🔄 HACER - Test 3: Leaderboard API")
    try:
        start_time = time.time()
        response = requests.get(f"{base_url}/api/game/leaderboard", timeout=10)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Leaderboard: {response.status_code}")
            print(f"   📊 Total players: {data.get('total_players', 0)}")
            print(f"   ⏱️ Tiempo: {duration:.3f}s")
            results.append({"test": "leaderboard", "status": "PASS", "duration": duration})
        else:
            print(f"❌ Leaderboard Failed: {response.status_code}")
            results.append({"test": "leaderboard", "status": "FAIL", "code": response.status_code})
    except Exception as e:
        print(f"❌ Leaderboard Error: {e}")
        results.append({"test": "leaderboard", "status": "FAIL", "error": str(e)})
    
    # Test 4: Documentation
    print("\n🔄 VERIFICAR - Test 4: API Documentation")
    try:
        start_time = time.time()
        response = requests.get(f"{base_url}/docs", timeout=10)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            print(f"✅ API Docs: {response.status_code}")
            print(f"   📚 Documentation accessible")
            print(f"   ⏱️ Tiempo: {duration:.3f}s")
            results.append({"test": "api_docs", "status": "PASS", "duration": duration})
        else:
            print(f"❌ API Docs Failed: {response.status_code}")
            results.append({"test": "api_docs", "status": "FAIL", "code": response.status_code})
    except Exception as e:
        print(f"❌ API Docs Error: {e}")
        results.append({"test": "api_docs", "status": "FAIL", "error": str(e)})
    
    # Test 5: Score Submission (Integration Test)
    print("\n🔄 VERIFICAR - Test 5: Score Submission")
    try:
        test_score = {
            "player_name": "TestUser_DirectWeb",
            "score": 1500,
            "level_reached": 6,
            "time_played": 200,
            "data_points": 12
        }
        
        start_time = time.time()
        response = requests.post(f"{base_url}/api/game/score", json=test_score, timeout=10)
        duration = time.time() - start_time
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Score Submission: {response.status_code}")
            print(f"   📊 Score ID: {data.get('id')}")
            print(f"   🏆 Status: {data.get('status')}")
            print(f"   ⏱️ Tiempo: {duration:.3f}s")
            results.append({"test": "score_submission", "status": "PASS", "duration": duration})
        else:
            print(f"❌ Score Submission Failed: {response.status_code}")
            results.append({"test": "score_submission", "status": "FAIL", "code": response.status_code})
    except Exception as e:
        print(f"❌ Score Submission Error: {e}")
        results.append({"test": "score_submission", "status": "FAIL", "error": str(e)})
    
    # Análisis Final PDCA
    print("\n🔄 ACTUAR - Análisis Final")
    passed = len([r for r in results if r["status"] == "PASS"])
    total = len(results)
    success_rate = (passed / total * 100) if total > 0 else 0
    
    print("=" * 60)
    print("📊 REPORTE FINAL - MEJORA CONTINUA")
    print("=" * 60)
    print(f"🧪 Total pruebas: {total}")
    print(f"✅ Exitosas: {passed}")
    print(f"❌ Fallidas: {total - passed}")
    print(f"📈 Tasa éxito: {success_rate:.1f}%")
    
    if success_rate >= 90:
        print("🎉 CALIDAD: EXCELENTE - Sistema listo para producción")
    elif success_rate >= 75:
        print("✅ CALIDAD: BUENA - Listo para deploy")
    elif success_rate >= 50:
        print("⚠️  CALIDAD: REGULAR - Mejoras necesarias")
    else:
        print("❌ CALIDAD: CRÍTICA - Revisión requerida")
    
    # Guardar resultados
    report = {
        "timestamp": datetime.now().isoformat(),
        "methodology": "PDCA Continuous Improvement",
        "total_tests": total,
        "passed_tests": passed,
        "success_rate": success_rate,
        "results": results
    }
    
    with open("direct_web_test_results.json", "w") as f:
        json.dump(report, f, indent=2)
    
    print("\n📄 Resultados guardados en: direct_web_test_results.json")
    
    print("\n🔄 PRÓXIMOS PASOS PDCA:")
    if success_rate >= 90:
        print("   📈 PLANIFICAR: Monitoreo continuo")
        print("   🚀 HACER: Deploy a producción")
        print("   ✅ VERIFICAR: Testing en vivo")
        print("   📊 ACTUAR: Optimización continua")
    else:
        print("   🔧 PLANIFICAR: Analizar fallos")
        print("   🛠️  HACER: Implementar mejoras")
        print("   ✅ VERIFICAR: Re-ejecutar tests")
        print("   📈 ACTUAR: Documentar mejoras")

if __name__ == "__main__":
    test_web_environment()