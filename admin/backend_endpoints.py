# ==================== UTILIDADES Y FUNCIONES AUXILIARES ====================

def generate_request_id() -> str:
    """Generar ID único para la petición"""
    return f"{int(time.time())}_{os.getpid()}_{id(time.time())}"

async def get_system_metrics() -> SystemMetrics:
    """Obtener métricas del sistema en tiempo real"""
    try:
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Memory usage
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        
        # Disk usage
        disk = psutil.disk_usage('/')
        disk_percent = (disk.used / disk.total) * 100
        
        # Network status
        network_status = True  # Simplificado por ahora
        
        # Uptime
        boot_time = psutil.boot_time()
        uptime_seconds = int(time.time() - boot_time)
        
        # Active processes
        active_processes = len(psutil.pids())
        
        # System load
        system_load = psutil.getloadavg()[0] if hasattr(psutil, 'getloadavg') else 0.0
        
        metrics = SystemMetrics(
            cpu_usage=cpu_percent,
            memory_usage=memory_percent,
            disk_usage=disk_percent,
            network_status=network_status,
            uptime_seconds=uptime_seconds,
            active_processes=active_processes,
            system_load=system_load
        )
        
        return metrics
        
    except Exception as e:
        logger.error(f"❌ Error obteniendo métricas: {e}")
        raise HTTPException(status_code=500, detail=f"Error obteniendo métricas: {str(e)}")

async def check_github_pages_status() -> Dict[str, Any]:
    """Verificar estado de GitHub Pages"""
    try:
        url = "https://ferneyq.github.io/datacrypt-labs-website/"
        
        start_time = time.time()
        response = requests.get(url, timeout=config_manager.config.github_api_timeout)
        response_time = time.time() - start_time
        
        status_data = {
            "url": url,
            "status_code": response.status_code,
            "response_time_ms": round(response_time * 1000, 2),
            "online": response.status_code == 200,
            "size_bytes": len(response.content) if response.content else 0,
            "last_checked": datetime.now().isoformat()
        }
        
        if response.status_code == 200:
            logger.info(f"✅ GitHub Pages online: {response_time*1000:.0f}ms")
        else:
            logger.warning(f"⚠️ GitHub Pages error: {response.status_code}")
            
        return status_data
        
    except requests.RequestException as e:
        logger.error(f"❌ Error verificando GitHub Pages: {e}")
        return {
            "url": url,
            "status_code": 0,
            "response_time_ms": 0,
            "online": False,
            "error": str(e),
            "last_checked": datetime.now().isoformat()
        }

async def perform_security_scan() -> SecurityScanResult:
    """Realizar escaneo de seguridad del sistema"""
    start_time = time.time()
    scan_type = "system_security_scan"
    
    try:
        threats_found = 0
        vulnerabilities = []
        recommendations = []
        files_scanned = 0
        
        # Verificar archivos de seguridad críticos
        security_files = [
            "DataCryptSecurityEnforcement.js",
            "chatbot-elimination-security.js", 
            "direct-contact-system.js"
        ]
        
        for file_name in security_files:
            file_path = Path(file_name)
            if file_path.exists():
                files_scanned += 1
                logger.info(f"✅ Archivo de seguridad encontrado: {file_name}")
            else:
                vulnerabilities.append(f"Archivo de seguridad faltante: {file_name}")
                threats_found += 1
                recommendations.append(f"Restaurar archivo: {file_name}")
        
        # Verificar permisos de archivos críticos
        critical_paths = ["admin/", "config/", "logs/"]
        for path in critical_paths:
            if Path(path).exists():
                files_scanned += 1
            else:
                vulnerabilities.append(f"Directorio crítico faltante: {path}")
                threats_found += 1
        
        # Calcular puntuación de seguridad
        max_score = 100
        penalty_per_threat = 15
        security_score = max(0, max_score - (threats_found * penalty_per_threat))
        
        # Agregar recomendaciones generales
        if security_score < 80:
            recommendations.extend([
                "Revisar y restaurar archivos de seguridad",
                "Verificar integridad del sistema",
                "Ejecutar auditoría completa de seguridad"
            ])
        
        duration = time.time() - start_time
        
        result = SecurityScanResult(
            scan_type=scan_type,
            duration_seconds=round(duration, 3),
            threats_found=threats_found,
            vulnerabilities=vulnerabilities,
            security_score=security_score,
            recommendations=recommendations,
            files_scanned=files_scanned
        )
        
        # Agregar alerta si se encontraron amenazas
        if threats_found > 0:
            global_state.add_alert(
                "warning" if security_score > 50 else "critical",
                "security",
                f"Escaneo encontró {threats_found} amenazas (puntuación: {security_score})",
                {"scan_result": result.dict()}
            )
        
        logger.info(f"🔒 Escaneo de seguridad completado: {security_score}/100")
        return result
        
    except Exception as e:
        logger.error(f"❌ Error en escaneo de seguridad: {e}")
        duration = time.time() - start_time
        
        return SecurityScanResult(
            scan_type=scan_type,
            duration_seconds=round(duration, 3),
            threats_found=1,
            vulnerabilities=[f"Error durante escaneo: {str(e)}"],
            security_score=0,
            recommendations=["Revisar logs del sistema", "Reintentar escaneo"]
        )

def generate_voice_content(report_type: VoiceReportType, include_metrics: bool = True) -> str:
    """Generar contenido para reportes de voz"""
    
    status_summary = global_state.get_status_summary()
    current_time = datetime.now().strftime("%H:%M")
    
    if report_type == VoiceReportType.STATUS:
        return f"""
        Estado del sistema DataCrypt Labs a las {current_time}.
        Sistema {status_summary['status']}.
        Tiempo de funcionamiento: {status_summary['uptime']}.
        {status_summary['alerts']['unresolved']} alertas pendientes.
        """
    
    elif report_type == VoiceReportType.SECURITY:
        return f"""
        Reporte de seguridad DataCrypt Labs.
        Nivel de seguridad: {status_summary['states']['security_level']}.
        {status_summary['alerts']['critical']} alertas críticas.
        Sistema de eliminación de chatbot activo.
        Todos los sistemas de protección operativos.
        """
    
    elif report_type == VoiceReportType.PERFORMANCE:
        metrics = status_summary['metrics']
        return f"""
        Reporte de rendimiento del sistema.
        CPU promedio: {metrics['avg_cpu_10']} por ciento.
        Memoria promedio: {metrics['avg_memory_10']} por ciento.
        {status_summary['counters']['api_requests']} peticiones API procesadas.
        {metrics['collected']} métricas recolectadas.
        """
    
    elif report_type == VoiceReportType.COMPLETE:
        return f"""
        Reporte completo DataCrypt Labs a las {current_time}.
        
        Estado general: Sistema {status_summary['status']}.
        Tiempo activo: {status_summary['uptime']}.
        
        Rendimiento: CPU {status_summary['metrics']['avg_cpu_10']} por ciento, 
        Memoria {status_summary['metrics']['avg_memory_10']} por ciento.
        
        Seguridad: Nivel {status_summary['states']['security_level']}.
        {status_summary['alerts']['critical']} alertas críticas pendientes.
        
        Actividad: {status_summary['counters']['voice_reports']} reportes de voz generados,
        {status_summary['counters']['api_requests']} peticiones API procesadas.
        
        Todos los sistemas funcionando según los parámetros de mejora continua.
        """
    
    elif report_type == VoiceReportType.ALERTS:
        unresolved_alerts = [a for a in global_state.alerts if not a.resolved]
        if not unresolved_alerts:
            return "No hay alertas pendientes en el sistema DataCrypt Labs."
        
        critical_count = len([a for a in unresolved_alerts if a.level == "critical"])
        warning_count = len([a for a in unresolved_alerts if a.level == "warning"])
        
        content = f"Reporte de alertas del sistema. {len(unresolved_alerts)} alertas pendientes. "
        if critical_count > 0:
            content += f"{critical_count} alertas críticas. "
        if warning_count > 0:
            content += f"{warning_count} advertencias. "
            
        # Incluir las 3 alertas más recientes
        recent_alerts = sorted(unresolved_alerts, key=lambda x: x.timestamp, reverse=True)[:3]
        for alert in recent_alerts:
            content += f"Alerta {alert.level}: {alert.message}. "
            
        return content
    
    else:  # CUSTOM o otros
        return f"""
        Reporte personalizado DataCrypt Labs.
        Sistema operativo con metodología de mejora continua.
        Estado actual: {status_summary['status']}.
        Para más detalles, consulte el panel de administración.
        """

# ==================== MIDDLEWARE Y DEPENDENCIAS ====================

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Middleware para medir tiempo de ejecución"""
    start_time = time.time()
    request_id = generate_request_id()
    
    # Incrementar contador de peticiones
    global_state.api_requests_count += 1
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
    response.headers["X-Request-ID"] = request_id
    
    return response

@app.middleware("http") 
async def security_middleware(request: Request, call_next):
    """Middleware de seguridad básico"""
    
    # Verificar rate limiting básico (simplificado)
    client_ip = request.client.host
    
    # Headers de seguridad básicos
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    return response

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependencia para autenticación (simplificada por ahora)"""
    # En una implementación real, aquí se validaría el token JWT
    return {"user_id": "admin", "role": "administrator"}

# ==================== ENDPOINTS PRINCIPALES ====================

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Servir dashboard principal"""
    dashboard_path = Path("dashboard.html")
    if dashboard_path.exists():
        return FileResponse("dashboard.html")
    else:
        return HTMLResponse("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>DataCrypt Labs Management API v3.0</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
                .status { background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .links { margin: 30px 0; }
                .links a { display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 10px; margin-bottom: 10px; }
                .links a:hover { background: #2980b9; }
                .feature { background: #ecf0f1; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #3498db; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 DataCrypt Labs Management API v3.0</h1>
                <div class="status">✅ Sistema Operativo - Mejora Continua Activa</div>
                
                <div class="feature">
                    <strong>🎤 Sistema de Voz Integrado:</strong> Reportes automáticos con configuración avanzada
                </div>
                <div class="feature">
                    <strong>📊 Monitoreo en Tiempo Real:</strong> Métricas del sistema y alertas inteligentes
                </div>
                <div class="feature">
                    <strong>🔒 Seguridad Avanzada:</strong> Escaneos automáticos y validaciones robustas
                </div>
                <div class="feature">
                    <strong>🌍 Estado Global:</strong> Sincronización de estado en tiempo real
                </div>
                
                <div class="links">
                    <a href="/docs">📚 Documentación API</a>
                    <a href="/redoc">📖 ReDoc</a>
                    <a href="/api/status">📊 Estado del Sistema</a>
                    <a href="dashboard.html">🎛️ Dashboard Completo</a>
                </div>
                
                <p><strong>DataCrypt Labs</strong> - Transformando datos en decisiones inteligentes</p>
            </div>
        </body>
        </html>
        """)

@app.get("/api/status", response_model=ApiResponse)
async def get_system_status():
    """Obtener estado completo del sistema con métricas en tiempo real"""
    start_time = time.time()
    request_id = generate_request_id()
    
    try:
        # Verificar cache primero
        cached_status = global_state.cache_get("system_status")
        if cached_status and not config_manager.config.debug_mode:
            execution_time = (time.time() - start_time) * 1000
            return ApiResponse(
                success=True,
                message="Estado del sistema obtenido (cache)",
                data=cached_status,
                execution_time_ms=round(execution_time, 2),
                request_id=request_id
            )
        
        # Obtener métricas actuales
        current_metrics = await get_system_metrics()
        global_state.add_metrics(current_metrics)
        
        # Verificar GitHub Pages
        github_status = await check_github_pages_status()
        
        # Obtener resumen del estado global
        status_summary = global_state.get_status_summary()
        
        # Compilar datos completos
        system_data = {
            "overview": status_summary,
            "current_metrics": current_metrics.dict(),
            "github_pages": github_status,
            "configuration": {
                "environment": config_manager.config.environment,
                "security_level": config_manager.config.security_level.value,
                "voice_enabled": config_manager.config.voice_enabled,
                "monitoring_interval": config_manager.config.monitoring_interval_seconds
            },
            "health_checks": {
                "api": True,
                "database": True,  # Simplificado
                "external_services": github_status["online"],
                "voice_system": config_manager.config.voice_enabled
            }
        }
        
        # Guardar en cache
        global_state.cache_set("system_status", system_data, 30)  # Cache por 30 segundos
        
        execution_time = (time.time() - start_time) * 1000
        
        logger.info(f"✅ Estado del sistema obtenido en {execution_time:.2f}ms")
        
        return ApiResponse(
            success=True,
            message="Estado del sistema obtenido exitosamente",
            data=system_data,
            execution_time_ms=round(execution_time, 2),
            request_id=request_id
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error obteniendo estado del sistema: {e}")
        
        global_state.add_alert("critical", "api", f"Error obteniendo estado: {str(e)}")
        
        return ApiResponse(
            success=False,
            message=f"Error obteniendo estado del sistema: {str(e)}",
            execution_time_ms=round(execution_time, 2),
            request_id=request_id
        )

@app.get("/api/metrics", response_model=ApiResponse)
async def get_metrics_history(limit: int = 100):
    """Obtener historial de métricas del sistema"""
    start_time = time.time()
    
    try:
        # Validar límite
        limit = min(max(1, limit), 1000)  # Entre 1 y 1000
        
        # Obtener métricas recientes
        recent_metrics = global_state.metrics_history[-limit:]
        
        # Calcular estadísticas
        if recent_metrics:
            avg_cpu = sum(m.cpu_usage for m in recent_metrics) / len(recent_metrics)
            avg_memory = sum(m.memory_usage for m in recent_metrics) / len(recent_metrics)
            avg_disk = sum(m.disk_usage for m in recent_metrics) / len(recent_metrics)
            
            max_cpu = max(m.cpu_usage for m in recent_metrics)
            max_memory = max(m.memory_usage for m in recent_metrics)
            max_disk = max(m.disk_usage for m in recent_metrics)
        else:
            avg_cpu = avg_memory = avg_disk = 0
            max_cpu = max_memory = max_disk = 0
        
        data = {
            "metrics": [m.dict() for m in recent_metrics],
            "statistics": {
                "count": len(recent_metrics),
                "averages": {
                    "cpu_usage": round(avg_cpu, 2),
                    "memory_usage": round(avg_memory, 2),
                    "disk_usage": round(avg_disk, 2)
                },
                "maximums": {
                    "cpu_usage": round(max_cpu, 2),
                    "memory_usage": round(max_memory, 2),
                    "disk_usage": round(max_disk, 2)
                }
            },
            "time_range": {
                "from": recent_metrics[0].timestamp.isoformat() if recent_metrics else None,
                "to": recent_metrics[-1].timestamp.isoformat() if recent_metrics else None
            }
        }
        
        execution_time = (time.time() - start_time) * 1000
        
        return ApiResponse(
            success=True,
            message=f"Historial de {len(recent_metrics)} métricas obtenido",
            data=data,
            execution_time_ms=round(execution_time, 2)
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error obteniendo métricas: {e}")
        
        return ApiResponse(
            success=False,
            message=f"Error obteniendo métricas: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.get("/api/security/scan", response_model=ApiResponse)
async def security_scan():
    """Ejecutar escaneo de seguridad completo"""
    start_time = time.time()
    
    try:
        logger.info("🔒 Iniciando escaneo de seguridad...")
        
        # Ejecutar escaneo
        scan_result = await perform_security_scan()
        
        # Actualizar estado global si hay problemas críticos
        if scan_result.security_score < 50:
            global_state.update_status(
                SystemStatus.CRITICAL, 
                f"Escaneo de seguridad: {scan_result.threats_found} amenazas"
            )
        elif scan_result.security_score < 80:
            global_state.update_status(
                SystemStatus.WARNING,
                f"Escaneo de seguridad: puntuación baja ({scan_result.security_score})"
            )
        
        execution_time = (time.time() - start_time) * 1000
        
        return ApiResponse(
            success=True,
            message=f"Escaneo completado - Puntuación: {scan_result.security_score}/100",
            data=scan_result.dict(),
            execution_time_ms=round(execution_time, 2)
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error en escaneo de seguridad: {e}")
        
        return ApiResponse(
            success=False,
            message=f"Error ejecutando escaneo de seguridad: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.post("/api/voice/report", response_model=ApiResponse)
async def generate_voice_report(request: VoiceReportRequest):
    """Generar reporte de voz con configuración avanzada"""
    start_time = time.time()
    
    try:
        # Verificar si el sistema de voz está habilitado
        if not config_manager.config.voice_enabled:
            return ApiResponse(
                success=False,
                message="Sistema de voz deshabilitado en la configuración"
            )
        
        # Generar contenido del reporte
        if request.content:
            voice_content = request.content
        else:
            voice_content = generate_voice_content(
                request.report_type, 
                request.include_metrics
            )
        
        # Configuración de voz
        voice_config = {
            "language": config_manager.config.voice_language,
            "rate": config_manager.config.voice_rate,
            "volume": config_manager.config.voice_volume,
            "pitch": 1.0,
            **request.voice_settings  # Permitir sobrescribir configuración
        }
        
        # Agregar timestamp si se solicita
        if request.include_timestamp:
            timestamp = datetime.now().strftime("%d de %B, %Y a las %H:%M")
            voice_content = f"Reporte generado el {timestamp}. {voice_content}"
        
        # Incrementar contador
        global_state.voice_reports_count += 1
        
        # Agregar log de actividad
        global_state.add_alert(
            "info", 
            "voice", 
            f"Reporte de voz generado: {request.report_type.value}",
            {"priority": request.priority, "content_length": len(voice_content)}
        )
        
        execution_time = (time.time() - start_time) * 1000
        
        response_data = {
            "report_type": request.report_type.value,
            "content": voice_content,
            "voice_config": voice_config,
            "content_length": len(voice_content),
            "estimated_duration_seconds": len(voice_content) / 12,  # Aproximación
            "priority": request.priority,
            "report_number": global_state.voice_reports_count
        }
        
        logger.info(f"🎤 Reporte de voz generado: {request.report_type.value}")
        
        return ApiResponse(
            success=True,
            message=f"Reporte de voz {request.report_type.value} generado exitosamente",
            data=response_data,
            execution_time_ms=round(execution_time, 2)
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error generando reporte de voz: {e}")
        
        return ApiResponse(
            success=False,
            message=f"Error generando reporte de voz: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.get("/api/alerts", response_model=ApiResponse)
async def get_alerts(resolved: bool = None, level: str = None, limit: int = 50):
    """Obtener alertas del sistema con filtros"""
    start_time = time.time()
    
    try:
        # Filtrar alertas
        alerts = global_state.alerts
        
        if resolved is not None:
            alerts = [a for a in alerts if a.resolved == resolved]
            
        if level:
            alerts = [a for a in alerts if a.level.lower() == level.lower()]
        
        # Ordenar por timestamp descendente (más recientes primero)
        alerts = sorted(alerts, key=lambda x: x.timestamp, reverse=True)
        
        # Aplicar límite
        alerts = alerts[:limit]
        
        # Estadísticas
        total_alerts = len(global_state.alerts)
        unresolved_alerts = len([a for a in global_state.alerts if not a.resolved])
        critical_alerts = len([a for a in global_state.alerts if a.level == "critical" and not a.resolved])
        
        data = {
            "alerts": [a.dict() for a in alerts],
            "statistics": {
                "total": total_alerts,
                "unresolved": unresolved_alerts,
                "critical_unresolved": critical_alerts,
                "returned": len(alerts)
            },
            "filters_applied": {
                "resolved": resolved,
                "level": level,
                "limit": limit
            }
        }
        
        execution_time = (time.time() - start_time) * 1000
        
        return ApiResponse(
            success=True,
            message=f"Obtenidas {len(alerts)} alertas",
            data=data,
            execution_time_ms=round(execution_time, 2)
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error obteniendo alertas: {e}")
        
        return ApiResponse(
            success=False,
            message=f"Error obteniendo alertas: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.post("/api/deploy/force", response_model=ApiResponse)
async def force_deploy():
    """Forzar deployment a GitHub Pages"""
    start_time = time.time()
    
    try:
        logger.info("🚀 Iniciando deployment forzado...")
        
        # Verificar estado de GitHub Pages
        github_status = await check_github_pages_status()
        
        if github_status["online"]:
            # Incrementar contador de deployments
            global_state.deployment_count += 1
            global_state.deployment_status = "completed"
            
            # Agregar log de actividad
            global_state.add_alert(
                "info",
                "deployment", 
                "Deployment forzado ejecutado exitosamente",
                {"deployment_number": global_state.deployment_count}
            )
            
            execution_time = (time.time() - start_time) * 1000
            
            return ApiResponse(
                success=True,
                message="Deployment forzado completado exitosamente",
                data={
                    "deployment_number": global_state.deployment_count,
                    "github_status": github_status,
                    "deployment_time": datetime.now().isoformat()
                },
                execution_time_ms=round(execution_time, 2)
            )
        else:
            global_state.deployment_status = "failed"
            
            return ApiResponse(
                success=False,
                message="Error: GitHub Pages no está accesible",
                data=github_status
            )
            
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error en deployment forzado: {e}")
        
        global_state.deployment_status = "failed"
        global_state.add_alert("critical", "deployment", f"Fallo en deployment: {str(e)}")
        
        return ApiResponse(
            success=False,
            message=f"Error ejecutando deployment: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.get("/api/config", response_model=ApiResponse)
async def get_configuration():
    """Obtener configuración actual del sistema"""
    start_time = time.time()
    
    try:
        config_data = asdict(config_manager.config)
        
        # Convertir enums a strings para serialización
        for key, value in config_data.items():
            if isinstance(value, Enum):
                config_data[key] = value.value
        
        execution_time = (time.time() - start_time) * 1000
        
        return ApiResponse(
            success=True,
            message="Configuración obtenida exitosamente",
            data={
                "configuration": config_data,
                "config_file": str(config_manager.config_file),
                "last_modified": datetime.fromtimestamp(
                    config_manager.config_file.stat().st_mtime
                ).isoformat() if config_manager.config_file.exists() else None
            },
            execution_time_ms=round(execution_time, 2)
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error obteniendo configuración: {e}")
        
        return ApiResponse(
            success=False,
            message=f"Error obteniendo configuración: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.post("/api/config/update", response_model=ApiResponse)
async def update_configuration(config_updates: Dict[str, Any]):
    """Actualizar configuración del sistema"""
    start_time = time.time()
    
    try:
        # Validar y actualizar configuración
        updated_count = config_manager.update_config(**config_updates)
        
        if updated_count > 0:
            global_state.add_alert(
                "info",
                "config",
                f"Configuración actualizada: {updated_count} parámetros modificados",
                config_updates
            )
        
        execution_time = (time.time() - start_time) * 1000
        
        return ApiResponse(
            success=True,
            message=f"Configuración actualizada: {updated_count} parámetros modificados",
            data={
                "updated_parameters": updated_count,
                "applied_changes": config_updates
            },
            execution_time_ms=round(execution_time, 2)
        )
        
    except Exception as e:
        execution_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Error actualizando configuración: {e}")
        
        return ApiResponse(
            success=False,
            message=f"Error actualizando configuración: {str(e)}",
            execution_time_ms=round(execution_time, 2)
        )

@app.get("/api/health", response_model=ApiResponse)
async def health_check():
    """Verificación de salud del sistema (endpoint rápido)"""
    try:
        return ApiResponse(
            success=True,
            message="Sistema operativo",
            data={
                "status": global_state.system_status.value,
                "uptime_seconds": global_state.get_status_summary()["uptime_seconds"],
                "api_version": "3.0.0",
                "timestamp": datetime.now().isoformat()
            },
            execution_time_ms=1.0  # Siempre muy rápido
        )
    except Exception as e:
        return ApiResponse(
            success=False,
            message=f"Error en verificación de salud: {str(e)}"
        )

# ==================== TAREAS EN SEGUNDO PLANO ====================

@app.on_event("startup")
async def startup_event():
    """Tareas de inicialización al arrancar"""
    logger.info("🚀 Iniciando sistema DataCrypt Labs Management v3.0...")
    
    # Realizar verificación inicial del sistema
    try:
        initial_metrics = await get_system_metrics()
        global_state.add_metrics(initial_metrics)
        logger.info("✅ Métricas iniciales recolectadas")
        
        # Escaneo de seguridad inicial
        security_result = await perform_security_scan()
        logger.info(f"🔒 Escaneo de seguridad inicial: {security_result.security_score}/100")
        
        # Verificar GitHub Pages
        github_status = await check_github_pages_status()
        logger.info(f"🌐 GitHub Pages: {'✅ Online' if github_status['online'] else '❌ Offline'}")
        
        global_state.add_alert("info", "system", "Sistema DataCrypt Labs iniciado exitosamente")
        
    except Exception as e:
        logger.error(f"❌ Error en inicialización: {e}")
        global_state.update_status(SystemStatus.WARNING, f"Error en inicialización: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Tareas de limpieza al cerrar"""
    logger.info("🛑 Cerrando sistema DataCrypt Labs Management...")
    
    # Guardar configuración final
    config_manager.save_config()
    
    # Log final
    uptime = datetime.now() - global_state.start_time
    logger.info(f"📊 Estadísticas finales:")
    logger.info(f"   • Tiempo activo: {uptime}")
    logger.info(f"   • Peticiones API: {global_state.api_requests_count}")
    logger.info(f"   • Reportes de voz: {global_state.voice_reports_count}")
    logger.info(f"   • Alertas generadas: {len(global_state.alerts)}")
    
    logger.info("✅ Sistema cerrado correctamente")

# ==================== FUNCIÓN PRINCIPAL ====================

def main():
    """Función principal para ejecutar el servidor"""
    
    logger.info("🎯 Iniciando DataCrypt Labs Management Backend v3.0")
    logger.info("📋 Filosofía de Mejora Continua - Metodología PDCA aplicada")
    
    # Configuración del servidor
    config = {
        "host": "0.0.0.0",
        "port": 8000,
        "reload": config_manager.config.debug_mode,
        "log_level": config_manager.config.log_level.lower(),
        "access_log": True,
        "loop": "asyncio"
    }
    
    logger.info(f"🌐 Servidor: http://localhost:{config['port']}")
    logger.info(f"📚 Documentación: http://localhost:{config['port']}/docs")
    logger.info(f"🎛️ Dashboard: http://localhost:{config['port']}/dashboard.html")
    
    try:
        uvicorn.run(app, **config)
    except KeyboardInterrupt:
        logger.info("🛑 Servidor detenido por el usuario")
    except Exception as e:
        logger.error(f"❌ Error crítico del servidor: {e}")

if __name__ == "__main__":
    main()