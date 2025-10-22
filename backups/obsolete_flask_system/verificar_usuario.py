import sqlite3

print("✅ VERIFICACIÓN FINAL DEL USUARIO ADMINISTRADOR")
print("=" * 50)

conn = sqlite3.connect('datacrypt_admin.db')
cursor = conn.cursor()

# Buscar tu usuario
cursor.execute('SELECT id, username, email, role, full_name, is_active, created_at FROM admin_users WHERE username = ?', ('Neyd696 :#',))
user = cursor.fetchone()

if user:
    print("🎉 USUARIO ENCONTRADO EN BASE DE DATOS:")
    print(f"   ID: {user[0]}")
    print(f"   Usuario: {user[1]}")
    print(f"   Email: {user[2]}")
    print(f"   Rol: {user[3]}")
    print(f"   Nombre: {user[4]}")
    print(f"   Activo: {'Sí' if user[5] else 'No'}")
    print(f"   Creado: {user[6]}")
else:
    print("❌ Usuario no encontrado")

# Mostrar todos los usuarios
print("\n📋 TODOS LOS USUARIOS EN EL SISTEMA:")
cursor.execute('SELECT id, username, role FROM admin_users')
users = cursor.fetchall()

for u in users:
    print(f"   {u[0]}: {u[1]} ({u[2]})")

conn.close()

print("\n🌐 ACCESO AL DASHBOARD:")
print("   URL: http://localhost:5000/admin")
print("   Usuario: Neyd696 :#")
print("   Contraseña: Simelamamscoscorrea123###_@")