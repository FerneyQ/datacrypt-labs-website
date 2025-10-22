"""
🗄️ DATACRYPT LABS - DATABASE SERVICES
Servicios especializados de base de datos para el sistema modular
Filosofía Mejora Continua: Servicios robustos y escalables
"""

import sqlite3
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

from backend.config.settings import get_settings
from backend.utils.logger import get_logger

settings = get_settings()
logger = get_logger(__name__)

class DatabaseService:
    """Servicio especializado de base de datos"""
    
    def __init__(self):
        self.db_path = settings.get_database_path()
        logger.info(f"🗄️ DatabaseService inicializado: {self.db_path}")
    
    @asynccontextmanager
    async def get_connection(self):
        """Context manager para conexiones de base de datos"""
        conn = None
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            logger.debug("📡 Conexión a base de datos establecida")
            yield conn
        except Exception as e:
            logger.error(f"❌ Error en conexión de base de datos: {e}")
            raise
        finally:
            if conn:
                conn.close()
                logger.debug("🔌 Conexión a base de datos cerrada")
    
    async def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Ejecutar query y retornar resultados"""
        try:
            async with self.get_connection() as conn:
                cursor = conn.execute(query, params)
                results = [dict(row) for row in cursor.fetchall()]
                logger.debug(f"📊 Query ejecutado: {len(results)} resultados")
                return results
        except Exception as e:
            logger.error(f"❌ Error ejecutando query: {e}")
            raise
    
    async def execute_insert(self, query: str, params: tuple = ()) -> int:
        """Ejecutar insert y retornar ID insertado"""
        try:
            async with self.get_connection() as conn:
                cursor = conn.execute(query, params)
                conn.commit()
                inserted_id = cursor.lastrowid
                logger.info(f"✅ Insert ejecutado, ID: {inserted_id}")
                return inserted_id
        except Exception as e:
            logger.error(f"❌ Error ejecutando insert: {e}")
            raise
    
    async def get_table_info(self, table_name: str) -> List[Dict[str, Any]]:
        """Obtener información de tabla"""
        query = f"PRAGMA table_info({table_name})"
        return await self.execute_query(query)
    
    async def get_all_tables(self) -> List[str]:
        """Obtener lista de todas las tablas"""
        query = "SELECT name FROM sqlite_master WHERE type='table'"
        results = await self.execute_query(query)
        return [row['name'] for row in results]

# Instancia global del servicio
database_service = DatabaseService()

async def get_database_service() -> DatabaseService:
    """Obtener instancia del servicio de base de datos"""
    return database_service